import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppointmentScreen from './sqaure';
import { auth } from '../../firebase';
import ExploreScreen from './ExploreScreen';
import MessagesScreen from './MessagesScreen';
import { useNotifications } from './NotificationsScreen';
import { BlurView } from 'expo-blur';
import Animated, { 
  withSpring, 
  useAnimatedStyle, 
  useSharedValue 
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

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

function HomeScreen() {
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([
    'Mobile App Developer', 'UI/UX Designer', 'Frontend Developer'
  ]);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchAnimation = useSharedValue(0);
  const [name, setName] = useState('User');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: '1',
      serviceName: 'Dental Checkup',
      providerName: 'Dr. Smith',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'Confirmed'
    },
    {
      id: '2',
      serviceName: 'Home Cleaning',
      providerName: 'CleanPro Services',
      date: '2024-03-22',
      time: '2:00 PM',
      status: 'Pending'
    }
  ]);
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
    // Add more services...
  ]);

  const popularSearches = [
    { id: '1', term: 'Software Engineer', icon: 'code-outline' },
    { id: '2', term: 'Product Designer', icon: 'color-palette-outline' },
    { id: '3', term: 'Data Scientist', icon: 'analytics-outline' },
    { id: '4', term: 'DevOps Engineer', icon: 'server-outline' },
  ];

  const { theme } = useTheme();

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
                      // Handle navigation or search submission
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
          { backgroundColor: item.status === 'Confirmed' ? '#e3f2fd' : '#fff3e0' }]}>
          <Text style={[styles.statusText, 
            { color: item.status === 'Confirmed' ? '#1a73e8' : '#f57c00' }]}>
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

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => navigation.navigate('ServiceDetails', { service: item })}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#ffc107" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButtons = () => {
    const categories = [
      { id: '1', title: 'Healthcare', icon: 'medical-outline' },
      { id: '2', title: 'Home Services', icon: 'home-outline' },
      { id: '3', title: 'Beauty & Wellness', icon: 'flower-outline' },
      { id: '4', title: 'Professional', icon: 'briefcase-outline' },
      { id: '5', title: 'Education', icon: 'school-outline' },
      { id: '6', title: 'Fitness', icon: 'fitness-outline' },
      { id: '7', title: 'Auto Services', icon: 'car-outline' },
      { id: '8', title: 'Pet Care', icon: 'paw-outline' }
    ];

    return (
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
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Hello, {name}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Find your services</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.iconWrapper}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Icon name="notifications-outline" size={24} color={theme.textSecondary} />
              {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={[styles.badgeText, { color: theme.textSecondary }]}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.card }]}
            onPress={handleSearchOpen}
            activeOpacity={0.7}
          >
            <Icon name="search-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && <SearchOverlay />}
      
      <ScrollView style={styles.content}>
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Appointments</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Appointments')}
                style={[styles.seeAllButton, { backgroundColor: theme.card }]}
              >
                <Text style={[styles.seeAllText, { color: theme.textSecondary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={upcomingAppointments}
              renderItem={renderAppointmentCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Services</Text>
          <FlatList
            horizontal
            data={popularServices}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {renderCategoryButtons()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MyJobsScreen() {
  return (
    <View style={styles.center}>
      <Text>My Jobs</Text>
    </View>
  );
}

function Booking() {
  return (
    <View style={styles.center}>
      <Text>Messages</Text>
    </View>
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

        {/* Quick Stats */}
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

        {/* Menu Items */}
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

        {/* Logout Button */}
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
          } else if (route.name === 'Appointments') {
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
      <Tab.Screen name="Appointments" component={AppointmentScreen} />
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
  searchContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  locationInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  notificationButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ea4335',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  suggestionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  searchHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  welcomeSection: {
    padding: 16,
    alignItems: 'center',
  },
  welcomeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    padding: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
});
