// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// // Import your screens
// import LoginScreen from './screens/Login/Login_page';
// import AdminScreen from './screens/Login/AdminScreen';
// import ProviderScreen from './screens/Login/ProviderScreen';
// import HomeScreen from './screens/Login/ConsumerScreen';
// import WelcomePage from './screens/Login/welcome';
// import RegisterScreen from './screens/Login/Register_page';
// import ForgotPasswordScreen from './screens/Login/Forgot_password';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator 
      
//         initialRouteName="wp" 
//         // screenOptions={{
//         //   headerStyle: {
//         //     backgroundColor: '#FFFFE7', // Attractive header background color
//         //     shadowColor: 'transparent', // Remove shadow
//         //     elevation: 0, // No shadow for Android
//         //   },
//         //   headerTintColor: 'black', // White color for header text
//         //   headerTitleStyle: {
//         //     // fontWeight: 'bold', // Bold title for headers
//         //     // fontSize: 22, // Larger font size
//         //   },
//         //   cardStyle: {
//         //     backgroundColor: '#FFFFE7', // Light background for all screens
//         //   },
//         // }}
//       >
//         <Stack.Screen
//           options={{ headerShown: false }}
//           name="wp"
//           component={WelcomePage}
//         />
//         <Stack.Screen options={{ headerShown: false }}
//           name="Login" 
//           component={LoginScreen} 
//         />
//         <Stack.Screen options={{ headerShown: false }}
//           name="Register" 
//           component={RegisterScreen} 
//         />
//         <Stack.Screen 
//           options={{ headerShown: false }} 
//           name="Forgot_Password" 
//           component={ForgotPasswordScreen} 
//         />
//         <Stack.Screen 
//           options={{ headerShown: false }} 
//           name="admin" 
//           component={AdminScreen} 
//         />
//         <Stack.Screen 
//           options={{ headerShown: false }} 
//           name="consumer" 
//           component={HomeScreen} 
//         />
//         <Stack.Screen 
//           options={{ headerShown: false }} 
//           name="provider" 
//           component={ProviderScreen} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { NotificationProvider } from './screens/Login/NotificationsScreen';
import { ThemeProvider } from './contexts/ThemeContext';  //for theme

// Import your screens
import LoginScreen from './screens/Login/Login_page';
import AdminScreen from './screens/Login/AdminScreen';
import ProviderScreen from './screens/Login/ProviderScreen';
import HomeScreen from './screens/Login/ConsumerScreen';
import CategoriesScreen from './screens/Login/Categories';
import AppointmentScreen from './screens/Login/sqaure';
import WelcomePage from './screens/Login/welcome';
import RegisterScreen from './screens/Login/Register_page';
import ForgotPasswordScreen from './screens/Login/Forgot_password';
import NotificationsScreen from './screens/Login/NotificationsScreen';
import PrivacyScreen from './screens/Login/PrivacyScreen';
import SupportScreen from './screens/Login/SupportScreen';
import PaymentMethodsScreen from './screens/Login/PaymentMethodsScreen';
import PersonalInfoScreen from './screens/Login/PersonalInfoScreen';
import ExploreScreen from './screens/Login/ExploreScreen';
import MessagesScreen from './screens/Login/MessagesScreen';
import ProfileScreen from './screens/Login/ProfileScreen';
import AppointmentsScreen from './screens/Login/AppointmentsScreen';
import ChangePasswordScreen from './screens/Login/ChangePasswordScreen';
import TwoFactorAuthScreen from './screens/Login/TwoFactorAuthScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab': iconName = 'home-outline'; break;
            case 'ExploreTab': iconName = 'compass-outline'; break;
            case 'MessagesTab': iconName = 'chatbubble-outline'; break;
            case 'ProfileTab': iconName = 'person-outline'; break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabel: ({ focused }) => {
          // Return the label without "Tab" suffix
          let label = route.name.replace('Tab', '');
          return <Text style={{ color: focused ? '#1a73e8' : 'gray', fontSize: 12 }}>{label}</Text>;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} />
      <Tab.Screen name="MessagesTab" component={MessagesScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="wp"
            screenOptions={({ route }) => ({
              headerShown: false
            })}
          >
            <Stack.Screen
              name="wp"
              component={WelcomePage}
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
            <Stack.Screen 
              name="admin" 
              component={AdminScreen} 
            />
            <Stack.Screen 
              name="consumer" 
              component={HomeScreen} 
            />
            <Stack.Screen 
              name="provider" 
              component={ProviderScreen} 
            />
            <Stack.Screen 
              name="Categories" 
              component={CategoriesScreen} 
            />
             <Stack.Screen 
              name="Appointments" 
              component={AppointmentScreen} 
            />
            <Stack.Screen 
              name="UserAppointments"
              component={AppointmentsScreen}
              options={{
                title: 'My Appointments',
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerTintColor: '#333',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen name="MainApp" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Support" component={SupportScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
            <Stack.Screen 
              name="ChangePassword" 
              component={ChangePasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="TwoFactorAuth" 
              component={TwoFactorAuthScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationProvider>
    </ThemeProvider>
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
