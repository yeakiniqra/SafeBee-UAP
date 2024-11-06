import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="DonationDetail"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="notifications/VolunteerNotifcation"
        options={{
          headerTitle: 'Disaster Alert',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />
      <Stack.Screen
        name="notifications/UserNotification"
        options={{
          headerTitle: 'Volunteer Responses',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
         
      />

      <Stack.Screen
        name="About"
        options={{
          headerTitle: 'About SafeBee',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />
      <Stack.Screen
        name="ProfilePages/MyProfile"
        options={{
          headerTitle: 'My Profile',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

      <Stack.Screen
        name="ProfilePages/Activities"
        options={{
          headerTitle: 'Activities',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
       />  

      <Stack.Screen
        name="services/Flood"
        options={{
          headerTitle: 'Flood Relief Contacts',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      /> 

      <Stack.Screen
        name="services/FireAlert"
        options={{
          headerTitle: 'Fire Alert',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

      <Stack.Screen
        name="services/SafetyTips"
        options={{
          headerTitle: 'Safety Tips',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

      <Stack.Screen
        name="services/ShelterCenter"
        options={{
          headerTitle: 'Shelter Center',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

      <Stack.Screen
        name="services/Hospital"
        options={{
          headerTitle: 'Hospital Info',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

      <Stack.Screen
        name="services/HelpLine"
        options={{
          headerTitle: 'HelpLine Contacts',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

      <Stack.Screen
        name="services/FireService"
        options={{
          headerTitle: 'Fire Emergency Services',
          headerStyle: {
            backgroundColor: '#0C3B2E',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          },
          headerTintColor: '#ffffff', 
        }}
      />

    </Stack>

  )
}