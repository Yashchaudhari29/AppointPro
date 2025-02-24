import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';

const db = getFirestore();

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        const data = userSnap.data();
        setUserInfo({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.mobile,
          profileImage: imageUri || 'https://static.vecteezy.com/system/resources/previews/011/490/381/non_2x/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImageUri = async () => {
    try {
      const uri = await AsyncStorage.getItem('userProfileImage');
      if (uri) {
        setImageUri(uri);
        setUserInfo(prev => ({ ...prev, profileImage: uri }));
      }
    } catch (error) {
      console.error('Error loading image URI:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadImageUri();
    await fetchUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
    loadImageUri();
  }, []);

  const menuItems = [
    
    {
      id: '2',
      title: 'Personal Information',
      icon: 'account-details',
      onPress: () => navigation.navigate('PersonalInfo',{userInfo}),
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'credit-card',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: '4',
      title: 'Notifications',
      icon: 'bell-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: '5',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: '6',
      title: 'Privacy Policy',
      icon: 'shield-check-outline',
      onPress: () => navigation.navigate('Privacy'),
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const SkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderContent}>
          <View style={styles.profileImageSkeleton} />
          <View style={styles.profileNameSkeleton} />
          <View style={styles.profileEmailSkeleton} />
        </View>
      </View>
      {/* <View style={styles.statsContainer}>
        <View style={styles.statItemSkeleton} />
        <View style={styles.statItemSkeleton} />
        <View style={styles.statItemSkeleton} />
      </View> */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItemSkeleton} />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f3" />
      <ScrollView
        style={styles.profileContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: userInfo.profileImage }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{userInfo.name}</Text>
              <Text style={styles.profileEmail}>{userInfo.email}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.menuContainer}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.onPress}
                  >
                    <View style={styles.menuItemLeft}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#6c63ff"
                      />
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#b0b0b0"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="#fff"
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f0f0f3',
  },
  profileContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: '#1a73e8',
    marginBottom: 15,
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'black',
  },
  profileEmail: {
    fontSize: 16,
    color: 'black',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#4a4a4a',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 20,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  skeletonContainer: {
    flex: 1,
    padding: 20,
  },
  profileImageSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
  },
  profileNameSkeleton: {
    width: 120,
    height: 20,
    marginTop: 10,
    backgroundColor: '#e0e0e0',
  },
  profileEmailSkeleton: {
    width: 180,
    height: 14,
    marginTop: 5,
    backgroundColor: '#e0e0e0',
  },
  statItemSkeleton: {
    flex: 1,
    height: 50,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  menuItemSkeleton: {
    height: 50,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
    borderRadius: 5,
  },
}); 