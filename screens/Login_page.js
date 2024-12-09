// #FFFFE7

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
  ActivityIndicator // Import ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path } from 'react-native-svg'; 
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const db1 = getFirestore();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Initial loading state is false
  const [dataLoading, setDataLoading] = useState(true); // State for tracking user data fetching

  useEffect(() => {
    // setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db1, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const role = docSnap.data().role;
            if (role === 'admin') {
              navigation.replace('Admin');
            } else if (role === 'consumer') {
              navigation.replace('consumer');
            } else if (role === 'provider') {
              navigation.replace('provider');
            }
            setDataLoading(false); // Set to false once the data is fetched
          } else {
            console.log("No user document found in Firestore");
            setDataLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setDataLoading(false);
        }
      } else {
        console.log("No user is signed in.");
        setDataLoading(false);
      }
    // setLoading(false);
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = async () => {
    const formErrors = {};
    if (!email) formErrors.email = 'Email is required';
    if (!password) formErrors.password = 'Password is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      // Fetch user role from Firestore
      const docRef = doc(db1, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === 'admin') {
          navigation.replace('admin');
        } else if (role === 'consumer') {
          navigation.replace('consumer');
        } else if (role === 'provider') {
          navigation.replace('provider');
        }
      }
    } catch (error) {
      alert(error.message);
    }
    setLoading(false); // Stop loading after login attempt
  };

  if (dataLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.formContainer}>
          <Text style={styles.header}>Log in to your Account</Text>
          <Text style={styles.smallheader}>Please, enter your information</Text>

          {/* Google Sign in Button */}
          <TouchableOpacity style={styles.googleButton}>
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width={30} height={30}>
              <Path
                fill="#4285F4"
                d="M120,76.1c0-3.1-0.3-6.3-0.8-9.3H75.9v17.7h24.8c-1,5.7-4.3,10.7-9.2,13.9l14.8,11.5C115,101.8,120,90,120,76.1L120,76.1z"
              />
              <Path
                fill="#34A853"
                d="M75.9,120.9c12.4,0,22.8-4.1,30.4-11.1L91.5,98.4c-4.1,2.8-9.4,4.4-15.6,4.4c-12,0-22.1-8.1-25.8-18.9L34.9,95.6C42.7,111.1,58.5,120.9,75.9,120.9z"
              />
              <Path
                fill="#FBBC05"
                d="M50.1,83.8c-1.9-5.7-1.9-11.9,0-17.6L34.9,54.4c-6.5,13-6.5,28.3,0,41.2L50.1,83.8z"
              />
              <Path
                fill="#EA4335"
                d="M75.9,47.3c6.5-0.1,12.9,2.4,17.6,6.9L106.6,41C98.3,33.2,87.3,29,75.9,29.1c-17.4,0-33.2,9.8-41,25.3l15.2,11.8C53.8,55.3,63.9,47.3,75.9,47.3z"
              />
            </Svg>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, errors.email && styles.errorInput]}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, errors.password && styles.errorInput]}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFE7" /> // Show the loading spinner
            ) : (
              <Text style={styles.loginButtonText}>Login</Text> // Show the button text
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('Forgot_Password')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.signUpText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
      }
    })
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7,
    color: '#333',
  },
  smallheader: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4285F4', 
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    marginLeft: 10,
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '500',
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
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 10,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    top: 12,
    right: 15,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#4285F4',
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    color: '#888',
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#4285F4',
  }
});

export default LoginScreen;
