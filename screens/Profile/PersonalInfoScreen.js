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
import firebase from '../../firebase';
import { getFirestore, doc, getDoc, collection, updateDoc } from 'firebase/firestore';

const db = getFirestore();
export default function PersonalInfoScreen({ navigation, route }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(route.params.userInfo);
  // console.log(userInfo);
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
        mediaTypes: ImagePicker.MediaType,
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
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);

      const updatedData = {};
      if (userInfo.firstName !== undefined) updatedData.firstName = userInfo.firstName;
      if (userInfo.lastName !== undefined) updatedData.lastName = userInfo.lastName;
      if (userInfo.phone !== undefined) updatedData.mobile = userInfo.phone;

      if (Object.keys(updatedData).length > 0) {
        await updateDoc(userRef, updatedData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile information updated successfully');
      } else {
        Alert.alert('Error', 'No valid data to update');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleTwoFactorAuth = () => {
    navigation.navigate('TwoFactorAuth');
  };

  const renderField = (label, value, key, editable = true) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => {
            // console.log(`Updating ${key}:`, text);
            setUserInfo(prev => ({ ...prev, [key]: text }));
          }}
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
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
          {isEditing ? (
            <>
              {renderField('First Name', userInfo.firstName, 'firstName')}
              {renderField('Last Name', userInfo.lastName, 'lastName')}
              {renderField('Email', userInfo.email, 'email', false)}
              {renderField('Phone', userInfo.phone, 'phone')}
              {renderField('Location', userInfo.location || 'Not set', 'location', false)}
            </>
          ) : (
            <>
              {renderField('Full Name', `${userInfo.firstName} ${userInfo.lastName}`, 'displayName', false)}
              {renderField('Email', userInfo.email, 'email', false)}
              {renderField('Phone', userInfo.phone, 'phone', false)}
              {renderField('Location', userInfo.location || 'Not set', 'location', false)}
            </>
          )}
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
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    position: 'relative',
  },
  backButton: {
      padding: 8,
      marginRight: 8,
      borderRadius: 12,
      backgroundColor: '#f5f5f5',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: '#1a73e8',
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
    backgroundColor: '#1a73e8',
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