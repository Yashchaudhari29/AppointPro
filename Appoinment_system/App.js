import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './screens/welcome';
import ServiceSelectionScreen from './screens/navigate';
import LoginScreen from './screens/Login_page'; 
import RegisterScreen from './screens/Register_page'; 
import ForgotPasswordScreen from './screens/Forgot_password'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="wp">
        <Stack.Screen
          name="wp"
          component={WelcomePage}
        />
        <Stack.Screen
          name="sss"
          component={ServiceSelectionScreen}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
        <Stack.Screen 
          name="Forgot_Password" 
          component={ForgotPasswordScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
