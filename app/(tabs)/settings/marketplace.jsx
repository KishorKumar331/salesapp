import { View, Text, ScrollView, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const pdfTemplates = [
  {
    id: '1',
    name: 'Business Quotation',
    description: 'Professional quotation template for business services',
    category: 'Business',
    price: 'Free',
    downloads: 1234,
    rating: 4.8,
    thumbnail: 'https://via.placeholder.com/100x140/7c3aed/ffffff?text=BQ',
  },
  {
    id: '2',
    name: 'Travel Invoice',
    description: 'Complete invoice template for travel agencies',
    category: 'Travel',
    price: '₹99',
    downloads: 892,
    rating: 4.6,
    thumbnail: 'https://via.placeholder.com/100x140/10b981/ffffff?text=TI',
  },

];

// const categories = ['All', 'Business', 'Travel', 'Sales', 'Legal', 'Free'];
import { useUserProfile } from "@/hooks/useUserProfile";

export default function MarketplaceScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUserProfile();
console.log(user)
  const filteredTemplates = pdfTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderTemplate = ({ item }) => (
    <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row">
        <View className="w-20 h-28 bg-purple-100 rounded-lg items-center justify-center">
          <Image source={{ uri: item.thumbnail }} className="w-full h-full rounded-lg" />
        </View>
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-start">
            <Text className="text-gray-900 font-semibold text-base flex-1">{item.name}</Text>
            <View className="bg-purple-100 px-2 py-1 rounded-full">
              <Text className="text-purple-600 text-xs font-medium">{item.category}</Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>{item.description}</Text>
          
          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="text-gray-700 text-sm ml-1">{item.rating}</Text>
            </View>
            <View className="flex-row items-center ml-4">
              <Ionicons name="download-outline" size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">{item.downloads}</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-purple-600 font-bold text-lg">{item.price}</Text>
            <TouchableOpacity className="bg-purple-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium text-sm">Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar
        title="PDF Marketplace"
        subtitle="Browse professional PDF templates"
        showBack
        onBackPress={() => router.back()}
      />

      {/* Search Bar */}
      <View className="px-4 pt-4">
        <View className="bg-white rounded-xl px-4 py-3 flex-row items-center border border-gray-200">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <Text className="text-gray-400 ml-2 flex-1">Search templates...</Text>
        </View>
      </View>

      {/* Categories */}
      {/* <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === category 
                ? 'bg-purple-600' 
                : 'bg-white border border-gray-200'
            }`}
            onPress={() => setSelectedCategory(category)}
          >
            <Text className={`text-sm font-medium ${
              selectedCategory === category 
                ? 'text-white' 
                : 'text-gray-700'
            }`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Templates List */}
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <View className="mt-6 mb-8">
            <TouchableOpacity className="relative overflow-hidden rounded-2xl shadow-xl">
              {/* Background gradient with pattern overlay */}
              <View className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <View className="absolute inset-0 bg-black/10"></View>
                {/* Decorative circles */}
                <View className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></View>
                <View className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></View>
              </View>
              
              {/* Content */}
              <View className="bg-purple-500 relative p-6">
                <View className="items-center">
                  {/* Icon with glow effect */}
                  <View className="relative">
                    <View className="absolute inset-0 bg-white/20 rounded-full blur-lg"></View>
                    <View className="relative bg-white/20 p-4 rounded-full backdrop-blur-sm">
                      <Ionicons name="document-text-outline" size={28} color="white" />
                    </View>
                  </View>
                  
                  <Text className="text-white font-bold text-xl mt-4 text-center">Need Something Custom?</Text>
                  <Text className="text-white/80 text-sm mt-2 text-center leading-relaxed">
                    Request a personalized PDF template designed specifically for your business needs
                  </Text>
                  
                  {/* Button with inner shadow */}
                  <View className="mt-5 relative">
                    <View className="absolute inset-0 bg-black/20 rounded-full blur-md"></View>
                    <View className="relative bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full border border-white/30">
                      <Text className="text-gray-800 font-bold text-base">Request Custom PDF</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
