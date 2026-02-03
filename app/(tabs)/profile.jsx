import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => router.replace("/(auth)")
        }
      ]
    );
  };
  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar with Profile Info */}
         <Navbar
        title="Journey Readdy"
        subtitle="Explore beautiful destinations"
        showSearch
        showNotifications
        onNotificationPress={() => console.log("Notifications pressed")}
      />


      <ScrollView className="flex-1 px-4 pt-6">
        {/* Stats Cards */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm">
            <Text className="text-2xl font-bold text-purple-600">127</Text>
            <Text className="text-gray-600 text-sm">Total Bookings</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm">
            <Text className="text-2xl font-bold text-green-600">₹2.4L</Text>
            <Text className="text-gray-600 text-sm">This Month</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="person-outline" size={24} color="#7c3aed" />
            <Text className="text-gray-900 font-medium ml-3 flex-1">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="settings-outline" size={24} color="#7c3aed" />
            <Text className="text-gray-900 font-medium ml-3 flex-1">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity   onPress={() => router.push('/(auth)/PaymentGateway/payment')}
 className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="help-circle-outline" size={24} color="#7c3aed" />
            <Text   onPress={() => router.push('/(auth)/PaymentGateway/payment')}
 className="text-gray-900 font-medium ml-3 flex-1">Pricing section</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="text-red-500 font-medium ml-3 flex-1">Logout</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity className="absolute bottom-20 right-4 bg-purple-600 rounded-full p-4 shadow-lg">
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
