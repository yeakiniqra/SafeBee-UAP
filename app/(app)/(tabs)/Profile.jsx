import React from 'react';
import { View, Text, Image, TouchableOpacity,Platform } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error('Error logging out:', error);
    }
  };

  let [fontsLoaded] = useFonts({
    'Inter-Bold': require('../../../assets/fonts/Inter_24pt-Bold.ttf'),
    'Inter-Regular': require('../../../assets/fonts/Inter_24pt-Regular.ttf'),
    'Inter-Semibold': require('../../../assets/fonts/Inter_24pt-SemiBold.ttf'),
    'Inter-Light': require('../../../assets/fonts/Inter_18pt-Light.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 items-center bg-gray-100 p-4" style={{ paddingTop: Platform.OS === 'android' ? 40 : 0 }}>
      {/* Profile Section */}
      <View className="w-full bg-white rounded-lg shadow-md p-4">
        <View className="flex-row items-center">
          <Image
            source={require('../../../assets/images/default-avatar.png')}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-lg font-semibold" style={{ fontFamily: 'Inter-Semibold' }}>{user.username}</Text>
            <Text className="text-gray-500" style={{ fontFamily: 'Inter-Semibold' }}>Blood Group: {user.bloodGroup}</Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <View className="mt-8 w-full">
        <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
          onPress={() => router.push('/ProfilePages/MyProfile')}
        >
          <View className="flex-row items-center">
            <AntDesign name="user" size={24} color="black" />
            <Text className="ml-4 text-base" style={{ fontFamily: 'Inter-Semibold' }}>My Profile</Text>
          </View>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity>

        {/* Conditionally render Activities option based on user role */}
        {user.role !== 'volunteer' && (
          <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
            onPress={() => router.push('/ProfilePages/Activities')}
          >
            <View className="flex-row items-center">
              <Ionicons name="list-outline" size={24} color="black" />
              <Text className="ml-4 text-base" style={{ fontFamily: 'Inter-Semibold' }}>Activities</Text>
            </View>
            <AntDesign name="right" size={20} color="gray" />
          </TouchableOpacity>
        )}

        <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={24} color="black" />
            <Text className="ml-4 text-base"  style={{ fontFamily: 'Inter-Semibold' }}>Notification</Text>
          </View>
          <Text className="text-sm text-emerald-500">Allow</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4" 
          onPress={() => router.push('/About')}
        >
          <View className="flex-row items-center">
            <Ionicons name="book-outline" size={24} color="black" />
            <Text className="ml-4 text-base" style={{ fontFamily: 'Inter-Semibold' }}>About the App</Text>
          </View>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 mt-4" style={{ fontFamily: 'Inter-Semibold' }}>Version 1.0.0</Text>

      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-center bg-red-500 p-4 rounded-lg shadow-md mt-8">
        <AntDesign name="logout" size={24} color="white" />
        <Text className="ml-4 text-base text-white" style={{ fontFamily: 'Inter-Semibold' }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
