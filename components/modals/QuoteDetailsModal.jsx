import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PdfPreviewModal from "../pdf/PdfPreviewModal";
import axios from "axios";

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
  <View
    className={`flex-row justify-between py-2 ${!isLast ? "border-b border-gray-100" : ""
      }`}
  >
    <Text className="text-gray-600">{label}</Text>
    <Text className="text-gray-800 font-medium text-right flex-1 ml-4">
      {value || "N/A"}
    </Text>
  </View>
);

export default function QuoteDetailsModal({ visible, onClose, quote, user }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!visible) return null;

  const onViewQuotation = async (quotation) => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/packages-pdf-html",
        {
          mode: "html",
          quoteId: quotation.QuoteId,
          tripId: quotation.TripId,
          type: "quotation",

        }
      );

      if (response.data) {
        setPdfHtml(response.data);
        setPdfUri(null);
        setShowPdfModal(true);
        setRefreshKey((prev) => prev + 1);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      Alert.alert(
        "Error",
        "Failed to load quotation preview. Please try again."
      );
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePreviewClose = () => {
    setShowPdfModal(false);
    setPdfHtml(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString; // Return as is if date parsing fails
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return `₹${parseInt(amount).toLocaleString("en-IN")}`;
  };

  const renderSection = (title, content, icon = null) => (
    <DetailCard title={title} icon={icon}>
      {content}
    </DetailCard>
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
  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <View className="flex-1  bg-gray-50">
          {/* Header */}
          <LinearGradient
            colors={["#7c3aed", "#5b21b6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 py-4 pt-12"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-xl font-bold text-white">
                  Quote #{quote.QuoteId}
                </Text>
                <Text className="text-sm text-purple-100">
                  Trip ID: {quote.TripId || "N/A"}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-purple-100">
                Created: {formatDate(quote.CreatedAt)}
              </Text>
              {quote.Quotations && (
                <Text className="text-sm text-purple-100">
                  Total Quotes: {quote.Quotations.length || 0}
                </Text>
              )}
            </View>
            {quote.SalesPersonEmail && (
              <Text className="text-sm text-purple-100 mt-1">
                Sales: {quote.SalesPersonEmail}
              </Text>
            )}
          </LinearGradient>

          <ScrollView className="flex-1 p-4">
            {/* Trip Summary */}
            {/* Contact Information */}
            {renderSection(
              "Contact Information",
              <View className="space-y-2">
                <DetailRow label="Customer Name" value={quote["Client-Name"]} />
                <DetailRow label="Email" value={quote["Client-Email"]} />
                <DetailRow
                  label="Phone"
                  value={quote["Client-Contact"]}
                  isLast={true}
                />
              </View>,
              <Ionicons name="person" size={20} color="#6366f1" />
            )}
            {renderSection(
              "Trip Summary",
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm text-gray-500">Destination</Text>
                    <Text className="text-base font-medium">
                      {quote.DestinationName}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-gray-500">Travel Dates</Text>
                    <Text className="text-base font-medium">
                      {formatDate(quote.TravelDate)} -{" "}
                      {formatDate(quote.TravelEndDate)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm text-gray-500">Travelers</Text>
                    <Text className="text-base font-medium">
                      {quote.NoOfPax} Adults
                      {parseInt(quote.Child) > 0 && `, ${quote.Child} Children`}
                      {parseInt(quote.Infant) > 0 &&
                        `, ${quote.Infant} Infants`}
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
                    Total Package Price:{" "}
                    {formatCurrency(quote.Costs?.TotalCost)}
                  </Text>
                </View>
              </View>,
              <Ionicons name="airplane" size={20} color="#6366f1" />
            )}
            {/* Itinerary */}
            {/* Hotels */}
            {/* Inclusions & Exclusions */}
            {/* Price Breakdown */}
            {quote.Costs &&
              renderSection(
                "Price Breakdown",
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
                </View>,
                <Ionicons name="receipt" size={20} color="#6366f1" />
              )}
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
              onPress={() => onViewQuotation(quote)}
              disabled={isPrinting}
            >
              {isPrinting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">Share Quote</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PdfPreviewModal
        key={refreshKey}
        visible={showPdfModal}
        pdfUri={pdfUri}
        pdfHtml={pdfHtml}
        onClose={handlePreviewClose}
        onShare={() => {
          // Implement share functionality if needed
          Alert.alert("Share", "Share functionality would go here");
        }}
      />
    </>
  );
}
