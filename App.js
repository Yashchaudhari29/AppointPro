import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { NotificationProvider } from './screens/consumer/home/NotificationsScreen';
import { ThemeProvider } from './contexts/ThemeContext';  //for theme

// Import your screens
import LoginScreen from './screens/Login/Login_page';
// import AdminScreen from './screens/Login/AdminScreen';
import ProviderScreen from './screens/Login/ProviderScreen';
import HomeScreen from './screens/consumer/home/ConsumerScreen';
import CategoriesScreen from './screens/consumer/Booking/Categories';
import AppointmentScreen from './screens/consumer/Booking/square';
import EditAppointment from './screens/consumer/Booking/Booking';
import WelcomePage from './screens/Login/welcome';
import RegisterScreen from './screens/Login/Register_page';
import ForgotPasswordScreen from './screens/Login/Forgot_password';
import NotificationsScreen from './screens/consumer/home/NotificationsScreen';
import PrivacyScreen from './screens/consumer/Profile/PrivacyScreen';
import SupportScreen from './screens/consumer/Profile/SupportScreen';
import PaymentMethodsScreen from './screens/consumer/Profile/PaymentMethodsScreen';
import PersonalInfoScreen from './screens/consumer/Profile/PersonalInfoScreen';
import ExploreScreen from './screens/consumer/Explore/ExploreScreen';
import MessagesScreen from './screens/consumer/Messages/MessagesScreen';
import ProfileScreen from './screens/consumer/Profile/ProfileScreen';
import AppointmentsScreen from './screens/consumer/home/AppointmentsScreen';
import ChangePasswordScreen from './screens/consumer/Profile/ChangePasswordScreen';
import TwoFactorAuthScreen from './screens/consumer/Profile/TwoFactorAuthScreen';
import ChatDetail from './screens/consumer/Messages/ChatDetail';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Specific_detail from './screens/consumer/Booking/Specific_detail';
import ConfirmBooking from './screens/consumer/Booking/ConfirmBooking';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                name="booking"
                component={EditAppointment}
              />
              <Stack.Screen
                name="ConfirmBooking"
                component={ConfirmBooking}
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
              {/* <Stack.Screen
                name="admin"
                component={AdminScreen}
              /> */}
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
                name="ChatDetail"
                component={ChatDetail}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserAppointments"
                component={AppointmentsScreen}
                options={{
                  headerShown:true,
                  title: 'My Appointments',
                }}
              />
              <Stack.Screen
                name="Specific_detail"
                component={Specific_detail}
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
      </ThemeProvider></GestureHandlerRootView>
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
