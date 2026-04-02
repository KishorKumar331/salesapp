import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UnauthorizedPage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
        <Ionicons name="shield-alert" size={48} color="#ef4444" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Not Authorized</Text>
      <Text className="text-gray-600 text-center mb-8">
        You are not authorized to access this application. Please connect with the admin to get your account configured.
      </Text>
      
      <Pressable 
        onPress={() => router.replace("/(auth)")}
        className="w-full bg-gray-900 rounded-xl py-4 items-center"
      >
        <Text className="text-white font-semibold text-lg">Back to Login</Text>
      </Pressable>
    </View>
  );
}
