import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <Navbar
        title="Explore Destinations"
        subtitle="Discover amazing places to visit"
        showSearch={true}
        showNotifications={true} onBackPress={undefined}      />

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Popular Destinations */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Popular Destinations</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <TouchableOpacity className="bg-white rounded-2xl p-4 mr-4 w-64 shadow-sm">
              <View className="bg-blue-100 rounded-xl h-32 mb-3 items-center justify-center">
                <Ionicons name="airplane" size={40} color="#3b82f6" />
              </View>
              <Text className="text-gray-900 font-bold text-lg">Dubai</Text>
              <Text className="text-gray-600 text-sm">Starting from ₹25,000</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-2xl p-4 mr-4 w-64 shadow-sm">
              <View className="bg-green-100 rounded-xl h-32 mb-3 items-center justify-center">
                <Ionicons name="leaf" size={40} color="#10b981" />
              </View>
              <Text className="text-gray-900 font-bold text-lg">Thailand</Text>
              <Text className="text-gray-600 text-sm">Starting from ₹35,000</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-2xl p-4 mr-4 w-64 shadow-sm">
              <View className="bg-orange-100 rounded-xl h-32 mb-3 items-center justify-center">
                <Ionicons name="sunny" size={40} color="#f59e0b" />
              </View>
              <Text className="text-gray-900 font-bold text-lg">Maldives</Text>
              <Text className="text-gray-600 text-sm">Starting from ₹85,000</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Travel Categories</Text>
          
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
              <View className="bg-purple-100 rounded-full p-3 w-12 h-12 items-center justify-center mb-3">
                <Ionicons name="business" size={24} color="#7c3aed" />
              </View>
              <Text className="text-gray-900 font-semibold">Business</Text>
              <Text className="text-gray-600 text-sm">Corporate travel</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
              <View className="bg-pink-100 rounded-full p-3 w-12 h-12 items-center justify-center mb-3">
                <Ionicons name="heart" size={24} color="#ec4899" />
              </View>
              <Text className="text-gray-900 font-semibold">Honeymoon</Text>
              <Text className="text-gray-600 text-sm">Romantic getaways</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
              <View className="bg-blue-100 rounded-full p-3 w-12 h-12 items-center justify-center mb-3">
                <Ionicons name="people" size={24} color="#3b82f6" />
              </View>
              <Text className="text-gray-900 font-semibold">Family</Text>
              <Text className="text-gray-600 text-sm">Family vacations</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-xl p-4 w-[48%] mb-4 shadow-sm">
              <View className="bg-green-100 rounded-full p-3 w-12 h-12 items-center justify-center mb-3">
                <Ionicons name="trail-sign" size={24} color="#10b981" />
              </View>
              <Text className="text-gray-900 font-semibold">Adventure</Text>
              <Text className="text-gray-600 text-sm">Thrilling experiences</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>   
    </View>
  );
}
