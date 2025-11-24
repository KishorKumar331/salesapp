import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import axios from "axios"
const useStatusChange = (initialStatus, quotationData) => {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = useCallback((newStatus) => {
        // Show confirmation dialog
        Alert.alert(
            'Confirm Status Change',
            `Are you sure you want to change status to ${newStatus}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                     

                        try {
                               console.log("Sending Payload:", {
                            TripId: quotationData?.TripId,
                            LeadId: quotationData?.LeadId,
                            LatestStatus: newStatus
                        });
                            setIsLoading(true);
                            const res = await axios.put(`https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote`, {
                                TripId: quotationData?.TripId,
                                LeadId: quotationData?.LeadId,
                                LatestStatus: newStatus,
                                SalesLeadStatus:newStatus,
                            })

                            console.log(res?.data) 

                            setStatus(newStatus);

                            // Log the status change with all quotation data
                            console.log(`Status changed to ${newStatus}`, {
                                status: newStatus,
                                timestamp: new Date().toISOString(),
                                quotationData
                            });

                            Alert.alert('Success', `Status updated to ${newStatus}`);

                            if (newStatus === 'Converted') {
                                console.log('Converted - All quotation data:', quotationData);
                            } else if (newStatus === 'Dumped') {
                                console.log('Dumped - All quotation data:', quotationData);
                            }

                            return true;
                        } catch (error) {
                            console.error('Error updating status:', error);
                            Alert.alert('Error', 'Failed to update status. Please try again.');
                            return false;
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    }, []);

    return {
        status,
        isLoading,
        updateStatus,
    };
};

export default useStatusChange;
