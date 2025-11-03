import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Quote {
  id: string;
  tripId: string;
  destination: string;
  customerName: string;
  duration: string;
  total: number;
  status: 'active' | 'expired' | 'used';
  createdDate: string;
}

interface LastQuotesModalProps {
  visible: boolean;
  onClose: () => void;
  onUseQuote: (quote: Quote) => void;
}

const LastQuotesModal: React.FC<LastQuotesModalProps> = ({
  visible,
  onClose,
  onUseQuote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleQuotes: Quote[] = [
    { id: '1', tripId: 'TRIP ID: 12668838', destination: 'Europe', customerName: 'Rajesh Kumar', duration: '7 days, 7 Nights', total: 91000, status: 'active', createdDate: '2024-01-15' },
    { id: '2', tripId: 'TRIP ID: 12668839', destination: 'Thailand', customerName: 'Priya Sharma', duration: '5 days, 4 Nights', total: 35000, status: 'active', createdDate: '2024-01-14' },
    { id: '3', tripId: 'TRIP ID: 12668900', destination: 'Dubai', customerName: 'Amit Patel', duration: '4 days, 3 Nights', total: 45000, status: 'active', createdDate: '2024-01-13' },
    { id: '4', tripId: 'TRIP ID: 12668901', destination: 'Singapore', customerName: 'Neha Gupta', duration: '6 days, 5 Nights', total: 55000, status: 'active', createdDate: '2024-01-12' },
    { id: '5', tripId: 'TRIP ID: 12668902', destination: 'Maldives', customerName: 'Rohit Singh', duration: '5 days, 4 Nights', total: 75000, status: 'active', createdDate: '2024-01-11' },
    { id: '6', tripId: 'TRIP ID: 12668903', destination: 'Japan', customerName: 'Kavya Reddy', duration: '8 days, 7 Nights', total: 95000, status: 'active', createdDate: '2024-01-10' },
    { id: '7', tripId: 'TRIP ID: 12668904', destination: 'Switzerland', customerName: 'Arjun Mehta', duration: '7 days, 6 Nights', total: 85000, status: 'active', createdDate: '2024-01-09' },
    { id: '8', tripId: 'TRIP ID: 12668905', destination: 'Bali', customerName: 'Shreya Jain', duration: '6 days, 5 Nights', total: 42000, status: 'active', createdDate: '2024-01-08' },
    { id: '9', tripId: 'TRIP ID: 12668906', destination: 'Paris', customerName: 'Vikram Kumar', duration: '5 days, 4 Nights', total: 68000, status: 'active', createdDate: '2024-01-07' },
    { id: '10', tripId: 'TRIP ID: 12668907', destination: 'London', customerName: 'Anita Sharma', duration: '6 days, 5 Nights', total: 72000, status: 'active', createdDate: '2024-01-06' },
  ];

  const filteredQuotes = sampleQuotes.filter(
    (quote) =>
      quote.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.tripId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseQuote = (quote: Quote) => {
    Alert.alert(
      'Use Quote',
      `Do you want to use the quote for ${quote.destination} (${quote.tripId})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Quote',
          onPress: () => {
            onUseQuote(quote);
            onClose();
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const QuoteCard = ({ quote }: { quote: Quote }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-blue-600 font-medium text-sm">{quote.tripId}</Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(quote.status)}`}>
          <Text className="text-xs font-medium capitalize">{quote.status}</Text>
        </View>
      </View>
      <Text className="text-lg font-bold text-gray-900 mb-1">{quote.destination}</Text>
      <Text className="text-gray-600 text-sm mb-1">{quote.customerName}</Text>
      <Text className="text-gray-500 text-sm mb-3">{quote.duration}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-bold text-purple-600">₹{quote.total.toLocaleString()}</Text>
        <TouchableOpacity
          onPress={() => handleUseQuote(quote)}
          className="bg-purple-600 rounded-lg px-4 py-2"
        >
          <Text className="text-white font-medium text-sm">Use this quote</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between p-4 pt-12">
            <Text className="text-xl font-bold text-gray-900">Last 10 Quotes</Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 rounded-full p-2"
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View className="px-4 pb-4">
            <Text className="text-gray-600 text-sm mb-1">👤 Rajesh Kumar</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center bg-blue-500 rounded-lg px-4 py-3">
            <Ionicons name="search" size={20} color="white" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Quotes"
              placeholderTextColor="rgba(255,255,255,0.7)"
              className="flex-1 ml-3 text-white"
            />
          </View>
        </View>

        {/* Quotes List */}
        <FlatList
          data={filteredQuotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <QuoteCard quote={item} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-lg mt-4">No quotes found</Text>
              <Text className="text-gray-400 text-sm mt-2">
                Try adjusting your search criteria
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

export default LastQuotesModal;
