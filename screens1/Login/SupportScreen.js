import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SupportScreen() {
  const supportOptions = [
    {
      id: '1',
      title: 'FAQs',
      icon: 'help-circle-outline',
      description: 'Find answers to common questions'
    },
    {
      id: '2',
      title: 'Contact Us',
      icon: 'mail-outline',
      description: 'Get in touch with our support team'
    },
    {
      id: '3',
      title: 'Live Chat',
      icon: 'chatbubble-outline',
      description: 'Chat with our support representatives'
    },
    {
      id: '4',
      title: 'Report an Issue',
      icon: 'warning-outline',
      description: 'Report technical problems or bugs'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How can we help you?</Text>
      {supportOptions.map((option) => (
        <TouchableOpacity key={option.id} style={styles.optionCard}>
          <Icon name={option.icon} size={24} color="#1a73e8" />
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 