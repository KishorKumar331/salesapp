


import React, { useState } from "react";
import {
  Alert,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import IntegratedQuotationForm from "@/components/form/IntegratedQuotationForm";
import { clearQuotationDraft } from "@/storage/quotationDrafts";
import PdfPreviewModal from "@/components/pdf/PdfPreviewModal";
import { getInstantHtmlPreview } from "../../utils/pdfUtils";
import { useUserProfile } from "@/hooks/useUserProfile";
import axios from "axios";

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, loading: userLoading } = useUserProfile();
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const leadData = params.leadData ? JSON.parse(params.leadData) : null;
  const followUpData = params.FollowleadData ? JSON.parse(params.FollowleadData) : null;
  console.log(followUpData, 'lllllll')
  console.log("👤 User data:", user);

  const handleFormSubmit = async (data) => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      console.log("📝 Generating HTML preview...", data);

      // 1️⃣ Merge user data with form data
      const dataWithUser = {
        ...data,
        user
      };

      // 2️⃣ Generate instant HTML preview with user data
      const result = getInstantHtmlPreview(dataWithUser);
      setPdfHtml(result.html);
      setPdfUri(null); // No PDF yet, only HTML
      setFormDataToSubmit(data); // Store form data for later submission
      setShowPdfModal(true);
      setRefreshKey((prev) => prev + 1);

      console.log("✅ HTML preview ready with user data");
      setIsPrinting(false);

      // Note: Actual submission will happen when user shares/downloads the PDF
    } catch (error) {
      console.error("❌ Error generating preview:", error);
      Alert.alert("Error", "Failed to generate preview. Please try again.");
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
        formDataToSubmit
      );

      console.log("✅ Quotation created:", res.data);

      const updateData = {
        TripId: res?.data?.TripId,
        Quotations: Array.isArray(leadData?.Quotations)
          ? [...leadData.Quotations, res.data.QuoteId]
          : [res.data.QuoteId],
        SalesStatus: "Cold",
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
          }
        }
      ]);
    } catch (error) {
      console.error("❌ Error submitting:", error);
      Alert.alert("Error", "Failed to submit quotation: " + (error?.message || error));
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
        key={refreshKey}
        visible={showPdfModal}
        pdfUri={pdfUri}
        pdfHtml={pdfHtml}
        onClose={handlePreviewClose}
        onShare={handleShare}
        clientName={
          followUpData?.["Client-Name"] ||
          leadData?.ClientLeadDetails?.FullName ||
          ""
        }
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
