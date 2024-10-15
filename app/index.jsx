import { View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import LottieView from "lottie-react-native";

export default function index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LottieView
        source={require("../assets/images/safebeeloading.json")}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text className="text-gray-400">Loading..</Text>
      <StatusBar style="auto" />
    </View>
  )
}