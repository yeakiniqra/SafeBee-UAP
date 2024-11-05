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
import React, { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import Loading from "../components/Loading";
import { useFonts } from "expo-font";

export default function Signin() {
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
            return;
        }

        setLoading(true)
        let response = await login(emailRef.current, passwordRef.current);
        setLoading(false)

        console.log('Got Result', response);
        if (!response.success) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
            return
        }

    }

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
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="w-full bg-gray-900 pb-8 px-6 pt-20">
                    {/* "Sign in to your" and "Account" in two lines */}
                    <Text className="text-3xl text-white text-left mb-1" style={{ fontFamily: 'Inter-Semibold' }}>
                        Sign in to your
                    </Text>
                    <Text className="text-3xl text-white text-left mb-2" style={{ fontFamily: 'Inter-Semibold' }}>
                        Account
                    </Text>

                    {/* Sign Up link */}
                    <TouchableOpacity onPress={() => router.push("/Signup")}>
                        <Text className="text-left text-gray-400" style={{ fontFamily: 'Inter-Regular' }}>
                            Don't have an account?{" "}
                            <Text className="text-emerald-500" style={{ fontFamily: 'Inter-Semibold' }}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* Rest of the form */}
                <View className="flex-1 items-center justify-center mt-8 px-4">
                    {/* Email */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mt-2 mb-6 p-2 rounded-md">
                        <Ionicons name="mail-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Email"
                            onChangeText={value => emailRef.current = value}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password */}
                    <View className="w-full flex-row items-center border-2 border-gray-300 mb-2 p-2 rounded-md">
                        <Ionicons name="lock-closed-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Password"
                            secureTextEntry
                            onChangeText={value => passwordRef.current = value}
                        />
                    </View>

                    <Text className="text-left w-full text-gray-500 mb-6" style={{ fontFamily: 'Inter-Regular' }}>
                        Password Must be 6 Characters
                    </Text>

                    {/* Login Button */}
                    <TouchableOpacity
                        className={`w-full py-3 rounded-md ${loading ? "bg-gray-400" : "bg-green-600"}`}
                        onPress={handleLogin}
                        disabled={loading} 
                    >
                        {loading ? (
                            <Loading />
                        ) : (
                            <Text className="text-white text-center text-lg font-semibold" style={{ fontFamily: 'Inter-Semibold' }}>
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>


                    {/* Or login with */}
                    <Text className="text-center text-gray-500 mt-6 mb-4" style={{ fontFamily: 'Inter-Regular' }}>Or login with</Text>

                    <View className="flex-row justify-between w-full">
                        <TouchableOpacity className="flex-1 bg-gray-100 py-3 mr-2 flex-row items-center justify-center rounded-md">
                            <Ionicons name="logo-google" size={24} color="black" />
                            <Text className="ml-2 font-medium">Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 bg-gray-100 py-3 ml-2 flex-row items-center justify-center rounded-md">
                            <Ionicons name="logo-facebook" size={24} color="black" />
                            <Text className="ml-2 font-medium">Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms of Service */}
                    <Text className="text-center text-gray-500 mt-8" style={{ fontFamily: 'Inter-Light' }}>
                        By signing up, you agree to the{" "}
                        <Text className="text-emerald-500">Terms of Service</Text> and{" "}
                        <Text className="text-emerald-500">Data Processing Agreement</Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
