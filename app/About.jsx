import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';
import { useFonts } from 'expo-font';

const About = () => {
  const { user } = useAuth(); // Assuming the useAuth hook provides user data
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendFeedback = async () => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    try {
      await addDoc(collection(db, 'Feedback'), {
        username: user.username || 'Anonymous',
        type: feedbackType,
        feedback: feedbackText,
        timestamp: Timestamp.now(),
      });
      setFeedbackText('');
      setModalVisible(false);
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('../../assets/fonts/Inter_24pt-Bold.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter_24pt-Regular.ttf'),
    'Inter-Semibold': require('../../assets/fonts/Inter_24pt-SemiBold.ttf'),
    'Inter-Light': require('../../assets/fonts/Inter_18pt-Light.ttf'),
});

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView className="flex-grow p-6 bg-white">
     
      {/* App Logo */}
      <View className="flex-row items-center justify-center mb-4">
        <Image source={require('../../assets/images/icon.png')} className="w-24 h-24" />
      </View>
      {/* Brief About the App */}
      <Text className="text-base text-gray-700 text-center mb-6"  style={{ fontFamily: 'Inter-Regular' }}>
        SafeBee is a disaster response app enabling users to report incidents, volunteers to respond, and donors to contribute towards relief efforts.
        It is designed to help communities come together during times of crisis and provide support to those in need.
        Use SafeBee to stay informed, stay safe, and help others in your community.
      </Text>

      {/* Developer Credits */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-left text-gray-800"  style={{ fontFamily: 'Inter-Semibold' }}>Developed by:</Text>
        <Text className="text-base text-left text-gray-600"  style={{ fontFamily: 'Inter-Regular' }}>Yeakin Iqra</Text>
        <Text className="text-base text-left text-gray-600"  style={{ fontFamily: 'Inter-Regular' }}>Naimul Islam</Text>
        <Text className="text-base text-left text-gray-600"  style={{ fontFamily: 'Inter-Regular' }}>Maruf Ahammed</Text>
      </View>

      {/* Feedback Button */}
      <TouchableOpacity
        className="bg-green-600 p-4 rounded-lg flex-row items-center justify-center"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chatbox-ellipses-outline" size={20} color="white" />
        <Text className="text-white text-base font-semibold ml-2" style={{ fontFamily: 'Inter-Semibold' }}>Give Feedback</Text>
      </TouchableOpacity>

      {/* Feedback Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white w-4/5 p-6 rounded-lg">
            <Text className="text-xl font-semibold text-center mb-4" style={{ fontFamily: 'Inter-Semibold' }}>Send Feedback</Text>

            {/* Feedback Type Selector */}
            <View className="flex-row justify-around mb-4">
              <TouchableOpacity
                className={feedbackType === 'bug' ? 'bg-green-500 p-2 rounded-full' : 'bg-gray-200 p-2 rounded-full'}
                onPress={() => setFeedbackType('bug')}
              >
                <Text className={feedbackType === 'bug' ? 'text-white' : 'text-gray-700'} style={{ fontFamily: 'Inter-Semibold' }}>Report a Bug</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={feedbackType === 'feature' ? 'bg-green-500 p-2 rounded-full' : 'bg-gray-200 p-2 rounded-full'}
                onPress={() => setFeedbackType('feature')}
              >
                <Text className={feedbackType === 'feature' ? 'text-white' : 'text-gray-700'} style={{ fontFamily: 'Inter-Semibold' }}>Suggest a Feature</Text>
              </TouchableOpacity>
            </View>

            {/* Feedback Input */}
            <TextInput
              className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
              placeholder="Your feedback here..."
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholderTextColor="#999"
            />

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-green-600 p-3 rounded-lg mb-2"
              onPress={handleSendFeedback}
            >
              <Text className="text-white text-center font-semibold">Submit Feedback</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-2">
              <Text className="text-center text-red-500" style={{ fontFamily: 'Inter-Semibold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default About;
