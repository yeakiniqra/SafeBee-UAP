import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useAuth } from '../../../context/authContext';
import { db, auth } from '../../../firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';  // Added setDoc for creating a new document
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyProfile() {
  const { user } = useAuth();
  const userEmail = auth.currentUser?.email;
  const [username, setUsername] = useState(user?.username || '');
  const [contact, setContact] = useState(user?.contact || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [editMode, setEditMode] = useState(false);

  let [fontsLoaded] = useFonts({
    'Inter-Bold': require('../../../assets/fonts/Inter_24pt-Bold.ttf'),
    'Inter-Regular': require('../../../assets/fonts/Inter_24pt-Regular.ttf'),
    'Inter-Semibold': require('../../../assets/fonts/Inter_24pt-SemiBold.ttf'),
    'Inter-Light': require('../../../assets/fonts/Inter_18pt-Light.ttf'),
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUsername(userData.username || '');
          setContact(userData.contact || '');
          setBloodGroup(userData.bloodGroup || '');
          setGender(userData.gender || '');
          setLocation(userData.location || '');
        } else if (user && user.userId) {
          const userDoc = doc(db, `users/${user.userId}`);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUsername(userData.username || '');
            setContact(userData.contact || '');
            setBloodGroup(userData.bloodGroup || '');
            setGender(userData.gender || '');
            setLocation(userData.location || '');
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user]);

  const handleEditToggle = async () => {
    if (editMode) {
      try {
        if (user && user.userId) {
          // Check if the user is a volunteer or a regular user
          const collectionName = user.role === 'volunteer' ? 'volunteers' : 'users';
          const userDocRef = doc(db, `${collectionName}/${user.userId}`);
          const docSnapshot = await getDoc(userDocRef);
  
          const updatedData = {
            username,
            contact,
            bloodGroup,
            gender,
            location,
          };
  
          // If document does not exist, create a new one
          if (!docSnapshot.exists()) {
            await setDoc(userDocRef, updatedData);
            console.log('Document created successfully!');
          } else {
            await updateDoc(userDocRef, updatedData);
          }
  
          await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          Alert.alert('Success', 'Profile updated successfully!');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
        console.error('Error updating document:', error);
      }
    }
    setEditMode(!editMode);
  };
  

  const getAvatar = () => {
    switch (gender.toLowerCase()) {
      case 'male':
        return require('../../../assets/images/male-avatar.png');
      case 'female':
        return require('../../../assets/images/female-avatar.png');
      default:
        return require('../../../assets/images/default-avatar.png');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-4 py-6">

            <View className="items-center my-6">
              <Image source={getAvatar()} className="w-24 h-24 rounded-full" />
            </View>
            <View className="mb-4">
              <Text className="text-md" style={{ fontFamily: 'Inter-Semibold' }}>Username</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-500"
                editable={false}
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View className="mb-4">
              <Text className="text-md" style={{ fontFamily: 'Inter-Semibold' }}>Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-500"
                value={userEmail}
                editable={false}
              />
            </View>
            <View className="mb-4">
              <Text className="text-md" style={{ fontFamily: 'Inter-Semibold' }}>Blood Group</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-500"
                editable={editMode}
                value={bloodGroup}
                onChangeText={setBloodGroup}
              />
            </View>

            <View className="mb-4">
              <Text className="text-md" style={{ fontFamily: 'Inter-Semibold' }}>Phone</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 flex-1"
                  editable={editMode}
                  value={contact}
                  onChangeText={setContact}
                />
                {editMode && (
                  <AntDesign name="edit" size={20} color="gray" style={{ marginLeft: 6 }} />
                )}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-md" style={{ fontFamily: 'Inter-Semibold' }}>Location</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 flex-1"
                  editable={editMode}
                  value={location}
                  placeholder='Enter your City, Country'
                  onChangeText={setLocation}
                />
                {editMode && (
                  <AntDesign name="edit" size={20} color="gray" style={{ marginLeft: 6 }} />
                )}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-md" style={{ fontFamily: 'Inter-Semibold' }}>Gender</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 flex-1"
                  editable={editMode}
                  value={gender}
                  onChangeText={setGender}
                  placeholder="Male/Female"
                />
                {editMode && (
                  <AntDesign name="edit" size={20} color="gray" style={{ marginLeft: 6 }} />
                )}
              </View>
            </View>

            <TouchableOpacity
              className={`p-3 rounded-lg items-center mt-6 ${editMode ? 'bg-green-600' : 'bg-teal-600'}`}
              onPress={handleEditToggle}
            >
              <Text className="text-white text-lg" style={{ fontFamily: 'Inter-Semibold' }}>
                {editMode ? 'Save Changes' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
