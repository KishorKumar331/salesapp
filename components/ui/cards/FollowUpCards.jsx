
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { router } from 'expo-router';
import {
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
import DocumentModal from "../DocumentModal";
import InvoiceListModal from "../InvoiceListModal";
import useStatusChange from "@/hooks/useStatusChange";
import QuotationListModal from "../../modals/QuotationListModal";

const FollowUpCards = ({ data }) => {

  const [currentPage, setCurrentPage] = useState(0);

  const [notes, setNotes] = useState(
    data?.Comments?.[0]?.Message || "No notes yet."
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleCreateNewInvoice = () => {
    // Navigate to the create invoice screen with the trip ID
    router.push({
      pathname: "/invoices/create",
      params: { 
        tripId: data?.TripId,
        initialData: JSON.stringify(data) // Pass the trip data as initial data
      }
    });
    // Close the modal
    setIsInvoiceModalVisible(false);
  };

  // Use the useStatusChange hook with quotation data
  const { status, isLoading, updateStatus } = useStatusChange(
    data?.Status || 'New',
    data // Pass the full quotation data
  );

  const listRef = useRef(null);

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

  // Same pages as before
  const pages = useMemo(() => ["page1", "page2"], []);

  // Smooth scroll logic
  const scrollToPage = useCallback(
    (pageIndex) => {
      listRef.current?.scrollToOffset({
        offset: pageIndex * cardWidth,
        animated: true,
      });
      setCurrentPage(pageIndex);
    },
    [cardWidth]
  );

  // Detect visible page
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  // Action handler (your existing logic)
  const handleActionPress = (action) => {
    if (action === "Documents") setIsDocumentModalVisible(true);
    else if (action === "Invoices") setIsInvoiceModalVisible(true);
    else if (action === "Quotations" || action === "Quotes & PDFs")
      setIsQuotationModalVisible(true);
    else Alert.alert("Action", `${action} pressed`);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    Alert.alert("Success", "Notes saved successfully!");
  };

  // -------------------- MAIN RENDER ITEM --------------------

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ width: cardWidth }} className="p-4">
        {/* ------------------ PAGE 1 (Your EXACT UI) ------------------ */}
        {item === "page1" && (
          <View>
            {/* First Line: Name, Email, Contact with Call Icon */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="bg-purple-100 px-2 py-1 rounded">
                    <Text className="text-purple-800 text-xs font-bold">
                      Trip #{data.TripId || data.QuoteId?.split('-').slice(0, 4).join('-')}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-medium text-base mr-2">
                    {data.clientName || data["Client-Name"]}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {data.clientEmail || data["Client-Email"]}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => {
                      const phoneNumber = data.clientContact || data["Client-Contact"];
                      if (phoneNumber) {
                        Linking.openURL(`tel:${phoneNumber}`);
                      } else {
                        Alert.alert("No contact number available");
                      }
                    }}
                  >
                    <Ionicons name="call" size={16} color="#10B981" />
                    <Text className="text-green-500 ml-1">
                      {data.clientContact || data["Client-Contact"] || "No contact"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => scrollToPage(1)}
                className="bg-gray-100 rounded-full p-2 ml-2"
              >
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Second Line: Destination and Travel Info */}
            <View className="mb-3 bg-gray-50 p-2 rounded">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">From</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.departureCity || data["Client-DepartureCity"] || 'N/A'}
                  </Text>
                </View>
                <Ionicons className='relative right-5' name="arrow-forward" size={16} color="#6b7280" />
                <View className="flex-1 ml-2">
                  <Text className="text-gray-500 text-xs">To</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.destination || data["Client-Destination"] || data.DestinationName || 'N/A'}
                  </Text>
                </View>
                <View className=" flex-row justify-end">
                  <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons name="calendar" size={12} color="#3b82f6" style={{ marginRight: 4 }} />
                    <Text className="text-blue-700 font-semibold text-xs">
                      {new Date(data.travelDate || data["Client-TravelDate"]).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Travel Date */}

            </View>

            {/* Third Line: Budget and Travelers */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-gray-500 text-xs">Budget</Text>
                <Text className="text-purple-600 text-lg font-bold">
                  ₹{data.budget?.toLocaleString() || data["Client-Budget"]?.toLocaleString() || 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center space-x-4">
                <View className="mx-2">
                  <Text className="text-gray-500 text-xs">PAX</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.pax || data["Client-Adults"] || 0}
                  </Text>
                </View>
                <View className='mx-2'>
                  <Text className="text-gray-500 text-xs">Child</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.child || data["Client-Children"] || 0}
                  </Text>
                </View>
                <View className='mx-2'>
                  <Text className="text-gray-500 text-xs">Infants</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.infant || data["Client-Infants"] || 0}
                  </Text>
                </View>
              </View>
            </View>


          </View>
        )}

        {/* ------------------ PAGE 2 (Quick Actions SAME) ------------------ */}
        {item === "page2" && (
          <View>
            <View className="flex-row items-center mb-3">

              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="bg-purple-100 px-2 py-1 rounded">
                      <Text className="text-purple-800 text-xs font-bold">
                        Trip #{data.TripId || data.QuoteId?.split('-').slice(0, 4).join('-')}
                      </Text>
                    </View>
                    <View className="relative">
                      {/* Status Button */}
                      <TouchableOpacity
                        className={`flex-row items-center justify-between px-4 py-1 rounded-lg border ${status === 'Converted'
                          ? 'bg-green-50 border-green-200'
                          : status === 'Dumped'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                          }`}
                        onPress={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        disabled={isLoading}
                      >
                        <View className="flex-row items-center">
                          {status === 'Converted' && <Ionicons name="checkmark-circle" size={16} color="#10b981" style={{ marginRight: 6 }} />}
                          {status === 'Dumped' && <Ionicons name="close-circle" size={16} color="#ef4444" style={{ marginRight: 6 }} />}
                          <Text className={`font-medium text-sm ${status === 'Converted' ? 'text-green-700' :
                            status === 'Dumped' ? 'text-red-700' : 'text-gray-700'
                            }`}>
                            {status === 'Converted' ? 'Converted' :
                              status === 'Dumped' ? 'Dumped' : 'Change Status'}
                          </Text>
                        </View>
                        <Ionicons
                          name={isStatusDropdownOpen ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color="#6b7280"
                        />
                      </TouchableOpacity>

                      {/* Status Dropdown */}
                      {isStatusDropdownOpen && (
                        <View className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                          <TouchableOpacity
                            className="flex-row items-center px-4 py-3 border-b border-gray-100"
                            onPress={() => {
                              updateStatus('Converted');
                              setIsStatusDropdownOpen(false);
                            }}
                            disabled={isLoading || status === 'Converted'}
                          >
                            <Ionicons
                              name={status === 'Converted' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                              size={18}
                              color={status === 'Converted' ? '#10b981' : '#6b7280'}
                              style={{ marginRight: 8 }}
                            />
                            <Text className={`text-sm ${status === 'Converted' ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                              Converted
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-row items-center px-4 py-3"
                            onPress={() => {
                              updateStatus('Dumped');
                              setIsStatusDropdownOpen(false);
                            }}
                            disabled={isLoading || status === 'Dumped'}
                          >
                            <Ionicons
                              name={status === 'Dumped' ? 'close-circle' : 'close-circle-outline'}
                              size={18}
                              color={status === 'Dumped' ? '#ef4444' : '#6b7280'}
                              style={{ marginRight: 8 }}
                            />
                            <Text className={`text-sm ${status === 'Dumped' ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>
                              Dumped
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-900 font-medium text-base mr-2">
                      {data.clientName || data["Client-Name"]}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {data.clientEmail || data["Client-Email"]}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => {
                        const phoneNumber = data.clientContact || data["Client-Contact"];
                        if (phoneNumber) {
                          Linking.openURL(`tel:${phoneNumber}`);
                        } else {
                          Alert.alert("No contact number available");
                        }
                      }}
                    >
                      <Ionicons name="call" size={16} color="#10B981" />
                      <Text className="text-green-500 ml-1">
                        {data.clientContact || data["Client-Contact"] || "No contact"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
             
            </View>
            <View className="space-y-4 ">
              <View className='flex flex-row justify-between'>

                <TouchableOpacity
                  className="bg-purple-100 rounded-lg p-1 h-[2.8rem] flex-row items-center justify-center space-x-2 border border-purple-200 shadow-sm"
                  onPress={() => handleActionPress("Quotes & PDFs")}
                >
                  <Ionicons name="document-text" size={18} color="#7c3aed" />
                  <Text className="text-purple-700 font-semibold text-sm">
                    Quotes & PDFs
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-blue-100 rounded-lg p-3 flex-row items-center justify-center space-x-2 border border-blue-200 shadow-sm mb-4"
                  onPress={() => handleActionPress("Invoices")}
                >
                  <Ionicons name="receipt" size={18} color="#3b82f6" />
                  <Text className="text-blue-700 font-semibold text-sm">
                    Invoices
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <TouchableOpacity
                  className={`${status === 'Dumped' ? 'bg-red-100' : 'bg-purple-100'} rounded-lg px-3 py-4 flex-1 mt-4 ml-2`}
                  onPress={() => updateStatus('Dumped')}
                  disabled={isLoading || status === 'Dumped'}
                >
                  <View className="items-center">
                    {isLoading && status === 'Dumped' ? (
                      <ActivityIndicator size="small" color="#7c3aed" />
                    ) : (
                      <Text className={`${status === 'Dumped' ? 'text-red-600' : 'text-purple-600'} font-medium text-xs mt-1`}>
                        {status === 'Dumped' ? 'Dumped' : 'Dump'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity> */}


              {/* Notes Section - Collapsible */}
              <TouchableOpacity
                onPress={() => setIsEditingNotes(!isEditingNotes)}
                className="flex-row justify-between items-center mb-2 p-2 bg-gray-50 rounded-lg"
              >
                <Text className="text-gray-600 font-medium">
                  {isEditingNotes ? 'Hide Notes' : 'Add/View Notes'}
                </Text>
                <Ionicons
                  name={isEditingNotes ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#6b7280"
                />
              </TouchableOpacity>

              {isEditingNotes && (
                <View className="bg-gray-50 rounded-lg p-3 mb-4">
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    placeholder="Type your notes here..."
                    className="text-gray-900 min-h-[100px] p-2 border border-gray-200 rounded"
                  />
                  <View className="flex-row justify-end mt-2 space-x-2">
                    <TouchableOpacity
                      onPress={() => {
                        setIsEditingNotes(false);
                        setNotes(data?.Comments?.[0]?.Message || ""); // Reset to original notes
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      <Text className="text-gray-700 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveNotes}
                      className="px-4 py-2 bg-purple-600 rounded-lg"
                    >
                      <Text className="text-white font-medium">Save Notes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            <View /></View>
        )}

      </View>
    );
  };

  return (
    <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden">
      <FlatList
        ref={listRef}
        data={pages}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        snapToInterval={cardWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: cardWidth,
          offset: cardWidth * index,
          index,
        })}
      />

      {/* Page indicator dots */}
      <View className="flex-row justify-center pb-3">
        {pages.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${currentPage === i ? "bg-purple-600" : "bg-gray-300"}`}
          />
        ))}
      </View>

      {/* Modals */}
      <DocumentModal
        visible={isDocumentModalVisible}
        onClose={() => setIsDocumentModalVisible(false)}
      />

      <InvoiceListModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        data={data}
        onCreateNew={handleCreateNewInvoice}
      />

      <QuotationListModal
        visible={isQuotationModalVisible}
        onClose={() => setIsQuotationModalVisible(false)}
        tripId={data?.TripId}
        data={data}
      />
    </View>
  );
};

export default FollowUpCards;
