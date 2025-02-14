import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Added MaterialIcons for message icon

export default function ProfessionalProfile() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual image URL
          style={styles.profileImage}
        />
        <Text style={styles.name}>Hardik Khandala</Text>
        <Text style={styles.speciality}>Neurology</Text>

        {/* Contact Buttons */}
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="message" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Information</Text>
        <Text style={styles.sectionText}>
          Currently taking in new patients. Please reach out to me if you are looking for a nutrition specialist.
        </Text>

        <Text style={styles.sectionTitle}>Specialities</Text>
        <Text style={styles.sectionText}>Consultation</Text>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color="black" />
          <Text style={styles.locationText}>Visnagar, Mehsana</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Consultation price</Text>
          <Text style={styles.priceValue}>$52/hr</Text>
        </View>
      </View>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center', // Centers content vertically
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speciality: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 50,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  priceLabel: {
    fontSize: 14,
    color: 'gray',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#d9534f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

