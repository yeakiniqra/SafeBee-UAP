import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Linking, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Shelter from '../../../scripts/ShelterCenter.json'; 
import { useFonts } from 'expo-font';

export default function ShelterCenter() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [shelterCenters, setShelterCenters] = useState([]);

  // Load previous selection on component mount
  useEffect(() => {
    // Retrieve previous location and shelter centers from AsyncStorage
    const loadStoredData = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('selectedLocation');
        const storedShelters = await AsyncStorage.getItem('selectedShelterCenters');
        if (storedLocation && storedShelters) {
          setValue(storedLocation);
          setShelterCenters(JSON.parse(storedShelters));
        }
      } catch (error) {
        console.error('Failed to load stored data:', error);
      }
    };
    loadStoredData();

    // Populate dropdown items
    const locations = Shelter.map((location) => ({
      label: location.location_name,
      value: location.location_name,
    }));
    setItems(locations);
  }, []);


  // Handle selection of a location
const handleLocationChange = async (selectedLocation) => {
  // If no location is selected, clear shelter centers and return without logging an error
  if (!selectedLocation) {
    setShelterCenters([]); // Clear previous shelter data if no location is selected
    setValue(null); // Reset the selected value
    return; // Simply return without storing anything in AsyncStorage
  }

  const selectedShelter = Shelter.find((location) => location.location_name === selectedLocation);
  const shelters = selectedShelter ? selectedShelter.shelter_centers : [];

  setValue(selectedLocation);
  setShelterCenters(shelters);

  // Store the selected location and shelter data in AsyncStorage
  try {
    await AsyncStorage.setItem('selectedLocation', selectedLocation);
    await AsyncStorage.setItem('selectedShelterCenters', JSON.stringify(shelters));
  } catch (error) {
    console.error('Failed to store data:', error);
  }
};



  // Handle call action
  const handleCall = (contact) => {
    Linking.openURL(`tel:${contact}`);
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


  const renderShelterCenter = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-5 shadow-md">
      <Image source={{ uri: item.shelter_center_image }} className="w-full h-48 rounded-lg mb-3" />
      <Text className="text-lg text-gray-800 mb-1"  style={{fontFamily: 'Inter-Semibold'}}>{item.shelter_center_name}</Text>
      <Text className="text-base text-gray-600 mb-3"  style={{fontFamily: 'Inter-Regular'}}>{item.shelter_center_location}</Text>

      <TouchableOpacity
        className="flex-row items-center justify-center bg-green-600 py-3 rounded-md"
        onPress={() => handleCall(item.emergency_contact)}
      >
        <Text className="text-white text-lg"  style={{fontFamily: 'Inter-Semibold'}}>Call for Emergency</Text>
        <AntDesign name="phone" size={20} color="white" className="ml-2" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
      {/* Location Dropdown */}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={handleLocationChange}
        placeholder="Select a Location"
        className="bg-white border border-gray-300 mb-4"
        textStyle={{ fontSize: 16, color: '#333' }}
        dropDownContainerStyle={{ borderColor: '#ddd' }}
      />

      {/* FlatList for shelter centers */}
      {shelterCenters.length > 0 ? (
        <FlatList
          data={shelterCenters}
          renderItem={renderShelterCenter}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className="text-center text-base text-gray-500 mt-5">
          Select a location to view available shelters.
        </Text>
      )}
    </SafeAreaView>
  );
}
