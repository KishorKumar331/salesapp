import React, { useMemo, useRef, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  Alert,
  TextInput,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QuotationModal from '../QuotationModal';
import LastQuotesModal from '../LastQuotesModal';
import DocumentModal from '../DocumentModal';
import InvoiceListModal from '../InvoiceListModal';
import QuotationListModal from '../QuotationListModal';
import useStatusChange from '@/hooks/useStatusChange';

const QuotationCards = ({ leadData, onStatusChange }) => {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = useMemo(() => screenWidth - 32, [screenWidth]);
  const listRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLastQuotesModalVisible, setIsLastQuotesModalVisible] = useState(false);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  const [notes, setNotes] = useState(leadData?.Comments?.[0]?.Message || "No notes yet.");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Use the useStatusChange hook
  const { status, isLoading, updateStatus } = useStatusChange(
    leadData?.Status || 'New',
    leadData
  );

  const pages = useMemo(() => ['page1', 'page2'], []);

  const scrollToPage = useCallback((pageIndex) => {
    listRef.current?.scrollToOffset({
      offset: pageIndex * cardWidth,
      animated: true,
    });
    setCurrentPage(pageIndex);
  }, [cardWidth]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      if (dx > 50 && currentPage > 0) {
        scrollToPage(currentPage - 1);
      } else if (dx < -50 && currentPage < pages.length - 1) {
        scrollToPage(currentPage + 1);
      }
    },
  }), [currentPage, pages.length, scrollToPage]);

  const handleActionPress = (action) => {
    if (action === "Documents") setIsDocumentModalVisible(true);
    else if (action === "Invoices") setIsInvoiceModalVisible(true);
    else if (action === "Quotations" || action === "Quotes & PDFs") setIsQuotationModalVisible(true);
    else Alert.alert("Action", `${action} pressed`);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    Alert.alert("Success", "Notes saved successfully!");
  };

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
              LeadId: leadData?.LeadId,
              Quotations: leadData?.Quotations,
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

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={{ width: cardWidth }} className="p-4">
        {item === 'page1' ? (
          <>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View className="bg-purple-100 rounded-full p-2">
                  <Ionicons name="person" size={20} color="#7c3aed" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Trip #{leadData.TripId}</Text>
                  <Text className="text-gray-900 font-medium">{leadData['Client-Name']}</Text>
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

            {/* Customer Info */}
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-gray-500 text-xs">Email</Text>
                <Text className="text-gray-900 font-medium">{leadData['Client-Email'] || 'N/A'}</Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Contact</Text>
                <Text className="text-gray-900 font-medium">{leadData['Client-Contact'] || 'N/A'}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-gray-500 text-xs">Destination</Text>
                <Text className="text-gray-900 font-medium">{leadData['Client-Destination'] || 'N/A'}</Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Travel Date</Text>
                <Text className="text-gray-900 font-medium">{leadData['Client-TravelDate'] || 'N/A'}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-gray-500 text-xs">Pax</Text>
                <Text className="text-gray-900 font-medium">
                  {leadData['Client-Pax'] || '0'}A {leadData['Client-Child'] || '0'}C
                </Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Budget</Text>
                <Text className="text-gray-900 font-medium">
                  {leadData['Client-Budget'] 
                    ? `₹${Number(leadData['Client-Budget']).toLocaleString()}`
                    : 'N/A'}
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

            {/* Action Buttons */}
            <View className="flex-row justify-between mt-4 mb-3">
              {['Documents', 'Invoices', 'Quotations'].map((action) => (
                <TouchableOpacity
                  key={action}
                  onPress={() => handleActionPress(action)}
                  className="items-center"
                >
                  <View className="bg-purple-100 p-2 rounded-lg">
                    <Ionicons 
                      name={
                        action === 'Documents' ? 'document-text' : 
                        action === 'Invoices' ? 'receipt' : 'document-attach'
                      } 
                      size={20} 
                      color="#7c3aed" 
                    />
                  </View>
                  <Text className="text-purple-600 font-medium text-xs mt-1">
                    {action}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <QuotaionButton />
          </>
        ) : (
          <View>
            {/* Second page content - Notes and Status Update */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-medium">Notes</Text>
                {isEditingNotes ? (
                  <TouchableOpacity onPress={handleSaveNotes}>
                    <Text className="text-purple-600 font-medium">Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsEditingNotes(true)}>
                    <Ionicons name="pencil" size={16} color="#7c3aed" />
                  </TouchableOpacity>
                )}
              </View>
              
              {isEditingNotes ? (
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  className="bg-gray-50 p-3 rounded-lg text-gray-700"
                  style={{ minHeight: 100, textAlignVertical: 'top' }}
                />
              ) : (
                <View className="bg-gray-50 p-3 rounded-lg">
                  <Text className="text-gray-700">{notes}</Text>
                </View>
              )}
            </View>

            {/* Status Update Section */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Update Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {['New', 'In Progress', 'Quoted', 'Converted', 'Lost'].map((statusOption) => (
                  <TouchableOpacity
                    key={statusOption}
                    onPress={() => updateStatus(statusOption).then(() => {
                      if (onStatusChange) onStatusChange();
                    })}
                    className={`px-3 py-1.5 rounded-full ${
                      status === statusOption 
                        ? 'bg-purple-600' 
                        : 'bg-gray-100'
                    }`}
                    disabled={isLoading}
                  >
                    <Text 
                      className={`text-sm font-medium ${
                        status === statusOption ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {statusOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="bg-gray-50 rounded-lg p-3 mb-4">
              <Text className="text-gray-600 text-sm mb-2">Contact Email</Text>
              <Text className="text-gray-900 font-medium">
                {leadData?.['Client-Email'] || 'No email provided'}
              </Text>
            </View>

            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-600 text-sm mb-2">Comments</Text>
              <Text className="text-gray-900 font-medium min-h-[4rem]">
                {leadData?.Comments?.length
                  ? String(leadData.Comments[leadData.Comments.length - 1]?.Message ?? '')
                  : 'No comments yet'}
              </Text>
            </View>

            <QuotaionButton />
          </View>
        )}
      </View>
    ),
    [cardWidth, leadData, status, isLoading, notes, isEditingNotes, updateStatus, onStatusChange]
  );

  return (
    <>
      <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden" {...panResponder.panHandlers}>
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
          nestedScrollEnabled
          directionalLockEnabled
          scrollEventThrottle={16}
        />

        {/* Page dots */}
        <View className="flex-row justify-center pb-3">
          {pages.map((_, i) => (
            <View 
              key={i} 
              className={`w-2 h-2 rounded-full mx-1 ${currentPage === i ? 'bg-purple-600' : 'bg-gray-300'}`} 
            />
          ))}
        </View>
      </View>

      {/* Modals */}
      <DocumentModal
        visible={isDocumentModalVisible}
        onClose={() => setIsDocumentModalVisible(false)}
        tripId={leadData?.TripId}
      />
      
      <InvoiceListModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        tripId={leadData?.TripId}
      />
      
      <QuotationListModal
        visible={isQuotationModalVisible}
        onClose={() => setIsQuotationModalVisible(false)}
        tripId={leadData?.TripId}
      />

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
          budget: leadData?.['Client-Budget'] || '0',
        }}
      />

      <LastQuotesModal
        visible={isLastQuotesModalVisible}
        onClose={() => setIsLastQuotesModalVisible(false)}
        onUseQuote={(quote) => {
          // Handle quote usage
          setIsLastQuotesModalVisible(false);
        }}
      />
    </>
  );
};

export default QuotationCards;
