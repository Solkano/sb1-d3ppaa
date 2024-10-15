import * as React from 'react';
import { StyleSheet } from 'react-nativescript';

export function AdminDashboard() {
  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">Admin Dashboard</label>
      <button style={styles.button} onTap={() => console.log('Manage Orders')}>
        Manage Orders
      </button>
      <button style={styles.button} onTap={() => console.log('Manage Drivers')}>
        Manage Drivers
      </button>
      <button style={styles.button} onTap={() => console.log('Manage Users')}>
        Manage Users
      </button>
      <button style={styles.button} onTap={() => console.log('View Reports')}>
        View Reports
      </button>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    fontSize: 18,
    color: '#2e6ddf',
    marginTop: 10,
  },
});