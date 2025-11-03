import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NewLeadForm() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-bold mb-4">Add Item Screen</Text>
      <TouchableOpacity className="bg-purple-600 rounded-full p-4 shadow-lg">
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
