import {
    View,
    Text,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    Pressable,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import Loading from "../components/Loading";
import { useFonts } from "expo-font";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [password, setPassword] = useState("");
    const [isVolunteer, setIsVolunteer] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !email || !phone || !password || !bloodGroup) {
            ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
            return;
        }

        setLoading(true);

        let response = await register(email, password, username, phone, isVolunteer, bloodGroup);
        setLoading(false);

        console.log('Got Result', response);
        if (!response.success) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
            return;
        }
    };

    let [fontsLoaded] = useFonts({
        'Inter-Bold': require('../assets/fonts/Inter_24pt-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter_24pt-Regular.ttf'),
        'Inter-Semibold': require('../assets/fonts/Inter_24pt-SemiBold.ttf'),
        'Inter-Light': require('../assets/fonts/Inter_18pt-Light.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? "padding" : "height"}
            className="flex-1 bg-white"
            style={{ paddingTop: Platform.OS === 'android' ? 32 : 0 }}
        >
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <View className="flex-1 justify-center">
                    <Text className="text-3xl text-left mb-4 mt-8" style={{ fontFamily: 'Inter-Semibold' }}>SIGN UP</Text>
                    <Text className="text-base text-left text-gray-500 mb-8" style={{ fontFamily: 'Inter-Regular' }}>
                        Create an account to continue!
                    </Text>

                    {/* Username */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mb-6 p-2 rounded-md">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    {/* Email */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mb-6 p-2 rounded-md">
                        <Ionicons name="mail-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Blood Group */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mb-6 p-2 rounded-md">
                        <Ionicons name="heart-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Blood Group"
                            value={bloodGroup}
                            onChangeText={setBloodGroup}
                        />
                    </View>

                    {/* Phone Number */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mb-6 p-2 rounded-md">
                        <Ionicons name="call-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Password */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mb-6 p-2 rounded-md">
                        <Ionicons name="lock-closed-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Volunteer Toggle */}
                    <View className="w-full flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() => setIsVolunteer(!isVolunteer)}  // Toggle isVolunteer state
                            >
                                <Ionicons
                                    name={isVolunteer ? "checkbox" : "square-outline"}  // Use isVolunteer state
                                    size={24}
                                    color={isVolunteer ? "blue" : "gray"}
                                />
                            </Pressable>
                            <Text className="ml-2 text-gray-600" style={{ fontFamily: 'Inter-Semibold' }}>Join As Volunteer</Text>
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        className={`w-full py-3 rounded-md ${loading ? "bg-gray-400" : "bg-emerald-600"}`}
                        onPress={handleRegister}
                        disabled={loading}  // Disable the button during loading
                    >
                        {loading ? (
                            <Loading />
                        ) : (
                            <Text className="text-white text-center text-lg font-semibold" style={{ fontFamily: 'Inter-Semibold' }}>
                                Register
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <Pressable onPress={() => router.push("/Signin")}>
                        <Text className="text-center text-gray-400 mt-4" style={{ fontFamily: 'Inter-Regular' }}>
                            Already have an account?{" "}
                            <Text className="text-green-500" style={{ fontFamily: 'Inter-Semibold' }}>Login</Text>
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
