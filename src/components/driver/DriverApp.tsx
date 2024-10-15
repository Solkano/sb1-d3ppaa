import * as React from 'react';
import { StackNavigator } from 'react-nativescript-navigation';
import { DriverLogin } from './DriverLogin';
import { DeliveryAssignments } from './DeliveryAssignments';
import { LiveNavigation } from './LiveNavigation';
import { DriverDashboard } from './DriverDashboard';

const Stack = StackNavigator();

export function DriverApp() {
  return (
    <Stack.Navigator initialRouteName="DriverLogin">
      <Stack.Screen name="DriverLogin" component={DriverLogin} />
      <Stack.Screen name="DeliveryAssignments" component={DeliveryAssignments} />
      <Stack.Screen name="LiveNavigation" component={LiveNavigation} />
      <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
    </Stack.Navigator>
  );
}