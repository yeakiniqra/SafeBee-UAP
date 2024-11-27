import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function DonationDetails() {
    // Fetch params
    const params = useLocalSearchParams();
    const router = useRouter();
    const [donation, setDonation] = useState(null);

    const donationId = params?.donationId || 'default_donation_id';

    useEffect(() => {
        if (!donationId) {
            console.error('Donation ID is undefined');
            return;
        }

        const fetchDonationDetails = async () => {
            try {
                const donationDoc = await getDoc(doc(db, 'donations', donationId));
                if (donationDoc.exists()) {
                    const donationData = donationDoc.data();

                    // Calculate days left
                    const campaignStart = donationData.campaign_start?.toDate(); // Firestore timestamp to JS Date
                    const campaignEnd = donationData.campaign_end?.toDate();
                    const today = new Date();
                    const timeDiff = campaignEnd - today; // Time difference in milliseconds
                    const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24))); // Convert to days and ensure non-negative

                    setDonation({
                        fund_name: donationData.fund_name || 'No Fund Name',
                        org_name: donationData.org_name || 'No Org Name',
                        cover_image: donationData.cover_image || 'default_image_url',
                        raised_amt: donationData.raised_amt || 0,
                        target_amt: donationData.target_amt || 0,
                        description: donationData.description || 'No Description',
                        logo: donationData.logo || 'default_logo_url',
                        donators: donationData.donators || 0,
                        days_left: daysLeft,
                    });
                } else {
                    console.error('No such donation found!');
                }
            } catch (error) {
                console.error('Error fetching donation details: ', error);
            }
        };

        fetchDonationDetails();
    }, [donationId]);

    let [fontsLoaded] = useFonts({
        'Inter-Bold': require('../../assets/fonts/Inter_24pt-Bold.ttf'),
        'Inter-Regular': require('../../assets/fonts/Inter_24pt-Regular.ttf'),
        'Inter-Semibold': require('../../assets/fonts/Inter_24pt-SemiBold.ttf'),
        'Inter-Light': require('../../assets/fonts/Inter_18pt-Light.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    if (!donation) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} className="absolute top-10 left-4 z-10 bg-green-500/50 rounded-md p-2">
                <Ionicons name="arrow-back-outline" size={28} color="white" />
            </TouchableOpacity>

            {/* Cover Image */}
            <Image
                source={{ uri: donation.cover_image }}
                className="w-full h-60 object-cover rounded-b-3xl"
            />

            {/* Fund Details */}
            <View className="p-6 bg-white rounded-t-3xl -mt-8">
                <Text className="text-xl" style={{ fontFamily: 'Inter-Semibold' }}>{donation.fund_name}</Text>
                <Text className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Inter-Regular' }}>
                    Initiated by: {donation.org_name}
                </Text>

                {/* Progress */}
                <View className="flex-row justify-between items-center mt-8">
                    <View className="flex-row items-center">
                        <Text className="text-xl" style={{ fontFamily: 'Inter-Semibold' }}>{donation.raised_amt} BDT</Text>
                        <Text className="text-gray-500 ml-2" style={{ fontFamily: 'Inter-Regular' }}>raised so far</Text>
                    </View>
                    <Text className="text-xl" style={{ fontFamily: 'Inter-Semibold' }}>{donation.target_amt} BDT</Text>
                </View>

                {/* Progress Bar */}
                <View className="w-full bg-gray-200 h-2 rounded-full mt-3">
                    <View
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(donation.raised_amt / donation.target_amt) * 100}%` }}
                    />
                </View>

                {/* Supporters and Days Left */}
                <View className="flex-row justify-between items-center mt-4">
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={24} color="gray" />
                        <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>{donation.donators}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={24} color="gray" />
                        <Text className="ml-2" style={{ fontFamily: 'Inter-Regular' }}>{donation.days_left} days left</Text>
                    </View>
                </View>

                {/* Description */}
                <View className="mt-6">
                    <Text className="text-lg font-semibold" style={{ fontFamily: 'Inter-Semibold' }}>Description</Text>
                    <Text className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Inter-Regular' }}>{donation.description}</Text>
                </View>

                {/* Organizer Info */}
                <View className="flex-row items-center mt-6">
                    <Image
                        source={{ uri: donation.logo }}
                        className="w-10 h-10 rounded-full"
                    />
                    <View className="ml-4">
                        <Text className="text-base font-bold" style={{ fontFamily: 'Inter-Semibold' }}>{donation.org_name}</Text>
                        <Text className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Regular' }}>Trusted by SafeBee</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-between mt-8">
                    <TouchableOpacity className="flex-row items-center justify-center bg-gray-200 p-4 rounded-lg">
                        <Ionicons name="share-social-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-green-500 p-4 rounded-lg flex-1 ml-4 justify-center items-center">
                        <Text className="text-white font-semibold text-2xl" style={{ fontFamily: 'Inter-Bold' }}>Donate Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
