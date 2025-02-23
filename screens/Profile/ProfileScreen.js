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
      onPress: () => navigation.navigate('PersonalInfo'),
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
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
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
            <LinearGradient
              colors={['#1a73e8', '#0d47a1']}
              style={styles.profileHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.profileHeaderContent}>
                <Image
                  source={{ uri: userInfo.profileImage }}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{userInfo.name}</Text>
                <Text style={styles.profileEmail}>{userInfo.email}</Text>
              </View>
            </LinearGradient>

            

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
                      color="#d9534f"
                    />
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#757575"
                  />
                </TouchableOpacity>
              ))}
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
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileHeaderContent: {
    alignItems: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    // marginTop: 200,
    // height: 300,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ea4335',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
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