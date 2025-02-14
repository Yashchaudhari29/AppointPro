import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  StatusBar,
  Platform,
  FlatList,
  Modal,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.75;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const CATEGORY_CARD_SIZE = (width - (16 * 3)) / 2;

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const featuredDoctors = [
    {
      id: '1',
      name: 'Dr. Sarah Connor',
      specialty: 'Cardiologist',
      hospital: 'Mayo Clinic',
      rating: 4.9,
      reviews: 482,
      image: 'https://example.com/sarah.jpg',
      nextSlot: '10:00 AM Today',
      price: '₹2,000',
      experience: '15 years',
      verified: true,
      badges: ['Top Rated', 'Quick Response'],
    },
    {
      id: '2',
      name: 'Dr. John Smith',
      specialty: 'Neurologist',
      hospital: 'Apollo Hospital',
      rating: 4.8,
      reviews: 356,
      image: 'https://example.com/john.jpg',
      nextSlot: '11:30 AM Today',
      price: '₹2,500',
      experience: '12 years',
      verified: true,
      badges: ['Expert', '24/7 Available'],
    },
    {
      id: '3',
      name: 'Dr. Emily Brown',
      specialty: 'Pediatrician',
      hospital: 'Children\'s Hospital',
      rating: 4.9,
      reviews: 624,
      image: 'https://example.com/emily.jpg',
      nextSlot: '2:00 PM Today',
      price: '₹1,800',
      experience: '10 years',
      verified: true,
      badges: ['Kid Friendly', 'Highly Rated'],
    },
    // Add more doctors...
  ];

  const categories = [
    {
      id: '1',
      title: 'Emergency Care',
      icon: 'heartbeat',
      color: '#FF4757',
      count: 28,
    },
    {
      id: '2',
      title: 'Dental Care',
      icon: 'tooth',
      color: '#2E86DE',
      count: 42,
    },
    {
      id: '3',
      title: 'Eye Care',
      icon: 'eye',
      color: '#1DD1A1',
      count: 35,
    },
    {
      id: '4',
      title: 'Mental Health',
      icon: 'brain',
      color: '#9B59B6',
      count: 31,
    },
    {
      id: '5',
      title: 'Pediatrics',
      icon: 'baby',
      color: '#F1C40F',
      count: 45,
    },
    // Add more categories...
  ];

  const popularServices = [
    {
      id: '1',
      title: 'Full Body Checkup',
      image: 'https://example.com/checkup.jpg',
      price: '₹1,999',
      rating: 4.8,
      bookings: '1.2k+ bookings',
    },
    // Add more services...
  ];

  // Add filter options
  const filterOptions = {
    specialties: [
      { id: '1', name: 'Cardiology' },
      { id: '2', name: 'Neurology' },
      { id: '3', name: 'Pediatrics' },
      { id: '4', name: 'Dentistry' },
      { id: '5', name: 'Orthopedics' },
    ],
    availability: [
      { id: '1', name: 'Available Today' },
      { id: '2', name: 'Available Tomorrow' },
      { id: '3', name: 'This Week' },
    ],
    rating: [
      { id: '1', name: '4.5+' },
      { id: '2', name: '4.0+' },
      { id: '3', name: '3.5+' },
    ],
    price: [
      { id: '1', name: '₹0-500' },
      { id: '2', name: '₹501-1000' },
      { id: '3', name: '₹1001-2000' },
      { id: '4', name: '₹2000+' },
    ],
  };

  const [selectedFilters, setSelectedFilters] = useState({
    specialties: [],
    availability: [],
    rating: [],
    price: [],
  });

  // Add animation values for category cards
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(50)).current;

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

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={100} style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Filter Sections */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Specialties */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Specialties</Text>
              <View style={styles.filterOptions}>
                {filterOptions.specialties.map((specialty) => (
                  <TouchableOpacity
                    key={specialty.id}
                    style={[
                      styles.filterChip,
                      selectedFilters.specialties.includes(specialty.id) && styles.filterChipSelected,
                    ]}
                    onPress={() => toggleFilter('specialties', specialty.id)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedFilters.specialties.includes(specialty.id) && styles.filterChipTextSelected,
                    ]}>
                      {specialty.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Add similar sections for availability, rating, and price */}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSelectedFilters({
                specialties: [],
                availability: [],
                rating: [],
                price: [],
              })}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                // Apply filters logic here
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  const renderFeaturedDoctor = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
    });

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
      >
        <Animated.View style={[styles.doctorCard, { transform: [{ scale }] }]}>
          <Image source={{ uri: item.image }} style={styles.doctorImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.doctorInfo}
          >
            <View style={styles.badgeContainer}>
              {item.badges.map((badge, idx) => (
                <View key={idx} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.doctorName}>{item.name}</Text>
              {item.verified && (
                <Ionicons name="checkmark-circle" size={20} color="#2E86DE" />
              )}
            </View>
            
            <Text style={styles.specialty}>{item.specialty}</Text>
            <Text style={styles.hospital}>{item.hospital}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.statText}>{item.rating}</Text>
                <Text style={styles.statSubtext}>({item.reviews})</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={styles.statText}>{item.experience}</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.nextSlot}>
                <Text style={styles.slotText}>{item.nextSlot}</Text>
              </View>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item, index }) => (
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
        onPress={() => navigation.navigate('CategoryDetail', { category: item })}
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

  const renderHeader = () => (
    <Animated.View style={[styles.header, {
      transform: [{
        translateY: scrollY.interpolate({
          inputRange: [0, 50],
          outputRange: [0, -HEADER_HEIGHT],
          extrapolate: 'clamp',
        })
      }]
    }]}>
      <BlurView intensity={100} style={styles.headerContent}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors, specialties..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <MaterialIcons name="tune" size={24} color="#2E86DE" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#2E86DE" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoryIndicator}>
        <MaterialIcons name="swipe" size={20} color="#666" />
        <Text style={styles.swipeText}>Swipe to explore</Text>
      </View>

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

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {renderHeader()}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Doctors */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Specialists</Text>
          <Animated.FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={featuredDoctors}
            renderItem={renderFeaturedDoctor}
            keyExtractor={item => item.id}
            snapToInterval={ITEM_SIZE}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {renderCategories()}

        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          {/* Add popular services list */}
        </View>
      </Animated.ScrollView>

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorCard: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.2,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  doctorInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(46, 134, 222, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  specialty: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  hospital: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  statSubtext: {
    color: '#fff',
    opacity: 0.8,
    marginLeft: 4,
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextSlot: {
    backgroundColor: 'rgba(29, 209, 161, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  slotText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: '#2E86DE',
  },
  filterChipText: {
    color: '#666',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  clearButtonText: {
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  featuredSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  featuredList: {
    paddingVertical: 10,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 10,
    paddingBottom: 20,
  },
});

export default ExploreScreen;