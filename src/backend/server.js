const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery_app';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(express.json());

// MongoDB connection
let db;
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    db = client.db();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // TODO: Implement proper authentication
  const user = { id: 1, email };
  const token = jwt.sign(user, JWT_SECRET);
  res.json({ token });
});

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  // TODO: Implement user registration
  res.sendStatus(201);
});

app.get('/api/products', authenticateToken, async (req, res) => {
  const { query } = req.query;
  try {
    const products = await db.collection('products').find({
      name: { $regex: query, $options: 'i' }
    }).toArray();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, totalAmount, deliveryAddress } = req.body;
  try {
    const result = await db.collection('orders').insertOne({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending',
      createdAt: new Date(),
      pickupLocation: {
        latitude: 37.7749, // Example coordinates, replace with actual pickup location
        longitude: -122.4194
      },
      deliveryLocation: {
        latitude: 37.7858, // Example coordinates, replace with actual delivery location
        longitude: -122.4064
      }
    });
    res.status(201).json({ orderId: result.insertedId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id), userId: req.user.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('joinRoom', (orderId) => {
    socket.join(orderId);
    console.log(`Socket joined room: ${orderId}`);
  });

  socket.on('updateOrderStatus', async (data) => {
    const { orderId, status } = data;
    try {
      await db.collection('orders').updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: status } }
      );
      const updatedOrder = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
      io.to(orderId).emit('orderStatusUpdated', updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  });

  socket.on('updateDriverLocation', async (data) => {
    const { orderId, location } = data;
    try {
      await db.collection('orders').updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { driverLocation: location } }
      );
      io.to(orderId).emit('driverLocationUpdated', location);
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});