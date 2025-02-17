import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  Modal,
  Animated,
  RefreshControl
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppointmentScreen from '../Booking/square';
import { auth } from '../../firebase';
import ExploreScreen from '../Explore/ExploreScreen';
import MessagesScreen from '../Messages/MessagesScreen';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNotifications } from './NotificationsScreen';
import { BlurView } from 'expo-blur';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import * as Location from 'expo-location';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import CategoriesScreen from '../Booking/Categories';
import { Provider } from 'react-native-paper';

const db1 = getFirestore();
const { width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.75;
const CATEGORY_CARD_SIZE = (width - (16 * 3)) / 2;

const jobsData = [
  {
    id: '1',
    title: 'Senior .Net Developer',
    company: 'Attri',
    location: 'Ahmedabad, Gujarat',
    salary: '₹17,00,000 - ₹20,00,000 a year',
    tags: ['Full-time', 'Day shift'],
    posted: 'Active 5 days ago',
  },
  {
    id: '2',
    title: 'Senior .NET (MVC/Core) Developer',
    company: 'MagnusMinds IT Solution',
    location: 'Satellite, Ahmedabad, Gujarat',
    salary: '₹17,00,000 - ₹20,00,000 a year',
    tags: ['Full-time', 'Day shift'],
    posted: 'Active 3 days ago',
  },
];

function JobCard({ job }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.salary}>{job.salary}</Text>
      <View style={styles.tagsContainer}>
        {job.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
      <Text style={styles.posted}>{job.posted}</Text>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyText}>Easily apply</Text>
      </TouchableOpacity>
    </View>
  );
}

// Add this skeleton component near the top
const AppointmentSkeleton = () => (
  <View style={styles.appointmentCard}>
    <View style={styles.appointmentTimeStrip}>
      <View style={[styles.skeleton, { width: 80, height: 20 }]} />
      <View style={[styles.skeleton, { width: 100, height: 20 }]} />
    </View>
    <View style={styles.appointmentContent}>
      <View style={[styles.skeleton, { width: '70%', height: 24, marginBottom: 8 }]} />
      <View style={[styles.skeleton, { width: '50%', height: 18, marginBottom: 8 }]} />
      <View style={[styles.skeleton, { width: '30%', height: 24 }]} />
    </View>
  </View>
);

// Add this component for the hero section skeleton
const HeroSectionSkeleton = () => (
  <View style={styles.heroSection}>
    <View style={styles.heroHeader}>
      <View>
        <View style={[styles.skeleton, { width: 150, height: 28, marginBottom: 8 }]} />
        <View style={[styles.skeleton, { width: 120, height: 16 }]} />
      </View>
      <View style={styles.headerActions}>
        <View style={[styles.skeleton, { width: 40, height: 40, borderRadius: 12 }]} />
        <View style={[styles.skeleton, { width: 40, height: 40, borderRadius: 12 }]} />
      </View>
    </View>
  </View>
);

// Update the FeaturedSpecialistSkeleton
const FeaturedSpecialistSkeleton = () => (
  <View style={[styles.modernDoctorCard, { backgroundColor: '#fff' }]}>
    <View style={[styles.skeleton, { 
      width: '100%', 
      height: ITEM_SIZE * 0.8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20
    }]} />
    
    <View style={styles.modernDoctorInfo}>
      <View style={styles.nameRow}>
        <View style={[styles.skeleton, { width: '60%', height: 24, marginBottom: 8 }]} />
        <View style={[styles.skeleton, { width: 45, height: 24, borderRadius: 12 }]} />
      </View>
      
      <View style={[styles.skeleton, { width: '40%', height: 16, marginBottom: 12 }]} />
      
      <View style={[styles.modernLocationContainer, { backgroundColor: '#F8F9FA' }]}>
        <View style={[styles.skeleton, { width: '80%', height: 16 }]} />
      </View>

      <View style={styles.modernStatsRow}>
        <View style={[styles.modernStat, { backgroundColor: '#F8F9FA' }]}>
          <View style={[styles.skeleton, { width: 80, height: 16 }]} />
        </View>
        <View style={[styles.modernStat, { backgroundColor: '#F8F9FA' }]}>
          <View style={[styles.skeleton, { width: 100, height: 16 }]} />
        </View>
      </View>

      <View style={styles.modernBadgeContainer}>
        <View style={[styles.skeleton, { width: 80, height: 28, borderRadius: 14 }]} />
        <View style={[styles.skeleton, { width: 60, height: 28, borderRadius: 14 }]} />
      </View>
    </View>
  </View>
);

// Add CategorySkeleton component
const CategorySkeleton = () => (
  <View style={styles.categoryCard}>
    <View style={[styles.skeleton, { 
      width: CATEGORY_CARD_SIZE,
      height: CATEGORY_CARD_SIZE,
      borderRadius: 16
    }]} />
  </View>
);

function HomeScreen() {
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Fetching location...');
  const [searchHistory, setSearchHistory] = useState([
    'Mobile App Developer', 'UI/UX Designer', 'Frontend Developer'
  ]);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchAnimation = useSharedValue(0);
  const [name, setName] = useState('User');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [appointmentIds, setAppointmentIds] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [providers, setProviders] = useState({});
  const [professions, setProfessions] = useState({});

  const [popularServices, setPopularServices] = useState([
    {
      id: '1',
      title: 'Plumbing Services',
      image: 'https://example.com/plumbing.jpg',
      rating: 4.8,
      reviews: 120,
      category: 'Home Services'
    },
    {
      id: '2',
      title: 'Electrical Repair',
      image: 'https://example.com/electrical.jpg',
      rating: 4.9,
      reviews: 150,
      category: 'Home Services'
    },
  ]);

  const popularSearches = [
    { id: '1', term: 'Software Engineer', icon: 'code-outline' },
    { id: '2', term: 'Product Designer', icon: 'color-palette-outline' },
    { id: '3', term: 'Data Scientist', icon: 'analytics-outline' },
    { id: '4', term: 'DevOps Engineer', icon: 'server-outline' },
  ];

  const [animations] = useState(() =>
    Array(6).fill(0).map(() => ({
      fadeAnim: new Animated.Value(0),
      translateX: new Animated.Value(50)
    }))
  );

  const [userInfo, setUserInfo] = useState('');

  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(50)).current;

  // Extract fetchUserData function
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db1, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();

      if (userSnap.exists()) {
        setName(userData.firstName);
      } else {
        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Extract fetchAppointmentIds function
  const fetchAppointmentIds = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const consumerAppointmentRef = doc(db1, 'ConsumerAppointments', user.uid);
      const consumerAppointmentSnap = await getDoc(consumerAppointmentRef);

      if (consumerAppointmentSnap.exists()) {
        const ids = consumerAppointmentSnap.data().appointments || [];
        const invertedIds = [...ids].reverse();
        setAppointmentIds(invertedIds);
      }
    } catch (error) {
      console.error('Error fetching appointment IDs:', error);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        if (appointmentIds.length === 0) return;

        const appointmentPromises = appointmentIds.map(async (id) => {  // Only fetch first 4
          const appointmentRef = doc(db1, 'Appointments', id);
          const appointmentSnap = await getDoc(appointmentRef);
          const data = appointmentSnap.data();
          if (appointmentSnap.exists()) {
            const data = appointmentSnap.data();
            return {
              id: id,
              serviceName: data.serviceName,
              providerName: data.providerName,
              date: data.date,
              time: data.time,
              status: data.status || 'Pending',
              appointment_Status:data.appointment_Status,
              image:data.provider_image,
              location:data.location,
            };
          }
          return null;
        });

        const allAppointments = (await Promise.all(appointmentPromises))
          .filter(appointment => appointment !== null);

        // Set state with only the first 2 appointments
        setUpcomingAppointments(allAppointments.slice(0, 4));
        setAllAppointments(allAppointments)
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentIds]);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const usersRef = collection(db1, 'users');
      const q = query(usersRef, where('role', '==', 'provider'));
      const usersSnapshot = await getDocs(q);
      
      // Object to store category counts and providers
      const categoryData = {
        'Emergency Care': { count: 0, icon: 'heartbeat', color: '#FF4757' },
        'Automobile': { count: 0, icon: 'car', color: '#2E86DE' },
        'Home Care': { count: 0, icon: 'home', color: '#1DD1A1' },
        'Beauty & Spa': { count: 0, icon: 'spa', color: '#9B59B6' },
        'Education': { count: 0, icon: 'school', color: '#F1C40F' },
        'General Services': { count: 0, icon: 'tools', color: '#20bf6b' }
      };

      // Process each user and categorize them
      usersSnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id };
        const profession = userData.job?.toLowerCase() || '';

        // Categorize based on profession and store unique professions
        if (profession.includes('doctor') || profession.includes('nurse')) {
          categoryData['Emergency Care'].count++;
        }
        else if (profession.includes('mechanic') || profession.includes('driver')) {
          categoryData['Automobile'].count++;
        }
        else if (profession.includes('plumber') || profession.includes('electrician') || profession.includes('carpenter')) {
          categoryData['Home Care'].count++;
        }
        else if (profession.includes('beautician') || profession.includes('salon') || profession.includes('spa')) {
          categoryData['Beauty & Spa'].count++;
        }
        else if (profession.includes('teacher') || profession.includes('tutor')) {
          categoryData['Education'].count++;        } 
      });

      // Convert to array format for categories
      const categoriesArray = Object.entries(categoryData).map(([title, data], index) => ({
        id: (index + 1).toString(),
        title,
        icon: data.icon,
        color: data.color,
        count: data.count
      }));

      // Create providers object with all provider details
      const providersObject = Object.entries(categoryData).reduce((acc, [title, data]) => {
        acc[title] = data.providers;
        return acc;
      }, {});

      // Update state with categories that have providers and all providers
      setCategories(categoriesArray.filter(cat => cat.count > 0));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setProviders({});
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({ item }) => (
    <Animated.View
      style={[
        styles.categoryCard,
        {
          opacity: fadeAnim,
          transform: [{ translateX }],
        },
      ]}
    >
      <TouchableOpacity
        
        style={styles.categoryButton}
      >
        <LinearGradient
          colors={[`${item.color}10`, `${item.color}20`]}
          style={styles.categoryGradient}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <FontAwesome5 name={item.icon} size={24} color="#fff" />
          </View>
          <Text style={styles.categoryTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.categoryCount}>
            {item.count} Specialists
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Browse by Category
        </Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Booking')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#2E86DE" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.categoryIndicator}>
        <MaterialIcons name="swipe" size={20} color="#666" />
        <Text style={styles.swipeText}>Swipe to explore</Text>
      </View> */}

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setUserLocation('Location access denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        const formattedAddress = `${address.city || ''} - ${address.postalCode || ''}`;
        setUserLocation(formattedAddress);
      } else {
        setUserLocation('Address not found');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setUserLocation('Location unavailable');
    }
  };


  const handleSearchOpen = () => {
    setShowSearch(true);
    searchAnimation.value = withSpring(1);
  };

  const handleSearchClose = () => {
    searchAnimation.value = withSpring(0);
    setTimeout(() => setShowSearch(false), 300);
    setSearchQuery('');
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim()) {
      const filtered = suggestions.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const SearchOverlay = () => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: searchAnimation.value,
      transform: [
        {
          translateY: withSpring(searchAnimation.value * -20)
        }
      ]
    }));

    return (
      <Animated.View
        style={[styles.searchOverlay, animatedStyle]}
      >
        <BlurView intensity={90} style={StyleSheet.absoluteFill} />
        <View style={styles.searchContent}>
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Icon name="search-outline" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for jobs, skills, companies..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Icon name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={handleSearchClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.searchResults}>
            {searchQuery.length === 0 ? (
              <>
                {searchHistory.length > 0 && (
                  <View style={styles.searchSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent Searches</Text>
                      <TouchableOpacity onPress={() => setSearchHistory([])}>
                        <Text style={styles.clearText}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                    {searchHistory.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.searchItem}
                        onPress={() => setSearchQuery(item)}
                      >
                        <Icon name="time-outline" size={20} color="#666" />
                        <Text style={styles.searchItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <View style={styles.searchSection}>
                  <Text style={styles.sectionTitle}>Popular Searches</Text>
                  {popularSearches.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.searchItem}
                      onPress={() => setSearchQuery(item.term)}
                    >
                      <Icon name={item.icon} size={20} color="#666" />
                      <Text style={styles.searchItemText}>{item.term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.suggestionsContainer}>
                {filteredSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setSearchQuery(item);
                    }}
                  >
                    <Icon name="search-outline" size={20} color="#666" />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    );
  };

  const suggestions = [
    'Plumber', 'Electrician', 'Carpenter',
    'House Cleaning', 'AC Repair', 'Painter',
    'Beauty Salon', 'Massage', 'Personal Trainer',
    'Yoga Instructor', 'Dentist', 'Doctor'
  ].filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackFromSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('Appointments', { appointment: item })}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <View style={[styles.statusBadge,
        { backgroundColor: 
            item.status === 'Confirmed' ? '#E3FCEF' : 
            item.status === 'Cancelled' ? '#FFE5E5' : '#FFF5E6' 
        }]}>
          <Text style={[styles.statusText,
          { color: 
              item.status === 'Confirmed' ? '#1CB66C' : 
              item.status === 'Cancelled' ? '#FF3B30' : '#FF9500'
          }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.providerName}>{item.providerName}</Text>
      <View style={styles.appointmentInfo}>
        <Icon name="calendar-outline" size={16} color="#666" />
        <Text style={styles.appointmentText}>{item.date}</Text>
        <Icon name="time-outline" size={16} color="#666" />
        <Text style={styles.appointmentText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedDoctor = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('booking', { Provider: item })}
        style={styles.modernDoctorCard}
      >
        <View style={styles.imageWrapper}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.modernDoctorImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          >
            {/* <Text style={styles.modernPrice}>₹{item.price}/hr</Text> */}
          </LinearGradient>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#2E86DE" />
            </View>
          )}
        </View>
        
        <View style={styles.modernDoctorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.modernDoctorName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <Text style={styles.modernSpecialty} numberOfLines={1}>{item.specialty}</Text>
          
          <View style={styles.modernLocationContainer}>
            <Icon name="location-sharp" size={14} color="#666" />
            <Text style={styles.modernLocation} numberOfLines={1}>{item.location}</Text>
          </View>

          <View style={styles.modernStatsRow}>
            <View style={styles.modernStat}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.modernStatText}>{item.experience} exp</Text>
            </View>
            <View style={styles.modernStat}>
              {/* <Ionicons name="money-outline" size={14} color="#666" /> */}
              <Text style={styles.modernStatText}>Consultation : ₹{item.price|| '-'} </Text>
            </View>
          </View>

          {item.badges && item.badges.length > 0 && (
            <View style={styles.modernBadgeContainer}>
              {item.badges.slice(0, 2).map((badge, idx) => (
                <View key={idx} style={styles.modernBadge}>
                  <Text style={styles.modernBadgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryGrid = () => (
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryButton}
          onPress={() => navigation.navigate('CategoryDetails', { category })}
        >
          <View style={styles.categoryIconContainer}>
            <Icon name={category.icon} size={24} color="#1a73e8" />
          </View>
          <Text style={styles.categoryButtonText}>{category.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const additionalStyles = StyleSheet.create({
    categoryCard: {
      width: CATEGORY_CARD_SIZE,
      marginHorizontal: 8,
      borderRadius: 16,
      overflow: 'hidden',
    },
    categoryButton: {
      width: '100%',
      height: '100%',
    },
    categoryGradient: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
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
    section: {
      marginVertical: 16,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    viewAllText: {
      fontSize: 14,
      color: '#2E86DE',
      marginRight: 4,
    },
    categoryIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      opacity: 0.6,
    },
    swipeText: {
      marginLeft: 8,
      fontSize: 12,
      color: '#666',
    },
    categoriesList: {
      paddingHorizontal: 8,
      paddingVertical: 10,
    },
    skeleton: {
      backgroundColor: '#E1E9EE',
      borderRadius: 4,
      overflow: 'hidden',
    },
  });

  // Add this function to fetch featured doctors
  const fetchFeaturedDoctors = async () => {
    setIsFeaturedLoading(true);
    try {
      const usersRef = collection(db1, 'users');
      const q = query(
        usersRef,
        where('rating', '>=', 4.5),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      const doctors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        specialty: doc.data().job,
        location: doc.data().Location || '-',
        rating: doc.data().rating || 4.5,
        reviews: doc.data().reviews || 0,
        experience: doc.data().Exp || '-',
        price: doc.data().consultation || '-',
        verified: doc.data().verified || false,
        image: doc.data().image || null,
        badges: doc.data().badges || []
      }));
      // console.log(doctors);
      setFeaturedDoctors(doctors);
    } catch (error) {
      console.error('Error fetching featured doctors:', error);
      // Set empty array on error to prevent showing stale data
      setFeaturedDoctors([]);
    } finally {
      setIsFeaturedLoading(false);
    }
  };

  // Add this useEffect to fetch data when component mounts
  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  // Update onRefresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchFeaturedDoctors(),
        fetchUserData(),
        fetchAppointmentIds(),
        fetchCategories(),
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Update original useEffects to use these functions
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchAppointmentIds();
  }, []);

  // Add loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Update the fetchData functions to handle loading states
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchAppointmentIds(),
        fetchFeaturedDoctors(),
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update the render section for Featured Specialists
  const renderFeaturedSection = () => (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Specialists</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#2E86DE" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={isFeaturedLoading ? [1,2,3] : featuredDoctors}
        renderItem={isFeaturedLoading ? () => <FeaturedSpecialistSkeleton /> : renderFeaturedDoctor}
        keyExtractor={(item, index) => isFeaturedLoading ? index.toString() : item.id}
        contentContainerStyle={styles.featuredList}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      {isLoading ? <HeroSectionSkeleton /> : (
        // Hero Section with Location & Profile
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.welcomeText}>Hello, {name} 👋</Text>
              <TouchableOpacity style={styles.locationPicker}>
                <Icon name="location-sharp" size={18} color="#FF4757" />
                <Text style={styles.locationText} numberOfLines={1}>{userLocation}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowSearch(true)}
              >
                <Icon name="search" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Icon name="notifications-outline" size={24} color="#666" />
                {unreadCount > 0 && <View style={styles.notificationBadge} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.mainContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1a73e8']} // Android
            tintColor="#1a73e8" // iOS
          />
        }
      >
        {/* Upcoming Appointments */}
        {appointmentIds.length > 0 && (
          <View style={styles.upcomingSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Appointments</Text>
              {upcomingAppointments.length > 0 && (
                <TouchableOpacity 
                  style={styles.viewAllButton} 
                  onPress={() => navigation.navigate('UserAppointments', { appointment_detail: allAppointments })}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#2E86DE" />
                </TouchableOpacity>
              )}
            </View>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.appointmentsList}
            >
              {appointmentIds.length > 0 && upcomingAppointments.length === 0 ? (
                <>
                  <AppointmentSkeleton />
                  <AppointmentSkeleton />
                  <AppointmentSkeleton />
                </>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.appointmentCard}
                    onPress={() => navigation.navigate('AppointmentDetails', { id: item.id })}
                  >
                    <View style={styles.appointmentTimeStrip}>
                      <Text style={styles.appointmentTime}>{item.time}</Text>
                      <Text style={styles.appointmentDate}>{item.date}</Text>
                    </View>
                    <View style={styles.appointmentContent}>
                      <Text style={styles.serviceName}>{item.serviceName} Appointment</Text>
                      <Text style={styles.providerName}>{item.providerName}</Text>
                      <View style={[styles.statusBadge,
                      { backgroundColor: 
                          item.status === 'Confirmed' ? '#E3FCEF' : 
                          item.status === 'Cancelled' ? '#FFE5E5' : '#FFF5E6' 
                      }]}>
                        <Text style={[styles.statusText,
                        { color: 
                            item.status === 'Confirmed' ? '#1CB66C' : 
                            item.status === 'Cancelled' ? '#FF3B30' : '#FF9500'
                        }]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : null}
            </ScrollView>
          </View>
        )}

        {/* Featured Specialists Section */}
        {renderFeaturedSection()}

        {/* Categories Section */}
        {renderCategories()}
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSearch(false)}
      >
        <View style={[styles.searchModal, { backgroundColor: theme.background }]}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setShowSearch(false)}>
              <MaterialIcons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search specialists, services..."
              placeholderTextColor={theme.placeholder}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
          {showSearchSuggestions && (
            <ScrollView style={styles.suggestionsContainer}>
              {filteredSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={[styles.suggestionText, { color: theme.text }]}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: auth.currentUser?.email || 'Not available',
    phone: '+91 1234567890',
    location: 'Ahmedabad, Gujarat',
    profileImage: 'https://via.placeholder.com/150'
  });

  const menuItems = [
    {
      id: '1',
      title: 'My Appointments',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('UserAppointments'),
    },
    {
      id: '2',
      title: 'Personal Information',
      icon: 'account-details',
      onPress: () => navigation.navigate('PersonalInfo'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'credit-card',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: '4',
      title: 'Notifications',
      icon: 'bell-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: '5',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: '6',
      title: 'Privacy Policy',
      icon: 'shield-check-outline',
      onPress: () => navigation.navigate('Privacy'),
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.replace('wp');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      <ScrollView style={styles.profileContainer}>
        <LinearGradient
          colors={['#1a73e8', '#0d47a1']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileHeaderContent}>
            <Image
              source={{ uri: userInfo.profileImage }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color="#d9534f"
                />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#757575"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color="#fff"
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = 'compass-outline';
          } else if (route.name === 'Booking') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Messages') {
            iconName = 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Booking" component={CategoriesScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeaderContent: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d9534f',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a73e8',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  appointmentCard: {
    width: 280,
    padding: 16,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  providerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 12,
  },
  serviceCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  activityCard: {
    width: 160,
    padding: 12,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  activityService: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  // section: {
  //   marginBottom: 24,
  // },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    position: 'relative',
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  badgeContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    zIndex: 1000,
  },
  searchContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    paddingLeft: 16,
  },
  cancelText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResults: {
    flex: 1,
  },
  searchSection: {
    paddingTop: 20,
  },
  clearText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  suggestionsContainer: {
    paddingTop: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryButton: {
    width: '23%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f0fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  seeAllText: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '500',
  },
  doctorsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  modernDoctorCard: {
    width: ITEM_SIZE,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: ITEM_SIZE * 0.8,
  },
  modernDoctorImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    padding: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modernDoctorInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modernDoctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  modernSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  modernLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  modernLocation: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  modernStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  modernStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modernStatText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  modernBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  modernBadge: {
    backgroundColor: '#E3EFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modernBadgeText: {
    fontSize: 12,
    color: '#2E86DE',
    fontWeight: '600',
  },
  featuredSection: {
    marginVertical: 16,
  },
  featuredList: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  heroSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
    borderWidth: 2,
    borderColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1D1E',
    marginBottom: 4,
  },
  locationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    maxWidth: 200,
  },
  searchModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    zIndex: 1000,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  suggestionsContainer: {
    paddingTop: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  categoryCard: {
    width: CATEGORY_CARD_SIZE,
    height: CATEGORY_CARD_SIZE,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryButton: {
    flex: 1,
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
  categoriesList: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    opacity: 0.6,
  },
  swipeText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2E86DE',
    marginRight: 4,
  },
  upcomingSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  appointmentTimeStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
  },
  appointmentContent: {
    gap: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  providerName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featuredSection: {
    marginBottom: 24,
  },
  mainContent: {
    flex: 1,
  },
  searchModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    zIndex: 1000,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  suggestionsContainer: {
    paddingTop: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  categoryCard: {
    width: CATEGORY_CARD_SIZE,
    height: CATEGORY_CARD_SIZE,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryButton: {
    flex: 1,
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
  categoriesList: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    opacity: 0.6,
  },
  swipeText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2E86DE',
    marginRight: 4,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modernDoctorCard: {
    width: ITEM_SIZE,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: ITEM_SIZE * 0.8,
  },
  modernDoctorImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    padding: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modernDoctorInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modernDoctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  modernSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  modernLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  modernLocation: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  modernStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  modernStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modernBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  modernBadge: {
    backgroundColor: '#E3EFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modernBadgeText: {
    fontSize: 12,
    color: '#2E86DE',
    fontWeight: '600',
  },
  featuredSection: {
    marginVertical: 16,
  },
  featuredList: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  skeletonBackground: {
    backgroundColor: '#E1E9EE',
  },
  skeleton: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  // Add shimmer animation effect
  '@keyframes shimmer': {
    '0%': {
      backgroundColor: '#E1E9EE',
    },
    '50%': {
      backgroundColor: '#F2F8FC',
    },
    '100%': {
      backgroundColor: '#E1E9EE',
    },
  },
  modernDoctorCard: {
    width: ITEM_SIZE,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: ITEM_SIZE * 0.8,
  },
  modernDoctorImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    padding: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modernDoctorInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modernDoctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  modernSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  modernLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  modernLocation: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  modernStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  modernStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modernBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  modernBadge: {
    backgroundColor: '#E3EFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modernBadgeText: {
    fontSize: 12,
    color: '#2E86DE',
    fontWeight: '600',
  },
  featuredSection: {
    marginVertical: 16,
  },
  featuredList: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  skeletonBackground: {
    backgroundColor: '#E1E9EE',
  },
  skeleton: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
});