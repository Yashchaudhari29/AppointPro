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
  const { category, providers } = route.params;
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Back</Text> */}
      </View>

      {/* Search Input with Icon */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
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
                <View style={styles.providerInfo}>
                  <Image
                    source={{ uri: provider.profileImage || 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{provider.name}</Text>
                    <Text style={styles.specialty}>{provider.specialty || category}</Text>
                    <View style={styles.ratingContainer}>
                      <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.rating}>{provider.rating || '4.9'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.availabilityContainer}>
                  <View style={styles.availabilityBadge}>
                    <View style={styles.dotIndicator} />
                    <Text style={styles.availabilityText}>Available Now</Text>
                  </View>
                  <Text style={styles.consultationFee}>
                    ${provider.price || '50'} Consultation Fee
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBooking(provider.id)}
                >
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
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
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  providerInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
    color: '#666',
    marginLeft: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
  consultationFee: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default Specific_detail;
