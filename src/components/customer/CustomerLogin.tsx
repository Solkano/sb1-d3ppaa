import * as React from 'react';
import { StyleSheet } from 'react-nativescript';

export function CustomerLogin({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Implement login logic here
    console.log('Login with:', email, password);
    navigation.navigate('ProductSearch');
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">Customer Login</label>
      <textField
        hint="Email"
        keyboardType="email"
        autocorrect={false}
        autocapitalizationType="none"
        style={styles.input}
        onTextChange={(args) => setEmail(args.value)}
      />
      <textField
        hint="Password"
        secure={true}
        style={styles.input}
        onTextChange={(args) => setPassword(args.value)}
      />
      <button style={styles.button} onTap={handleLogin}>
        Login
      </button>
      <button
        style={styles.button}
        onTap={() => navigation.navigate('Signup')}
      >
        Sign Up
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
  input: {
    width: '80%',
    marginBottom: 10,
    fontSize: 18,
  },
  button: {
    fontSize: 18,
    color: '#2e6ddf',
    marginTop: 10,
  },
});