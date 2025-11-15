import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function InvoicesScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with your actual API call
  const fetchInvoices = async () => {
    try {
      setRefreshing(true);
      // Replace with your actual API call
      // const response = await fetch('/api/invoices');
      // const data = await response.json();
      // setInvoices(data);
      
      // Mock data for now
      setInvoices([
        { id: 'INV-001', customer: 'John Doe', amount: 25000, date: '2023-11-14', status: 'Paid' },
        { id: 'INV-002', customer: 'Jane Smith', amount: 18000, date: '2023-11-10', status: 'Pending' },
      ]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-2 rounded-lg shadow-sm"
      onPress={() => router.push(`/(tabs)/invoices/${item.id}`)}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-bold text-gray-900">{item.id}</Text>
          <Text className="text-gray-600">{item.customer}</Text>
        </View>
        <View className="items-end">
          <Text className="font-bold">₹{item.amount.toLocaleString()}</Text>
          <View className={`px-2 py-1 rounded-full ${
            item.status === 'Paid' ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <Text className={`text-xs font-medium ${
              item.status === 'Paid' ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Invoices</Text>
      </View>

      {/* Invoice List */}
      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={fetchInvoices}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">No invoices found</Text>
          </View>
        }
      />

      {/* Create New Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-purple-600 rounded-full p-4 shadow-lg"
        onPress={() => router.push('/(tabs)/invoices/create')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
