import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  Platform,
  ActivityIndicator, 
  Linking,
  Alert,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Calendar from 'expo-calendar';

const BookedDetails = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');
  const [showConfetti, setShowConfetti] = useState(true);
  const [timeUntilAppointment, setTimeUntilAppointment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Animation refs
  const circleScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const quickActionsSlide = useRef(new Animated.Value(100)).current;

  // Appointment details (updated appointment date)
  const appointmentDate = new Date('2025-02-21T18:40:00');
  const appointmentDetails = {
    doctor: 'Dr. Kevon Lane',
    specialty: 'Gynecologist',
    type: 'Online Consultation',
    date: 'Feb 21, 2025',
    time: '06:40 - 07:30 PM'
  };

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = appointmentDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilAppointment(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeUntilAppointment('Appointment time has passed');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  // Initial animations & quick actions slide in
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.spring(circleScale, {
        toValue: 1.2,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(circleScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();

    Animated.timing(checkmarkOpacity, {
      toValue: 1,
      duration: 400,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Show quick actions after main content appears
    setTimeout(() => {
      setShowQuickActions(true);
      Animated.spring(quickActionsSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 1000);

    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(confettiTimer);
  }, []);

  const renderConfetti = () => (
    <>
      <ConfettiCannon
        count={100}
        origin={{ x: -10, y: 0 }}
        autoStart={true}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={3000}
        colors={['#00A36C', '#FFFFFF', '#0047AB', '#87CEEB']}
      />
      <ConfettiCannon
        count={100}
        origin={{ x: width + 10, y: 0 }}
        autoStart={true}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={3000}
        colors={['#00A36C', '#FFFFFF', '#0047AB', '#87CEEB']}
      />
      <ConfettiCannon
        count={50}
        origin={{ x: width / 2, y: height / 4 }}
        autoStart={true}
        fadeOut={true}
        explosionSpeed={300}
        fallSpeed={2500}
        colors={['#00A36C', '#FFFFFF', '#0047AB', '#87CEEB']}
      />
    </>
  );

  const handleViewDetails = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('AppointmentDetails', {
      appointmentId: 'xyz123'
    });
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const shareMessage = `My appointment with ${appointmentDetails.doctor}\n\nDate: ${appointmentDetails.date}\nTime: ${appointmentDetails.time}\nType: ${appointmentDetails.type}`;
      
      await Share.share({
        message: shareMessage,
        title: 'Appointment Details'
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Unable to share appointment details');
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            // Add cancellation logic here
            Alert.alert(
              'Appointment Cancelled',
              'Your appointment has been cancelled. You will receive a confirmation email shortly.'
            );
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleAddToCalendar = async () => {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
      const eventDetails = {
        title: `Online Consultation with ${appointmentDetails.doctor}`,
        location: 'Online Consultation',
        notes: `Online Consultation with ${appointmentDetails.doctor} - ${appointmentDetails.specialty}\nPlease be ready 5 minutes before the appointment.`,
        startDate: appointmentDate,
        endDate: new Date('2025-02-21T19:30:00'),
      };
  
      if (Platform.OS === 'android') {
        try {
          const startDate = eventDetails.startDate.toISOString().replace(/-|:|\./g, '').slice(0, 15);
          const endDate = eventDetails.endDate.toISOString().replace(/-|:|\./g, '').slice(0, 15);
  
          const googleParams = new URLSearchParams({
            action: 'TEMPLATE',
            text: eventDetails.title,
            dates: `${startDate}/${endDate}`,
            details: eventDetails.notes,
            location: eventDetails.location,
            crm: 'POPUP:1440,POPUP:60,POPUP:30'
          }).toString();
  
          const googleCalendarAppUrl = `vnd.android.cursor.item/event?${googleParams}`;
          const hasGoogleCalendar = await Linking.canOpenURL(googleCalendarAppUrl);
  
          if (hasGoogleCalendar) {
            await Linking.openURL(googleCalendarAppUrl);
          } else {
            const webUrl = `https://calendar.google.com/calendar/render?${googleParams}`;
            await Linking.openURL(webUrl);
          }
  
          Alert.alert(
            'Calendar Event',
            'Please confirm the event details and reminders in your calendar app.',
            [{ text: 'OK' }]
          );
        } catch (error) {
          console.error('Google Calendar Error:', error);
          throw new Error('Failed to open calendar');
        }
      } else if (Platform.OS === 'ios') {
        try {
          const { status } = await Calendar.requestCalendarPermissionsAsync();
          
          if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const defaultCalendar = calendars.find(cal => 
              cal.allowsModifications && 
              cal.type === Calendar.CalendarType.LOCAL
            ) || calendars[0];
  
            if (defaultCalendar) {
              await Calendar.createEventAsync(defaultCalendar.id, {
                ...eventDetails,
                alarms: [
                  { relativeOffset: -1440 }, // 1 day before
                  { relativeOffset: -60 },   // 1 hour before
                  { relativeOffset: -30 }    // 30 minutes before
                ],
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                availability: Calendar.Availability.BUSY
              });
  
              Alert.alert(
                'Success',
                'Event added to your calendar with reminders:\n\n• 1 day before\n• 1 hour before\n• 30 minutes before',
                [{ text: 'OK' }]
              );
            } else {
              throw new Error('No writeable calendar found');
            }
          } else {
            throw new Error('Calendar permission denied');
          }
        } catch (error) {
          console.error('iOS Calendar Error:', error);
          const startDate = eventDetails.startDate.toISOString().replace(/-|:|\./g, '').slice(0, 15);
          const endDate = eventDetails.endDate.toISOString().replace(/-|:|\./g, '').slice(0, 15);
  
          const googleParams = new URLSearchParams({
            action: 'TEMPLATE',
            text: eventDetails.title,
            dates: `${startDate}/${endDate}`,
            details: eventDetails.notes,
            location: eventDetails.location,
            crm: 'POPUP:1440,POPUP:60,POPUP:30'
          }).toString();
  
          const webUrl = `https://calendar.google.com/calendar/render?${googleParams}`;
          await Linking.openURL(webUrl);
  
          Alert.alert(
            'Calendar Event',
            'Please confirm the event details and reminders in your calendar.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Calendar Error:', error);
      Alert.alert(
        'Error',
        'Unable to add the event to your calendar. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const QuickActionButton = ({ icon, label, onPress, color = '#0047AB' }) => (
    <TouchableOpacity 
      style={[styles.quickActionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={20} color="#FFFFFF" />
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0047AB', '#000080']}
        style={StyleSheet.absoluteFillObject}
      />

      {showConfetti && renderConfetti()}

      <View style={styles.mainContainer}>
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successCircle, { transform: [{ scale: circleScale }] }]}>
            <Animated.View style={{ opacity: checkmarkOpacity }}>
              <MaterialCommunityIcons name="check" size={36} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.card, { opacity: contentOpacity, transform: [{ translateY: contentSlide }] }]}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Please check your email for details</Text>

          {/* Countdown Timer */}
          <View style={styles.countdownContainer}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#0047AB" />
            <Text style={styles.countdownText}>
              Time until appointment: {timeUntilAppointment}
            </Text>
          </View>

          <View style={styles.providerContainer}>
            <View style={styles.providerImagePlaceholder}>
              <MaterialCommunityIcons name="doctor" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{appointmentDetails.doctor}</Text>
              <Text style={styles.providerSpecialty}>{appointmentDetails.specialty}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <BookingDetail icon="video" label="Type" value={appointmentDetails.type} />
            <BookingDetail icon="calendar" label="Date" value={appointmentDetails.date} />
            <BookingDetail icon="clock-outline" label="Time" value={appointmentDetails.time} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.secondaryButton, isLoading && styles.disabledButton]}
              onPress={handleAddToCalendar}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="calendar-plus" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Add to Calendar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {showQuickActions && (
            <Animated.View style={[styles.quickActionsContainer, { transform: [{ translateY: quickActionsSlide }] }]}>
              <QuickActionButton 
                icon="share-variant" 
                label="Share" 
                onPress={handleShare}
                color="#00A36C"
              />
              <QuickActionButton 
                icon="file-document-outline" 
                label="View Details" 
                onPress={handleViewDetails}
              />
              <QuickActionButton 
                icon="cancel" 
                label="Cancel" 
                onPress={handleCancelAppointment}
                color="#DC3545"
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const BookingDetail = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={24} color="#0047AB" />
    <View style={styles.detailText}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  successContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00A36C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0047AB',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 71, 171, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  countdownText: {
    fontSize: 14,
    color: '#0047AB',
    fontWeight: '500',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 71, 171, 0.1)',
  },
  providerImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00A36C',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0047AB',
  },
  providerSpecialty: {
    fontSize: 12,
    color: '#666666',
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 71, 171, 0.1)',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0047AB',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#0047AB',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 71, 171, 0.1)',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default BookedDetails;
