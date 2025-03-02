// FOR DOCTOR DETAIL PAGE


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import { StatusBar } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { getFirestore, doc, setDoc, collection, addDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { auth } from '../../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getFirestore();
// Constants
const DOCTOR_DATA = {
  name: 'Dr. Kristin Watson',
  specialty: 'Heart Specialist',
  location: 'New York, United States',
  stats: {
    patients: '7,500+',
    experience: '10+',
    rating: '4.9+',
    reviews: '4,956',
  },
  about: 'With over a decade of experience, Dr. Kristin Watson is a highly skilled Heart Specialist in New York. He has treated more than 7,500 patients...',
  fees: {
    secondOpinion: '80.00',
    consultation: '150.00',
    followUp: '100.00',
  },
};

// Mock data for booked slots
const bookedSlots = {
  '2025-02-20': ['09:00 AM', '11:00 AM'],
  '2025-02-21': ['10:00 AM', '02:00 PM'],
  '2025-02-22': ['08:00 AM', '03:00 PM'],
};

// Mock data for doctor's availability
const doctorAvailability = {
  '2025-02-20': { available: true },
  '2025-02-21': { available: true },
  '2025-02-22': { available: true },
  '2025-02-24': { available: false },
  '2025-02-25': { available: false },
};

const DoctorBookingScreen = ({ route, navigation }) => {
  const { providerId, provider } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, fadeAnim]);

  const RedirectedSuccess = (appointmentId, provider) => {
    navigation.navigate('ConfirmBooking', {
      appointmentId: appointmentId,
      providers: provider,
      bookingTime: selectedTime,
      location: provider.Location || 'Virtual Consultation'
    });
  };

  const hideModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 17; i++) {
      const time = `${i.toString().padStart(2, '0')}:00 ${i < 12 ? 'AM' : 'PM'}`;
      const isBooked = bookedSlots[selectedDate]?.includes(time);
      const availability = Math.floor(Math.random() * 6);
      slots.push({ time, isBooked, availability });
    }
    return slots;
  };

  const saveNotification = async (appointmentId) => {
    try {
      // Get existing notifications
      const existingNotifications = await AsyncStorage.getItem('notifications');
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];

      // Create new notification
      const newNotification = {
        id: appointmentId,
        title: 'Appointment Confirmed',
        message: `Your appointment with ${provider.name} is confirmed for ${selectedDate} at ${selectedTime}`,
        time: new Date().toISOString(),
        icon: 'calendar-outline',
        color: '#34a853',
        isRead: false,
        status: 'unread',
        details: `Provider: ${provider.name}\nService: ${provider.job}\nLocation: ${provider.Location || 'Virtual Consultation'}\nConsultation Fee: ₹${provider.consultation}`
      };

      // Add new notification to the beginning of the array
      notifications.unshift(newNotification);

      // Save back to AsyncStorage
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }
    Alert.alert(
      "Confirm Appointment",
      `Would you like to confirm your appointment?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) {
                Alert.alert('Error', 'Please login to book an appointment');
                return;
              }

              // Create new appointment in Firestore
              const appointmentRef = await addDoc(collection(db, 'Appointments'), {
                consumerId: currentUser.uid,
                providerId: providerId,
                providerName: provider.name,
                serviceName: provider.job,
                date: selectedDate,
                time: selectedTime,
                consultation: provider.consultation,
                status: 'pending',
                appointment_Status: 'upcoming',
                provider_image: provider.image || "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=",
                location: provider.Location,
                createdAt: new Date(),
              });
              const consumerAppointmentRef = doc(db, 'ConsumerAppointments', currentUser.uid);
              await setDoc(consumerAppointmentRef, {
                appointments: arrayUnion(appointmentRef.id)
              }, { merge: true });

              // Save notification to AsyncStorage
              await saveNotification(appointmentRef.id);

              // Navigate to confirmation screen
              RedirectedSuccess(appointmentRef.id, provider);
            } catch (error) {
              console.error('Error booking appointment:', error);
              Alert.alert('Error', 'Failed to book appointment. Please try again.');
            }
          }
        }
      ]
    );
  };

  const confirmBooking = () => {
    hideModal();
    Alert.alert(
      'Booking Confirmed',
      `Your appointment has been scheduled for ${selectedDate} at ${selectedTime}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedDate(null);
            setSelectedTime(null);
          },
        },
      ]
    );
  };

  const renderStats = () => (
    <View style={styles.stats}>
      {Object.entries(DOCTOR_DATA.stats).map(([key, value]) => (
        <View key={key} style={styles.statItem}>
          <Text style={styles.statNumber}>{value}</Text>
          <Text style={styles.statLabel}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderCalendarSection = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    const generateDates = () => {
      const dates = [];
      let currentDate = new Date();
      while (currentDate <= maxDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    return (
      <View style={styles.section}>
        <View style={styles.calendarHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.calendarToggle}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Icon name="event" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {showCalendar ? (
          <Calendar
            current={today.toISOString().split('T')[0]}
            minDate={today.toISOString().split('T')[0]}
            maxDate={maxDate.toISOString().split('T')[0]}
            onDayPress={(day) => {
              if (doctorAvailability[day.dateString]?.available !== false) {
                setSelectedDate(day.dateString);
                setSelectedTime(null);
                setShowCalendar(false);
              }
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#007AFF',
              },
            }}
            theme={{
              todayTextColor: '#007AFF',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDotColor: '#ffffff',
              arrowColor: '#007AFF',
              monthTextColor: '#2d4150',
              textDayFontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
              textMonthFontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
              textDayHeaderFontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
            }}
            style={styles.calendar}
          />
        ) : (
          <View style={styles.timelineContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timelineScroll}
            >
              {generateDates().map((date, index) => {
                const dateString = date.toISOString().split('T')[0];
                const isSelected = dateString === selectedDate;
                const isPast = date < today;
                const isAvailable = doctorAvailability[dateString]?.available !== false;

                return (
                  <View key={dateString} style={styles.timelineItem}>
                    {index === 0 && <View style={styles.timelineStart} />}
                    <View style={[styles.timelineLine, isPast && styles.timelinePast]} />
                    <TouchableOpacity
                      style={[
                        styles.dateCard,
                        isSelected && styles.selectedCard,
                        isPast && styles.pastCard,
                        !isAvailable && styles.unavailableCard,
                      ]}
                      onPress={() => {
                        if (!isPast && isAvailable) {
                          setSelectedDate(dateString);
                          setSelectedTime(null);
                        }
                      }}
                      disabled={isPast || !isAvailable}
                    >
                      <View style={styles.dateContent}>
                        <Text style={[styles.monthText, isSelected && styles.selectedText]}>
                          {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </Text>
                        <Text style={[styles.dateNumber, isSelected && styles.selectedText]}>
                          {date.getDate()}
                        </Text>
                        <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </Text>
                      </View>
                      {isAvailable && (
                        <View style={[styles.statusIndicator, isSelected && styles.selectedIndicator]} />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderTimeSlots = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Time</Text>
      {selectedDate ? (
        <View style={styles.timeContainer}>
          {generateTimeSlots().map(({ time, isBooked, availability }) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlotContainer,
                selectedTime === time && styles.selectedTimeSlot,
                isBooked && styles.bookedTimeSlot,
              ]}
              onPress={() => !isBooked && setSelectedTime(time)}
              disabled={isBooked}
            >
              <Text style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText,
                isBooked && styles.bookedTimeText,
              ]}>
                {time}
              </Text>
              {isBooked ? (
                <Text style={styles.bookedText}>Booked</Text>
              ) : (
                <Text style={[
                  styles.availabilityText,
                  availability <= 2 && styles.lowAvailability,
                  availability > 2 && availability <= 4 && styles.mediumAvailability,
                  availability > 4 && styles.highAvailability,
                ]}>
                  {availability <= 2 ? 'Few slots left' :
                    availability <= 4 ? 'Going fast' : 'Available'}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noDateSelected}>Please select a date first</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity>
            <Icon name="favorite-border" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.doctorInfo}>
          <Image
            source={{ uri: provider.image || 'https://via.placeholder.com/100' }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{provider.job === 'Doctor' ? `Dr. ${provider.name}` : provider.name}</Text>
            <Text style={styles.specialty}>{provider.job} - {provider.specialist}</Text>
            <View style={styles.location}>
              <Icon name="location-on" size={16} color="#666" />
              <Text style={styles.locationText}>{provider.Location || 'Location not specified'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{provider.rating || '-'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{provider.Exp || '-'}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{provider.reviews || '-'}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {provider.About || `Not Mentioned`}
          </Text>
        </View>

        {renderCalendarSection()}
        {renderTimeSlots()}

        <View style={styles.fees}>
          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Consultation</Text>
            <Text style={styles.feeAmount}>₹{provider.consultation || 'Not Mentioned'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>

      {modalVisible && (
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
          />
          <Animated.View
            style={[
              styles.modal,
              {
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
              },
            ]}

          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirm Appointment</Text>
                <TouchableOpacity onPress={hideModal}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentDetailItem}>
                  <Icon name="person" size={20} color="#007AFF" />
                  <Text style={styles.appointmentDetailText}>{provider.name}</Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  <Icon name="event" size={20} color="#007AFF" />
                  <Text style={styles.appointmentDetailText}>
                    {new Date(selectedDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      weekday: 'long'
                    })}
                  </Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  <Icon name="access-time" size={20} color="#007AFF" />
                  <Text style={styles.appointmentDetailText}>{selectedTime}</Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  {/* <Icon name="euro" size={20} color="#007AFF" /> */}
                  <Text style={styles.appointmentDetailText}>
                    Rs. {provider.consultation} (Consultation Fee)
                  </Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={hideModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmBooking}
                >
                  <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  doctorInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  doctorDetails: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  specialty: {
    color: '#666',
    marginTop: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: '#666',
    marginLeft: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  aboutText: {
    color: '#666',
    lineHeight: 22,
  },
  calendar: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarToggle: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f0f8ff',
  },
  timelineContainer: {
    marginTop: 10,
    height: 160,
  },
  timelineScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timelineItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
  },
  timelineStart: {
    width: 3,
    height: 20,
    backgroundColor: '#007AFF',
    marginBottom: -1,
  },
  timelineLine: {
    width: 3,
    height: 30,
    backgroundColor: '#007AFF',
    marginBottom: 10,
  },
  timelinePast: {
    backgroundColor: '#d1d1d1',
  },
  dateCard: {
    width: 75,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  selectedCard: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.05 }],
  },
  pastCard: {
    backgroundColor: '#f5f5f5',
  },
  unavailableCard: {
    backgroundColor: '#fafafa',
  },
  dateContent: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  dateNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  dayText: {
    fontSize: 12,
    color: '#666',
  },
  selectedText: {
    color: '#ffffff',
  },
  statusIndicator: {
    width: 30,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#4CAF50',
  },
  selectedIndicator: {
    backgroundColor: '#ffffff',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlotContainer: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
  },
  bookedTimeSlot: {
    backgroundColor: '#FFE5E5',
    opacity: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d4150',
  },
  selectedTimeText: {
    color: '#fff',
  },
  bookedTimeText: {
    color: '#FF6B6B',
  },
  availabilityText: {
    fontSize: 12,
    marginTop: 4,
  },
  lowAvailability: {
    color: '#FF6B6B',
  },
  mediumAvailability: {
    color: '#FFB067',
  },
  highAvailability: {
    color: '#50C878',
  },
  fees: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 12,
  },
  feeLabel: {
    color: '#666',
  },
  feeAmount: {
    fontWeight: 'bold',
    color: '#2d4150',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
    color: '#2d4150',
  },
  appointmentDetails: {
    marginBottom: 24,
  },
  appointmentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentDetailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2d4150',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDateSelected: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
    fontStyle: 'italic',
  },
  bookedText: {
    fontSize: 12,
    marginTop: 4,
    color: '#FF6B6B',
    fontWeight: '500',
  },
});

export default DoctorBookingScreen;