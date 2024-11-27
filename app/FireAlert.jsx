import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, SafeAreaView, FlatList, Modal, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useAuth } from '../../../context/authContext';

export default function FireAlert() {
  const { user } = useAuth();
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Get unique key for storing contact (using user ID or email)
  const getEmergencyContactKey = () => `emergencyContact_${user.userId}`;

  // Load saved contact from AsyncStorage
  useEffect(() => {
    const fetchSavedContact = async () => {
      try {
        const savedContact = await AsyncStorage.getItem(getEmergencyContactKey());
        if (savedContact !== null) {
          setEmergencyContact(JSON.parse(savedContact));
        }
      } catch (error) {
        console.log('Error fetching contact:', error);
      }
    };
    fetchSavedContact();
  }, []);

  // Save selected contact
  const saveContact = async (contact) => {
    try {
      await AsyncStorage.setItem(getEmergencyContactKey(), JSON.stringify(contact));
      setEmergencyContact(contact);
      setModalVisible(false); // Close modal after saving
      Alert.alert('Success', 'Emergency contact saved.');
    } catch (error) {
      console.log('Error saving contact:', error);
    }
  };

  // Fetch contacts from phone
  const fetchContacts = async () => {
    try {
      const permission = await Contacts.requestPermission();
      if (permission === 'authorized') {
        const allContacts = await Contacts.getAll();
        setContacts(allContacts);
        setModalVisible(true); // Show the modal with contacts
      } else {
        Alert.alert('Permission denied', 'We need access to your contacts to save an emergency contact.');
      }
    } catch (error) {
      console.log('Error fetching contacts:', error);
    }
  };

  // Handle SOS call
  const handleSOS = () => {
    if (emergencyContact && emergencyContact.phoneNumbers.length > 0) {
      const phoneNumber = emergencyContact.phoneNumbers[0].number;
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('No Contact', 'Please add an emergency contact first.');
    }
  };

  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('../../../assets/fonts/Inter_24pt-Bold.ttf'),
    'Inter-Regular': require('../../../assets/fonts/Inter_24pt-Regular.ttf'),
    'Inter-Semibold': require('../../../assets/fonts/Inter_24pt-SemiBold.ttf'),
    'Inter-Light': require('../../../assets/fonts/Inter_18pt-Light.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Render contact item
  const renderContactItem = ({ item }) => (
    <TouchableOpacity onPress={() => saveContact(item)} className="p-4 border-b border-gray-200">
      <Text className="text-lg">{item.displayName}</Text>
      <Text className="text-sm text-gray-600">{item.phoneNumbers[0]?.number}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Emergency Contact Section */}
      <View className="flex-row items-center justify-center mt-8 mb-4">
        <View className="flex-row items-center">
          <Ionicons name="add-circle-outline" size={24} color="green" onPress={fetchContacts} />
          <Text className="text-lg ml-2 text-center" style={{ fontFamily: 'Inter-Semibold' }}>
            Emergency Contact:{' '}
            {emergencyContact ? (
              <Text className="text-green-600">{emergencyContact.displayName}</Text>
            ) : (
              <Text className="text-gray-500">Add Contact</Text>
            )}
          </Text>
        </View>
      </View>

      {/* SOS Button */}
      <View className="items-center justify-center mb-8">
        <TouchableOpacity onPress={handleSOS} className="rounded-full bg-red-500 p-12 mb-4 shadow-lg">
          <Image source={require('../../../assets/images/sos.png')} style={{ width: 200, height: 200 }} />
        </TouchableOpacity>
        <Text className="text-center text-gray-500" style={{ fontFamily: 'Inter-Regular' }}>
          Press the button for emergency assistance
        </Text>
      </View>

      {/* ScrollView for Instructions */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Instructions Section */}
        <View className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-2" style={{ fontFamily: 'Inter-Semibold' }}>Do these things</Text>
          <View className="flex-row items-start mb-2">
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>
              Use Fire Extinguishers to put out small fires
            </Text>
          </View>
          <View className="flex-row items-start mb-2">
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>
              If you can't put out the fire, leave the area immediately and call 911 or your local emergency number
            </Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>
              If you are trapped, close all doors between you and the fire and seal cracks and vents with cloth or tape to keep smoke out.
            </Text>
          </View>
        </View>

        {/* Don't Section */}
        <View className="p-4 bg-gray-100 rounded-lg shadow-sm mt-4">
          <Text className="text-lg font-semibold mb-2" style={{ fontFamily: 'Inter-Semibold' }}>Don't do this</Text>
          <View className="flex-row items-start mb-2">
            <Ionicons name="close-circle" size={20} color="red" />
            <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>
              Don't use elevators
            </Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="close-circle" size={20} color="red" />
            <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>
              Don't leave cooking unattended
            </Text>
          </View>
          <View className="flex-row items-start mt-2">
            <Ionicons name="close-circle" size={20} color="red" />
            <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>
              Do not block fire exits with furniture, clutter, or any other objects
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal for Contact List */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white p-4">
          <Text className="text-xl font-bold mb-4">Select Emergency Contact</Text>
          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.recordID}
          />
          <TouchableOpacity
            className="bg-red-500 p-3 rounded-md mt-4"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-center text-lg">Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
