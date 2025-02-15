import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const db = getFirestore();

const Specific_detail = ({ route, navigation }) => {
  const { category } = route.params;
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, [category]);

  const fetchProviders = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('job', '==', category)
      );
      const querySnapshot = await getDocs(q);
      const providersData = [];
      
      querySnapshot.forEach((doc) => {
        providersData.push({ id: doc.id, ...doc.data() });
      });
      
      setProviders(providersData);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleBooking = (providerId) => {
    navigation.navigate('BookAppointment', {
      providerId,
      category,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {providers.map((provider) => (
        <View key={provider.id} style={styles.card}>
          <View style={styles.providerHeader}>
            <Image
              source={{ uri: provider.profileImage || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{provider.name}</Text>
              <Text style={styles.specialty}>{provider.specialty || category}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.infoText}>
                {provider.rating || '4.5'} ({provider.reviewCount || '0'} reviews)
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <Text style={styles.infoText}>
                {provider.location || 'Location not specified'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="currency-usd" size={20} color="#666" />
              <Text style={styles.infoText}>
                {provider.price || 'Price not specified'} per visit
              </Text>
            </View>
          </View>

          <View style={styles.experienceContainer}>
            <Text style={styles.experienceText}>
              {provider.experience || '5+ years'} of experience
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton} onPress={() => navigation.navigate('booking')}
          >
            <Text style={styles.bookButtonText} >Book Appointment</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  specialty: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666666',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  experienceContainer: {
    marginBottom: 16,
  },
  experienceText: {
    fontSize: 14,
    color: '#333333',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Specific_detail;
