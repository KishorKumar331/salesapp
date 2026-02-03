import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FetchQuoteByTripID } from "../../api/leads/FetchLeads";
import PdfPreviewModal from "../pdf/PdfPreviewModal";
import axios from "axios";



// Header
const QuotationHeader = ({ onClose }) => {
  return (
    <View className="bg-purple-600 p-4 pt-12 rounded-b-3xl">
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-xl font-bold">Journey Routers</Text>
        <TouchableOpacity onPress={onClose} className="bg-white/20 p-2 rounded-full">
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-white/80 text-sm mt-2">Quotation Management</Text>
    </View>
  )
}


export default function QuotationListModal({
  visible,
  onClose,
  tripId,
  user,
}) {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const latest = quotations[0];
  const previous = quotations.slice(1);

  const handlePreviewClose = () => {
    setShowPdfModal(false);
    setPdfHtml(null);
  };




  const fetchQuotations = async (id) => {
    try {
      if (!id) {
        throw new Error('No trip ID provided');
      }

      setLoading(true);
      setError(null);

      const response = await FetchQuoteByTripID(id);

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const data = Array.isArray(response.data) ? response.data : [];

      const sorted = data.sort(
        (a, b) => new Date(b.CreatedAt || 0).getTime() - new Date(a.CreatedAt || 0).getTime()
      );

      setQuotations(sorted);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Failed to load quotations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && tripId) {
      fetchQuotations(tripId);
    }
  }, [visible, tripId]);



    const onViewQuotation = async (quotation) => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      const response = await axios.post(
        'https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/packages-pdf-html',
        {
          renderOnly: true,
          data: {
            ...quotation,
            user
          }
        }
      );

      if (response.data) {
        setPdfHtml(response.data);
        setPdfUri(null);
        setFormDataToSubmit(quotation);
        setShowPdfModal(true);
        setRefreshKey(prev => prev + 1);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      Alert.alert("Error", "Failed to load quotation preview. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-gray-50">
        <QuotationHeader onClose={onClose} />

        {/* Content */}
        <View className="flex-1 p-4">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text className="mt-3 text-gray-600">Loading quotations...</Text>
            </View>
          ) : error ? (
            <Text className="text-center text-red-500 mt-6">{error}</Text>
          ) : quotations.length === 0 ? (
            <Text className="text-center text-gray-500 mt-6">No quotations found.</Text>
          ) : (
            <FlatList
              data={[]}
              keyExtractor={(_, index) => `empty-${index}`}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  {latest && (
                    <View className="bg-white p-4 mb-4 rounded-xl border border-purple-300">
                      <Text className="text-xs text-gray-500 mb-1 font-medium">
                        LATEST QUOTATION
                      </Text>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-purple-600 font-bold text-lg">
                          {latest.QuoteId}
                        </Text>
                        <View className="flex-row space-x-2">
                          <TouchableOpacity
                            className="bg-blue-100 p-2 rounded-full"
                            onPress={() => onViewQuotation(latest)}
                            disabled={isPrinting}
                          >
                            {isPrinting ? (
                              <ActivityIndicator size="small" color="#3b82f6" />
                            ) : (
                              <Ionicons name="eye" size={18} color="#3b82f6" />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="bg-gray-100 p-2 rounded-full"
                            onPress={() => {
                              onClose();
                              router.push({
                                pathname: '/(tabs)/QuotationScreen',
                                params: {
                                  FollowleadData: JSON.stringify(latest)
                                }
                              });
                            }}
                          >
                            <Ionicons name="document-text" size={18} color="#6b7280" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text className="text-gray-900 font-semibold text-lg mt-2">
                        ₹{latest.Costs?.TotalCost?.toLocaleString("en-IN") || '0'}
                      </Text>
                    </View>
                  )}
                </>
              }
              ListFooterComponent={
                <>
                  {previous.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setShowPrevious(!showPrevious)}
                      className="flex-row items-center justify-center py-3 mb-4"
                    >
                      <Text className="text-purple-600 font-medium mr-1">
                        {showPrevious ? 'Hide' : 'Show'} Previous Quotations ({previous.length})
                      </Text>
                      <Ionicons
                        name={showPrevious ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#7c3aed"
                      />
                    </TouchableOpacity>
                  )}
                  {showPrevious && previous.map((quotation) => (
                    <View
                      key={quotation.QuoteId}
                      className="bg-white p-4 mb-4 rounded-xl border border-gray-200"
                    >
                      <Text className="text-xs text-gray-500 mb-1 font-medium">
                        PREVIOUS QUOTATION
                      </Text>
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-gray-700 font-semibold">
                            {quotation.QuoteId}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            {new Date(quotation.CreatedAt).toLocaleDateString()}
                          </Text>
                        </View>
                        <View className="flex-row space-x-2">
                          <TouchableOpacity
                            className="bg-blue-100 p-2 rounded-full"
                            onPress={() => onViewQuotation(quotation)}
                          >
                            <Ionicons name="eye" size={18} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="bg-gray-100 p-2 rounded-full"
                            onPress={() => {
                              onClose();
                              router.push({
                                pathname: '/(tabs)/QuotationScreen',
                                params: {
                                  FollowleadData: JSON.stringify(quotation)
                                }
                              });
                            }}
                          >
                            <Ionicons name="document-text" size={18} color="#6b7280" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text className="text-gray-900 font-semibold mt-2">
                        ₹{quotation.Costs?.TotalCost?.toLocaleString("en-IN") || '0'}
                      </Text>
                    </View>
                  ))}
                </>
              }
              renderItem={null}
            />
          )}
            <PdfPreviewModal
              key={refreshKey}
              visible={showPdfModal}
              pdfUri={pdfUri}
              pdfHtml={pdfHtml}
              onClose={handlePreviewClose}
              onShare={() => {
                // Implement share functionality if needed
                Alert.alert("Info", "Share functionality would go here");
              }}
            />
        </View>
      </View>
    </Modal>
  );
}
