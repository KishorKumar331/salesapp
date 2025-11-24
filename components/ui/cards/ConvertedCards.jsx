import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  PanResponder, 
  Alert, 
  TextInput,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DocumentModal from '../DocumentModal';
import InvoiceListModal from '../InvoiceListModal';
import QuotationListModal from '../QuotationListModal';
import useStatusChange from '@/hooks/useStatusChange';

const ConvertedCards = ({ data, onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [notes, setNotes] = useState(data?.Comments?.[0]?.Message || "No notes yet.");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

  const { status, isLoading, updateStatus } = useStatusChange(
    data?.SalesStatus || 'Converted',
    data
  );

  const scrollToPage = (pageIndex) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: pageIndex * cardWidth,
        animated: true,
      });
      setCurrentPage(pageIndex);
    }
  };

  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const pageIndex = Math.round(contentOffset.x / cardWidth);
    setCurrentPage(pageIndex);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      if (dx > 50 && currentPage > 0) {
        scrollToPage(currentPage - 1);
      } else if (dx < -50 && currentPage < 2) {
        scrollToPage(currentPage + 1);
      }
    },
  });

  const handleActionPress = (action) => {
    if (action === "Documents") {
      setIsDocumentModalVisible(true);
    } else if (action === "Invoices") {
      setIsInvoiceModalVisible(true);
    } else if (action === "Quotations") {
      setIsQuotationModalVisible(true);
    } else {
      Alert.alert("Action", `${action} pressed`);
    }
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    Alert.alert("Success", "Notes saved successfully!");
  };

  const handleStatusUpdate = async (newStatus) => {
    await updateStatus(newStatus);
    if (onStatusChange) onStatusChange();
  };

  return (
    <>
      <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden">
        <View {...panResponder.panHandlers}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
          >
            {/* 1️⃣ Customer Info */}
            <View style={{ width: cardWidth }} className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="bg-purple-100 rounded-full p-2">
                    <Ionicons name="person" size={20} color="#7c3aed" />
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm">
                      Trip #{data.TripId}
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {data["Client-Name"]}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row gap-2">
                  <TouchableOpacity className="bg-gray-100 rounded-full p-2">
                    <Ionicons name="call" size={16} color="#4b5563" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-gray-100 rounded-full p-2">
                    <Ionicons name="chatbubbles" size={16} color="#4b5563" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Email</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Email"] || 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Contact</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Contact"] || 'N/A'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Destination</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Destination"] || 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Travel Date</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-TravelDate"] || 'N/A'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Pax</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Pax"] || '0'}A {data["Client-Child"] || '0'}C
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Budget</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Budget"] ? `₹${Number(data["Client-Budget"]).toLocaleString()}` : 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Status</Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-800 text-xs font-medium">
                      {status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between mt-4 mb-3">
                {['Documents', 'Invoices', 'Quotations'].map((action) => (
                  <TouchableOpacity
                    key={action}
                    onPress={() => handleActionPress(action)}
                    className="items-center"
                  >
                    <View className="bg-purple-100 p-2 rounded-lg">
                      <Ionicons 
                        name={
                          action === 'Documents' ? 'document-text' : 
                          action === 'Invoices' ? 'receipt' : 'document-attach'
                        } 
                        size={20} 
                        color="#7c3aed" 
                      />
                    </View>
                    <Text className="text-purple-600 font-medium text-xs mt-1">
                      {action}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 2️⃣ Notes and Status */}
            <View style={{ width: cardWidth }} className="p-4">
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-700 font-medium">Notes</Text>
                  {isEditingNotes ? (
                    <TouchableOpacity onPress={handleSaveNotes}>
                      <Text className="text-purple-600 font-medium">Save</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setIsEditingNotes(true)}>
                      <Ionicons name="pencil" size={16} color="#7c3aed" />
                    </TouchableOpacity>
                  )}
                </View>
                
                {isEditingNotes ? (
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    className="bg-gray-50 p-3 rounded-lg text-gray-700"
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                  />
                ) : (
                  <View className="bg-gray-50 p-3 rounded-lg">
                    <Text className="text-gray-700">{notes}</Text>
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Update Status</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['Converted', 'In Progress', 'Completed'].map((statusOption) => (
                    <TouchableOpacity
                      key={statusOption}
                      onPress={() => handleStatusUpdate(statusOption)}
                      className={`px-3 py-1.5 rounded-full ${
                        status === statusOption 
                          ? 'bg-purple-600' 
                          : 'bg-gray-100'
                      }`}
                      disabled={isLoading}
                    >
                      <Text 
                        className={`text-sm font-medium ${
                          status === statusOption ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {statusOption}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Page indicators */}
          <View className="flex-row justify-center pb-3">
            {[0, 1].map((i) => (
              <View 
                key={i}
                className={`w-2 h-2 rounded-full mx-1 ${currentPage === i ? 'bg-purple-600' : 'bg-gray-300'}`}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Modals */}
      <DocumentModal
        visible={isDocumentModalVisible}
        onClose={() => setIsDocumentModalVisible(false)}
        tripId={data?.TripId}
      />
      
      <InvoiceListModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        tripId={data?.TripId}
      />
      
      <QuotationListModal
        visible={isQuotationModalVisible}
        onClose={() => setIsQuotationModalVisible(false)}
        tripId={data?.TripId}
      />
    </>
  );
};

export default ConvertedCards;
