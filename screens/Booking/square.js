import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, FlatList } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db1 = getFirestore();
const screenWidth = Dimensions.get('window').width;

// Icon mapping for different provider types
const getProviderIcon = (job) => {
  const iconMap = {
    'Doctor': 'user-md',
    'Dentist': 'tooth',
    'Cardiologist': 'heart',
    'Dermatologist': 'allergies',
    'Pediatrician': 'baby',
    'Psychiatrist': 'brain',
    'Physiotherapist': 'walking',
    'Nurse': 'user-nurse',
    'Plumber': 'wrench',
    'Electrician': 'bolt',
    'Carpenter': 'hammer',
    'Cleaner': 'broom',
    'default': 'user-tie'
  };

  return iconMap[job] || iconMap.default;
};

// Get color for different provider types
const getProviderColor = (job) => {
  const colorMap = {
    'Doctor': '#4CAF50',
    'Dentist': '#2196F3',
    'Cardiologist': '#F44336',
    'Dermatologist': '#9C27B0',
    'Pediatrician': '#FF9800',
    'Psychiatrist': '#673AB7',
    'Physiotherapist': '#00BCD4',
    'Nurse': '#E91E63',
    'Plumber': '#3F51B5',
    'Electrician': '#FFC107',
    'Carpenter': '#795548',
    'Cleaner': '#009688',
    'default': '#607D8B'
  };

  return colorMap[job] || colorMap.default;
};

const AppointmentScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db1, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const users = userSnapshot.docs.map(doc => doc.data());

      const groupedJobs = users.reduce((acc, user) => {
        if (user.role === 'provider') {
          const { job } = user;
          if (!acc[job]) acc[job] = [];
          acc[job].push(user);
        }
        return acc;
      }, {});
      setCategories(groupedJobs);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const renderProvider = ({ item }) => {
    const iconName = getProviderIcon(item.job);
    const iconColor = getProviderColor(item.job);
    
    return (
      <TouchableOpacity 
        style={styles.providerCard}
        onPress={() => navigation.navigate('ProviderDetail', { provider: item })}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <FontAwesome5 name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <Text style={styles.providerJob}>{item.job}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.reviews}>(124)</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: iconColor }]} onPress={() => navigation.navigate('booking')}
        >
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search specialists..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Ionicons name="filter" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {Object.entries(categories).map(([category, providers]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoryDetail', { category })}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={providers}
              renderItem={renderProvider}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.providersList}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    color: '#333',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  content: {
    paddingVertical: 20,
  },
  categorySection: {
    marginBottom: 28,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  providersList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 6,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  providerInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerJob: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    color: '#333',
    marginLeft: 4,
    marginRight: 2,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AppointmentScreen;