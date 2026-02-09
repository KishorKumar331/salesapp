import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";

export default function SettingsScreen() {
  const router = useRouter();

  const menuItems = [
    {
      id: 'marketplace',
      title: 'PDF Marketplace',
      subtitle: 'Browse and download PDF templates',
      icon: 'document-text-outline',
      onPress: () => router.push('/(tabs)/settings/marketplace'),
    },
    {
      id: 'account',
      title: 'Account Settings',
      subtitle: 'Manage your account preferences',
      icon: 'person-outline',
      onPress: () => router.push('/(tabs)/settings/account'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Configure notification settings',
      icon: 'notifications-outline',
      onPress: () => router.push('/(tabs)/settings/notifications'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: 'lock-closed-outline',
      onPress: () => router.push('/(tabs)/settings/privacy'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      onPress: () => router.push('/(tabs)/settings/help'),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      onPress: () => router.push('/(tabs)/settings/about'),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar
        title="Settings"
        subtitle="Manage your app preferences"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="bg-white rounded-2xl shadow-sm">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center p-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={item.onPress}
            >
              <View className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Ionicons name={item.icon} size={20} color="#7c3aed" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-medium text-base">{item.title}</Text>
                <Text className="text-gray-500 text-sm mt-1">{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
