import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  StatusBar,
  Dimensions,
  ScrollView
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/Feather'; 
import Svg, { Path } from 'react-native-svg';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [place, setPlace] = useState('');
  const [role, setRole] = useState(''); // Empty by default
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    return {
      minLength,
      hasNumber,
      hasSpecialChar,
      hasLetter,
    };
  };

  const handleSubmit = () => {
    const formErrors = {};
    if (!name) formErrors.name = 'Name is required';
    if (!email) formErrors.email = 'Email is required';
    if (!mobile) formErrors.mobile = 'Mobile number is required';
    if (!place) formErrors.place = 'Place is required';
    if (!role) formErrors.role = 'Type of service is required';
    if (!password) formErrors.password = 'Password is required';
    if (!confirmPassword) formErrors.confirmPassword = 'Confirm password is required';

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.minLength) {
      formErrors.passwordLength = 'Password must be at least 8 characters';
    }
    if (!passwordValidation.hasNumber) {
      formErrors.passwordNumber = 'Password must contain at least one number';
    }
    if (!passwordValidation.hasSpecialChar) {
      formErrors.passwordSpecialChar = 'Password must contain at least one special character';
    }
    if (!passwordValidation.hasLetter) {
      formErrors.passwordLetter = 'Password must contain at least one letter';
    }

    if (password !== confirmPassword) formErrors.passwordMatch = 'Passwords don’t match';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Handle registration logic here
    alert('Registration successful!');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.formContainer}>
          <Text style={styles.header}>Get Started with AppointPro</Text>

          {/* Google Sign Up Button */}
          <TouchableOpacity style={styles.googleButton}>
            {/* Google SVG Logo */}
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
            
            {/* Button Text */}

            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </TouchableOpacity>
          
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={[styles.input, errors.name && styles.errorInput]}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, errors.email && styles.errorInput]}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          
          <TextInput
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            style={[styles.input, errors.mobile && styles.errorInput]}
            keyboardType="phone-pad"
          />
          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
          
          <TextInput
            placeholder="Place"
            value={place}
            onChangeText={setPlace}
            style={[styles.input, errors.place && styles.errorInput]}
          />
          {errors.place && <Text style={styles.errorText}>{errors.place}</Text>}

          {/* Types of services */}
          <View style={[styles.selectinputContainer, errors.role && styles.errorInput]}>
              <SelectList
                setSelected={setRole}
                data={[
                  { key: 'customer', value: 'Customer' },
                  { key: 'service_provider', value: 'Service Provider' },
                ]}
                save="value"
                placeholder="Type of service"
                placeholderStyle={{ color: 'grey' }} 
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
              style={[styles.input, errors.password && styles.errorInput]}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon name={passwordVisible ? "eye-off" : "eye"} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {errors.passwordLength && <Text style={styles.errorText}>{errors.passwordLength}</Text>}
          {errors.passwordNumber && <Text style={styles.errorText}>{errors.passwordNumber}</Text>}
          {errors.passwordSpecialChar && <Text style={styles.errorText}>{errors.passwordSpecialChar}</Text>}
          {errors.passwordLetter && <Text style={styles.errorText}>{errors.passwordLetter}</Text>}

          {/* Confirm Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, errors.confirmPassword && styles.errorInput]}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Icon name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          {errors.passwordMatch && <Text style={styles.errorText}>{errors.passwordMatch}</Text>}

          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
            
          <View style={styles.alreadyAccountContainer}>
            <Text style={styles.AlreadyaccountText}>Already have an account? </Text>
            <Text style={styles.loginLinkText}>Login</Text>
          </View>

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
    marginBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleButtonText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    color: '#333',
  },

  selectinputContainer:{
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
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

  alreadyAccountContainer: {
    flexDirection: 'row',  
    alignSelf: 'center'
  },

  AlreadyaccountText: {
    color: 'black',
    fontSize: 14,
  },

  loginLinkText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
