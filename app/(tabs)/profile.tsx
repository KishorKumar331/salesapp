import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar with Profile Info */}
      <View className="bg-gradient-to-br from-purple-600 to-purple-800 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1" />
          <TouchableOpacity className="bg-white/20 rounded-full p-3 relative">
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center mb-4">
          <View className="bg-white/20 rounded-full p-4 mr-4">
            <Ionicons name="person" size={32} color="white" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">John Doe</Text>
            <Text className="text-white/80 text-sm">Travel Agent</Text>
          </View>
        </View>
      </View>

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

          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="help-circle-outline" size={24} color="#7c3aed" />
            <Text className="text-gray-900 font-medium ml-3 flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="text-red-500 font-medium ml-3 flex-1">Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
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
