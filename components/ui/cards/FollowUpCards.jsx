import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  PanResponder,
  Alert,
  TextInput,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import DocumentModal from "../DocumentModal";
import InvoiceListModal from "../InvoiceListModal";
import QuotationListModal from "../QuotationListModal";
import { router } from "expo-router";

const FollowUpCards = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [notes, setNotes] = useState(
    data?.Comments?.[0]?.Message || "No notes yet."
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

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
    } else if (action === "Quotations" || action === "Quotes & PDFs") {
      setIsQuotationModalVisible(true);
    } else {
      Alert.alert("Action", `${action} pressed`);
    }
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    Alert.alert("Success", "Notes saved successfully!");
  };

  return (
    <>
      <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden h-auto">
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
                    <Text className="text-gray-700 text-base font-medium">
                      {data["Client-Name"]}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => scrollToPage(1)}
                  className="bg-gray-100 rounded-full p-2"
                >
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-600 text-sm mb-1">Destination</Text>
              <Text className="text-gray-900 font-semibold mb-3">
                {data["Client-Destination"]}
              </Text>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Email</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Email"]}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Travel Date</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-TravelDate"]}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="text-gray-500 text-xs">Pax</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Pax"]}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Status</Text>
                  <Text className="text-green-600 font-medium">
                    {data.SalesStatus}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 text-sm mb-1">Budget</Text>
              <Text className="text-purple-600 text-2xl font-bold mb-4">
                ₹{data["Client-Budget"].toLocaleString()}
              </Text>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-blue-500 rounded-lg px-4 py-2 flex-1 mr-2"
                  onPress={() =>
                    Alert.alert("Call", data["Client-Contact"] || "No number")
                  }
                >
                  <Text className="text-white font-medium text-center">
                    Call Client
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2"
                  onPress={() =>
                    Alert.alert("Email", data["Client-Email"] || "No email")
                  }
                >
                  <Text className="text-white font-medium text-center">
                    Send Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2️⃣ Quick Actions */}
            <View style={{ width: cardWidth }} className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <TouchableOpacity
                  onPress={() => scrollToPage(0)}
                  className="bg-gray-100 rounded-full p-2"
                >
                  <Ionicons name="chevron-back" size={16} color="#6b7280" />
                </TouchableOpacity>

                <View className="flex-row-reverse items-center gap-3">
                  <View>
                    <Text className="text-gray-500 text-sm">
                      Trip #{data.TripId}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {data["Client-Name"]}
                    </Text>
                  </View>
                  <View className="bg-purple-100 rounded-full p-2">
                    <Ionicons name="person" size={20} color="#7c3aed" />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => scrollToPage(2)}
                  className="bg-gray-100 rounded-full p-2"
                >
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-lg font-bold text-gray-900 mb-6 text-center">
                Quick Actions
              </Text>

              <View className="space-y-3">
                <View className="flex-row justify-between space-x-2">
                  <TouchableOpacity
                    className="bg-purple-100 rounded-lg px-3 py-3 flex-1 mr-1"
                    onPress={() => handleActionPress("Quotes & PDFs")}
                  >
                    <View className="items-center">
                      <Ionicons
                        name="document-text"
                        size={20}
                        color="#7c3aed"
                      />
                      <Text className="text-purple-600 font-medium text-xs mt-1 text-center">
                        Quotes & PDFs
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-blue-100 rounded-lg px-3 py-3 flex-1 ml-1"
                    onPress={() => handleActionPress("Invoices")}
                  >
                    <View className="items-center">
                      <Ionicons name="receipt" size={20} color="#3b82f6" />
                      <Text className="text-blue-600 font-medium text-xs mt-1 text-center">
                        Invoices
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="flex-row mt-8 justify-between space-x-2">
                  <TouchableOpacity
                    className="bg-teal-100 rounded-lg px-3 py-3 flex-1 mr-1"
                    onPress={() => handleActionPress("Documents")}
                  >
                    <View className="items-center">
                      <Ionicons name="folder" size={20} color="#14b8a6" />
                      <Text className="text-teal-600 font-medium text-xs mt-1 text-center">
                        Documents
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 3️⃣ Notes */}
            <View style={{ width: cardWidth }} className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <TouchableOpacity
                  onPress={() => scrollToPage(1)}
                  className="bg-gray-100 rounded-full p-2"
                >
                  <Ionicons name="chevron-back" size={16} color="#6b7280" />
                </TouchableOpacity>

                <View className="flex-row-reverse items-center gap-3">
                  <View>
                    <Text className="text-gray-500 text-sm">
                      Trip #{data.TripId}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {data["Client-Name"]}
                    </Text>
                  </View>
                  <View className="bg-purple-100 rounded-full p-2">
                    <Ionicons name="person" size={20} color="#7c3aed" />
                  </View>
                </View>

                <View className="w-8" />
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-900">Notes</Text>
                <TouchableOpacity
                  onPress={() => setIsEditingNotes(!isEditingNotes)}
                  className="bg-purple-100 rounded-lg px-3 py-1"
                >
                  <Text className="text-purple-600 font-medium text-sm">
                    {isEditingNotes ? "Cancel" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-gray-50 rounded-lg p-3 flex-1">
                {isEditingNotes ? (
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={8}
                    className="text-gray-900 font-medium min-h-[12rem] text-sm"
                    placeholder="Add your notes here..."
                    textAlignVertical="top"
                  />
                ) : (
                  <Text className="text-gray-900 font-medium min-h-[12rem] text-sm">
                    {notes}
                  </Text>
                )}
              </View>

              {isEditingNotes && (
                <TouchableOpacity
                  onPress={handleSaveNotes}
                  className="bg-purple-600 rounded-lg py-3 mt-4"
                >
                  <Text className="text-white font-medium text-center">
                    Save Notes
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Page Indicator */}
        <View className="flex-row justify-center pb-3">
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentPage === index ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Modals */}
      <DocumentModal
        visible={isDocumentModalVisible}
        onClose={() => setIsDocumentModalVisible(false)}
      />
      <InvoiceListModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        tripId={data?.TripId}
        onCreateNew={() => {
          router.push({
            pathname: "/invoice/InvoiceScreen",
            params: {
              tripId: data?.TripId,
            },
          });
        }}
      />
      <QuotationListModal
        visible={isQuotationModalVisible}
        onClose={() => setIsQuotationModalVisible(false)}
        tripId={data?.TripId}
        onViewQuotation={(quotation) => {
          // Handle view quotation details
          Alert.alert('View Quotation', `Viewing details for: ${quotation.quotationNumber}`);
          // You can navigate to a detailed view or open a modal with more details
        }}
        onCreateNew={() => {
          // Handle create new quotation
          Alert.alert('Create New', 'Would open quotation creation form');
        }}
      />
    </>
  );
};

export default FollowUpCards;
