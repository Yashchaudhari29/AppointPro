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
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path } from 'react-native-svg'; 
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
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
        <StatusBar 
          backgroundColor="#f5f5f5"
          barStyle="dark-content"
          translucent={true}
        />
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="calendar-today" size={60} color="#007AFF" />
          </View>
          <Text style={styles.header}>Welcome Back</Text>
          <Text style={styles.subHeader}>Sign in to continue</Text>

          {/* Email Input */}
          <View style={[styles.inputWrapper, errors.email && styles.errorInput]}>
            <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Input */}
          <View style={[styles.inputWrapper, errors.password && styles.errorInput]}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity 
            style={styles.forgotPasswordContainer} 
            onPress={() => navigation.navigate('Forgot_Password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerContainer} 
            onPress={() => navigation.navigate('Register')}
          >
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 15,
  },
  signUpText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
