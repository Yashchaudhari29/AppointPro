// ForgetPasswordScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!email) {
      setMessage('Please enter a valid email address');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your mail please.");
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.formContainer}>
        <Text style={styles.header}>Reset Your Password</Text>
        
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}
        
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
          <Text style={styles.loginLinkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 10,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  message: {
    fontSize: 16,
    color: '#FF5722',
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;
