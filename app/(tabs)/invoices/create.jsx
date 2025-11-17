import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import InvoiceForm from '@/components/form/InvoiceForm';

export default function CreateInvoiceScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [tripData, setTripData] = useState({
    tripId: params.tripId || '',
    customer: {
      name: params.customerName || '',
      email: params.email || '',
      contact: params.contact || '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
    destination: params.destination || '',
    pax: params.pax ? parseInt(params.pax) : 1,
    travelDate: params.travelDate || new Date().toISOString().split('T')[0],
    payment: {
      installments: [
        {
          installmentAmount: 0,
          installmentDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
        },
      ],
    },
  });

  // Parse initialData if provided for editing
  useEffect(() => {
    if (params.initialData) {
      try {
        const parsedData = JSON.parse(params.initialData);
        setInitialData(parsedData);
        // Update tripData with the parsed initialData
        setTripData(prev => ({
          ...prev,
          ...parsedData,
          tripId: parsedData.tripId || params.tripId || '',
          customer: {
            ...prev.customer,
            ...parsedData.customer,
            address: {
              ...prev.customer?.address,
              ...parsedData.customer?.address
            }
          },
          payment: {
            ...prev.payment,
            ...parsedData.payment,
            installments: parsedData.payment?.installments || prev.payment.installments
          }
        }));
      } catch (error) {
        console.error('Error parsing initialData:', error);
      }
    }
  }, [params.initialData]);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50">
        <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            {params.isEdit ? 'Edit Invoice' : 'Create Invoice'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          <InvoiceForm 
            tripId={tripData.tripId}
            onSubmit={handleSubmit}
            initialData={initialData || tripData}
            defaultCustomerName={tripData.customer?.name}
            defaultEmail={tripData.customer?.email}
            defaultContact={tripData.customer?.contact}
            defaultDestination={tripData.destination}
            defaultPax={tripData.pax?.toString()}
            defaultTravelDate={tripData.travelDate}
          />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
