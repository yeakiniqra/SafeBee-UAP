import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Platform,Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useFonts } from 'expo-font';

export default function Donation() {
  const [donations, setDonations] = useState([]);
  const router = useRouter();

  // Fetch donation data from Firebase
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationSnapshot = await getDocs(collection(db, 'donations'));
        const donationData = donationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDonations(donationData);
      } catch (error) {
        console.error("Error fetching donations: ", error);
      }
    };

    fetchDonations();
  }, []);

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
    <View className='flex-1 bg-gray-200'>
     
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        {donations.map((item) => (
          <Pressable
            key={item.id}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
            onPress={() => router.push({ pathname: '/DonationDetail', params: { donationId: item.id } })}
          >
            {/* Cover Image */}
            <Image source={{ uri: item.cover_image }} className="w-full h-40" />

            {/* Content */}
            <View className="p-4">
              <Text className="text-xl text-gray-800" style={{ fontFamily: 'Inter-Semibold' }}>{item.fund_name}</Text>
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'Inter-Regular' }}>by {item.org_name}</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-base text-green-700 font-semibold" style={{ fontFamily: 'Inter-Regular' }}>Raised {item.raised_amt} BDT</Text>
                <Text className="text-sm text-gray-500 ml-2" style={{ fontFamily: 'Inter-Regular' }} >of {item.target_amt} BDT</Text>
              </View>

              {/* Progress */}
              <View className="bg-gray-200 rounded-full h-2 w-full mt-2">
                <View style={{ width: `${(item.raised_amt / item.target_amt) * 100}%` }} className="bg-green-500 h-2 rounded-full" />
              </View>

              {/* Donate Button */}
              <TouchableOpacity className="mt-4 bg-emerald-500 p-3 rounded-lg">
                <Text className="text-white text-center font-semibold text-lg" style={{ fontFamily: 'Inter-Semibold' }}>Donate Now</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        ))}
      </ScrollView>

    </View>
  );
}
