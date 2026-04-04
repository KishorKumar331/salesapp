import React, { useState } from "react";
import { Alert, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import IntegratedQuotationForm from "@/components/form/IntegratedQuotationForm";
import { clearQuotationDraft } from "@/storage/quotationDrafts";
import PdfPreviewModal from "@/components/pdf/PdfPreviewModal";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthManager";

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const leadData = params.leadData ? JSON.parse(params.leadData) : null;

  const followUpData = params.FollowleadData
    ? JSON.parse(params.FollowleadData)
    : null;

  const handleFormSubmit = async (data) => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      const dataWithUser = {
        ...data,
        company: user?.user?.company || user?.company
      };

      console.log("Data with user:", dataWithUser);
      // Call the new API endpoint to get HTML
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/packages-pdf-html",
        {
          mode: "html",
          type: "quotation",
          data: dataWithUser,
          templateName: user?.preferences?.quotationpdf || user?.Preference?.quotationpdf || user?.quotationpdf
        }
      );

      if (response.data) {
        console.log("HTML Content received from API");
        setPdfHtml(response.data);
        setPdfUri(null);
        setFormDataToSubmit({
          ...data,
          company: user?.user?.company || user?.company,
          CompanyEmail: user?.user?.Email || user?.Email,
        });
        setShowPdfModal(true);
        setRefreshKey((prev) => prev + 1);
        console.log("✅ HTML set for preview");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Error generating preview:", error);
      Alert.alert("Error", "Failed to generate preview. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePreviewClose = () => {
    setShowPdfModal(false);
    // Just close the modal, don't submit
  };

  const handleShare = async () => {
    // This runs when user clicks download/share button
    if (!formDataToSubmit) {
      Alert.alert("Error", "No quotation data to submit");
      return;
    }

    try {
      console.log("📤 Submitting quotation to API...");

      const res = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations",
        { ...formDataToSubmit, CompanyEmail: user?.user?.Email || user?.Email }
      );

      console.log("✅ Quotation created:", res.data);

      const updateData = {
        TripId: leadData?.TripId || followUpData?.TripId,
        CreatedAt: leadData?.CreatedAt || followUpData?.CreatedAt,
        company: leadData?.company || followUpData?.company,
        quotations: Array.isArray(leadData?.quotations) || Array.isArray(followUpData?.quotations)
          ? [...(leadData?.quotations || followUpData?.quotations || []), res.data.QuoteId]
          : [res.data.QuoteId],
        latestStatus: "Cold",
        latestQuotationId: res.data.QuoteId,
        LeadId: leadData?.LeadId || followUpData?.LeadId,
      };

      await axios.put(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote",
        updateData
      );

      await clearQuotationDraft(formDataToSubmit.TripId);

      Alert.alert("Success", "Quotation created and shared successfully!", [
        {
          text: "OK",
          onPress: () => {
            setShowPdfModal(false);
            router.replace("/(tabs)");
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Error submitting:", error);
      Alert.alert(
        "Error",
        "Failed to submit quotation: " + (error?.message || error)
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <IntegratedQuotationForm
        onSubmit={handleFormSubmit}
        lead={leadData}
        followUpData={followUpData}
      />

      {/* Loading Overlay */}
      {isPrinting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Preparing Preview...</Text>
          </View>
        </View>
      )}

      <PdfPreviewModal
        data={formDataToSubmit}
        key={refreshKey}
        visible={showPdfModal}
        pdfUri={pdfUri}
        pdfHtml={pdfHtml}
        onClose={handlePreviewClose}
        onShare={handleShare}
      />
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
});

export default QuotationScreen;
