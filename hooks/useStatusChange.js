import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from "axios";
import { useAuth } from "../components/auth/AuthManager";

const useStatusChange = (initialStatus, quotationData) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const sendHandoverEmail = useCallback(async (quotation) => {
    console.log(quotation)
    debugger
    if (!quotation) {
      return;
    }

    try {
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/handovermail-manager",
        {
          TripId: quotation?.TripId,
          QuoteId: quotation?.latestQuotationId,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "🔥 Handover email error:",
        error?.response?.data || error?.message || error
      );
      throw error;
    }
  }, []);

  const performStatusUpdate = useCallback(
    async (newStatus) => {
      try {
        setIsLoading(true);
        const res = await axios.put(
          "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote",
          {
            company: user?.user?.company || user?.company,
            CreatedAt: quotationData?.CreatedAt,
            TripId: quotationData?.TripId,
            LeadId: quotationData?.LeadId,
            latestStatus: newStatus,
          }
        );

        setStatus(newStatus);

        if (newStatus === "Converted") {
          try {
            console.log('handover runs');
            await sendHandoverEmail(quotationData);
            Alert.alert("Success", "Status Converted & handover email sent ✅");
          } catch (_emailError) {
            Alert.alert("Warning", "Status Updated: Converted successfully, but handover email failed to send.");
          }
        } else {
          Alert.alert("Success", `Status updated to ${newStatus}`);
        }
      } catch (error) {
        console.error("Status update error:", error);
        Alert.alert("Error", "Failed to update status. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [sendHandoverEmail, quotationData, user]
  );

  const updateStatus = useCallback(
    (newStatus) => {
      Alert.alert(
        "Confirm Status Change",
        `Are you sure you want to change status to ${newStatus}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes, Change",
            onPress: () => performStatusUpdate(newStatus),
          },
        ],
        { cancelable: true }
      );
    },
    [performStatusUpdate]
  );

  return {
    status,
    isLoading,
    updateStatus,
  };
};

export default useStatusChange;
