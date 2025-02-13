import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories] = useState([
    {
      id: '1',
      name: 'Healthcare',
      icon: 'medical-outline',
      color: '#4CAF50',
      services: ['Doctors', 'Dentists', 'Physiotherapy']
    },
    {
      id: '2',
      name: 'Home Services',
      icon: 'home-outline',
      color: '#2196F3',
      services: ['Cleaning', 'Plumbing', 'Electrical']
    },
    {
      id: '3',
      name: 'Beauty & Wellness',
      icon: 'flower-outline',
      color: '#9C27B0',
      services: ['Salon', 'Spa', 'Massage']
    },
    // Add more categories
  ]);

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryDetails', { category: item })}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
        <Icon name={item.icon} size={30} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.serviceCount}>{item.services.length} Services</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Services</Text>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesList: {
    padding: 10,
  },
  categoryCard: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  serviceCount: {
    fontSize: 12,
    color: '#666',
  },
}); 