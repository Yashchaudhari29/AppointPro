import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: '1', title: 'Electrician' },
  { id: '2', title: 'Mechanic' },
  { id: '3', title: 'Plumber' },
  { id: '4', title: 'Photographers' },
  { id: '5', title: 'Cleaning' },
  { id: '6', title: 'Beauty Salons' },
  { id: '7', title: 'Dental Clinics' },
  { id: '8', title: 'Chiropractors' },
  { id: '9', title: 'Pet Services' },
  { id: '10', title: 'Tutoring Lessons' },
  { id: '11', title: 'Medical Clinics' },
  { id: '12', title: 'Hair Salons' },
  { id: '13', title: 'Gyms' },
];

const CategoriesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categories</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard}>
            <View style={styles.placeholderIcon} /> {/* Placeholder */}
            <Text style={styles.categoryTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  placeholderIcon: { width: 50, height: 50, backgroundColor: '#ddd', marginBottom: 8, borderRadius: 25 },
  categoryTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});

export default CategoriesScreen;

