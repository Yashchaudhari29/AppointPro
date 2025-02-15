import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs,getFirestore, query, distinct } from 'firebase/firestore';
// import { db } from '../../firebase';
const db = getFirestore();
const CategoriesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Map of category names to their respective icons
  const categoryIcons = {
    'doctor': { icon: 'medical-bag', color: '#FF6B6B', bgColor: '#FFE8E8' },
    'electrician': { icon: 'flash-circle', color: '#4D96FF', bgColor: '#E6F0FF' },
    'plumber': { icon: 'pipe', color: '#48BFE3', bgColor: '#E3F6FC' },
    'Mechanic': { icon: 'car-cog', color: '#FF8C42', bgColor: '#FFE8D6' },
    'Photographer': { icon: 'camera-wireless', color: '#845EC2', bgColor: '#F1EAFC' },
    'Cleaning': { icon: 'spray-bottle', color: '#00C2A8', bgColor: '#E0F7F5' },
    'Beauty Salon': { icon: 'face-woman-shimmer', color: '#FF75A0', bgColor: '#FFE8F0' },
    'Dental Clinic': { icon: 'tooth-outline', color: '#00B4D8', bgColor: '#E0F7FC' },
    'Chiropractor': { icon: 'human-handsup', color: '#9B5DE5', bgColor: '#F3EBFC' },
    'Pet Services': { icon: 'paw', color: '#FF9671', bgColor: '#FFE8E0' },
    'Tutoring': { icon: 'school', color: '#2EC4B6', bgColor: '#E0F6F4' },
    'Medical Clinic': { icon: 'hospital-box', color: '#FF6B6B', bgColor: '#FFE8E8' },
    'Hair Salon': { icon: 'content-cut', color: '#845EC2', bgColor: '#F1EAFC' },
    'Gym': { icon: 'weight-lifter', color: '#4D96FF', bgColor: '#E6F0FF' }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      // Create a Set to store unique categories
      const uniqueCategories = new Set();
      
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.job) {
          uniqueCategories.add(userData.job);
        }
      });

      // Convert Set to array and format for FlatList
      const categoriesArray = Array.from(uniqueCategories).map((category, index) => ({
        id: (index + 1).toString(),
        title: category
      }));

      setCategories(categoriesArray);
      setFilteredCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to handle search query change
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCategories(categories); // Reset to all categories when search is cleared
    } else {
      const filtered = categories.filter((category) =>
        category.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { 
        backgroundColor: theme.card,
        ...theme.shadow
      }]}
      onPress={() => navigation.navigate('Specific_detail', { category: item.title })}
    >
      <View style={[styles.iconContainer, { 
        backgroundColor: categoryIcons[item.title]?.bgColor || '#F0F0F0'
      }]}>
        <MaterialCommunityIcons 
          name={categoryIcons[item.title]?.icon || 'help-circle'}
          size={32}
          color={categoryIcons[item.title]?.color || theme.text}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.categoryTitle, { color: theme.text }]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      
      <Text style={[styles.header, { color: theme.text }]}>Categories</Text>

      {/* Search Input */}
      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: theme.searchBackground,
          color: theme.text,
          borderColor: theme.border
        }]}
        placeholder="Search categories..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
});

export default CategoriesScreen;

