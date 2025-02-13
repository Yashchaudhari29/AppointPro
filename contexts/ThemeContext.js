import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, Alert } from 'react-native';

export const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#1a73e8',
    secondary: '#f0f0f0',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E0E0E0',
    error: '#d9534f',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
    card: '#FFFFFF',
    statusBar: 'dark-content',
    searchBackground: '#f5f5f5',
    inputBackground: '#FFFFFF',
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }
  },
  dark: {
    name: 'dark',
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#2196F3',
    secondary: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
    error: '#ef5350',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#00acc1',
    card: '#242424',
    statusBar: 'light-content',
    searchBackground: '#2C2C2C',
    inputBackground: '#1E1E1E',
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
  }
};

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);
  const [theme, setTheme] = useState(
    systemColorScheme === 'dark' ? themes.dark : themes.light
  );

  // Load saved theme mode
  useEffect(() => {
    loadThemeMode();
  }, []);

  // Update theme when system theme or theme mode changes
  useEffect(() => {
    updateTheme(themeMode);
  }, [systemColorScheme, themeMode]);

  const loadThemeMode = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem('themeMode');
      if (savedThemeMode) {
        setThemeMode(savedThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const updateTheme = (mode) => {
    let newTheme;
    switch (mode) {
      case ThemeMode.LIGHT:
        newTheme = themes.light;
        break;
      case ThemeMode.DARK:
        newTheme = themes.dark;
        break;
      case ThemeMode.SYSTEM:
        newTheme = systemColorScheme === 'dark' ? themes.dark : themes.light;
        break;
      default:
        newTheme = themes.light;
    }
    setTheme(newTheme);
  };

  const showThemeSelector = () => {
    Alert.alert(
      'Choose Theme',
      'Select your preferred theme',
      [
        {
          text: 'Light',
          onPress: () => changeThemeMode(ThemeMode.LIGHT)
        },
        {
          text: 'Dark',
          onPress: () => changeThemeMode(ThemeMode.DARK)
        },
        {
          text: 'System',
          onPress: () => changeThemeMode(ThemeMode.SYSTEM)
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
  };

  const changeThemeMode = async (mode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode,
      showThemeSelector 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 