import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import HelpLineContact from '../../../scripts/HelpLine.json';


const HelpLine = () => {
  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
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
    <ScrollView className="p-4 bg-gray-100" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
     
      {HelpLineContact.map((contact, index) => (
        <View
          key={index}
          className="bg-white p-4 mb-4 rounded-lg shadow-md"
        >
          <Text className="text-lg text-gray-800 mb-2" style={{fontFamily: 'Inter-Semibold'}}>{contact.organization}</Text>
          <Text className="text-gray-600 mb-3" style={{fontFamily: 'Inter-Regular'}}>{contact.description}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-blue-600 " style={{fontFamily: 'Inter-Semibold'}}>{contact.helpline_number}</Text>
            <TouchableOpacity
              onPress={() => makeCall(contact.helpline_number)}
              className="flex-row items-center"
            >
              <Ionicons name="call-outline" size={24} color="green" />
              <Text className="text-green-600 ml-2" style={{fontFamily: 'Inter-Semibold'}}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default HelpLine;
