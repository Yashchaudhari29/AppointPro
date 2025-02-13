import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/Feather';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const db1 = getFirestore();

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    return { minLength, hasNumber, hasSpecialChar, hasLetter };
  };

  const handleSubmit = async () => {
    const formErrors = {};

    // Form validation
    if (!name) formErrors.name = 'Name is required';
    if (!email) formErrors.email = 'Email is required';
    if (!mobile) formErrors.mobile = 'Mobile number is required';
    if (!role) formErrors.role = 'Role is required';
    if (!password) formErrors.password = 'Password is required';
    if (!confirmPassword) formErrors.confirmPassword = 'Confirm password is required';

    // const passwordValidation = validatePassword(password);
    // if (!passwordValidation.minLength) formErrors.passwordLength = 'Password must be at least 8 characters';
    // if (!passwordValidation.hasNumber) formErrors.passwordNumber = 'Password must contain at least one number';
    // if (!passwordValidation.hasSpecialChar) formErrors.passwordSpecialChar = 'Password must contain at least one special character';
    // if (!passwordValidation.hasLetter) formErrors.passwordLetter = 'Password must contain at least one letter';

    // if (password !== confirmPassword) formErrors.passwordMatch = 'Passwords do not match';

    // if (Object.keys(formErrors).length > 0) {
    //   setErrors(formErrors);
    //   return;
    // }

    try {
      setIsLoading(true);
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await setDoc(doc(db1, 'users', user.uid), {
        name,
        email,
        mobile,
        role,
        password,
      });
      navigation.replace('Login');
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.formContainer}>
          <Text style={styles.header}>Get Started with AppointPro</Text>

          {/* Name Input */}
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={[styles.input, errors.name && styles.errorInput]}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {/* Email Input */}
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={[styles.input, errors.email && styles.errorInput]}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Mobile Input */}
          <TextInput
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            style={[styles.input, errors.mobile && styles.errorInput]}
          />
          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

          {/* Role Selection */}
          <View style={[styles.selectContainer, errors.role && styles.errorInput]}>
            <SelectList
              setSelected={setRole}
              data={[
                { key: 'provider', value: 'Service Provider' },
                { key: 'consumer', value: 'Service Consumer' },
              ]}
              placeholder="Select Role"
              search={false}
            />
          </View>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={[styles.input, errors.password && styles.errorInput]}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              style={[styles.input, errors.confirmPassword && styles.errorInput]}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Icon name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          {errors.passwordMatch && <Text style={styles.errorText}>{errors.passwordMatch}</Text>}

          {/* Register Button */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          {/* Login Link */}
          <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.goBack()}>
            <Text style={styles.registerText}>
            Already have an account? <Text style={styles.signUpText}>Log In</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  selectContainer: {
    borderColor:'#ccc',
    width: '100%',
    marginVertical: 10,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  registerButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop:20,
    alignItems: 'center',
  },
  registerText: {
    color: '#888',
  },
  signUpText: {
    color:'black',
    fontWeight: 'bold',
  }
});

export default RegisterScreen;
