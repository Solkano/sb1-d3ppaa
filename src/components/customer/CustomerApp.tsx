import * as React from 'react';
import { StackNavigator } from 'react-nativescript-navigation';
import { CustomerLogin } from './CustomerLogin';
import { CustomerSignup } from './CustomerSignup';
import { ProductSearch } from './ProductSearch';
import { OrderPlacement } from './OrderPlacement';
import { OrderTracking } from './OrderTracking';
import { CartProvider } from '../../contexts/CartContext';

const Stack = StackNavigator();

export function CustomerApp() {
  return (
    <CartProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={CustomerLogin} />
        <Stack.Screen name="Signup" component={CustomerSignup} />
        <Stack.Screen name="ProductSearch" component={ProductSearch} />
        <Stack.Screen name="OrderPlacement" component={OrderPlacement} />
        <Stack.Screen name="OrderTracking" component={OrderTracking} />
      </Stack.Navigator>
    </CartProvider>
  );
}