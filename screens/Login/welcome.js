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

  const gradientColors = ['#4158D0', '#C850C0', '#FFCC70'];

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
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View 
          style={{
            transform: [{ scale: splashScale }],
            opacity: splashOpacity,
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons 
            name="calendar-clock" 
            size={150} 
            color="#FFFFFF"
            style={{ 
              alignSelf: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 5,
            }}
          />
          <Text style={[styles.splashText, { color: '#FFFFFF' }]}>AppointPro</Text>
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
        colors={gradientColors}
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
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={100} 
              color="#FFFFFF"
              style={{ 
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 5,
              }}
            />
          </View>

          <Text style={styles.heading}>
            AppointPro
          </Text>
          
          <Text style={styles.subheading}>
            Book appointments effortlessly
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
              color="#4158D0"
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
    fontSize: 40,
    fontWeight: '800',
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  heading: {
    fontSize: Platform.OS === 'web' ? 44 : 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  subheading: {
    fontSize: Platform.OS === 'web' ? 22 : 20,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    transform: [{ scale: 1.05 }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: '700',
    marginRight: 12,
    color: '#4158D0',
    letterSpacing: 0.5,
  },
});