import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';

const EditAppointment = () => {
  const [selectedDay, setSelectedDay] = useState('18');
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{'\u276E Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Appointment</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>Hardik Khandala</Text>
          <Text style={styles.profileDetails}>XYZ Technologies</Text>
          <Text style={styles.profileDetails}>Gandhinagar, Gujarat</Text>
        </View>
      </View>

      {/* Pick a Day */}
      <Text style={styles.sectionTitle}>Pick a day</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayPickerContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dayButton,
              item === selectedDay && styles.selectedButton,
            ]}
            onPress={() => setSelectedDay(item)}
          >
            <Text
              style={[
                styles.dayText,
                item === selectedDay && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Pick a Time */}
      <Text style={styles.sectionTitle}>Pick a time</Text>
      <View style={styles.timePickerContainer}>
        {['08:30', '09:00', '10:00', '10:30', '11:00', '11:30', '12:30', '15:30', '16:00', '16:30'].map(
          (time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeButton,
                time === '12:30' && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  time === '12:30' && styles.selectedText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Choose a Specialty */}
      <Text style={styles.sectionTitle}>Choose a Specialty</Text>
      <View style={styles.specialtyContainer}>
        {['Coloring', 'Blowout', 'Hairstyling', 'Manicure', 'Pedicure', 'Manicure & Pedicure'].map(
          (specialty, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.specialtyButton,
                specialty === 'Manicure & Pedicure' && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.specialtyText,
                  specialty === 'Manicure & Pedicure' && styles.selectedText,
                ]}
              >
                {specialty}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Type */}
      <Text style={styles.sectionTitle}>Type</Text>
      <View style={styles.typeContainer}>
        {['In Person', 'Audio Call', 'Video Session'].map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.typeButton,
              type === 'In Person' && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.typeText,
                type === 'In Person' && styles.selectedText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reschedule Button */}
      <TouchableOpacity style={styles.rescheduleButton}>
        <Text style={styles.rescheduleText}>Reschedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:20,
    justifyContent: 'space-between',
  },
  backButton: {
    fontSize: 16,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'center',
    transform: [{ translateX: -60 }],
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileDetails: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dayPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#d9534f',
  },
  dayText: {
    color: '#000',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
  },
  timePickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    margin: 5,
  },
  timeText: {
    color: '#000',
    fontSize: 12,
  },
  specialtyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  specialtyButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    margin: 5,
  },
  specialtyText: {
    color: '#000',
    fontSize: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  typeText: {
    color: '#000',
    fontSize: 14,
  },
  rescheduleButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  rescheduleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditAppointment;
