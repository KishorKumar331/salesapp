import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QuotationModal from '../QuotationModal';
import LastQuotesModal from '../LastQuotesModal';

const QuotationCards = ({ leadData }) => {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = useMemo(() => screenWidth - 32, [screenWidth]); // margins
  const listRef = useRef(null);

  const [page, setPage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLastQuotesModalVisible, setIsLastQuotesModalVisible] = useState(false);

  const pages = useMemo(() => ['main', 'details'], []);

  const scrollToPage = useCallback((idx) => {
    listRef.current?.scrollToOffset({ offset: idx * cardWidth, animated: true });
    setPage(idx);
  }, [cardWidth]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length) {
      const i = viewableItems[0].index || 0;
      setPage(i);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const QuotaionButton = React.useMemo(
    () => () => (
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => setIsLastQuotesModalVisible(true)}
          className="bg-purple-100 rounded-lg px-4 py-2 flex-1 mr-2"
        >
          <Text className="text-purple-600 font-medium text-center">Last 10 Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // Generate a truly unique TripId using lead data + timestamp + random
            const uniqueId = leadData?.TripId || 
              leadData?.id || 
              leadData?._id || 
              `${leadData?.['Client-Contact'] || 'LEAD'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Convert lead data to the format expected by the form
            const formattedLeadData = {
              TripId: uniqueId,
              LeadId:leadData?.LeadId,
              Quotations:leadData?.Quotations,
              ClientLeadDetails: {
                FullName: leadData?.['Client-Name'] || '',
                Contact: leadData?.['Client-Contact'] || '',
                Email: leadData?.['Client-Email'] || '',
                TravelDate: leadData?.['Client-TravelDate'] || '',
                Pax: leadData?.['Client-Pax'] || '1',
                Child: leadData?.['Client-Child'] || '0',
                Infant: '0',
                Budget: leadData?.['Client-Budget'] || '',
                DepartureCity: leadData?.['Client-DepartureCity'] || '',
                DestinationName: leadData?.['Client-Destination'] || '',
                Days: leadData?.['Client-Days'] || 2,
              },
              AssignDate: new Date().toISOString().split('T')[0],
            };
            
            router.push({
              pathname: '/(tabs)/QuotationScreen',
              params: { 
                leadData: JSON.stringify(formattedLeadData)
              }
            });
          }}
          className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2"
        >
          <Text className="text-white font-medium text-center">Create Quote</Text>
        </TouchableOpacity>
      </View>
    ),
    [router, leadData]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <View style={{ width: cardWidth }} className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          {index === 1 ? (
            <TouchableOpacity onPress={() => scrollToPage(0)} className="bg-gray-100 rounded-full p-2">
              <Ionicons name="chevron-back" size={16} color="#6b7280" />
            </TouchableOpacity>
          ) : <View className="w-8" />}

          <View className="flex gap-[1rem] flex-row items-center">
            <View className="bg-purple-100 rounded-full p-2">
              <Ionicons name="airplane" size={20} color="#7c3aed" />
            </View>
            <View className="flex flex-col">
              <Text className="text-gray-500 text-sm">
                {leadData?.CompanyId || 'Lead'} - {leadData?.SalesStatus || 'New'}
              </Text>
              <Text className="text-gray-500 text-sm">
                {leadData?.['Client-Name'] || 'Unknown Client'}
              </Text>
            </View>
          </View>

          {index === 0 ? (
            <TouchableOpacity onPress={() => scrollToPage(1)} className="bg-gray-100 rounded-full p-2">
              <Ionicons name="chevron-forward" size={16} color="#6b7280" />
            </TouchableOpacity>
          ) : <View className="w-8" />}
        </View>

        {/* Body */}
        {item === 'main' ? (
          <>
            <Text className="text-gray-600 text-sm mb-1">Contact</Text>
            <Text className="text-gray-900 font-semibold mb-3">
              {leadData?.['Client-Contact'] || 'No contact'}
            </Text>

            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-gray-500 text-xs">Destination</Text>
                <Text className="text-gray-900 font-medium">
                  {leadData?.['Client-Destination'] || 'Not specified'}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Departure</Text>
                <Text className="text-gray-900 font-medium">
                  {leadData?.['Client-DepartureCity'] || 'Not specified'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-500 text-xs">Adults</Text>
                <Text className="text-gray-900 font-medium">{leadData?.['Client-Pax'] || 0}</Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Children</Text>
                <Text className="text-gray-900 font-medium">{leadData?.['Client-Child'] || 0}</Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Days</Text>
                <Text className="text-gray-900 font-medium">{leadData?.['Client-Days'] || 0}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-500 text-xs">Travel Date</Text>
                <Text className="text-gray-900 font-medium">
                  {leadData?.['Client-TravelDate']
                    ? new Date(leadData['Client-TravelDate']).toLocaleDateString()
                    : 'Not set'}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Lead Source</Text>
                <Text className="text-gray-900 font-medium">{leadData?.LeadSource || 'Unknown'}</Text>
              </View>
            </View>

            <Text className="text-gray-600 text-sm mb-1">Budget</Text>
            <Text className="text-purple-600 text-2xl font-bold mb-4">
              {leadData?.['Client-Budget'] > 0
                ? `₹${Number(leadData['Client-Budget']).toLocaleString()}`
                : 'Budget not specified'}
            </Text>

            <QuotaionButton />
          </>
        ) : (
          <>
            <View className="bg-gray-50 rounded-lg p-3 mb-4">
              <Text className="text-gray-600 text-sm mb-2">Email</Text>
              <Text className="text-gray-900 font-medium">
                {leadData?.['Client-Email'] || 'No email provided'}
              </Text>
            </View>

            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-600 text-sm mb-2">Comments</Text>
              <Text className="text-gray-900 font-medium min-h-[6rem]">
                {leadData?.Comments?.length
                  ? String(leadData.Comments[leadData.Comments.length - 1]?.Message ?? '')
                  : 'No comments available'}
              </Text>
            </View>

            <QuotaionButton />
          </>
        )}
      </View>
    ),
    [cardWidth, leadData, scrollToPage]
  );

  return (
    <>
      <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden">
        <FlatList
          ref={listRef}
          data={pages}
          keyExtractor={(k) => k}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={cardWidth}
          decelerationRate="fast"
          disableIntervalMomentum
          getItemLayout={(data, i) => ({ length: cardWidth, offset: cardWidth * i, index: i })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          // Helps with nested vertical parents on Android:
          nestedScrollEnabled
          // Helps avoid diagonal scroll conflicts:
          directionalLockEnabled
          scrollEventThrottle={16}
        />

        {/* Page dots */}
        <View className="flex-row justify-center pb-3">
          <View className={`w-2 h-2 rounded-full mx-1 ${page === 0 ? 'bg-purple-600' : 'bg-gray-300'}`} />
          <View className={`w-2 h-2 rounded-full mx-1 ${page === 1 ? 'bg-purple-600' : 'bg-gray-300'}`} />
        </View>
      </View>

      <QuotationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={() => setIsModalVisible(false)}
        initialData={{
          customerName: leadData?.['Client-Name'] || '',
          contactNumber: leadData?.['Client-Contact'] || '',
          destination: leadData?.['Client-Destination'] || '',
          departure: leadData?.['Client-DepartureCity'] || '',
          adults: String(leadData?.['Client-Pax'] ?? '0'),
          children: String(leadData?.['Client-Child'] ?? '0'),
          budget: '0',
        }}
      />

      <LastQuotesModal
        visible={isLastQuotesModalVisible}
        onClose={() => setIsLastQuotesModalVisible(false)}
        onUseQuote={(q) => {
          // keep Alert but ensure it’s not huge text
        }}
      />
    </>
  );
};

export default QuotationCards;
