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


  const sendHandoverEmail = useCallback(async (quotation) => {
    if (!quotation) {
      return;
    }

    try {
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/handovermail-manager",
        quotation
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
                const res = await axios.put(
                  "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote",
                  {
                    TripId: quotationData?.TripId,
                    LeadId: quotationData?.LeadId,
                    LatestStatus: newStatus,
                    SalesStatus: newStatus,
                  }
                );

                setStatus(newStatus);
                if (newStatus === "Converted") {
                  let quotationToSend = latestQuotation;
                  if (!quotationToSend) {
                    quotationToSend = await refreshQuotation();
                  }
                  if (!quotationToSend) {
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
                      Alert.alert(
                        "Status Updated",
                        "Converted ho gaya, but handover email fail ho gaya."
                      );
                    }
                  }
                } else {
                  Alert.alert("Success", `Status updated to ${newStatus}`);
                }

           
              } catch (error) {
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
