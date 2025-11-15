import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InvoiceForm from '@/components/form/InvoiceForm';

export default function CreateInvoiceScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState({
    TripId: params.tripId || '',
    CustomerDetails: {
      Name: params.customerName || '',
      Email: params.email || '',
      Contact: params.contact || '',
      Address: {
        Street: '',
        City: '',
        State: '',
        ZipCode: '',
        Country: '',
      },
    },
    Destination: params.destination || '',
    NumberOfTravelers: params.pax ? parseInt(params.pax) : 1,
    TravelDate: params.travelDate || new Date().toISOString().split('T')[0],
    Installments: [
      {
        InstallmentAmount: 0,
        InstallmentDate: new Date().toISOString().split('T')[0],
        Status: 'Pending',
      },
    ],
  });

  // Initialize form with any passed parameters
  useEffect(() => {
    if (params.tripId) {
      // If you need to fetch additional data, do it here
      // Example: fetchQuotations(params.tripId).then(quotes => {...});
    }
  }, [params.tripId]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // Here you would typically save the invoice to your backend
      console.log('Submitting invoice:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful submission, navigate back
      router.back();
      
      // Show success message
      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200 flex-row items-center">
        <View 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </View>
        <Text className="text-xl font-bold text-gray-900">
          Create New Invoice
        </Text>
      </View>

      {/* Invoice Form */}
      <ScrollView className="flex-1">
        <View className="p-4">
          <InvoiceForm 
            tripId={tripData.TripId}
            initialData={tripData}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </View>
      </ScrollView>
    </View>
  );
}
