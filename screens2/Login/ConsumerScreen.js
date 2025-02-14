import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
// import AppointmentScreen from './round'
import AppointmentScreen from './sqaure';
const jobsData = [
  {
    id: '1',
    title: 'Senior .Net Developer',
    company: 'Attri',
    location: 'Ahmedabad, Gujarat',
    salary: '₹17,00,000 - ₹20,00,000 a year',
    tags: ['Full-time', 'Day shift'],
    posted: 'Active 5 days ago',
  },
  {
    id: '2',
    title: 'Senior .NET (MVC/Core) Developer',
    company: 'MagnusMinds IT Solution',
    location: 'Satellite, Ahmedabad, Gujarat',
    salary: '₹17,00,000 - ₹20,00,000 a year',
    tags: ['Full-time', 'Day shift'],
    posted: 'Active 3 days ago',
  },
];

function JobCard({ job }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.salary}>{job.salary}</Text>
      <View style={styles.tagsContainer}>
        {job.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
      <Text style={styles.posted}>{job.posted}</Text>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyText}>Easily apply</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Job title, keywords, or company"
      />
      <TextInput
        style={styles.locationInput}
        placeholder="gandhinagar, gujarat"
      />
      <FlatList
        data={jobsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
      />
    </View>
  );
}

function MyJobsScreen() {
  return (
    <View style={styles.center}>
      <Text>My Jobs</Text>
    </View>
  );
}

function Booking() {
  return (
    <View style={styles.center}>
      <Text>Messages</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text>Profile</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            // } else if (route.name === 'My Jobs') {
            //   iconName = 'briefcase-outline';
            } else if (route.name === 'Booking') {
              iconName = 'calendar-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        {/* <Tab.Screen name="My Jobs" component={MyJobsScreen} /> */}
        <Tab.Screen name="Booking" component={AppointmentScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    // {/* </NavigationContainer> */}
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  company: { fontSize: 14, color: '#555' },
  location: { fontSize: 14, color: '#777' },
  salary: { fontSize: 14, color: '#28a745', marginVertical: 5 },
  tagsContainer: { flexDirection: 'row', marginBottom: 5 },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 5,
    fontSize: 12,
  },
  posted: { fontSize: 12, color: '#888' },
  applyButton: { marginTop: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
  applyText: { color: '#fff', textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const categories = [
//   { id: '1', title: 'Gyms' },
//   { id: '2', title: 'Hair Salons' },
//   { id: '3', title: 'Medical Clinics' },
//   { id: '4', title: 'Photographers' },
// ];

// const specialists = [
//   {
//     id: '1',
//     name: 'Dr. Sarah Wilson',
//     specialty: 'Cardiology',
//     rating: 4.9,
//   },
//   // Add more specialists
// ];

// const CategoryCard = ({ title }) => (
//   <TouchableOpacity style={styles.categoryCard}>
//     <Text style={styles.categoryTitle}>{title}</Text>
//   </TouchableOpacity>
// );

// const SpecialistCard = ({ name, specialty, rating }) => (
//   <TouchableOpacity style={styles.specialistCard}>
//     <LinearGradient
//       colors={['#f7f7f7', '#ffffff']}
//       style={styles.specialistGradient}
//     >
//       <View style={styles.specialistInfo}>
//         <Text style={styles.specialistName}>{name}</Text>
//         <Text style={styles.specialistSpecialty}>{specialty}</Text>
//         <View style={styles.ratingContainer}>
//           <Icon name="star" size={16} color="#FFD700" />
//           <Text style={styles.ratingText}>{rating}</Text>
//         </View>
//       </View>
//     </LinearGradient>
//   </TouchableOpacity>
// );

// const HomeScreen = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Home</Text>
//         <TouchableOpacity>
//           <Icon name="menu" size={24} color="#333" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search specialists, services..."
//           placeholderTextColor="#666"
//         />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.categoriesSection}>
//           <Text style={styles.sectionTitle}>Categories</Text>
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             data={categories}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => <CategoryCard title={item.title} />}
//             contentContainerStyle={styles.categoriesList}
//           />
//         </View>

//         <View style={styles.specialistsSection}>
//           <Text style={styles.sectionTitle}>Top Specialists</Text>
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             data={specialists}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <SpecialistCard
//                 name={item.name}
//                 specialty={item.specialty}
//                 rating={item.rating}
//               />
//             )}
//             contentContainerStyle={styles.specialistsList}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     marginHorizontal: 20,
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   categoriesSection: {
//     marginBottom: 25,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     marginHorizontal: 20,
//     marginBottom: 15,
//   },
//   categoriesList: {
//     paddingHorizontal: 15,
//   },
//   categoryCard: {
//     alignItems: 'center',
//     marginHorizontal: 5,
//     width: 100,
//   },
//   categoryTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     textAlign: 'center',
//   },
//   specialistsSection: {
//     marginBottom: 25,
//   },
//   specialistsList: {
//     paddingHorizontal: 15,
//   },
//   specialistCard: {
//     width: 200,
//     marginHorizontal: 5,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   specialistGradient: {
//     padding: 15,
//   },
//   specialistInfo: {
//     marginTop: 5,
//   },
//   specialistName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   specialistSpecialty: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//   },
// });

// export default HomeScreen;
