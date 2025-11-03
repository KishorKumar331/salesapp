import { View, Text, Pressable, ScrollView, Dimensions, TextInput, Alert, Modal, ActivityIndicator, Platform, ToastAndroid } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const OnBoardingPage = () => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Carousel data
  const carouselImages = [
    { id: 1, title: "Welcome to Our Platform", bgColor: "#DCEAF7" },
    { id: 2, title: "Manage Your Sales", bgColor: "#E8F5E8" },
    { id: 3, title: "Track Your Progress", bgColor: "#FFF2E8" },
    { id: 4, title: "Connect with Clients", bgColor: "#F3E8FF" },
    { id: 5, title: "Grow Your Business", bgColor: "#FFE8F0" }
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handleLogin = async () => {
    if (!loginInput.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      let apiUrl = 'https://sg76vqy4vi.execute-api.ap-south-1.amazonaws.com/salesapp/Auth?';
      
      // Determine if input is email or phone
      if (isValidEmail(loginInput)) {
        apiUrl += `Email=${encodeURIComponent(loginInput)}`;
      } else if (isValidPhone(loginInput)) {
        apiUrl += `Phone=${encodeURIComponent(loginInput)}`;
      } else {
        Alert.alert('Error', 'Please enter a valid email or phone number');
        setIsLoading(false);
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        if (Array.isArray(result) && result.length === 0) {
          // Empty array means no profile found
          Alert.alert('Not Found', 'No account found with this email/phone. Please create an account first.');
        } else if (result && (Array.isArray(result) ? result.length > 0 : Object.keys(result).length > 0)) {
          // Profile found, store to localStorage and navigate
          await AsyncStorage.setItem('userProfile', JSON.stringify(result));
          await AsyncStorage.setItem('createAccount', 'true');
          
          showToast('Login successful!');
          setShowLoginModal(false);
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', 'Invalid response from server');
        }
      } else {
        Alert.alert('Error', result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("createAccount", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error setting auth status:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#7c3aed', '#5b21b6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-3xl px-5 pb-6"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-white">Journey Routers</Text>
          <View className="flex-row gap-2">
            <Pressable onPress={() => setShowLoginModal(true)} className="px-4 py-2 rounded-full bg-white/20">
              <Text className="text-white font-medium">Login</Text>
            </Pressable>
            <Pressable onPress={()=>router.replace("/(auth)/createAccount")} className="px-4 py-2 rounded-full bg-white/20">
              <Text className="text-white font-medium">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* Full Height Carousel */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
        >
          {carouselImages.map((item, index) => (
            <View key={item.id} style={{ width }} className="flex-1 px-5 justify-center max-h-[44rem]">
              <Text className="text-3xl font-extrabold text-gray-900 mt-6 text-center">Get Started Today</Text>
              <Text className="text-gray-500 mt-2 text-center">Join thousands of users already using our platform</Text>

              {/* Hero Card */}
              <View className="mt-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex-1 ">
                <View className="flex-1 rounded-xl items-center justify-center" style={{ backgroundColor: item.bgColor }}>
                  <View className="w-24 h-44 bg-white rounded-3xl items-center justify-center shadow" />
                </View>
                <Text className="mt-4 text-center text-gray-800 font-medium">{item.title}</Text>
              </View>

            </View>
          ))}
        </ScrollView>

        {/* Carousel Dots */}
        <View className="flex-row items-center justify-center gap-2 pb-4">
          {carouselImages.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? 'w-8 bg-purple-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Fixed Get Started Button */}
        {/* <View className="px-5 pb-6">
          <Pressable onPress={handleGetStarted} className="overflow-hidden rounded-full">
            <LinearGradient colors={["#9b5cff", "#4f46e5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 9999 }}>
              <Text className="text-center text-white font-semibold text-base">Get Started Now</Text>
            </LinearGradient>
          </Pressable>
        </View> */}
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">Login</Text>
              <Pressable onPress={() => setShowLoginModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Email or Phone Number</Text>
              <TextInput
                value={loginInput}
                onChangeText={setLoginInput}
                placeholder="Enter your email or phone number"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border border-gray-200"
                editable={!isLoading}
              />
            </View>

            <View className="space-y-3">
              <Pressable 
                onPress={handleLogin}
                disabled={isLoading}
                className="overflow-hidden rounded-full"
              >
                <LinearGradient 
                  colors={["#7c3aed", "#5b21b6"]} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }} 
                  style={{ paddingVertical: 16, borderRadius: 9999 }}
                >
                  <View className="flex-row items-center justify-center">
                    {isLoading && <ActivityIndicator size="small" color="white" className="mr-2" />}
                    <Text className="text-center text-white font-semibold text-base">
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>

              <Pressable 
                onPress={() => {
                  setShowLoginModal(false);
                  router.push('/(auth)/createAccount');
                }}
                className="bg-gray-200 rounded-full py-4"
                disabled={isLoading}
              >
                <Text className="text-center text-gray-700 font-semibold">Create New Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OnBoardingPage;