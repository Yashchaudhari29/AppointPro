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

const DoctorBookingScreen = () => {
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

  const showModal = () => {
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
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

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }
    showModal();
    // alert('Booking confirmed');
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

    const markedDates = {};
    Object.keys(doctorAvailability).forEach(date => {
      if (date === selectedDate) {
        markedDates[date] = {
          selected: true,
          selectedColor: '#007AFF',
        };
      } else if (!doctorAvailability[date].available) {
        markedDates[date] = {
          disabled: true,
          disableTouchEvent: true,
          dotColor: 'red',
          marked: true
        };
      } else if (bookedSlots[date]) {
        markedDates[date] = {
          marked: true,
          dotColor: '#FFB067'
        };
      } else {
        markedDates[date] = {
          marked: true,
          dotColor: '#50C878'
        };
      }
    });

    return (
      <View style={styles.section}>
        <View style={styles.calendarHeader}>
          <Text style={styles.sectionTitle}>Schedule Date</Text>
          <TouchableOpacity
            style={styles.calendarToggle}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Text style={styles.calendarToggleText}>
              {showCalendar ? 'Show Quick Dates' : 'Open Calendar'}
            </Text>
            <Icon
              name={showCalendar ? 'calendar-today' : 'date-range'}
              size={20}
              color="#007AFF"
            />
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
              }
            }}
            markedDates={markedDates}
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateContainer}>
              {[...Array(7)].map((_, index) => {
                const date = new Date(today);
                date.setDate(today.getDate() + index);
                const dateString = date.toISOString().split('T')[0];
                const isSelected = dateString === selectedDate;
                
                return (
                  <TouchableOpacity
                    key={dateString}
                    style={[
                      styles.dateButton,
                      isSelected && styles.selectedDate,
                      !doctorAvailability[dateString]?.available && styles.unavailableDate,
                    ]}
                    onPress={() => {
                      if (doctorAvailability[dateString]?.available !== false) {
                        setSelectedDate(dateString);
                        setSelectedTime(null);
                      }
                    }}
                    disabled={!doctorAvailability[dateString]?.available}
                  >
                    <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                      {date.getDate()}
                    </Text>
                    <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#50C878' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFB067' }]} />
            <Text style={styles.legendText}>Partially Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
        </View>
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
              {!isBooked && (
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
          <TouchableOpacity>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor Details</Text>
          <TouchableOpacity>
            <Icon name="favorite-border" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.doctorInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{DOCTOR_DATA.name}</Text>
            <Text style={styles.specialty}>{DOCTOR_DATA.specialty}</Text>
            <View style={styles.location}>
              <Icon name="location-on" size={16} color="#666" />
              <Text style={styles.locationText}>{DOCTOR_DATA.location}</Text>
            </View>
          </View>
        </View>

        {renderStats()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{DOCTOR_DATA.about}</Text>
        </View>

        {renderCalendarSection()}
        {renderTimeSlots()}

        <View style={styles.fees}>
          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Second Opinion</Text>
            <Text style={styles.feeAmount}>€{DOCTOR_DATA.fees.secondOpinion}</Text>
          </View>
          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Consultation</Text>
            <Text style={styles.feeAmount}>€{DOCTOR_DATA.fees.consultation}</Text>
          </View>
          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Follow-Up</Text>
            <Text style={styles.feeAmount}>€{DOCTOR_DATA.fees.followUp}</Text>
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
                  <Text style={styles.appointmentDetailText}>{DOCTOR_DATA.name}</Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  <Icon name="event" size={20} color="#007AFF" />
                  <Text style={styles.appointmentDetailText}>
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  <Icon name="access-time" size={20} color="#007AFF" />
                  <Text style={styles.appointmentDetailText}>{selectedTime}</Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  <Icon name="euro" size={20} color="#007AFF" />
                  <Text style={styles.appointmentDetailText}>
                    €{DOCTOR_DATA.fees.consultation} (Consultation Fee)
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
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
  },
  calendarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  calendarToggleText: {
    color: '#007AFF',
    marginRight: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  dateButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedDate: {
    backgroundColor: '#007AFF',
  },
  unavailableDate: {
    backgroundColor: '#f8f8f8',
    opacity: 0.5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedDateText: {
    color: '#fff',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
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
    color: '#666',
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
    marginBottom: 12,
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
});

export default DoctorBookingScreen;