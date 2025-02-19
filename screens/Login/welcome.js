import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Animated,
  StatusBar,
  SafeAreaView, 
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../../firebase'; // Import auth from firebase

export default function WelcomePage({ navigation }) {
  const [showSplash, setShowSplash] = useState(true);
  
  const splashScale = useRef(new Animated.Value(0.5)).current;
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Splash animation
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
        // Only start welcome animations if user is not logged in
        if (!auth.currentUser) {
          startWelcomeAnimations();
        } else {
          // Navigate to main app screen if user is logged in
          navigation.replace('consumer');
        }
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
    navigation.navigate('Login');
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient 
          colors={['#FFFFFF', '#F0F4F8']} 
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View 
          style={{
            transform: [{ scale: splashScale }],
            opacity: splashOpacity
          }}
        >
          <MaterialCommunityIcons 
            name="calendar-clock" 
            size={120} 
            color="#1A237E"
            style={{ alignSelf: 'center'}}
          />
          <Text style={[styles.splashText, { color: '#1A237E' }]}>AppointPro</Text>
        </Animated.View>
      </View>
    );
  }

  // If user is logged in, don't show welcome screen
  if (auth.currentUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#FFFFFF', '#F0F4F8']} 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
      />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        
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
          <View 
            style={[
              styles.logoContainer, 
              { 
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: 'rgba(26, 35, 126, 0.1)'
              }
            ]}
          >
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={80} 
              color="#1A237E"
            />
          </View>

          <Text style={styles.heading}>
            Welcome to the Future
          </Text>
          
          <Text style={styles.subheading}>
            Unleash Possibilities, Redefine Experience
          </Text>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              Explore Now
            </Text>
            <MaterialCommunityIcons 
              name="arrow-right-circle" 
              size={30} 
              color="#FFFFFF"
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
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 40 : 20,
  },
  logoContainer: {
    marginBottom: 30,
    borderRadius: 50,
    padding: 20,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  heading: {
    fontSize: Platform.OS === 'web' ? 40 : 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A237E',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  subheading: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    fontStyle: 'italic',
    color: '#1A237E',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    backgroundColor: '#1A237E',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#FFFFFF',
  },
});