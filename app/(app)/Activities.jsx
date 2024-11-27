import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/authContext';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function Activities() {
  const [reports, setReports] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.username) return;

      setLoading(true);
      const reportsQuery = query(
        collection(db, 'disasterReports'),
        where('username', '==', user.username)
      );

      try {
        const querySnapshot = await getDocs(reportsQuery);
        const reportsData = [];
        for (const docSnapshot of querySnapshot.docs) {
          const reportData = { id: docSnapshot.id, ...docSnapshot.data() };

          // If the report has a volunteerId, fetch the volunteer details
          if (reportData.volunteerId) {
            const volunteerRef = doc(db, 'volunteers', reportData.volunteerId);
            const volunteerSnapshot = await getDoc(volunteerRef);
            if (volunteerSnapshot.exists()) {
              reportData.volunteerUsername = volunteerSnapshot.data().username;
              reportData.volunteerContactNo = volunteerSnapshot.data().contact;
            }
          }
          reportsData.push(reportData);
        }
        setReports(reportsData);
      } catch (error) {
        console.log('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleCloseReport = async (reportId) => {
    const reportRef = doc(db, 'disasterReports', reportId);

    try {
      await updateDoc(reportRef, { isClosed: true });
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, isClosed: true } : report
        )
      );
    } catch (error) {
      console.log('Error closing report:', error);
    }
  };

  const handleCompleteResponse = async (reportId) => {
    const reportRef = doc(db, 'disasterReports', reportId);

    try {
      await updateDoc(reportRef, { isCompleted: true });
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, isCompleted: true } : report
        )
      );
    } catch (error) {
      console.log('Error completing response:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString(); // Format the date and time
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl mb-4">Your Reported Disasters</Text>
      {loading ? (
        <View className="flex flex-row justify-center items-center">
          <Ionicons name="sync" size={24} color="gray" />
          <Text className="ml-2 text-lg text-gray-500">Loading...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {reports.map((report) => (
            <View
              key={report.id}
              className={`p-4 mb-4 border rounded-lg shadow ${report.isClosed ? 'bg-gray-200' : 'bg-white'}`}
            >
              <View className="flex flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={24} color="#f56565" />
                <Text className="ml-2 text-xl font-semibold">{report.disasterType}</Text>
              </View>
              <Text className="text-sm text-gray-700">{report.description}</Text>
              <Text className="text-xs text-gray-500">{formatTimestamp(report.timestamp)}</Text>

              {/* Display volunteer's username and contact number if volunteerId is present */}
              {report.volunteerId ? (
                <View className="mt-4">
                  <Text className="font-bold text-gray-700">Volunteer Information:</Text>
                  <Text className="text-sm text-gray-600">Username: {report.volunteerUsername || 'N/A'}</Text>
                  <Text className="text-sm text-gray-600">Contact No: {report.volunteerContactNo || 'N/A'}</Text>
                </View>
              ) : (
                <Text className="text-sm text-gray-500 mt-2">No responses yet.</Text>
              )}

              {!report.isClosed ? (
                user.role === 'user' ? ( // Check if current user is a regular user
                  <Pressable
                    onPress={() => {
                      Alert.alert(
                        'Close Report',
                        'Are you sure you want to close this report?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'OK', onPress: () => handleCloseReport(report.id) },
                        ]
                      );
                    }}
                    className="bg-red-600 mt-4 py-2 px-4 rounded-lg"
                  >
                    <Text className="text-white text-center">Close Report</Text>
                  </Pressable>
                ) : ( // If the user is a volunteer
                  <Pressable
                    onPress={() => {
                      Alert.alert(
                        'Complete Response',
                        'Are you sure you want to mark this response as completed?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'OK', onPress: () => handleCompleteResponse(report.id) },
                        ]
                      );
                    }}
                    className="bg-green-600 mt-4 py-2 px-4 rounded-lg"
                  >
                    <Text className="text-white text-center">Complete Response</Text>
                  </Pressable>
                )
              ) : (
                <Text className="mt-4 text-red-600 font-semibold">Report is closed</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
