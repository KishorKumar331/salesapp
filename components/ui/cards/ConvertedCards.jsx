import { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FetchQuoteByTripID } from '@/api/leads/FetchLeads';
import useStatusChange from '@/hooks/useStatusChange';
import QuoteDetailsModal from '../../modals/QuoteDetailsModal';

const ConvertedCards = ({ data, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;
  const { status } = useStatusChange(data?.SalesStatus || 'Converted', data);

  const fetchLatestQuote = async () => {
    if (!data?.TripId) return;

    setIsLoading(true);
    try {
      const response = await FetchQuoteByTripID(data.TripId);
      console.log(response)
      if (response?.data?.length > 0) {
        const latestQuote = response.data[0];
        setQuoteDetails(latestQuote);
        setIsModalVisible(true);
      } else {
        Alert.alert('No Quotes', 'No quotes found for this trip.');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      Alert.alert('Error', 'Failed to fetch quote details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQuote = () => {
    if (!isLoading) {
      fetchLatestQuote();
    }
  };

  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const pageIndex = Math.round(contentOffset.x / cardWidth);
    setCurrentPage(pageIndex);
  };

  return (
    <>
      <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-gray-300 border border-gray-100 mb-4">
        <View>
       
            {/* 1️⃣ Customer Info */}
            <View style={{ width: cardWidth }} className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="bg-purple-100 rounded-full p-2">
                    <Ionicons name="person" size={20} color="#7c3aed" />
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm">
                      Trip #{data.TripId}
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {data["Client-Name"]}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row gap-2">
                  <TouchableOpacity className="bg-gray-100 rounded-full p-2">
                    <Ionicons name="call" size={16} color="#4b5563" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-gray-100 rounded-full p-2">
                    <Ionicons name="chatbubbles" size={16} color="#4b5563" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Email</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Email"] || 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Contact</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Contact"] || 'N/A'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Destination</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Destination"] || 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Travel Date</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-TravelDate"] || 'N/A'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-gray-500 text-xs">Pax</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Pax"] || '0'}A {data["Client-Child"] || '0'}C
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Budget</Text>
                  <Text className="text-gray-900 font-medium">
                    {data["Client-Budget"] ? `₹${Number(data["Client-Budget"]).toLocaleString()}` : 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">Status</Text>
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-800 text-xs font-medium">
                      {status}
                    </Text>
                  </View>
                </View>
              </View>


            </View>
            
            {/* View More Button */}
         
               <TouchableOpacity 
              onPress={handleViewQuote}
              className="flex-row items-center justify-center py-3 border-t border-gray-100"
            >
              <Text className="text-purple-600 font-medium mr-2">View Quote Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#7c3aed" />
            </TouchableOpacity>

        </View>
      </View>

      {/* Quote Details Modal */}
      <QuoteDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        quote={{...quoteDetails, ...data}}
      />
    </>
  );
};

export default ConvertedCards;
