import { Tabs } from 'expo-router';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

export default function TabLayout() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: true,
            tabBarStyle: {
                backgroundColor: '#0C3B2E',
                position: 'absolute',
                paddingVertical: 10,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                height: 60,
                justifyContent: 'center',
                alignSelf: 'center',
            }
        }}>
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
                }}
            />

            <Tabs.Screen
                name="Report"
                options={{
                    title: 'Disaster Report',
                    headerTitle: 'Report A Disaster',
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0C3B2E',
                    },
                    headerTitleStyle: {
                        color: 'white',
                    },
                    tabBarIcon: ({ color }) => <FontAwesome5 name="bullhorn" size={24} color={color} />
                }}
            />

            <Tabs.Screen
                name="Donation"
                options={{
                    headerTitle: 'Donation for Relief',
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0C3B2E',
                    },
                    headerTitleStyle: {
                        color: 'white',
                    },
                    tabBarIcon: ({ color }) => <FontAwesome5 name="hand-holding-heart" size={24} color={color} />
                }}
            />

            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome5 name="user-cog" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}
