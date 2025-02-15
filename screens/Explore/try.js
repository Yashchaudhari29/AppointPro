//FOR VIEW ANIMATION AFTER BOOKING

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const BookedDetails = () => {
  const { width, height } = Dimensions.get('window');
  const [showConfetti, setShowConfetti] = useState(true);
  const circleScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate success circle
    Animated.sequence([
      Animated.spring(circleScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();

    // Animate content
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Hide confetti after 4 seconds
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0047AB', '#000080']}
        style={StyleSheet.absoluteFillObject}
      />

      {showConfetti && (
        <>
          <ConfettiCannon
            count={80}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            colors={['#00A36C', '#FFFFFF', '#0047AB']}
          />
          <ConfettiCannon
            count={80}
            origin={{ x: width + 10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            colors={['#00A36C', '#FFFFFF', '#0047AB']}
          />
        </>
      )}

      <ScrollView>
        <View style={styles.successContainer}>
          <Animated.View style={[
            styles.successCircle,
            { transform: [{ scale: circleScale }] }
          ]}>
            <Animated.View style={{ opacity: checkmarkOpacity }}>
              <MaterialCommunityIcons name="check" size={50} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View style={[
          styles.contentContainer,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentSlide }]
          }
        ]}>
          <View style={styles.card}>
            <Text style={styles.title}>Booking Confirmed!</Text>
            <Text style={styles.subtitle}>Please check your email for receipt and booking details.</Text>

            <View style={styles.providerContainer}>
            {/* <Image 
                source={require('../../assets/images/doctor.png')}
                style={styles.providerImage}
              /> */}
              <View style={styles.providerImagePlaceholder}>
                <MaterialCommunityIcons 
                  name="doctor" 
                  size={30} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>Dr.Kevon Lane</Text>
                <Text style={styles.providerSpecialty}>Gynecologist</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <BookingDetail 
                icon="video" 
                label="Consultation Type" 
                value="Online Consultation" 
              />
              <BookingDetail 
                icon="calendar" 
                label="Date" 
                value="Wednesday, February 17, 2024" 
              />
              <BookingDetail 
                icon="clock-outline" 
                label="Time" 
                value="06:40 PM - 07:30 PM" 
              />
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => Haptics.impactAsync()}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => Haptics.impactAsync()}
            >
              <Text style={styles.buttonText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
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
    backgroundColor: '#FFFFFF',
  },
  successContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00A36C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0047AB',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsContainer: {
    marginBottom: 32,
    gap: 20,
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
  primaryButton: {
    backgroundColor: '#00A36C',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#00A36C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#0047AB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0047AB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 71, 171, 0.1)',
  },
  providerImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00A36C',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0047AB',
    marginBottom: 4,
  },
  providerSpecialty: {
    fontSize: 14,
    color: '#666666',
  },
});

export default BookedDetails;