import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function QuotationListModal({
  visible,
  onClose,
  tripId,
  onViewQuotation,
  onCreateNew,
}) {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    if (visible && tripId) {
      fetchQuotations();
    }
  }, [visible, tripId]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations?TripId=${tripId}`
      );

      if (!response.ok) throw new Error("Failed to fetch quotations");

      const data = await response.json();

      const sorted = Array.isArray(data)
        ? data.sort(
            (a, b) =>
              new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
          )
        : [];

      setQuotations(sorted);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Failed to load quotations.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "sent":
        return { bg: "bg-blue-100", text: "text-blue-800" };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  const getStatusText = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Draft";

  const latest = quotations[0];
  const previous = quotations.slice(1);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-purple-600 p-4 pt-12 rounded-b-3xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-bold">Journey Routers</Text>
            <TouchableOpacity onPress={onClose} className="bg-white/20 p-2 rounded-full">
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/80 text-sm mt-2">Quotation Management</Text>
        </View>

        {/* Content */}
        <View className="flex-1 p-4">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text className="mt-3 text-gray-600">Loading quotations...</Text>
            </View>
          ) : error ? (
            <Text className="text-center text-red-500 mt-6">{error}</Text>
          ) : quotations.length === 0 ? (
            <Text className="text-center text-gray-500 mt-6">No quotations found.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Latest */}
              {latest && (
                <View className="bg-white p-4 mb-4 rounded-xl border border-purple-300">
                  <Text className="text-xs text-gray-500 mb-1 font-medium">
                    LATEST QUOTATION
                  </Text>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-purple-600 font-bold text-lg">
                      {latest.QuoteId}
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        getStatusColor(latest.LastUpdateStatus?.UpdatedBy).bg
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          getStatusColor(latest.LastUpdateStatus?.UpdatedBy).text
                        }`}
                      >
                        {getStatusText(latest.LastUpdateStatus?.UpdatedBy)}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gray-900 font-semibold text-lg">
                    ₹
                    {latest.Costs?.TotalCost?.toLocaleString("en-IN") ||
                      latest.Budget?.toLocaleString("en-IN") ||
                      0}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-1">
                    Destination: {latest.DestinationName}
                  </Text>

                  <Text className="text-gray-500 text-xs">
                    {latest["Client-Name"]} • {latest["Client-Contact"]}
                  </Text>

                  <View className="flex-row justify-end mt-3 space-x-3">
                    <TouchableOpacity
                      className="bg-blue-100 p-2 rounded-full"
                      onPress={() => onViewQuotation(latest)}
                    >
                      <Ionicons name="eye" size={18} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-gray-100 p-2 rounded-full"
                      onPress={() => {
                        console.log('Opening latest quotation:', latest.QuoteId);
                        onClose();
                        setTimeout(() => {
                          router.push({
                            pathname: '/(tabs)/QuotationScreen',
                            params: { 
                              FollowleadData: JSON.stringify(latest)
                            }
                          });
                        }, 100);
                      }}
                    >
                      <Ionicons name="document-text" size={18} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Toggle Previous */}
              {previous.length > 0 && !showPrevious && (
                <TouchableOpacity
                  onPress={() => setShowPrevious(true)}
                  className="bg-gray-100 p-3 rounded-lg items-center"
                >
                  <Text className="text-purple-600 font-medium">
                    Show Previous Quotations ({previous.length})
                  </Text>
                </TouchableOpacity>
              )}

              {/* Previous Quotations */}
              {showPrevious && (
                <View className="mt-4">
                  <Text className="text-xs text-gray-500 mb-2 font-medium">
                    PREVIOUS QUOTATIONS
                  </Text>

                  {previous.map((q) => (
                    <View
                      key={q.QuoteId}
                      className="bg-white p-4 mb-3 rounded-xl border border-gray-200"
                    >
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-800 font-semibold">
                          {q.QuoteId}
                        </Text>
                        <View
                          className={`px-3 py-1 rounded-full ${
                            getStatusColor(q.LastUpdateStatus?.UpdatedBy).bg
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              getStatusColor(q.LastUpdateStatus?.UpdatedBy).text
                            }`}
                          >
                            {getStatusText(q.LastUpdateStatus?.UpdatedBy)}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-gray-900 font-bold text-lg mb-1">
                        ₹
                        {q.Costs?.TotalCost?.toLocaleString("en-IN") ||
                          q.Budget?.toLocaleString("en-IN") ||
                          0}
                      </Text>
                      <Text className="text-gray-500 text-sm mb-1">
                        Destination: {q.DestinationName}
                      </Text>
                      <Text className="text-gray-500 text-xs mb-2">
                        {q["Client-Name"]} • {q["Client-Contact"]}
                      </Text>

                      <View className="flex-row justify-end mt-1 space-x-3">
                        <TouchableOpacity
                          className="bg-blue-100 p-2 rounded-full"
                          onPress={() => onViewQuotation(q)}
                        >
                          <Ionicons name="eye" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="bg-gray-100 p-2 rounded-full"
                          onPress={() => {
                            console.log('Opening quotation:', q.QuoteId);
                            onClose();
                            setTimeout(() => {
                              router.push({
                                pathname: '/(tabs)/QuotationScreen',
                                params: { 
                                  FollowleadData: JSON.stringify(q)
                                }
                              });
                            }, 100);
                          }}
                        >
                          <Ionicons name="document-text" size={18} color="#6b7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => setShowPrevious(false)}
                    className="bg-gray-100 p-3 rounded-lg items-center mt-2"
                  >
                    <Text className="text-purple-600 font-medium">
                      Hide Previous Quotations
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
