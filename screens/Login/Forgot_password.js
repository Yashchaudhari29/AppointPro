// ForgetPasswordScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ActivityIndicator 
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
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <View style={styles.back_container}>
          <Icon name="arrow-left" size={17} style={styles.arrowIcon} />
          <Text style={styles.backText}>Back to Login</Text>
          </View>
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
    backgroundColor: '#FFFFE7',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#FF0000',
  },
  message: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop:20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    color: '#FFFFE7',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backText: {
    color: 'grey',
    fontSize: 16,
    // fontWeight: 'bold',
  },
  back_container:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon:{
    color:'grey'
  }
  
});

export default ForgotPasswordScreen;
