import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from "axios";
import useLatestQuotation from './useLatestQuotation';

const useStatusChange = (initialStatus, quotationData) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const {
    latestQuotation,
    loading: isFetchingQuotation,
    error: quotationError,
    refreshQuotation,
  } = useLatestQuotation(quotationData?.TripId);
console.log(latestQuotation)
  useEffect(() => {
    if (quotationError) {
      console.log("❌ Quotation fetch error:", quotationError);
    }
  }, [quotationError]);

  const sendHandoverEmail = useCallback(async (quotation) => {
    if (!quotation) {
      console.log("⚠️ No quotation provided for handover email");
      return;
    }

    try {
      console.log("📤 Sending handover email with payload:", quotation);

      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/handovermail-manager",
        quotation
      );

      console.log("📨 Handover email sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.log(
        "🔥 Handover email error:",
        error?.response?.data || error?.message || error
      );
      throw error;
    }
  }, []);

  const updateStatus = useCallback(
    (newStatus) => {
      Alert.alert(
        "Confirm Status Change",
        `Are you sure you want to change status to ${newStatus}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              try {
                setIsLoading(true);

                console.log("📤 Sending status update:", {
                  TripId: quotationData?.TripId,
                  LeadId: quotationData?.LeadId,
                  LatestStatus: newStatus,
                  SalesStatus: newStatus,
                });

                const res = await axios.put(
                  "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote",
                  {
                    TripId: quotationData?.TripId,
                    LeadId: quotationData?.LeadId,
                    LatestStatus: newStatus,
                    SalesStatus: newStatus,
                  }
                );

                console.log("✅ Status update response:", res?.data);
                setStatus(newStatus);

                // ===========================
                // 🔥 Handover Email Logic
                // ===========================
                if (newStatus === "Converted") {
                  // 1️⃣ Pehle try karo already loaded latestQuotation
                  let quotationToSend = latestQuotation;

                  // 2️⃣ Agar null hai to force refresh
                  if (!quotationToSend) {
                    console.log(
                      "ℹ️ No cached quotation, fetching latest before email..."
                    );
                    quotationToSend = await refreshQuotation();
                  }

                  if (!quotationToSend) {
                    console.log(
                      "❌ Still no quotation after refresh, skipping email."
                    );
                    Alert.alert(
                      "Status Updated",
                      "Converted ho gaya, but quotation data nahi mila, email nahi bheja gaya."
                    );
                  } else {
                    try {
                      await sendHandoverEmail(quotationToSend);
                      Alert.alert(
                        "Success",
                        "Status Converted & handover email sent ✅"
                      );
                    } catch (emailError) {
                      console.log("❌ Handover email failed:", emailError);
                      Alert.alert(
                        "Status Updated",
                        "Converted ho gaya, but handover email fail ho gaya."
                      );
                    }
                  }
                } else {
                  Alert.alert("Success", `Status updated to ${newStatus}`);
                }

                console.log(`ℹ️ Status changed to ${newStatus}`, {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  quotationData,
                });
              } catch (error) {
                console.log("❌ Error updating status:", error);
                Alert.alert("Error", "Failed to update status. Please try again.");
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    },
    [quotationData, latestQuotation, refreshQuotation, sendHandoverEmail]
  );

  return {
    status,
    isLoading: isLoading || isFetchingQuotation, // ✅ button disable ke liye
    updateStatus,
    latestQuotation,
    refreshQuotation,
    quotationError,
  };
};

export default useStatusChange;
