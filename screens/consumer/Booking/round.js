import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const AppointmentScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Categories</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Home</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={20} color="black" />
        <Text style={styles.searchText}>Search...</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Best Specialists Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Best Specialists</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.specialistsContainer}>
            <View style={styles.specialistCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.specialistImage} />
              <Text style={styles.specialistName}>Christopher San</Text>
              <Text style={styles.specialistDetails}>Nutritionist</Text>
            </View>
            <View style={styles.specialistCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.specialistImage} />
              <Text style={styles.specialistName}>Olivia Stark</Text>
              <Text style={styles.specialistDetails}>Exercise Trainer</Text>
            </View>
            <View style={styles.specialistCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.specialistImage} />
              <Text style={styles.specialistName}>Christina K</Text>
              <Text style={styles.specialistDetails}>Beauty Consultant</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}> &gt; </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Gyms Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Gyms</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.gymsContainer}>
            <View style={styles.gymCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.gymImage} />
              <Text style={styles.gymName}>Planet Fitness</Text>
            </View>
            <View style={styles.gymCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.gymImage} />
              <Text style={styles.gymName}>Live Fit Gym</Text>
            </View>
            <View style={styles.gymCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.gymImage} />
              <Text style={styles.gymName}>Fitness SF</Text>
            </View>
            <View style={styles.gymCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.gymImage} />
              <Text style={styles.gymName}>The Space S</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}> &gt; </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Hair Salons Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Hair Salons</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.salonsContainer}>
            <View style={styles.salonCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.salonImage} />
              <Text style={styles.salonName}>Hair Salons</Text>
            </View>
            <View style={styles.salonCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.salonImage} />
              <Text style={styles.salonName}>Hair Boutique</Text>
            </View>
            <View style={styles.salonCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.salonImage} />
              <Text style={styles.salonName}>Salon Chic</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}> &gt; </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  categoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  specialistsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  specialistCard: {
    width: screenWidth * 0.6,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 12,
    marginRight: 16,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialistImage: {
    width: '100%',
    height: 120,
    borderRadius: 100,
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialistDetails: {
    fontSize: 12,
    color: '#666',
  },
  gymsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  gymCard: {
    width: screenWidth * 0.45,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 12,
    marginRight: 16,
    elevation: 2,
    alignItems: 'center',
  },
  gymImage: {
    width: '100%',
    height: 120,
    borderRadius: 100,
    marginBottom: 8,
  },
  gymName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  salonsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  salonCard: {
    width: screenWidth * 0.45,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 12,
    marginRight: 16,
    elevation: 2,
    alignItems: 'center',
  },
  salonImage: {
    width: '100%',
    height: 120,
    borderRadius: 100,
    marginBottom: 8,
  },
  salonName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginTop: 10,
  },
  viewMoreText: {
    color: 'white',
    fontSize: 20,
  },
});

export default AppointmentScreen;
