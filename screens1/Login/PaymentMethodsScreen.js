import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaymentMethodsScreen() {
  const [selectedCard, setSelectedCard] = useState('1');
  
  const cards = [
    {
      id: '1',
      type: 'visa',
      number: '**** **** **** 4242',
      expiry: '12/24',
      holder: 'John Doe',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      number: '**** **** **** 5555',
      expiry: '09/25',
      holder: 'John Doe',
      isDefault: false
    }
  ];

  const renderCard = (card) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.cardContainer,
        selectedCard === card.id && styles.selectedCard
      ]}
      onPress={() => setSelectedCard(card.id)}
    >
      <LinearGradient
        colors={card.type === 'visa' ? ['#1a73e8', '#1557b0'] : ['#ea4335', '#b31412']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name={card.type === 'visa' ? 'credit-card' : 'credit-card-outline'}
            size={40}
            color="#fff"
          />
          {card.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.cardNumber}>{card.number}</Text>
        
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardLabel}>Card Holder</Text>
            <Text style={styles.cardValue}>{card.holder}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Expires</Text>
            <Text style={styles.cardValue}>{card.expiry}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Saved Cards</Text>
        {cards.map(renderCard)}

        <TouchableOpacity style={styles.addCardButton}>
          <Icon name="add-circle-outline" size={24} color="#1a73e8" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        <View style={styles.otherMethods}>
          <Text style={styles.sectionTitle}>Other Payment Methods</Text>
          
          <TouchableOpacity style={styles.paymentMethod}>
            <Icon name="logo-google" size={24} color="#ea4335" />
            <Text style={styles.methodText}>Google Pay</Text>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <Icon name="wallet-outline" size={24} color="#34a853" />
            <Text style={styles.methodText}>Pay on Service</Text>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
  },
  cardGradient: {
    padding: 20,
    borderRadius: 15,
    height: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  defaultBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  addCardText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  otherMethods: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
}); 