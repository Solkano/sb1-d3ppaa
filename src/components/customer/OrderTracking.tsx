import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-nativescript';
import axios from 'axios';
import io from 'socket.io-client';
import MapView, { Marker, Polyline } from 'react-native-maps';

const BACKEND_URL = 'http://localhost:3000'; // Replace with your actual backend URL

export function OrderTracking({ route }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    const socket = io(BACKEND_URL);
    
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
        // Fetch initial route
        fetchRoute(response.data.pickupLocation, response.data.deliveryLocation);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      }
    };

    fetchOrderDetails();

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      socket.emit('joinRoom', orderId);
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
      }
    });

    socket.on('driverLocationUpdated', (location) => {
      setDriverLocation(location);
    });

    return () => {
      socket.off('orderStatusUpdated');
      socket.off('driverLocationUpdated');
      socket.disconnect();
    };
  }, [orderId]);

  const fetchRoute = async (origin, destination) => {
    try {
      // This is a placeholder. In a real app, you'd use a directions API
      const response = await axios.get(`https://api.example.com/directions`, {
        params: { origin, destination }
      });
      setRouteCoordinates(response.data.route);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  if (error) {
    return (
      <flexboxLayout style={styles.container}>
        <label style={styles.errorText}>{error}</label>
      </flexboxLayout>
    );
  }

  if (!order) {
    return (
      <flexboxLayout style={styles.container}>
        <activityIndicator busy={true} />
      </flexboxLayout>
    );
  }

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">Order Tracking</label>
      <label>Order ID: {order._id}</label>
      <label>Status: {order.status}</label>
      <label>Total Amount: ${order.totalAmount}</label>
      <label>Delivery Address: {order.deliveryAddress}</label>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: order.pickupLocation.latitude,
          longitude: order.pickupLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={order.pickupLocation}
          title="Pickup Location"
        />
        <Marker
          coordinate={order.deliveryLocation}
          title="Delivery Location"
        />
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver Location"
            pinColor="blue"
          />
        )}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#000"
          strokeWidth={2}
        />
      </MapView>

      <scrollView style={styles.itemList}>
        {order.items.map((item, index) => (
          <label key={index} style={styles.item}>
            {item.name} - ${item.price} x {item.quantity}
          </label>
        ))}
      </scrollView>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  itemList: {
    width: '100%',
    maxHeight: 200,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
});