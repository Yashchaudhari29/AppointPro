import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { auth } from '../../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';
import { Dropdown } from 'react-native-element-dropdown';
import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore();

const ProviderForm = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('yes');
  const [consultationFee, setConsultationFee] = useState('');
  const [image, setImage] = useState('');
  const [job, setJob] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [errors, setErrors] = useState({});

  // Dropdown items
  const jobItems = [
    { label: 'Select Job', value: '' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Plumber', value: 'plumber' },
    { label: 'Electrician', value: 'electrician' },
  ];

  const availabilityItems = [
    { label: 'Available for Consultation?', value: 'yes' },
    { label: 'Not Available', value: 'no' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address) {
          const formattedAddress = `${address.city || ''} - ${address.postalCode || ''}`;
          setLocation(formattedAddress);
        }
      } else {
        Alert.alert('Permission Denied', 'Unable to access location. Please enter it manually.');
      }
    })();
  }, []);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const formErrors = {};
    if (!location) formErrors.location = 'Location is required';
    if (!experience || isNaN(experience)) formErrors.experience = 'Experience must be a number';
    if (!consultationFee) formErrors.consultationFee = 'Consultation Fee is required';
    if (!job) formErrors.job = 'Job is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await setDoc(doc(db, 'providers', user.uid), {
        location,
        experience,
        availability,
        consultationFee,
        image,
        job,
        specialty: job === 'doctor' ? specialty : null,
      });
      navigation.navigate('ProviderHome');
    } catch (error) {
      console.error('Error saving provider data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#f0f0f0', '#ffffff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Provider Registration</Text>
          
          {/* Location Input */}
          <View style={styles.inputWrapper}>
            <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

          {/* Experience Input */}
          <View style={styles.inputWrapper}>
            <Icon name="briefcase" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Experience (years)"
              value={experience}
              onChangeText={text => setExperience(text.replace(/[^0-9]/g, ''))}
              style={styles.input}
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}

          {/* Consultation Fee Input */}
          <View style={styles.inputWrapper}>
            <Icon name="dollar-sign" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Consultation Fee"
              value={consultationFee}
              onChangeText={setConsultationFee}
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>
          {errors.consultationFee && <Text style={styles.errorText}>{errors.consultationFee}</Text>}

          {/* Image URL Input */}
          <View style={styles.inputWrapper}>
            <Icon name="image" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Image URL"
              value={image}
              onChangeText={setImage}
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>

          {/* Job Dropdown */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={jobItems}
            labelField="label"
            valueField="value"
            placeholder="Select Job"
            value={job}
            onChange={item => setJob(item.value)}
          />
          {errors.job && <Text style={styles.errorText}>{errors.job}</Text>}

          {/* Specialty Input */}
          {job === 'doctor' && (
            <View style={styles.inputWrapper}>
              <Icon name="star" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Specialty"
                value={specialty}
                onChangeText={setSpecialty}
                style={styles.input}
                placeholderTextColor="#666"
              />
            </View>
          )}

          {/* Availability Dropdown */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={availabilityItems}
            labelField="label"
            valueField="value"
            placeholder="Available for Consultation?"
            value={availability}
            onChange={item => setAvailability(item.value)}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  dropdown: {
    height: 50,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default ProviderForm; 