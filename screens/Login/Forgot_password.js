// ForgetPasswordScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import Icon from 'react-native-vector-icons/Feather';
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!email) {
      setMessage('Please enter a valid email address');
      return;
    }
    setLoading(true); // Show loading spinner
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your mail please.");
      navigation.goBack();
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false); // Stop loading spinner
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Add Back Button */}
      <TouchableOpacity 
        style={styles.backButtonTop} 
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backContainer}>
          <Icon name="arrow-left" size={24} color="#007AFF" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.formContainer}>
        <Text style={styles.header}>Reset Your Password</Text>
        
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}
        
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={[styles.input, message && styles.errorInput]}
        />
        
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handlePasswordReset} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFE7" /> // Show loading spinner
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.resetButtonText}>Send Reset Email</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 30,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  input: {
    height: 55,
    borderWidth: 1.5,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  errorInput: {
    borderColor: '#FF0000',
  },
  message: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#fdf0f0',
    padding: 12,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    left: 20,
    zIndex: 1,
  },
  backContainer: {
    backgroundColor: '#f0f7ff',
    padding: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default ForgotPasswordScreen;
