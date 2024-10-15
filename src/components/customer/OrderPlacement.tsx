import * as React from 'react';
import { useState, useContext } from 'react';
import { StyleSheet } from 'react-nativescript';
import axios from 'axios';
import { CartContext } from '../../contexts/CartContext';

export function OrderPlacement({ navigation }) {
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post('/api/orders', {
        items: cart,
        totalAmount: calculateTotal(),
        deliveryAddress: address,
      });
      
      if (response.status === 201) {
        clearCart();
        navigation.navigate('OrderTracking', { orderId: response.data.orderId });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">Your Order</label>
      <scrollView style={styles.cartList}>
        {cart.map((item) => (
          <label key={item.id} style={styles.cartItem}>
            {item.name} - ${item.price} x {item.quantity}
          </label>
        ))}
      </scrollView>
      <label style={styles.total}>Total: ${calculateTotal()}</label>
      <textField
        hint="Delivery Address"
        style={styles.input}
        onTextChange={(args) => setAddress(args.value)}
      />
      <button style={styles.button} onTap={handlePlaceOrder}>
        Place Order
      </button>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    padding: 20,
  },
  cartList: {
    width: '100%',
    maxHeight: 200,
  },
  cartItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    fontSize: 18,
  },
  button: {
    fontSize: 18,
    color: '#2e6ddf',
    marginTop: 10,
  },
});