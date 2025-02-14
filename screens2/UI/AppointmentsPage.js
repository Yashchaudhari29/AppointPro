import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

const AppointmentsPage = () => {
  const appointments = [
    {
      id: '1',
      name: 'Om Chaudhari',
      service: 'General Tests - In Person',
      date: '15/10/2021',
      time: '10:30',
      status: 'Scheduled',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Rahi Chaudhary',
      service: 'General Checkup - In Person',
      date: '16/10/2021',
      time: '11:30',
      status: 'Unconfirmed',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      name: 'Yash',
      service: 'Coloring - In Person',
      date: '16/10/2021',
      time: '10:00',
      status: 'Unconfirmed',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      name: 'Rahi',
      service: 'General Tests - In Person',
      date: '15/10/2021',
      time: '10:30',
      status: 'Rescheduled',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '5',
      name: 'Yash',
      service: 'General Checkup - In Person',
      date: '16/10/2021',
      time: '11:30',
      status: 'Unconfirmed',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '6',
      name: 'Om',
      service: 'Coloring - In Person',
      date: '16/10/2021',
      time: '10:00',
      status: 'Unconfirmed',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  const renderAppointment = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.service}>{item.service}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.iconText}>📅 {item.date}</Text>
            <Text style={styles.iconText}>⏰ {item.time}</Text>
          </View>
          <View
            style={[
              styles.status,
              {
                backgroundColor:
                  item.status === 'Rescheduled' ? '#ff9800' : '#9e9e9e',
              },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginVertical: 10,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  service: {
    color: '#757575',
  },
  details: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    marginRight: 15,
    color: '#616161',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    color: '#',
    fontSize: 12,
  },
  actions: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    marginLeft: 5,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AppointmentsPage;