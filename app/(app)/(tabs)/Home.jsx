import { View, Text, Platform, Image, TouchableOpacity, ScrollView, SafeAreaView,ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { useAuth } from '../../../context/authContext';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const API_KEY = process.env.WEATHER_API_KEY;

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      if (currentLocation) {
        const { coords: { latitude, longitude } } = currentLocation;
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const currentCity = reverseGeocode[0].city;
          setCity(currentCity);

          if (currentCity) {
            fetchWeather(currentCity);
          }
        }
      }
    };

    const fetchWeather = async (city) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.log('Error fetching weather:', error);
      }
    };

    const fetchUnreadNotifications = async () => {
      if (!user) return;

      setLoading(true); // Start loading

      // Query to fetch unread notifications
      const notificationQuery = query(
        collection(db, 'disasterReports'),
        where('username', '==', user.username),
        where('isRead', '==', false) // Only fetch unread notifications
      );

      try {
        const querySnapshot = await getDocs(notificationQuery);
        setUnreadCount(querySnapshot.size); 
      } catch (error) {
        console.log('Error fetching unread notifications:', error);
      } finally {
        setLoading(false); 
      }
    };


    getPermission();
    fetchUnreadNotifications();
  }, [user]);

  
  const markNotificationsAsRead = async () => {
    if (!user?.username) return;

    const notificationQuery = query(
      collection(db, 'disasterReports'),
      where('username', '==', user.username),
      where('isRead', '==', false)
    );

    try {
      const querySnapshot = await getDocs(notificationQuery);

      const batch = writeBatch(db);

      querySnapshot.forEach((docSnapshot) => {
        const docRef = doc(db, 'disasterReports', docSnapshot.id);
        batch.update(docRef, { isRead: true });
      });

      await batch.commit(); 
      setUnreadCount(0); 
    } catch (error) {
      console.log('Error marking notifications as read:', error);
    }
  };


const handleNotificationPress = () => {
  markNotificationsAsRead(); 

  if (user?.role === 'volunteer') {
    router.push("/notifications/VolunteerNotifcation");
  } else {
    router.push("/notifications/UserNotification");
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
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 35 : 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="bg-gray-100 p-4">

          
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl text-green-800" style={{ fontFamily: 'Inter-Semibold' }}>
              Hello, {user?.username}
            </Text>

            {/* Notification icon with red dot */}
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <TouchableOpacity onPress={handleNotificationPress}>
                <View style={{ position: 'relative' }}>
                  <Ionicons name="notifications-outline" size={24} color="black" />
                  {unreadCount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                        {unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

          </View>

          <Text className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter-Semibold' }}>
            {city ? `No emergency alerts in ${city}.` : 'No emergency alerts.'}
          </Text>
          <Text className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'Inter-Regular' }}>Let's get you prepared just in case</Text>

          {/* Weather Card */}
          <View className="bg-green-900 p-6 rounded-lg flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-6xl mb-2" style={{ fontFamily: 'Inter-Semibold' }}>{weather?.main?.temp}°</Text>
              <Text className="text-gray-300 text-base mb-1" style={{ fontFamily: 'Inter-Regular' }}>H: {weather?.main?.temp_max}° L: {weather?.main?.temp_min}°</Text>
              <Text className="text-gray-300 text-base" style={{ fontFamily: 'Inter-Regular' }}>{city}, {weather?.sys?.country}</Text>
            </View>
            <Image source={require('../../../assets/images/weather.png')} style={{ width: 100, height: 100 }} className="ml-4" />
          </View>

          {/* Emergency Section */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base text-gray-700" style={{ fontFamily: 'Inter-Semibold' }}>Are you facing an emergency?</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </View>

          {/* Emergency Options */}
          <View className="flex-row justify-around mb-4">
            {/* Disaster Report */}
            <TouchableOpacity className="items-center bg-red-100 p-4 rounded-full w-20 h-20 justify-center">
              <Ionicons name="alert-circle-outline" size={28} color="black" />
              <Text className="text-xs mt-2 text-center" style={{ fontFamily: 'Inter-Regular' }}>Disaster Report</Text>
            </TouchableOpacity>

            {/* Flood */}
            <TouchableOpacity className="items-center bg-blue-100 p-4 rounded-full w-20 h-20 justify-center"
              onPress={() => router.push("/services/Flood")}
            >
              <Ionicons name="water-outline" size={28} color="black" />
              <Text className="text-xs mt-2 text-center" style={{ fontFamily: 'Inter-Regular' }}>Flood</Text>
            </TouchableOpacity>

            {/* Fire Alert */}
            <TouchableOpacity className="items-center bg-yellow-100 p-4 rounded-full w-20 h-20 justify-center"
              onPress={() => router.push("/services/FireAlert")}
            >
              <Ionicons name="flame-outline" size={28} color="black" />
              <Text className="text-xs mt-2 text-center" style={{ fontFamily: 'Inter-Regular' }}>Fire Alert</Text>
            </TouchableOpacity>

            {/* Safety Tips */}
            <TouchableOpacity className="items-center bg-green-100 p-4 rounded-full w-20 h-20 justify-center"
              onPress={() => router.push("/services/SafetyTips")}
            >
              <Ionicons name="shield-checkmark-outline" size={28} color="black" />
              <Text className="text-xs mt-2 text-center" style={{ fontFamily: 'Inter-Regular' }}>Safety Tips</Text>
            </TouchableOpacity>
          </View>

          {/* Emergency Services */}
          <View className="flex-row justify-between items-center mb-4 mt-4">
            <Text className="text-base font-semibold text-gray-700" style={{ fontFamily: 'Inter-Semibold' }}>Emergency Services Near You</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </View>

          <View className="flex-row justify-around mb-4">
            {/* Fire Service */}
            <View className="items-center">
              <TouchableOpacity className="bg-emerald-800 p-4 rounded-full w-16 h-16 justify-center items-center"
                onPress={() => router.push("/services/FireService")}
              >
                <MaterialCommunityIcons name="fire-truck" size={28} color="orange" />
              </TouchableOpacity>
              <Text className="text-xs mt-2 text-center text-black" style={{ fontFamily: 'Inter-Regular' }}>
                Fire Service
              </Text>
            </View>

            {/* HelpLine */}
            <View className="items-center">
              <TouchableOpacity className="bg-emerald-800 p-4 rounded-full w-16 h-16 justify-center items-center"
                onPress={() => router.push("/services/HelpLine")}
              >
                <Ionicons name="call-outline" size={28} color="yellow" />
              </TouchableOpacity>
              <Text className="text-xs mt-2 text-center text-black" style={{ fontFamily: 'Inter-Regular' }}>
                Helpline
              </Text>
            </View>

            {/* Hospital */}
            <View className="items-center">
              <TouchableOpacity className="bg-emerald-800 p-4 rounded-full w-16 h-16 justify-center items-center"
                onPress={() => router.push("/services/Hospital")}
              >
                <Ionicons name="medkit-outline" size={28} color="lime" />
              </TouchableOpacity>
              <Text className="text-xs mt-2 text-center text-black" style={{ fontFamily: 'Inter-Regular' }}>
                Hospital
              </Text>
            </View>

            {/* Shelter Center */}
            <View className="items-center">
              <TouchableOpacity className="bg-emerald-800 p-4 rounded-full w-16 h-16 justify-center items-center"
                onPress={() => router.push("/services/ShelterCenter")}
              >
                <Ionicons name="home-outline" size={28} color="white" />
              </TouchableOpacity>
              <Text className="text-xs mt-2 text-center text-black" style={{ fontFamily: 'Inter-Regular' }}>
                Shelter Center
              </Text>
            </View>
          </View>



          {/* Crowdfunding Section */}
          <View className="flex-row justify-between items-center mb-4 mt-4">
            <Text className="text-base font-semibold text-gray-700" style={{ fontFamily: 'Inter-Semibold' }}>Support Disaster Relief</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="flex-row mb-4">
            {/* First Card */}
            <TouchableOpacity className="bg-white rounded-lg w-64 mr-4 shadow-md overflow-hidden">
              <Image source={require('../../../assets/images/dis1.jpg')} className="h-40 w-full object-cover" />
              <View className="p-4">
                <Text className="text-base font-semibold text-gray-800 mt-2" style={{ fontFamily: 'Inter-Semibold' }}>Relief support for People in Bangladesh</Text>
                <View className="flex-row items-center mt-2">
                  <Image source={require('../../../assets/images/assunnah_foundation.png')} className="w-4 h-4" />
                  <Text className="text-xs text-gray-500 ml-1" style={{ fontFamily: 'Inter-Regular' }}>As-Sunnah Foundation</Text>
                </View>
                <Text className="text-lg font-semibold text-black mt-4">1 Crore BDT <Text className="text-sm text-gray-500">raised</Text></Text>
              </View>
            </TouchableOpacity>

            {/* Second Card */}
            <TouchableOpacity className="bg-white rounded-lg w-64 mr-4 shadow-md overflow-hidden">
              <Image source={require('../../../assets/images/dis2.jpg')} className="h-40 w-full object-cover" />
              <View className="p-4">
                <Text className="text-base font-semibold text-gray-800 mt-2" style={{ fontFamily: 'Inter-Semibold' }}>Flood Recovery in Bangladesh</Text>
                <View className="flex-row items-center mt-2">
                  <Image source={require('../../../assets/images/uap_dru.jpg')} className="w-4 h-4" />
                  <Text className="text-xs text-gray-500 ml-1" style={{ fontFamily: 'Inter-Regular' }}>UAP-DRU</Text>
                </View>
                <Text className="text-lg font-semibold text-black mt-4">70k BDT <Text className="text-sm text-gray-500">raised</Text></Text>
              </View>
            </TouchableOpacity>

            {/* Third Card */}
            <TouchableOpacity className="bg-white rounded-lg w-64 mr-4 shadow-md overflow-hidden">
              <Image source={require('../../../assets/images/dis3.jpg')} className="h-40 w-full object-cover" />
              <View className="p-4">
                <Text className="text-base font-semibold text-gray-800 mt-2" style={{ fontFamily: 'Inter-Semibold' }}>Medical Aid for Flood Survivors</Text>
                <View className="flex-row items-center mt-2">
                  <Image source={require('../../../assets/images/unicef.png')} className="w-4 h-4" />
                  <Text className="text-xs text-gray-500 ml-1" style={{ fontFamily: 'Inter-Regular' }}>Unicef</Text>
                </View>
                <Text className="text-lg font-semibold text-black mt-4">67.3 Lac BDT <Text className="text-sm text-gray-500">raised</Text></Text>
              </View>
            </TouchableOpacity>
          </ScrollView>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
