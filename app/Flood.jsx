import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Alert, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';


const floodContact = require('../../../scripts/FloodRelief.json');

export default function Flood() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  // State to manage dropdown picker
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    floodContact.map((district) => ({
      label: district.district_name,
      value: district.district_name,
    }))
  );

  useEffect(() => {
    const fetchSavedDistrict = async () => {
      try {
        const savedDistrict = await AsyncStorage.getItem('selectedDistrict');
        if (savedDistrict !== null) {
          setSelectedDistrict(savedDistrict);
          const contact = floodContact.find(district => district.district_name === savedDistrict);
          setSelectedContact(contact);
        }
      } catch (error) {
        console.log('Error fetching saved district:', error);
      }
    };
    fetchSavedDistrict();
  }, []);

  const saveDistrict = async (district) => {
    try {
      await AsyncStorage.setItem('selectedDistrict', district);
      Alert.alert('Saved', `Contacts for ${district} saved for quick access.`);
    } catch (error) {
      console.log('Error saving district:', error);
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    const contact = floodContact.find(item => item.district_name === district);
    setSelectedContact(contact);
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
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

  return (
    <SafeAreaView className="flex-1 bg-white p-4">

      {/* District Picker using DropDownPicker */}
      <DropDownPicker
        open={open}
        value={selectedDistrict}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedDistrict}
        setItems={setItems}
        onChangeValue={(value) => handleDistrictChange(value)}
        placeholder="Select a district..."
        style={{
          backgroundColor: '#fafafa',
          fontFamily: 'Inter-Regular',
        }}
        dropDownStyle={{
          backgroundColor: '#fafafa',
        }}
      />

      {/* Display Contact Information */}
      {selectedContact && (
        <ScrollView className="mt-4">
          <Text className="text-lg font-semibold mb-2" style={{fontFamily: 'Inter-Semibold'}}>
            Contacts for {selectedContact.district_name}:
          </Text>

          <View className="mb-4">
            <Text className="font-semibold" style={{fontFamily: 'Inter-Semibold'}}>Helpline:</Text>
            <TouchableOpacity onPress={() => handleCall(selectedContact.helpline_no)}>
              <Text className="text-blue-500 underline">{selectedContact.helpline_no}</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="font-semibold" style={{fontFamily: 'Inter-Semibold'}}>Police Station:</Text>
            <TouchableOpacity onPress={() => handleCall(selectedContact.police_station_no)}>
              <Text className="text-blue-500 underline">{selectedContact.police_station_no}</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="font-semibold" style={{fontFamily: 'Inter-Semibold'}}>Police Commissioner:</Text>
            <TouchableOpacity onPress={() => handleCall(selectedContact.police_commissioner_no)}>
              <Text className="text-blue-500 underline">{selectedContact.police_commissioner_no}</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="font-semibold" style={{fontFamily: 'Inter-Semibold'}}>Fire Service:</Text>
            <TouchableOpacity onPress={() => handleCall(selectedContact.fire_service_contact_no)}>
              <Text className="text-blue-500 underline">{selectedContact.fire_service_contact_no}</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="font-semibold" style={{fontFamily: 'Inter-Semibold'}}>NGO ({selectedContact.NGO_name}):</Text>
            <TouchableOpacity onPress={() => handleCall(selectedContact.Ngo_contact)}>
              <Text className="text-blue-500 underline">{selectedContact.Ngo_contact}</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-green-500 p-3 rounded-md"
            onPress={() => saveDistrict(selectedContact.district_name)}
          >
            <Text className="text-white text-center text-md" style={{fontFamily: 'Inter-Semibold'}}>Save Contact for Quick Access</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
