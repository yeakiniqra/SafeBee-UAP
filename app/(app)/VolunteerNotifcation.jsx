import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; 
import { useAuth } from '../../../context/authContext'; 
import Mapbox, { MarkerView } from '@rnmapbox/maps';


export default function VolunteerNotification() {
  const [disasterReports, setDisasterReports] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const { user } = useAuth(); 

  // Fetch disaster reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'disasterReports'));
        const reports = [];
        querySnapshot.forEach((doc) => {
          reports.push({ id: doc.id, ...doc.data() });
        });
        setDisasterReports(reports);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching disaster reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Function to handle volunteer's response by updating their location
const handleRespond = async (reportId) => {
  try {
      // Get volunteer's current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to respond.');
          return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const volunteerCoords = [location.coords.longitude, location.coords.latitude]; // Store coords as [longitude, latitude]

      // Update the disaster report with volunteer's response location
      const reportRef = doc(db, 'disasterReports', reportId);
      await updateDoc(reportRef, {
          volunteerLocation: volunteerCoords, // Store as coords array
          volunteerResponded: true,
          volunteerId: user?.userId,
      });

      // Show success message
      Alert.alert('Response Submitted', 'Your response location has been sent!');
  } catch (error) {
      console.error('Error responding to disaster:', error);
      Alert.alert('Error', 'Failed to submit your response. Please try again.');
  }
};


  return (
    <ScrollView className="bg-gray-100 flex-1 p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20}}>
      <Text className="text-lg font-bold text-gray-700 mb-4">Recent Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {disasterReports.length > 0 ? (
            disasterReports.map((report) => (
              <View
                key={report.id}
                className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col"
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="alert-circle" size={24} color="red" />
                  <Text className="text-base font-bold text-gray-800 ml-2">
                    Disaster: {report.disasterType}
                  </Text>
                </View>

                <Text className="text-gray-600 mb-1">
                  Location: {report.location || 'Unknown'}
                </Text>
               
                <Text className="text-gray-600 mb-3">
                  Reported by: {report.username || 'Anonymous'}
                </Text>
                <Text className="text-gray-600 mb-3">
                  Contact: {report.contact || 'Not provided'}
                </Text>

                {/* Respond Button */}
                {!report.volunteerResponded ? (
                  <TouchableOpacity
                    onPress={() => handleRespond(report.id)}
                    className="bg-green-500 py-2 rounded-lg"
                  >
                    <View className="flex-row justify-center items-center">
                      <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                      <Text className="text-white text-base ml-2">Respond</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-green-700 italic">You have responded to this report.</Text>
                )}
              </View>
            ))
          ) : (
            <Text className="text-gray-600 text-center mt-10">No disaster reports available.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}
