import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
      <Stack.Navigator initialRouteName="wp">
        <Stack.Screen options={{ headerShown: false }} name="wp" component={WelcomePage}/>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Forgot_Password" component={ForgotPasswordScreen} />
        <Stack.Screen options={{ headerShown: false }} name="admin" component={AdminScreen} />
        <Stack.Screen options={{ headerShown: false }} name="consumer" component={ServiceSelectionScreen} />
        <Stack.Screen options={{ headerShown: false }} name="provider" component={ProviderScreen} />
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
