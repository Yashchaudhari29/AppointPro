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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomePage({ navigation }) {
  const [colorMode, setColorMode] = useState('light');
  const [showSplash, setShowSplash] = useState(true);
  
  const splashScale = useRef(new Animated.Value(0.5)).current;
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const theme = {
    light: {
      gradientColors: ['#FFFFFF', '#F0F4F8'],
      text: '#1A237E',
      accent: '#1A237E',
      iconBackground: 'transparent', // Removed white background
      textShadow: 'rgba(0, 0, 0, 0.1)',
      buttonText: '#FFFFFF',
      buttonBackground: '#1A237E',
      logoContainerBorder: 'rgba(26, 35, 126, 0.1)'
    },
    dark: {
      gradientColors: ['#121212', '#1E1E1E'],
      text: '#E0E0E0',
      accent: '#3F51B5',
      iconBackground: 'transparent', // Removed white background
      textShadow: 'rgba(255, 255, 255, 0.1)',
      buttonText: '#FFFFFF',
      buttonBackground: '#3F51B5',
      logoContainerBorder: 'rgba(63, 81, 181, 0.2)'
    }
  };

  const currentTheme = theme[colorMode];

  const toggleTheme = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
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
    navigation.navigate('Login');
  };

  const ThemeToggleButton = () => (
    <TouchableOpacity 
      onPress={toggleTheme} 
      style={styles.themeToggle}
    >
      {colorMode === 'light' ? (
        <Ionicons name="moon" size={24} color={currentTheme.text} />
      ) : (
        <Ionicons name="sunny" size={24} color={currentTheme.text} />
      )}
    </TouchableOpacity>
  );

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient 
          colors={currentTheme.gradientColors} 
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
            color={currentTheme.accent}
            style={{ alignSelf: 'center'}}
          />
          <Text style={[styles.splashText, { color: currentTheme.text }]}>AppointPro</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={currentTheme.gradientColors} 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
      />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar 
          barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'} 
        />
        
        <ThemeToggleButton />

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
                backgroundColor: currentTheme.iconBackground,
                borderWidth: 2,
                borderColor: currentTheme.logoContainerBorder
              }
            ]}
          >
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={80} 
              color={currentTheme.accent}
            />
          </View>

          <Text 
            style={[
              styles.heading, 
              { 
                color: currentTheme.text,
                textShadowColor: currentTheme.textShadow,
              }
            ]}
          >
            Welcome to the Future
          </Text>
          
          <Text 
            style={[
              styles.subheading, 
              { 
                color: currentTheme.text,
                textShadowColor: currentTheme.textShadow,
              }
            ]}
          >
            Unleash Possibilities, Redefine Experience
          </Text>

          <TouchableOpacity 
            style={[
              styles.nextButton, 
              { 
                backgroundColor: currentTheme.buttonBackground,
                shadowColor: currentTheme.accent,
                elevation: 5,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3
              }
            ]} 
            onPress={handleNext}
          >
            <Text style={[
              styles.nextButtonText, 
              { color: currentTheme.buttonText }
            ]}>
              Explore Now
            </Text>
            <MaterialCommunityIcons 
              name="arrow-right-circle" 
              size={30} 
              color={currentTheme.buttonText}
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
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    right: 20,
    opacity: 0.7,
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
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5
  },
  subheading: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    fontStyle: 'italic',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
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
  },
});