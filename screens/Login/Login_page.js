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
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
              if (docSnap.data().job==undefined || docSnap.data().job==null || docSnap.data().job=='') {
                navigation.replace('ProviderForm');
              } else {
                navigation.replace('provider');
              }
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
          <View style={styles.logoContainer}>
          <MaterialCommunityIcons 
              name="calendar-clock" 
              size={80} 
              color="#007AFF"
              style={styles.clock}
            />
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
  clock:{
    shadowColor:'#007AFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f0f7ff',
    padding: 20,
    borderRadius: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
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
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.5,
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

export default LoginScreen;
