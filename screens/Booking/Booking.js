import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Booking = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('18');
  const [selectedTime, setSelectedTime] = useState('12:30');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Manicure & Pedicure');
  const [selectedType, setSelectedType] = useState('In Person');

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const timeSlots = [
    '08:30', '09:00', '10:00', '10:30', 
    '11:00', '11:30', '12:30', '15:30', 
    '16:00', '16:30'
  ];
  const specialties = [
    'Coloring', 'Blowout', 'Hairstyling', 
    'Manicure', 'Pedicure', 'Manicure & Pedicure'
  ];
  const types = ['In Person', 'Audio Call', 'Video Session'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Hardik Khandala</Text>
            <Text style={styles.profileDetails}>XYZ Technologies</Text>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.locationText}>Gandhinagar, Gujarat</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.daysContainer}
          >
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCard,
                  selectedDay === day && styles.selectedCard
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[
                  styles.dayNumber,
                  selectedDay === day && styles.selectedText
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.dayText,
                  selectedDay === day && styles.selectedText
                ]}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  selectedTime === time && styles.selectedCard
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        

        {/* Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Type</Text>
          <View style={styles.typeContainer}>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeCard,
                  selectedType === type && styles.selectedCard
                ]}
                onPress={() => setSelectedType(type)}
              >
                <MaterialCommunityIcons 
                  name={
                    type === 'In Person' ? 'account' :
                    type === 'Audio Call' ? 'phone' : 'video'
                  }
                  size={24}
                  color={selectedType === type ? '#fff' : '#333'}
                />
                <Text style={[
                  styles.typeText,
                  selectedType === type && styles.selectedText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCard: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  daysContainer: {
    paddingHorizontal: 15,
  },
  dayCard: {
    width: 65,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  timeCard: {
    width: '23%',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: '2%',
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  specialtyCard: {
    width: '48%',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: '2%',
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  typeCard: {
    width: '31%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#007AFF',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  specialtyText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  typeText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  selectedText: {
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Booking;
