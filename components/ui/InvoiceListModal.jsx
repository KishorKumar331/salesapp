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

export default function InvoiceListModal({
  visible,
  onClose,
  tripId,
  onCreateNew,
}) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && tripId) {
      fetchInvoices();
    }
  }, [visible, tripId]);

  const fetchInvoices = async () => {
    if (!tripId) {
      setError("Trip ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/invoices?TripId=${tripId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any required authentication headers here
            // 'Authorization': `Bearer ${yourAuthToken}`
          },
        }
      );

      let responseData;
      const contentType = response.headers.get('content-type');
      
      // Handle different response types
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          throw new Error(`Unexpected response format: ${text.substring(0, 100)}...`);
        }
      }

      if (!response.ok) {
        // Handle API error responses
        const errorMessage = responseData?.message || 
                            responseData?.error || 
                            `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle different possible response structures
      let invoicesData = [];
      
      if (Array.isArray(responseData)) {
        invoicesData = responseData;
      } else if (responseData && typeof responseData === 'object') {
        // Handle case where data is nested under a property
        const possibleDataKeys = ['data', 'items', 'invoices', 'results'];
        for (const key of possibleDataKeys) {
          if (Array.isArray(responseData[key])) {
            invoicesData = responseData[key];
            break;
          }
        }
      }

      // Sort invoices by creation date (newest first)
      const sortedInvoices = [...invoicesData].sort((a, b) => {
        const dateA = a.CreatedAt || a.createdAt || a.date || 0;
        const dateB = b.CreatedAt || b.createdAt || b.date || 0;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      setInvoices(sortedInvoices);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message || "Failed to load invoices. Please try again later.");
      setInvoices([]); // Clear any previous data on error
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
      case "overdue":
        return { bg: "bg-red-100", text: "text-red-800" };
      case "partial":
        return { bg: "bg-blue-100", text: "text-blue-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  const getStatusText = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Draft";

  const latest = invoices[0];
  const previous = invoices.slice(1);

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
          <Text className="text-white/80 text-sm mt-2">Invoice Management</Text>
        </View>

        {/* Content */}
        <View className="flex-1 p-4">
          {/* Create New Invoice Button */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              setTimeout(() => onCreateNew(), 100);
            }}
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-2">Create New Invoice</Text>
          </TouchableOpacity>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text className="mt-2 text-gray-600">Loading invoices...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center p-6">
              <View className="bg-red-50 p-4 rounded-full mb-4">
                <Ionicons name="alert-circle" size={32} color="#ef4444" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">Couldn't load invoices</Text>
              <Text className="text-red-600 text-center mb-6">{error}</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={onClose}
                  className="border border-gray-300 px-6 py-2 rounded-lg"
                >
                  <Text className="text-gray-700">Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={fetchInvoices}
                  className="bg-purple-600 px-6 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : invoices.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
              <Text className="text-center text-gray-500 mt-4">No invoices found.</Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Create your first invoice to get started
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Latest Invoice */}
              {latest && (
                <View className="bg-white p-4 mb-4 rounded-xl border border-purple-300">
                  <Text className="text-xs text-gray-500 mb-1 font-medium">
                    LATEST INVOICE
                  </Text>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-purple-600 font-bold text-lg">
                      {latest.InvoiceNumber || latest.InvoiceId}
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        getStatusColor(latest.Status).bg
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          getStatusColor(latest.Status).text
                        }`}
                      >
                        {getStatusText(latest.Status)}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gray-900 font-semibold text-lg">
                    ₹{latest.TotalAmount?.toLocaleString("en-IN") || 0}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-1">
                    Destination: {latest.Destination}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {latest.CustomerDetails?.Name} • {latest.CustomerDetails?.Contact}
                  </Text>

                  <View className="flex-row justify-end mt-3 space-x-3">
                    <TouchableOpacity
                      className="bg-blue-100 p-2 rounded-full"
                      onPress={() => {
                        // TODO: View invoice PDF
                        console.log("View invoice:", latest.InvoiceId);
                      }}
                    >
                      <Ionicons name="eye" size={18} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-gray-100 p-2 rounded-full"
                      onPress={() => {
                        console.log("Opening invoice:", latest.InvoiceId);
                        onClose();
                        setTimeout(() => {
                          router.push({
                            pathname: "/invoice/InvoiceScreen",
                            params: {
                              invoiceData: JSON.stringify(latest),
                            },
                          });
                        }, 100);
                      }}
                    >
                      <Ionicons name="document-text" size={18} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Previous Invoices */}
              {previous.length > 0 && (
                <View className="mt-4">
                  <Text className="text-xs text-gray-500 mb-2 font-medium">
                    PREVIOUS INVOICES
                  </Text>

                  {previous.map((invoice) => (
                    <View
                      key={invoice.InvoiceId}
                      className="bg-white p-4 mb-3 rounded-xl border border-gray-200"
                    >
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-800 font-semibold">
                          {invoice.InvoiceNumber || invoice.InvoiceId}
                        </Text>
                        <View
                          className={`px-3 py-1 rounded-full ${
                            getStatusColor(invoice.Status).bg
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              getStatusColor(invoice.Status).text
                            }`}
                          >
                            {getStatusText(invoice.Status)}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-gray-900 font-bold text-lg mb-1">
                        ₹{invoice.TotalAmount?.toLocaleString("en-IN") || 0}
                      </Text>
                      <Text className="text-gray-500 text-sm mb-1">
                        Destination: {invoice.Destination}
                      </Text>
                      <Text className="text-gray-500 text-xs mb-2">
                        {invoice.CustomerDetails?.Name} • {invoice.CustomerDetails?.Contact}
                      </Text>

                      <View className="flex-row justify-end mt-1 space-x-3">
                        <TouchableOpacity
                          className="bg-blue-100 p-2 rounded-full"
                          onPress={() => {
                            console.log("View invoice:", invoice.InvoiceId);
                          }}
                        >
                          <Ionicons name="eye" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="bg-gray-100 p-2 rounded-full"
                          onPress={() => {
                            console.log("Opening invoice:", invoice.InvoiceId);
                            onClose();
                            setTimeout(() => {
                              router.push({
                                pathname: "/invoice/InvoiceScreen",
                                params: {
                                  invoiceData: JSON.stringify(invoice),
                                },
                              });
                            }, 100);
                          }}
                        >
                          <Ionicons name="document-text" size={18} color="#6b7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
