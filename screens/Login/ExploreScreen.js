import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.75;
const CATEGORY_CARD_SIZE = (width - (16 * 3)) / 2;

const ExploreScreen = ({ navigation }) => {
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
  ];

  // Animation values for category cards
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
});

export default ExploreScreen;