import * as React from 'react';
import { BaseNavigationContainer } from '@react-navigation/core';
import { stackNavigatorFactory } from 'react-nativescript-navigation';
import { CustomerApp } from '../components/customer/CustomerApp';
import { DriverApp } from '../components/driver/DriverApp';
import { AdminDashboard } from '../components/admin/AdminDashboard';

const StackNavigator = stackNavigatorFactory();

export const AppNavigator = () => (
  <BaseNavigationContainer>
    <StackNavigator.Navigator
      initialRouteName="CustomerApp"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNavigator.Screen name="CustomerApp" component={CustomerApp} />
      <StackNavigator.Screen name="DriverApp" component={DriverApp} />
      <StackNavigator.Screen name="AdminDashboard" component={AdminDashboard} />
    </StackNavigator.Navigator>
  </BaseNavigationContainer>
);