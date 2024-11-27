import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/authContext';

export default function UserNotification() {
  const [disasterReports, setDisasterReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch volunteer's username based on volunteerId
  const getVolunteerUsername = async (volunteerId) => {
    try {
      const volunteerDoc = await getDoc(doc(db, 'volunteers', volunteerId));
      if (volunteerDoc.exists()) {
        return volunteerDoc.data().username;
      }
      return 'Unknown Volunteer'; // Fallback if volunteer data is not found
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      return 'Error fetching volunteer';
    }
  };

  // Fetch disaster reports and append volunteer usernames
  const fetchDisasterReports = async () => {
    try {
      if (!user || !user.username) {
        Alert.alert('Error', 'User information not available');
        setLoading(false);
        return;
      }

      // Query disaster reports where the current user is the one who submitted the report
      const q = query(collection(db, 'disasterReports'), where('username', '==', user.username));
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        if (data.volunteerResponded && data.volunteerId) {
          const volunteerUsername = await getVolunteerUsername(data.volunteerId);
          return { id: doc.id, ...data, volunteerUsername };
        }
        return { id: doc.id, ...data };
      });

      // Wait for all async volunteerUsername fetches to complete
      const reportsWithUsernames = await Promise.all(reports);
      setDisasterReports(reportsWithUsernames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching disaster reports:', error);
      Alert.alert('Error', 'Failed to load disaster reports');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasterReports();
  }, []);

  return (
    <View className='flex-1 bg-white p-6'>
      <Text className='text-sm font-semibold text-left mb-4 text-blue-400'>Your Reports</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {disasterReports.length > 0 ? (
            disasterReports.map((report) => (
              <View
                key={report.id}
                className='mb-4 p-4 rounded-lg'
                style={{
                  backgroundColor: report.volunteerResponded ? 'blue' : 'gray', // Change card color based on volunteer response
                }}
              >
                {/* Disaster Type */}
                <Text className='text-lg font-bold mb-2' style={{ color: report.volunteerResponded ? 'white' : 'black' }}>
                  <Ionicons name="alert-circle-outline" size={20} color="red" /> {report.disasterType}
                </Text>

                {/* Disaster Description */}
                <Text className='text-base italic' style={{ color: report.volunteerResponded ? 'white' : 'black' }}>
                  "{report.description}"
                </Text>

                {/* Volunteer Info */}
                <View className='flex flex-row items-center mb-2'>
                  <Ionicons name="person-circle-outline" size={24} color={report.volunteerResponded ? 'white' : 'green'} />
                  <Text className='ml-2 text-base font-medium' style={{ color: report.volunteerResponded ? 'white' : 'black' }}>
                    {report.volunteerResponded
                      ? `${report.volunteerUsername || 'Unknown Volunteer'} responded to your report`
                      : 'No volunteer has responded yet'}
                  </Text>
                </View>

                {/* Location */}
                <View className='mt-2'>
                  <Text className='text-sm' style={{ color: report.volunteerResponded ? 'white' : 'gray' }}>
                    <Ionicons name="location-outline" size={16} color={report.volunteerResponded ? 'white' : 'gray'} />{' '}
                    Location: {report.location}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className='text-center text-gray-500'>No volunteer responses yet.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}
