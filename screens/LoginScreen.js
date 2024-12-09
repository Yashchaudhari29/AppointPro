import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
const db1 = getFirestore();
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer'); // Default role
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db1, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const role = docSnap.data().role;
            if (role === 'admin') {
              navigation.navigate('Admin');
            } else if (role === 'consumer') {
              navigation.navigate('consumer');
            } else if (role === 'provider') {
              navigation.navigate('Provider');
            }
          } else {
            console.log("No user document found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      await setDoc(doc(db1, 'users', user.uid), {
        role: role,
      });

      navigation.navigate('Home');
    } catch (error) {
      alert(error);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      // Fetch user role from Firestore
      const docRef = doc(db1, 'users', user.uid);  // Correct usage with `doc` function
      const docSnap = await getDoc(docRef);  // Correct method to fetch document

      if (docSnap.exists) {
        const role = docSnap.data().role;
        if (role === 'admin') {
          navigation.navigate('Admin');
        } else if (role === 'consumer') {
          navigation.navigate('consumer');
        } else if (role === 'provider') {
          navigation.navigate('Provider');
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />

          {/* Show the role picker only during registration */}
          {role && (
            <RNPickerSelect
              onValueChange={(value) => setRole(value)}
              items={[
                { label: 'Admin', value: 'admin' },
                { label: 'consumer', value: 'consumer' },
                { label: 'Provider', value: 'provider' },
              ]}
              style={pickerSelectStyles}
              placeholder={{
                label: 'Select Role...',
                value: null,
              }}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Register Button with Role Dropdown */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});

// Styles for the Picker component
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    color: 'black',
  },
  inputAndroid: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    color: 'black',
  },
});
