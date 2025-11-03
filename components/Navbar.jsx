import { View, Text, TouchableOpacity, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { router } from "expo-router";



export default function Navbar({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
  showBack = false,
  onBackPress,
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
    colors={['#7c3aed', '#5b21b6']} 
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    className="rounded-b-3xl px-4 pb-6"
    style={{ paddingTop: insets.top + 16 }}
  >
      <View className="flex-row items-center justify-between mb-4">
        {showSearch && !showBack && (
          <Pressable onPress={async() =>  await   AsyncStorage.removeItem("createAccount") } className="flex-row items-center bg-white/20 rounded-full px-4 py-3 flex-1 mr-4">
            <Ionicons name="search" size={20} color="white" />
            <TextInput
              placeholder="Search destinations"
              placeholderTextColor="rgba(255,255,255,0.7)"
              className="text-white ml-2 flex-1"
            />
          </Pressable>
        )}

        {showBack && (
          <TouchableOpacity 
            onPress={onBackPress}
            className="bg-white/20 rounded-full p-3 mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        {!showSearch && !showBack && <View className="flex-1" />}

        {showNotifications && (
          <TouchableOpacity 
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("createAccount");
                
                if (__DEV__) {
                  router.replace("/(auth)");
                } else {
                  await Updates.reloadAsync();
                }
              } catch (error) {
                console.error("Error during logout:", error);
                router.replace("/(auth)");
              }
            }}
            className="bg-white/20 rounded-full p-3 relative"
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
            {/* Notification Badge */}
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Title and Subtitle */}
      <View>
        <Text className="text-white text-2xl font-bold">{title}</Text>
        {subtitle && (
          <Text className="text-white/80 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
    </LinearGradient>
  );
}
