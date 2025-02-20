import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Feather';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const db1 = getFirestore();

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    const minLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    return { minLength, hasNumber, hasSpecialChar, hasLetter };
  };

  const handleSubmit = async () => {
    const formErrors = {};

    // Form validation
    if (!firstName) formErrors.firstName = 'First name is required';
    if (!lastName) formErrors.lastName = 'Last name is required';
    if (!email) formErrors.email = 'Email is required';
    if (!mobile) formErrors.mobile = 'Mobile number is required';
    if (!role) formErrors.role = 'Role is required';
    if (!password) formErrors.password = 'Password is required';
    if (!confirmPassword) formErrors.confirmPassword = 'Confirm password is required';

    // Uncommented password validation
    // const passwordValidation = validatePassword(password);
    // if (!passwordValidation.minLength) formErrors.passwordLength = 'Password must be at least 6 characters';
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
        firstName,
        lastName,
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
        <StatusBar 
          backgroundColor="#f5f5f5"
          barStyle="dark-content"
          translucent={true}
        />
        
        <View style={styles.formContainer}>
          
          {/* Moved Back Button Here */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backContainer}>
              <Icon name="arrow-left" size={24} color="#007AFF" />
              {/* <Text style={styles.backText}>Back</Text> */}
            </View>
          </TouchableOpacity>
          <Text style={styles.header}>Create Account</Text>

          <Text style={styles.subHeader}>Join AppointPro and streamline your appointments</Text>

          {/* First Name Input */}
          <View style={styles.inputWrapper}>
            <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={[styles.input, errors.firstName && styles.errorInput]}
              placeholderTextColor="#666"
            />
          </View>
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          {/* Last Name Input */}
          <View style={styles.inputWrapper}>
            <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={[styles.input, errors.lastName && styles.errorInput]}
              placeholderTextColor="#666"
            />
          </View>
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={[styles.input, errors.email && styles.errorInput]}
              placeholderTextColor="#666"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Mobile Input */}
          <View style={styles.inputWrapper}>
            <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              style={[styles.input, errors.mobile && styles.errorInput]}
              placeholderTextColor="#666"
            />
          </View>
          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

          {/* Role Selection */}
          <View style={[styles.inputWrapper, errors.role && styles.errorInput]}>
            <Icon name="users" size={20} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={[
                { label: 'Service Provider', value: 'provider' },
                { label: 'Service Consumer', value: 'consumer' },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Role"
              value={role}
              onChange={item => setRole(item.value)}
            />
          </View>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={[styles.input, errors.password && styles.errorInput]}
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              style={[styles.input, errors.confirmPassword && styles.errorInput]}
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Icon name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          {errors.passwordMatch && <Text style={styles.errorText}>{errors.passwordMatch}</Text>}

          {/* Register Button */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
          )}

          {/* Login Link */}
          <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.goBack()}>
            <Text style={styles.registerText}>
              Already have an account? <Text style={styles.signUpText}>Sign In</Text>
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
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  selectWrapper: {
    marginBottom: 15,
  },
  selectContainer: {
    flex: 1,
  },
  selectBox: {
    borderWidth: 0,
    paddingLeft: 0,
  },
  selectInput: {
    color: '#333',
    fontSize: 16,
  },
  dropdown: {
    flex: 1,
    height: 50,
    backgroundColor: 'transparent',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  loadingIndicator: {
    marginTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  backText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RegisterScreen;
