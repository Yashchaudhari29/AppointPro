import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, StatusBar, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs,getFirestore, query, distinct } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
// import { db } from '../../firebase';
const db = getFirestore();

const { width } = Dimensions.get('window');
const CATEGORY_CARD_SIZE = (width - (16 * 3)) / 2;

const CategorySkeleton = () => (
  <View style={[styles.categoryCard, { backgroundColor: '#F3F4F6' }]}>
    <View style={[styles.skeleton, styles.iconContainer]} />
    <View style={styles.textContainer}>
      <View style={[styles.skeleton, { width: '80%', height: 20, marginBottom: 8 }]} />
      <View style={[styles.skeleton, { width: '60%', height: 16 }]} />
    </View>
  </View>
);

const CategoriesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [providers, setProviders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Map of category names to their respective icons
  const categoryIcons = {
    'doctor': { icon: 'medical-bag', color: '#FF6B6B', bgColor: '#FFE8E8' },
    'electrician': { icon: 'power-plug', color: '#4D96FF', bgColor: '#E6F0FF' },
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

  useMemo(() => {
    const fetchCategories = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        
        // Store all providers data
        const providersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProviders(providersData);
        
        const uniqueCategories = new Set();
        const counts = {};
        
        providersData.forEach((userData) => {
          if (userData.job) {
            uniqueCategories.add(userData.job);
            counts[userData.job] = (counts[userData.job] || 0) + 1;
          }
        });

        const categoriesArray = Array.from(uniqueCategories).map((category, index) => ({
          id: (index + 1).toString(),
          title: category
        }));

        setCategories(categoriesArray);
        setFilteredCategories(categoriesArray);
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    const fetchCategories = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        
        const providersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProviders(providersData);
        
        const uniqueCategories = new Set();
        const counts = {};
        
        providersData.forEach((userData) => {
          if (userData.job) {
            uniqueCategories.add(userData.job);
            counts[userData.job] = (counts[userData.job] || 0) + 1;
          }
        });

        const categoriesArray = Array.from(uniqueCategories).map((category, index) => ({
          id: (index + 1).toString(),
          title: category
        }));

        setCategories(categoriesArray);
        setFilteredCategories(categoriesArray);
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchCategories();
  }, []);

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      
      {/* Updated Header Section */}
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.text }]}>Book a Service</Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>
          Choose a category to find your service provider
        </Text>
      </View>

      {/* Search Input with Icon */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: theme.searchBackground,
            color: theme.text,
          }]}
          placeholder="What service are you looking for?"
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>


      {/* Categories List with Updated Card Design */}
      <FlatList
        data={categories.length === 0 && providers.length > 0 ? Array(6).fill({}) : filteredCategories}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E86DE']} // Android
            tintColor={theme.text} // iOS
          />
        }
        renderItem={({ item }) => (
          categories.length === 0 && providers.length > 0 ? (
            <CategorySkeleton />
          ) : (
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Specific_detail', { 
                category: item.title,
                providers: providers,
                bgcol: categoryIcons[item.title]?.bgColor || '#F3F4F6',
              })}
            >
              <LinearGradient
                colors={[`${categoryIcons[item.title]?.color}10` || '#F3F4F610', `${categoryIcons[item.title]?.color}20` || '#F3F4F620']}
                style={styles.categoryGradient}
              >
                <View style={[styles.iconContainer, { 
                  backgroundColor: categoryIcons[item.title]?.color || '#F3F4F6'
                }]}>
                  <MaterialCommunityIcons 
                    name={categoryIcons[item.title]?.icon || 'help-circle'}
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.categoryTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {categoryCounts[item.title] || 0} Specialists
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingLeft: 8,
    fontSize: 16,
  },
  popularSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  categoryCard: {
    width: CATEGORY_CARD_SIZE,
    height: CATEGORY_CARD_SIZE,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: CATEGORY_CARD_SIZE * 0.25,
    height: CATEGORY_CARD_SIZE * 0.25,
    borderRadius: (CATEGORY_CARD_SIZE * 0.25) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textContainer: {
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  skeleton: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default CategoriesScreen;

