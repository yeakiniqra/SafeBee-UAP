import { View, Text, TouchableOpacity, Alert, Linking, SafeAreaView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/authContext';
import { db } from '../../../firebaseConfig';
import * as Location from 'expo-location';
import Mapbox, { MapView, Camera, MarkerView, LocationPuck } from '@rnmapbox/maps';
import { collection, addDoc, onSnapshot } from 'firebase/firestore'; 
import { useFonts } from 'expo-font';

export default function FireService() {
  const { user } = useAuth();
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [safetyTips, setSafetyTips] = useState([]);
  const [reportedFires, setReportedFires] = useState([]);
  const [location, setLocation] = useState(null);

  // Get current location of the user
  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to report fire.');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    };
    fetchLocation();
  }, []);

  // Handle SOS call
  const handleSOS = () => {
    Linking.openURL('tel:999');
  };

  // Fetch safety tips (mock function)
  const fetchSafetyTips = async () => {
    const tips = [
      { title: 'Stay Low', description: 'In case of fire, stay low to avoid smoke inhalation.', category: 'during' },
      { title: 'Stop, Drop, and Roll', description: 'If your clothes catch fire, stop, drop, and roll to extinguish the flames.', category: 'during' },
    ];
    setSafetyTips(tips);
  };

  useEffect(() => {
    fetchSafetyTips();
  }, []);

  // Fetch reported fires from Firebase in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'FireAlert'), (snapshot) => {
      const fireReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportedFires(fireReports);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // Report fire at the current location
  const reportFire = async () => {
    if (!location) {
      Alert.alert('Error', 'Unable to fetch location. Please enable location services.');
      return;
    }
    
    const username = user?.username || 'Anonymous User'; 
    const userContact = user?.contact || 'N/A'; 
  
    try {
      await addDoc(collection(db, 'FireAlert'), {
        username: username, // Use the fallback here
        userContact: userContact,
        location: { latitude: location.latitude, longitude: location.longitude },
        timestamp: new Date(),
      });
      
      Alert.alert('Fire Reported', 'Your fire report has been submitted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to report the fire. Please try again.');
      console.log('Error reporting fire:', error);
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

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SOS Button */}
        <TouchableOpacity
          className="rounded-full bg-red-500 p-12 mb-4 shadow-lg"
          onPress={handleSOS}
        >
          <View className="items-center justify-center">
            <Text className="text-white text-4xl" style={{fontFamily: 'Inter-Semibold'}}>SOS</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 mb-8" style={{fontFamily: 'Inter-Regular'}}>Press the button for emergency assistance</Text>

        {/* Safety Tips */}
        <Text className="text-xl mb-4" style={{fontFamily: 'Inter-Semibold'}}>Safety Tips</Text>
        {safetyTips.map((tip, index) => (
          <View key={index} className="mb-4 p-4 border rounded-lg bg-gray-100 shadow">
            <Text className="text-lg text-gray-500" style={{fontFamily: 'Inter-Semibold'}}>{tip.title}</Text>
            <Text style={{fontFamily: 'Inter-Regular'}}>{tip.description}</Text>
          </View>
        ))}

        {/* Report Fire Button */}
        <TouchableOpacity
          className="bg-orange-500 p-3 rounded-md mb-8"
          onPress={reportFire}
        >
          <Text className="text-white text-center text-lg" style={{fontFamily: 'Inter-Semibold'}}>Report Fire</Text>
        </TouchableOpacity>

        {/* Map View */}
        <Text className="text-xl mb-4" style={{fontFamily: 'Inter-Semibold'}}>Reported Fire Locations</Text>
        <MapView
          style={{ width: '100%', height: 300 }}
          camera={{
            centerCoordinate: [location?.longitude || 37.78825, location?.latitude || -122.4324],
            zoomLevel: 12,
          }}
        >
          {reportedFires.map((fire) => (
            <MarkerView key={fire.id} coordinate={[fire.location.longitude, fire.location.latitude]}>
              <View className="bg-red-500 p-2 rounded-full">
                <Ionicons name="flame" size={24} color="white" />
              </View>
            </MarkerView>
          ))}
        </MapView>
      </ScrollView>
    </SafeAreaView>
  );
}
