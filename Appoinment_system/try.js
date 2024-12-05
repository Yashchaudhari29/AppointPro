import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  StatusBar,
  SafeAreaView, 
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomePage({ navigation }) {
  const [showSplash, setShowSplash] = useState(true);
  
  // Animated values
  const splashScale = useRef(new Animated.Value(0.5)).current;
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Splash screen animation
    Animated.parallel([ 
      Animated.spring(splashScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(splashOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();

    // Splash screen timeout
    const splashTimer = setTimeout(() => {
      Animated.parallel([ 
        Animated.timing(splashScale, {
          toValue: 3,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ]).start(() => {
        setShowSplash(false);
        startWelcomeAnimations();
      });
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  const startWelcomeAnimations = () => {
    Animated.parallel([ 
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 3,
        tension: 50,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleNext = () => {
    navigation.navigate('sss');
  };

  // Splash Screen Component
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient 
          colors={['#1A237E', '#3F51B5']} 
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View 
          style={{
            transform: [{ scale: splashScale }],
            opacity: splashOpacity
          }}
        >
          {/* Replace the rocket-launch icon with a service-related icon */}
          <MaterialCommunityIcons 
            name="calendar-clock" 
            size={120} 
            color="#fff" 
            style={{ alignSelf: 'center'}}
          />
          <Text style={styles.splashText}>AppointPro</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#1A237E', '#3F51B5']} 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
      />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <Animated.View 
          style={[ 
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [
                { translateY },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            {/* You can replace this with a custom image logo if preferred */}
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={80} 
              color="#fff" 
            />
          </View>

          <Animated.Text 
            style={[ 
              styles.heading, 
              { 
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim 
              }
            ]}
          >
            Welcome to the Future
          </Animated.Text>
          
          <Animated.Text 
            style={[ 
              styles.subheading, 
              { 
                transform: [{ translateY: translateY }],
                opacity: fadeAnim 
              }
            ]}
          >
            Unleash Possibilities, Redefine Experience
          </Animated.Text>
        </Animated.View>

        <Animated.View 
          style={[ 
            styles.buttonContainer, 
            { 
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim 
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Explore Now</Text>
            <MaterialCommunityIcons 
              name="arrow-right-circle" 
              size={30} 
              color="#1A237E" 
            />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A237E',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15
  },
  subheading: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    width: '30%',
    borderWidth: 2,
    elevation: 5,
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  nextButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginRight: 10,
  },
});





























import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView, 
  StatusBar, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RegisterPage({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Register logic here
    console.log('User Registered', name, email, password);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#ffffff', '#F0F4F8']} 
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text style={styles.heading}>Create Your Account</Text>
          <Text style={styles.subheading}>Join us and start exploring the world!</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')} 
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    textAlign: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  subheading: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#616161',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#1A237E',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#1A237E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#1A237E',
    fontSize: 16,
  },
});
