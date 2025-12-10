import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from "axios";

const useStatusChange = (initialStatus, quotationData) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
console.log(quotationData)
 


  const sendHandoverEmail = useCallback(async (quotation) => {
    console.log(quotation,'testssdsd')
    if (!quotation) {
      return;
    }

    try {
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/handovermail-manager",
       {TripId:quotation?.TripId,
        QuoteId:quotation?.LatestQuotationId,
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
                    try {
                      console.log('handover runs')
                      await sendHandoverEmail(quotationData);
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
    [ sendHandoverEmail]
  );

  return {
    status,
    updateStatus,
  };
};

export default useStatusChange;
