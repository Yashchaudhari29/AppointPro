import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db1 = getFirestore();
const screenWidth = Dimensions.get('window').width;

const AppointmentScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search specialists..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.categoryButtonText}>Categories</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.keys(categories).map((categoryKey) => (
          <View key={categoryKey} style={styles.section}>
            <Text style={styles.sectionTitle}>{categoryKey}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories[categoryKey].map((item, index) => (
                <View key={index} style={styles.card}>
                  <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.cardImage} />
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardDetails}>{item.job}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
  },
  categoryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  categoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    width: screenWidth * 0.4,
    marginRight: 12,
    elevation: 2,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDetails: {
    fontSize: 12,
    color: '#777',
  },
});

export default AppointmentScreen;