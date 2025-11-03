import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuotationFormProps {
  onClose: () => void;
  onSubmit: (data: QuotationData) => void;
  initialData?: Partial<QuotationData>;
}

interface QuotationData {
  customerName: string;
  contactNumber: string;
  email: string;
  destination: string;
  departure: string;
  departureDate: string;
  returnDate: string;
  adults: string;
  children: string;
  budget: string;
  notes: string;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  onClose,
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<QuotationData>({
    customerName: initialData.customerName || '',
    contactNumber: initialData.contactNumber || '',
    email: initialData.email || '',
    destination: initialData.destination || '',
    departure: initialData.departure || '',
    departureDate: initialData.departureDate || '',
    returnDate: initialData.returnDate || '',
    adults: initialData.adults || '1',
    children: initialData.children || '0',
    budget: initialData.budget || '',
    notes: initialData.notes || '',
  });

  const handleInputChange = (field: keyof QuotationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.customerName.trim()) {
      Alert.alert('Error', 'Customer name is required');
      return;
    }
    if (!formData.contactNumber.trim()) {
      Alert.alert('Error', 'Contact number is required');
      return;
    }
    if (!formData.destination.trim()) {
      Alert.alert('Error', 'Destination is required');
      return;
    }

    onSubmit(formData);
  };

  const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    numberOfLines?: number;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`border border-gray-300 rounded-lg px-3 py-3 text-gray-900 ${
          multiline ? 'h-20' : 'h-12'
        }`}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p- border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">New Quotation</Text>
        <TouchableOpacity
          onPress={onClose}
          className="bg-gray-100 rounded-full p-2"
        >
          <Ionicons name="close" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Customer Information */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Customer Information
          </Text>
          
          <FormField
            label="Customer Name *"
            value={formData.customerName}
            onChangeText={(text) => handleInputChange('customerName', text)}
            placeholder="Enter customer name"
          />

          <FormField
            label="Contact Number *"
            value={formData.contactNumber}
            onChangeText={(text) => handleInputChange('contactNumber', text)}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
          />

          <FormField
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />
        </View>

        {/* Trip Information */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Trip Information
          </Text>

          <FormField
            label="Destination *"
            value={formData.destination}
            onChangeText={(text) => handleInputChange('destination', text)}
            placeholder="Enter destination"
          />

          <FormField
            label="Departure From"
            value={formData.departure}
            onChangeText={(text) => handleInputChange('departure', text)}
            placeholder="Enter departure city"
          />

          <View className="flex-row space-x-2 mb-4">
            <View className="flex-1 mr-2">
              <FormField
                label="Departure Date"
                value={formData.departureDate}
                onChangeText={(text) => handleInputChange('departureDate', text)}
                placeholder="DD/MM/YYYY"
              />
            </View>
            <View className="flex-1 ml-2">
              <FormField
                label="Return Date"
                value={formData.returnDate}
                onChangeText={(text) => handleInputChange('returnDate', text)}
                placeholder="DD/MM/YYYY"
              />
            </View>
          </View>

          <View className="flex-row space-x-2 mb-4">
            <View className="flex-1 mr-2">
              <FormField
                label="Adults"
                value={formData.adults}
                onChangeText={(text) => handleInputChange('adults', text)}
                placeholder="Number of adults"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1 ml-2">
              <FormField
                label="Children"
                value={formData.children}
                onChangeText={(text) => handleInputChange('children', text)}
                placeholder="Number of children"
                keyboardType="numeric"
              />
            </View>
          </View>

          <FormField
            label="Budget"
            value={formData.budget}
            onChangeText={(text) => handleInputChange('budget', text)}
            placeholder="Enter budget amount"
            keyboardType="numeric"
          />
        </View>

        {/* Additional Information */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </Text>

          <FormField
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => handleInputChange('notes', text)}
            placeholder="Enter any special requirements or notes"
            multiline={true}
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-gray-100 rounded-lg py-3 mr-2"
          >
            <Text className="text-gray-700 font-medium text-center">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 bg-purple-600 rounded-lg py-3 ml-2"
          >
            <Text className="text-white font-medium text-center">
              Create Quotation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QuotationForm;
