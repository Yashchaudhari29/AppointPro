import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Specific_detail = ({ route, navigation }) => {
  const { category, providers, bgcol } = route.params;
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (providers) {
      const filtered = providers.filter(provider => provider.job === category);
      setFilteredProviders(filtered);
      setIsLoading(false);
    }
  }, [category, providers]);
  
  // Function to handle search query change
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProviders(providers.filter(provider => provider.job === category));
    } else {
      const filtered = providers.filter(provider => 
        provider.job === category && 
        (provider.name.toLowerCase().includes(query.toLowerCase()) ||
         provider.specialty?.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredProviders(filtered);
    }
  };

  const handleBooking = (providerId) => {
    const selectedProvider = providers.find(p => p.id === providerId);
    navigation.navigate('booking', {
      providerId,
      category,
      provider: selectedProvider
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { backgroundColor: bgcol }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>{category}</Text> */}
      </View>

      {/* Fixed Search Bar */}
      <View style={[styles.searchWrapper, { backgroundColor: bgcol }]}>
      {/* styles.searchContainer */}
      <View style={styles.searchContainer}>
          <MaterialCommunityIcons 
            name="magnify" 
            size={20} 
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search providers..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading providers...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {filteredProviders.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#666" />
              <Text style={styles.noResultsText}>No providers found</Text>
            </View>
          ) : (
            filteredProviders.map((provider) => (
              <View key={provider.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.providerInfo}>
                    <Image
                      source={{ uri: provider.image || 'https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=' }}
                      style={styles.profileImage}
                    />
                    <View style={styles.headerInfo}>
                      <Text style={styles.name}>
                        {provider.job === 'Doctor' ? `Dr. ${provider.name}` : provider.name}
                      </Text>
                      <Text style={styles.specialty}>{provider.specialist}</Text>
                      <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{provider.rating || '4.5'}</Text>
                        <Text style={styles.reviews}>(124 reviews)</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.experienceContainer}>
                    <Text style={styles.experienceYears}>{provider.Exp || '--'}</Text>
                    {/* <Text style={styles.experienceLabel}>Years</Text> */}
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: provider.availability ? '#e8f5e9' : '#ffebee' }
                      ]}>
                        <View style={[
                          styles.dotIndicator,
                          { backgroundColor: provider.availability ? '#4caf50' : '#ff5252' }
                        ]} />
                        <Text style={[
                          styles.availabilityText,
                          { color: provider.availability ? '#4caf50' : '#ff5252' }
                        ]}>
                          {provider.availability ? 'Available Now' : 'Not Available'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="map-marker-outline" size={18} color="#666" />
                      <Text style={styles.infoText}>2.5 km away</Text>
                    </View>
                  </View>

                  <View style={styles.bottomContainer}>
                    <View style={styles.feeContainer}>
                      <Text style={styles.feeLabel}>Consultation Fee</Text>
                      <Text style={styles.feeAmount}>₹{provider.consultation || '--'}</Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.bookButton, !provider.availability && styles.bookButtonDisabled]}
                      onPress={() => handleBooking(provider.id)}
                      disabled={!provider.availability}
                    >
                      <Text style={styles.bookButtonText}>
                        {provider.availability ? 'Book Now' : 'Unavailable'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal
        visible={showSearch}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSearch(false)}
      >
        <View style={styles.searchModal}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setShowSearch(false)}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginLeft: 16,
  },
  searchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: 4, // Add some space below the fixed search bar
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  experienceContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
  },
  experienceYears: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  experienceLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardBody: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#666',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  feeContainer: {
    flex: 1,
  },
  feeLabel: {
    fontSize: 12,
    color: '#666',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginLeft: 16,
  },
  bookButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Specific_detail;
