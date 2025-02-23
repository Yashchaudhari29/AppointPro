import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PersonalInfoScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    photoURL: 'https://via.placeholder.com/150',
    displayName: auth.currentUser?.displayName || 'User Name',
    email: auth.currentUser?.email || '',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    emergencyContact: {
      name: 'Jane Doe',
      relation: 'Spouse',
      phone: '+1 234 567 8901'
    }
  });

  useEffect(() => {
    const loadImageUri = async () => {
      try {
        const uri = await AsyncStorage.getItem('userProfileImage');
        if (uri) {
          setUserInfo(prev => ({ ...prev, photoURL: uri }));
        }
      } catch (error) {
        console.error('Error loading image URI:', error);
      }
    };

    loadImageUri();
  }, []);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setUserInfo(prev => ({ ...prev, photoURL: uri }));
        await AsyncStorage.setItem('userProfileImage', uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    try {
      // Here you would typically update the user info in your backend
      setIsEditing(false);
      Alert.alert('Success', 'Profile information updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleTwoFactorAuth = () => {
    navigation.navigate('TwoFactorAuth');
  };

  const renderField = (label, value, key) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setUserInfo(prev => ({ ...prev, [key]: text }))}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: userInfo.photoURL }} style={styles.profilePhoto} />
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton} onPress={handleImagePick}>
              <Icon name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Icon name={isEditing ? "checkmark" : "pencil"} size={20} color="#fff" />
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          {renderField('Full Name', userInfo.displayName, 'displayName')}
          {renderField('Email', userInfo.email, 'email')}
          {renderField('Phone', userInfo.phone, 'phone')}
          {renderField('Location', userInfo.location, 'location')}
          {renderField('Date of Birth', userInfo.dateOfBirth, 'dateOfBirth')}
          {renderField('Gender', userInfo.gender, 'gender')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          {renderField('Name', userInfo.emergencyContact.name, 'emergencyContactName')}
          {renderField('Relation', userInfo.emergencyContact.relation, 'emergencyContactRelation')}
          {renderField('Phone', userInfo.emergencyContact.phone, 'emergencyContactPhone')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <TouchableOpacity 
            style={styles.securityButton}
            onPress={handleChangePassword}
          >
            <Icon name="lock-closed-outline" size={24} color="#1a73e8" />
            <Text style={styles.securityButtonText}>Change Password</Text>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.securityButton}
            onPress={handleTwoFactorAuth}
          >
            <Icon name="shield-checkmark-outline" size={24} color="#1a73e8" />
            <Text style={styles.securityButtonText}>Two-Factor Authentication</Text>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  changePhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1a73e8',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a73e8',
    paddingVertical: 8,
    color: '#333',
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  securityButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
}); 