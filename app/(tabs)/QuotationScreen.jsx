import { useAuth } from "@/components/auth/AuthManager";
import IntegratedQuotationForm from "@/components/form/IntegratedQuotationForm";
import PdfPreviewModal from "@/components/pdf/PdfPreviewModal";
import { clearQuotationDraft } from "@/storage/quotationDrafts";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("Params in QuotationScreen:", params);
  const { user } = useAuth();
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  console.log(pdfUri)
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  // Reconstruct leadData from flat params
  const leadData = useMemo(() => {
    if (!params.tripId) return null;

    // Parse nested object if it exists, otherwise use flat params
    const details = params.clientLeadDetails
      ? JSON.parse(params.clientLeadDetails)
      : {
        FullName: params.clientName || '',
        Contact: params.clientContact || '',
        Email: params.clientEmail || '',
        TravelDate: params.travelDate || '',
        Pax: params.pax || '1',
        Child: params.child || '0',
        Infant: params.infant || '0',
        Budget: params.budget || '',
        DepartureCity: params.departureCity || '',
        DestinationName: params.destination || '',
        Days: params.days || '2',
      };

    return {
      TripId: params.tripId,
      LeadId: params.leadId,
      AssignDate: params.assignDate,
      Quotations: params.quotations ? JSON.parse(params.quotations) : [],
      CreatedAt: params.createdAt || '',
      ClientLeadDetails: details
    };
  }, [params]);

  console.log("📥 Reconstructed leadData:", leadData);

  const followUpData = useMemo(() => {
    return params.FollowleadData ? JSON.parse(params.FollowleadData) : null;
  }, [params.FollowleadData]);

  const handleFormSubmit = async (data) => {
    console.log(data)
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      const dataWithUser = {
        ...data,
        company: user?.user?.company
      };

      console.log("Data with user:", dataWithUser);
      // Pdf Api
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
          company: user?.user?.company,
          CompanyEmail: user?.user?.Email,
        });
        setShowPdfModal(true);
        setRefreshKey((prev) => prev + 1);
        console.log("✅ HTML set for preview");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Error generating preview:", error);
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
      return;
    }

    try {

      const res = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations",
        { ...formDataToSubmit, CompanyEmail: user?.user?.Email, company: user?.user?.company }
      );

      console.log("✅ Quotation created:", res.data);

      const updateData = {
        CreatedAt: leadData?.CreatedAt ?? followUpData?.tripdata?.CreatedAt,
        TripId: leadData?.TripId || followUpData?.TripId,
        company: user?.user?.company,
        quotations: [
          ...(
            Array.isArray(leadData?.Quotations)
              ? leadData.Quotations
              : Array.isArray(followUpData?.tripdata?.quotations)
                ? followUpData?.tripdata?.quotations
                : []
          ),
          res.data.QuoteId
        ],
        latestStatus: "Cold",
        latestQuotationId: res.data.QuoteId,
        LeadId: leadData?.LeadId || followUpData?.LeadId,
      };

      await axios.put(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote",
        updateData
      );

      await clearQuotationDraft(formDataToSubmit.TripId);

      router.replace("/");
    } catch (error) {
      console.error("❌ Error submitting:", error);

    }
  };


  return (
    <View style={{ flex: 1 }}>
      <IntegratedQuotationForm
        key={leadData?.TripId || followUpData?.QuoteId || "new-form"}
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
