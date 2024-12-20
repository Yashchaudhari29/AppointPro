import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import LoginScreen from './screens/Login_page';
import AdminScreen from './screens/AdminScreen';
import ProviderScreen from './screens/ProviderScreen';
import ServiceSelectionScreen from './screens/navigate';
import WelcomePage from './screens/welcome';
import RegisterScreen from './screens/Register_page';
import ForgotPasswordScreen from './screens/Forgot_password';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      
        initialRouteName="wp" 
        // screenOptions={{
        //   headerStyle: {
        //     backgroundColor: '#FFFFE7', // Attractive header background color
        //     shadowColor: 'transparent', // Remove shadow
        //     elevation: 0, // No shadow for Android
        //   },
        //   headerTintColor: 'black', // White color for header text
        //   headerTitleStyle: {
        //     // fontWeight: 'bold', // Bold title for headers
        //     // fontSize: 22, // Larger font size
        //   },
        //   cardStyle: {
        //     backgroundColor: '#FFFFE7', // Light background for all screens
        //   },
        // }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="wp"
          component={WelcomePage}
        />
        <Stack.Screen options={{ headerShown: false }}
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen options={{ headerShown: false }}
          name="Register" 
          component={RegisterScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="Forgot_Password" 
          component={ForgotPasswordScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="admin" 
          component={AdminScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="consumer" 
          component={ServiceSelectionScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="provider" 
          component={ProviderScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
