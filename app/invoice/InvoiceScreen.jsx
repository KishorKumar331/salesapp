import React, { useState } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import InvoiceForm from "@/components/form/InvoiceForm";
import axios from "axios";

const InvoiceScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tripId = params.tripId || null;
  const invoiceData = params.invoiceData ? JSON.parse(params.invoiceData) : null;

  console.log("InvoiceScreen - TripId:", tripId);
  console.log("InvoiceScreen - Invoice Data:", invoiceData);

  const handleFormSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log("📝 Submitting invoice data...", data);

      // Add metadata
      const invoicePayload = {
        ...data,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        Status: "Pending",
        InvoiceNumber: `INV-${Date.now()}`, // Generate invoice number
        CompanyId: "12345", // TODO: Get from user context
      };

      // POST request to create invoice
      const res = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/invoices",
        invoicePayload
      );

      console.log("✅ Invoice created:", res.data);

      Alert.alert(
        "Success",
        "Invoice created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error creating invoice:", {
        error: error.message,
        response: error.response?.data,
      });

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to create invoice. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tripId && !invoiceData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No trip data available. Please select a trip first.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <InvoiceForm
        tripId={tripId || invoiceData?.TripId}
        onSubmit={handleFormSubmit}
        initialData={invoiceData}
      />

      {/* Loading Overlay */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Creating Invoice...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingBox: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
  },
});

export default InvoiceScreen;
