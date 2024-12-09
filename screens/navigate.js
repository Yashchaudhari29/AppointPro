import React from 'react';
import { View, StyleSheet, ScrollView, Text, Button } from 'react-native'; // Importing Button from React Native
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for the right arrow icon
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const services = [
  { name: 'Electrician' },
  { name: 'Technician' },
  { name: 'Plumber' },
];

const ServiceCard = ({ name }) => (
  <Card style={styles.card} mode="contained" onPress={() => alert(`You selected ${name}`)}>
    <View style={styles.row}>
      <Text style={styles.cardText}>{name}</Text>
      <Icon name="arrow-right" size={20} color="#fff" style={styles.icon} />
    </View>
  </Card>
);

const ServiceSelectionScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Ensure button visibility and styling */}
      <Text style={styles.headerText}>Choose your service...🔧</Text>
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <ServiceCard key={index} name={service.name} />
        ))}
      </View>
      <View style={styles.logoutButtonContainer}>
        <Button title="Logout" onPress={handleSignOut} color="#FF5733" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFE7',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  servicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#242629',
    paddingVertical: 10,
    elevation: 5,
  },
  cardText: {
    padding: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    fontSize: 20, // Adjusting icon size for consistent appearance
    color: '#fff',
  },
  logoutButtonContainer: {
    marginBottom: 20, // Add some space for visibility
    alignItems: 'center', // Center the button
  },
});

export default ServiceSelectionScreen;
