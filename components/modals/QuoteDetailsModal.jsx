import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DetailCard = ({ title, children, icon }) => (
  <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
    <View className="flex-row items-center mb-2">
      {icon && <View className="mr-2">{icon}</View>}
      <Text className="text-lg font-bold text-gray-800">{title}</Text>
    </View>
    {children}
  </View>
);

const DetailRow = ({ label, value, isLast = false }) => (
  <View className={`flex-row justify-between py-2 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <Text className="text-gray-600">{label}</Text>
    <Text className="text-gray-800 font-medium text-right flex-1 ml-4">{value || 'N/A'}</Text>
  </View>
);

export default function QuoteDetailsModal({ visible, onClose, quote }) {
  console.log(quote)
  if (!visible) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString; // Return as is if date parsing fails
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `₹${parseInt(amount).toLocaleString('en-IN')}`;
  };

  const renderSection = (title, content, icon = null) => (
    <DetailCard 
      title={title}
      icon={icon}
    >
      {content}
    </DetailCard>
  );

  const renderItineraryItem = (item, index) => (
    <View key={index} className="mb-6 last:mb-0">
      <View className="flex-row items-start mb-2">
        <View className="bg-purple-100 rounded-full w-6 h-6 items-center justify-center mr-2 mt-0.5">
          <Text className="text-purple-600 font-medium text-xs">{index + 1}</Text>
        </View>
        <Text className="text-base font-semibold text-gray-800 flex-1">
          {item.Title || `Day ${index + 1}`}
        </Text>
      </View>
      
      {item.ImageUrl && (
        <Image 
          source={{ uri: item.ImageUrl }} 
          className="w-full h-48 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}
      
      <View className="pl-8">
        {item.Date && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-2">
              {formatDate(item.Date)}
            </Text>
          </View>
        )}
        
        {item.Description && (
          <Text className="text-gray-700 text-sm mb-3">
            {item.Description.replace(/<[^>]*>?/gm, '')}
          </Text>
        )}
      </View>
    </View>
  );

  const renderHotel = (hotel, index) => (
    <View key={index} className="mb-4 last:mb-0">
      <Text className="font-medium text-gray-800">{hotel.Name} 
        {hotel.Category > 0 && (
          <Text className="text-yellow-500">{'★'.repeat(hotel.Category)}</Text>
        )}
      </Text>
      <Text className="text-sm text-gray-600">{hotel.City}</Text>
      <Text className="text-sm text-gray-600">
        {formatDate(hotel.CheckInDate)} - {formatDate(hotel.CheckOutDate)} • {hotel.Nights} Nights
      </Text>
      {hotel.RoomType && (
        <Text className="text-sm text-gray-600">Room: {hotel.RoomType}</Text>
      )}
      {hotel.Comments && (
        <Text className="text-sm text-gray-600 mt-1">Notes: {hotel.Comments}</Text>
      )}
    </View>
  );

  const renderInclusionExclusion = (type) => (
    <View className="flex-1">
      <Text className="font-medium text-gray-700 mb-2">
        {type === 'inclusions' ? '✓ Included' : '✗ Not Included'}
      </Text>
      <View className="bg-gray-50 p-3 rounded-lg">
        {quote[type === 'inclusions' ? 'Inclusions' : 'Exclusions']?.map((item, i) => (
          <View key={i} className="flex-row items-start mb-1">
            <Ionicons 
              name={type === 'inclusions' ? 'checkmark-circle' : 'close-circle'} 
              size={16} 
              color={type === 'inclusions' ? '#10b981' : '#ef4444'} 
              style={{ marginTop: 2, marginRight: 6 }}
            />
            <Text className="text-gray-700 text-sm flex-1">{item.item}</Text>
          </View>
        )) || <Text className="text-gray-500 text-sm">No {type} specified</Text>}
      </View>
    </View>
  );

  if (!quote) {
    return (
      <Modal visible={visible} onRequestClose={onClose}>
        <View className="flex-1 items-center justify-center bg-white p-6">
          <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-600 text-lg mt-4 text-center">
            No quote details available
          </Text>
          <TouchableOpacity 
            onPress={onClose}
            className="mt-6 bg-purple-100 px-6 py-3 rounded-lg"
          >
            <Text className="text-purple-600 font-medium">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
const inset=useSafeAreaInsets()
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View  className="flex-1  bg-gray-50">
        {/* Header */}
        <LinearGradient 
        
          colors={['#7c3aed', '#5b21b6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-4 py-4 pt-12"
        >
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-xl font-bold text-white">Quote #{quote.QuoteId}</Text>
              <Text className="text-sm text-purple-100">Trip ID: {quote.TripId || 'N/A'}</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              className="p-2 -mr-2"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-purple-100">Created: {formatDate(quote.CreatedAt)}</Text>
            {quote.Quotations && (
              <Text className="text-sm text-purple-100">Total Quotes: {quote.Quotations.length || 0}</Text>
            )}
          </View>
          {quote.SalesPersonEmail && (
            <Text className="text-sm text-purple-100 mt-1">Sales: {quote.SalesPersonEmail}</Text>
          )}
        </LinearGradient>

        <ScrollView className="flex-1 p-4">
          {/* Trip Summary */}
      
          {/* Contact Information */}
          {renderSection('Contact Information', (
            <View className="space-y-2">
              <DetailRow 
                label="Customer Name" 
                value={quote['Client-Name']} 
              />
              <DetailRow 
                label="Email" 
                value={quote['Client-Email']} 
              />
              <DetailRow 
                label="Phone" 
                value={quote['Client-Contact']} 
                isLast={true}
              />
            </View>
          ), <Ionicons name="person" size={20} color="#6366f1" />)}
    {renderSection('Trip Summary', (
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm text-gray-500">Destination</Text>
                  <Text className="text-base font-medium">{quote.DestinationName}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm text-gray-500">Travel Dates</Text>
                  <Text className="text-base font-medium">
                    {formatDate(quote.TravelDate)} - {formatDate(quote.TravelEndDate)}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-sm text-gray-500">Travelers</Text>
                  <Text className="text-base font-medium">
                    {quote.NoOfPax} Adults
                    {parseInt(quote.Child) > 0 && `, ${quote.Child} Children`}
                    {parseInt(quote.Infant) > 0 && `, ${quote.Infant} Infants`}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm text-gray-500">Duration</Text>
                  <Text className="text-base font-medium">
                    {quote.Days} Days / {quote.Nights} Nights
                  </Text>
                </View>
              </View>
              
              <View className="bg-blue-50 p-3 rounded-lg mt-2">
                <Text className="text-blue-800 text-center font-medium">
                  Total Package Price: {formatCurrency(quote.Costs?.TotalCost)}
                </Text>
              </View>
            </View>
          ), <Ionicons name="airplane" size={20} color="#6366f1" />)}

          {/* Itinerary */}
      
          {/* Hotels */}
      
          {/* Inclusions & Exclusions */}
        
          {/* Price Breakdown */}
          {quote.Costs && renderSection('Price Breakdown', (
            <View className="space-y-2">
              <DetailRow 
                label="Package Cost" 
                value={formatCurrency(quote.Costs.LandPackageCost)} 
              />
              <DetailRow 
                label="Flight Cost" 
                value={formatCurrency(quote.Costs.FlightCost)} 
              />
              <DetailRow 
                label="Visa Cost" 
                value={formatCurrency(quote.Costs.VisaCost)} 
              />
              {quote.Costs.GSTAmount > 0 && (
                <DetailRow 
                  label="GST" 
                  value={formatCurrency(quote.Costs.GSTAmount)} 
                />
              )}
              {quote.Costs.TCSAmount > 0 && (
                <DetailRow 
                  label="TCS" 
                  value={formatCurrency(quote.Costs.TCSAmount)} 
                />
              )}
              <View className="border-t border-gray-200 mt-2 pt-2">
                <DetailRow 
                  label="Total Amount" 
                  value={formatCurrency(quote.Costs.TotalCost)} 
                  isLast={true}
                />
              </View>
            </View>
          ), <Ionicons name="receipt" size={20} color="#6366f1" />)}

          <View className="h-8" /> {/* Bottom padding */}
        </ScrollView>

        {/* Footer Actions */}
        <View className="bg-white border-t border-gray-100 p-4 flex-row space-x-3">
          <TouchableOpacity 
            className="flex-1 bg-white border border-purple-600 py-3 rounded-lg items-center"
            onPress={onClose}
          >
            <Text className="text-purple-600 font-medium">Close</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-purple-600 py-3 rounded-lg items-center"
            onPress={() => {
              // Handle share or other action
            }}
          >
            <Text className="text-white font-medium">Share Quote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
