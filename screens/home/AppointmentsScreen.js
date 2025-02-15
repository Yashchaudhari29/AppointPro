import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function AppointmentsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState({
    upcoming: [
      {
        id: '1',
        serviceName: 'Dental Checkup',
        providerName: 'Dr. Sarah Smith',
        date: 'Today',
        time: '10:00 AM',
        location: 'Manhattan Medical Center',
        status: 'Confirmed',
        image: 'https://via.placeholder.com/150'
      },
      {
        id: '2',
        serviceName: 'House Cleaning',
        providerName: 'CleanPro Services',
        date: 'Tomorrow',
        time: '2:00 PM',
        location: 'Your Home Address',
        status: 'Pending',
        image: 'https://via.placeholder.com/150'
      },
    ],
    completed: [
      {
        id: '3',
        serviceName: 'Hair Styling',
        providerName: 'Style Studio',
        date: 'Yesterday',
        time: '3:30 PM',
        location: 'Downtown Style Studio',
        status: 'Completed',
        image: 'https://via.placeholder.com/150'
      },
    ],
    cancelled: [
      {
        id: '4',
        serviceName: 'Massage Therapy',
        providerName: 'Wellness Spa',
        date: '2024-02-15',
        time: '11:00 AM',
        location: 'Wellness Center',
        status: 'Cancelled',
        image: 'https://via.placeholder.com/150'
      },
    ]
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleReschedule = (appointment) => {
    Alert.alert(
      "Reschedule Appointment",
      `Would you like to reschedule your ${appointment.serviceName} appointment?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reschedule",
          onPress: () => {
            // Add reschedule logic here
            navigation.navigate('booking');
          }
        }
      ]
    );
  };

  const handleCancel = (appointment) => {
    Alert.alert(
      "Cancel Appointment",
      `Are you sure you want to cancel your ${appointment.serviceName} appointment?`,
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          onPress: () => {
            // Move appointment to cancelled list
            const updatedAppointments = {
              ...appointments,
              upcoming: appointments.upcoming.filter(app => app.id !== appointment.id),
              cancelled: [...appointments.cancelled, { ...appointment, status: 'Cancelled' }]
            };
            setAppointments(updatedAppointments);
            Alert.alert("Cancelled", "Your appointment has been cancelled.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: item.image }}
            style={styles.providerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.providerName}>{item.providerName}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
          <Icon name="time-outline" size={16} color="#666" style={styles.timeIcon} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>

      {activeTab === 'upcoming' && (
        <View style={styles.appointmentActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleReschedule(item)}
          >
            <Icon name="calendar" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleCancel(item)}
          >
            <Icon name="close" size={20} color="#ea4335" />
            <Text style={[styles.actionButtonText, { color: '#ea4335' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: activeTab === tab ? '#1a73e8' : '#666' }]}>
              <Text style={styles.countText}>{appointments[tab].length}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={appointments[activeTab]}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No {activeTab} appointments</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  countBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  timeIcon: {
    marginLeft: 16,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
  },
  secondaryButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ea4335',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
});

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return '#34a853';
    case 'pending':
      return '#fbbc04';
    case 'completed':
      return '#1a73e8';
    case 'cancelled':
      return '#ea4335';
    default:
      return '#666';
  }
} 