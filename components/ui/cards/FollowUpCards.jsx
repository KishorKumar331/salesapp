// // import { Ionicons } from "@expo/vector-icons";
// // import React, { useState, useRef } from "react";
// // import {
// //   Text,
// //   TouchableOpacity,
// //   PanResponder,
// //   Alert,
// //   TextInput,
// //   View,
// //   ScrollView,
// //   Dimensions,
// // } from "react-native";
// // import DocumentModal from "../DocumentModal";
// // import InvoiceListModal from "../InvoiceListModal";
// // import QuotationListModal from "../QuotationListModal";
// // import { router } from "expo-router";

// // const FollowUpCards = ({ data }) => {
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [notes, setNotes] = useState(
// //     data?.Comments?.[0]?.Message || "No notes yet."
// //   );
// //   const [isEditingNotes, setIsEditingNotes] = useState(false);
// //   const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
// //   const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
// //   const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
// //   const scrollViewRef = useRef(null);
// //   const screenWidth = Dimensions.get("window").width;
// //   const cardWidth = screenWidth - 32;

// //   const scrollToPage = (pageIndex) => {
// //     if (scrollViewRef.current) {
// //       scrollViewRef.current.scrollTo({
// //         x: pageIndex * cardWidth,
// //         animated: true,
// //       });
// //       setCurrentPage(pageIndex);
// //     }
// //   };

// //   const handleScrollEnd = (event) => {
// //     const contentOffset = event.nativeEvent.contentOffset;
// //     const pageIndex = Math.round(contentOffset.x / cardWidth);
// //     setCurrentPage(pageIndex);
// //   };

// //   const panResponder = PanResponder.create({
// //     onMoveShouldSetPanResponder: (evt, gestureState) => {
// //       return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
// //     },
// //     onPanResponderRelease: (evt, gestureState) => {
// //       const { dx } = gestureState;
// //       if (dx > 50 && currentPage > 0) {
// //         scrollToPage(currentPage - 1);
// //       } else if (dx < -50 && currentPage < 2) {
// //         scrollToPage(currentPage + 1);
// //       }
// //     },
// //   });

// //   const handleActionPress = (action) => {
// //     if (action === "Documents") {
// //       setIsDocumentModalVisible(true);
// //     } else if (action === "Invoices") {
// //       setIsInvoiceModalVisible(true);
// //     } else if (action === "Quotations" || action === "Quotes & PDFs") {
// //       setIsQuotationModalVisible(true);
// //     } else {
// //       Alert.alert("Action", `${action} pressed`);
// //     }
// //   };

// //   const handleSaveNotes = () => {
// //     setIsEditingNotes(false);
// //     Alert.alert("Success", "Notes saved successfully!");
// //   };

// //   return (
// //     <>
// //       <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden h-auto">
// //         <View {...panResponder.panHandlers}>
// //           <ScrollView
// //             ref={scrollViewRef}
// //             horizontal
// //             pagingEnabled
// //             showsHorizontalScrollIndicator={false}
// //             onMomentumScrollEnd={handleScrollEnd}
// //             scrollEventThrottle={16}
// //           >
// //             {/* 1️⃣ Customer Info */}
// //             <View style={{ width: cardWidth }} className="p-4">
// //               <View className="flex-row items-center justify-between mb-3">
// //                 <View className="flex-row items-center gap-3">
// //                   <View className="bg-purple-100 rounded-full p-2">
// //                     <Ionicons name="person" size={20} color="#7c3aed" />
// //                   </View>
// //                   <View>
// //                     <Text className="text-gray-500 text-sm">
// //                       Trip #{data.TripId}
// //                     </Text>
// //                     <Text className="text-gray-700 text-base font-medium">
// //                       {data["Client-Name"]}
// //                     </Text>
// //                   </View>
// //                 </View>

// //                 <TouchableOpacity
// //                   onPress={() => scrollToPage(1)}
// //                   className="bg-gray-100 rounded-full p-2"
// //                 >
// //                   <Ionicons
// //                     name="chevron-forward"
// //                     size={16}
// //                     color="#6b7280"
// //                   />
// //                 </TouchableOpacity>
// //               </View>

// //               <Text className="text-gray-600 text-sm mb-1">Destination</Text>
// //               <Text className="text-gray-900 font-semibold mb-3">
// //                 {data["Client-Destination"]}
// //               </Text>

// //               <View className="flex-row justify-between mb-3">
// //                 <View>
// //                   <Text className="text-gray-500 text-xs">Email</Text>
// //                   <Text className="text-gray-900 font-medium">
// //                     {data["Client-Email"]}
// //                   </Text>
// //                 </View>
// //                 <View>
// //                   <Text className="text-gray-500 text-xs">Travel Date</Text>
// //                   <Text className="text-gray-900 font-medium">
// //                     {data["Client-TravelDate"]}
// //                   </Text>
// //                 </View>
// //               </View>

// //               <View className="flex-row justify-between mb-4">
// //                 <View>
// //                   <Text className="text-gray-500 text-xs">Pax</Text>
// //                   <Text className="text-gray-900 font-medium">
// //                     {data["Client-Pax"]}
// //                   </Text>
// //                 </View>
// //                 <View>
// //                   <Text className="text-gray-500 text-xs">Status</Text>
// //                   <Text className="text-green-600 font-medium">
// //                     {data.SalesStatus}
// //                   </Text>
// //                 </View>
// //               </View>

// //               <Text className="text-gray-600 text-sm mb-1">Budget</Text>
// //               <Text className="text-purple-600 text-2xl font-bold mb-4">
// //                 ₹{data["Client-Budget"].toLocaleString()}
// //               </Text>

// //               <View className="flex-row justify-between">
// //                 <TouchableOpacity
// //                   className="bg-blue-500 rounded-lg px-4 py-2 flex-1 mr-2"
// //                   onPress={() =>
// //                     Alert.alert("Call", data["Client-Contact"] || "No number")
// //                   }
// //                 >
// //                   <Text className="text-white font-medium text-center">
// //                     Call Client
// //                   </Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2"
// //                   onPress={() =>
// //                     Alert.alert("Email", data["Client-Email"] || "No email")
// //                   }
// //                 >
// //                   <Text className="text-white font-medium text-center">
// //                     Send Email
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>

// //             {/* 2️⃣ Quick Actions */}
// //             <View style={{ width: cardWidth }} className="p-4">
// //               <View className="flex-row items-center justify-between mb-3">
// //                 <TouchableOpacity
// //                   onPress={() => scrollToPage(0)}
// //                   className="bg-gray-100 rounded-full p-2"
// //                 >
// //                   <Ionicons name="chevron-back" size={16} color="#6b7280" />
// //                 </TouchableOpacity>

// //                 <View className="flex-row-reverse items-center gap-3">
// //                   <View>
// //                     <Text className="text-gray-500 text-sm">
// //                       Trip #{data.TripId}
// //                     </Text>
// //                     <Text className="text-gray-500 text-sm">
// //                       {data["Client-Name"]}
// //                     </Text>
// //                   </View>
// //                   <View className="bg-purple-100 rounded-full p-2">
// //                     <Ionicons name="person" size={20} color="#7c3aed" />
// //                   </View>
// //                 </View>

// //                 <TouchableOpacity
// //                   onPress={() => scrollToPage(2)}
// //                   className="bg-gray-100 rounded-full p-2"
// //                 >
// //                   <Ionicons
// //                     name="chevron-forward"
// //                     size={16}
// //                     color="#6b7280"
// //                   />
// //                 </TouchableOpacity>
// //               </View>

// //               <Text className="text-lg font-bold text-gray-900 mb-6 text-center">
// //                 Quick Actions
// //               </Text>

// //               <View className="space-y-3">
// //                 <View className="flex-col gap-2 justify-between space-x-2">
// //                   <TouchableOpacity
// //                     className="bg-purple-100 rounded-lg px-3 py-3 flex-1 mr-1"
// //                     onPress={() => handleActionPress("Quotes & PDFs")}
// //                   >
// //                     <View className="items-center">
// //                       <Ionicons
// //                         name="document-text"
// //                         size={20}
// //                         color="#7c3aed"
// //                       />
// //                       <Text className="text-purple-600 font-medium text-xs mt-1 text-center">
// //                         Quotes & PDFs
// //                       </Text>
// //                     </View>
// //                   </TouchableOpacity>

// //                   <TouchableOpacity
// //                     className="bg-blue-100 rounded-lg px-3 py-3 flex-1 ml-1"
// //                     onPress={() => handleActionPress("Invoices")}
// //                   >
// //                     <View className="items-center">
// //                       <Ionicons name="receipt" size={20} color="#3b82f6" />
// //                       <Text className="text-blue-600 font-medium text-xs mt-1 text-center">
// //                         Invoices
// //                       </Text>
// //                     </View>
// //                   </TouchableOpacity>
// //                 </View>


// //               </View>
// //             </View>

// //             {/* 3️⃣ Notes */}
// //             <View style={{ width: cardWidth }} className="p-4">
// //               <View className="flex-row items-center justify-between mb-3">
// //                 <TouchableOpacity
// //                   onPress={() => scrollToPage(1)}
// //                   className="bg-gray-100 rounded-full p-2"
// //                 >
// //                   <Ionicons name="chevron-back" size={16} color="#6b7280" />
// //                 </TouchableOpacity>

// //                 <View className="flex-row-reverse items-center gap-3">
// //                   <View>
// //                     <Text className="text-gray-500 text-sm">
// //                       Trip #{data.TripId}
// //                     </Text>
// //                     <Text className="text-gray-500 text-sm">
// //                       {data["Client-Name"]}
// //                     </Text>
// //                   </View>
// //                   <View className="bg-purple-100 rounded-full p-2">
// //                     <Ionicons name="person" size={20} color="#7c3aed" />
// //                   </View>
// //                 </View>

// //                 <View className="w-8" />
// //               </View>

// //               <View className="flex-row items-center justify-between mb-4">
// //                 <Text className="text-lg font-bold text-gray-900">Notes</Text>
// //                 <TouchableOpacity
// //                   onPress={() => setIsEditingNotes(!isEditingNotes)}
// //                   className="bg-purple-100 rounded-lg px-3 py-1"
// //                 >
// //                   <Text className="text-purple-600 font-medium text-sm">
// //                     {isEditingNotes ? "Cancel" : "Edit"}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View className="bg-gray-50 rounded-lg p-3 flex-1">
// //                 {isEditingNotes ? (
// //                   <TextInput
// //                     value={notes}
// //                     onChangeText={setNotes}
// //                     multiline
// //                     numberOfLines={8}
// //                     className="text-gray-900 font-medium min-h-[12rem] text-sm"
// //                     placeholder="Add your notes here..."
// //                     textAlignVertical="top"
// //                   />
// //                 ) : (
// //                   <Text className="text-gray-900 font-medium min-h-[12rem] text-sm">
// //                     {notes}
// //                   </Text>
// //                 )}
// //               </View>

// //               {isEditingNotes && (
// //                 <TouchableOpacity
// //                   onPress={handleSaveNotes}
// //                   className="bg-purple-600 rounded-lg py-3 mt-4"
// //                 >
// //                   <Text className="text-white font-medium text-center">
// //                     Save Notes
// //                   </Text>
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           </ScrollView>
// //         </View>

// //         {/* Page Indicator */}
// //         <View className="flex-row justify-center pb-3">
// //           {[0, 1, 2].map((index) => (
// //             <View
// //               key={index}
// //               className={`w-2 h-2 rounded-full mx-1 ${
// //                 currentPage === index ? "bg-purple-600" : "bg-gray-300"
// //               }`}
// //             />
// //           ))}
// //         </View>
// //       </View>

// //       {/* Modals */}
// //       <DocumentModal
// //         visible={isDocumentModalVisible}
// //         onClose={() => setIsDocumentModalVisible(false)}
// //       />
// //       <InvoiceListModal
// //         visible={isInvoiceModalVisible}
// //         onClose={() => setIsInvoiceModalVisible(false)}
// //         tripId={data?.TripId}
// //         onCreateNew={() => {
// //           // First close the modal
// //           setIsInvoiceModalVisible(false);
// //           // Then navigate to the invoice creation screen with a small delay
// //           setTimeout(() => {
// //             router.push({
// //               pathname: "/(tabs)/invoices/create",
// //               params: {
// //                 tripId: data?.TripId,
// //                 customerName: data?.['Client-Name'],
// //                 destination: data?.['Client-Destination'],
// //                 pax: data?.['Client-Pax'],
// //                 travelDate: data?.['Client-TravelDate']
// //               },
// //             });
// //           }, 300); // Small delay to ensure modal is closed before navigation
// //         }}
// //       />
// //       <QuotationListModal
// //         visible={isQuotationModalVisible}
// //         onClose={() => setIsQuotationModalVisible(false)}
// //         tripId={data?.TripId}
// //         onViewQuotation={(quotation) => {
// //           // Handle view quotation details
// //           Alert.alert('View Quotation', `Viewing details for: ${quotation.quotationNumber}`);
// //           // You can navigate to a detailed view or open a modal with more details
// //         }}
// //         onCreateNew={() => {
// //           // Handle create new quotation
// //           Alert.alert('Create New', 'Would open quotation creation form');
// //         }}
// //       />
// //     </>
// //   );
// // };

// // export default FollowUpCards;


// // ⛔ REMOVE PanResponder
// // ⛔ REMOVE ScrollView horizontal issues

// import React, { useRef, useState, useCallback, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Dimensions,
//   FlatList,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import DocumentModal from "../DocumentModal";
// import InvoiceListModal from "../InvoiceListModal";
// import QuotationListModal from "../QuotationListModal";
// import { router } from "expo-router";

// const FollowUpCards = ({ data }) => {
//   const screenWidth = Dimensions.get("window").width;
//   const cardWidth = screenWidth - 32;

//   const [page, setPage] = useState(0);
//   const listRef = useRef(null);

//   const pages = useMemo(() => ["info", "actions", "notes"], []);

//   const scrollToPage = useCallback(
//     (i) => {
//       listRef.current?.scrollToOffset({
//         offset: i * cardWidth,
//         animated: true,
//       });
//       setPage(i);
//     },
//     [cardWidth]
//   );

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems?.length) {
//       setPage(viewableItems[0].index);
//     }
//   }).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 60,
//   }).current;

//   const renderItem = useCallback(
//     ({ item, index }) => (
//       <View style={{ width: cardWidth }} className="p-4">
//         {/* ---------------------- PAGE 1 (INFO) ---------------------- */}
//         {item === "info" && (
//           <>
//             <View className="flex-row items-center justify-between mb-3">
//               <View className="flex-row items-center gap-3">
//                 <View className="bg-purple-100 rounded-full p-2">
//                   <Ionicons name="person" size={20} color="#7c3aed" />
//                 </View>
//                 <View>
//                   <Text className="text-gray-500 text-sm">
//                     Trip #{data.TripId}
//                   </Text>
//                   <Text className="text-gray-700 text-base font-medium">
//                     {data["Client-Name"]}
//                   </Text>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 onPress={() => scrollToPage(1)}
//                 className="bg-gray-100 rounded-full p-2"
//               >
//                 <Ionicons name="chevron-forward" size={16} color="#6b7280" />
//               </TouchableOpacity>
//             </View>

//             <Text className="text-gray-600 text-sm mb-1">Destination</Text>
//             <Text className="text-gray-900 font-semibold mb-3">
//               {data["Client-Destination"]}
//             </Text>

//             <View className="flex-row justify-between mb-3">
//               <View>
//                 <Text className="text-gray-500 text-xs">Email</Text>
//                 <Text className="text-gray-900 font-medium">
//                   {data["Client-Email"]}
//                 </Text>
//               </View>
//               <View>
//                 <Text className="text-gray-500 text-xs">Travel Date</Text>
//                 <Text className="text-gray-900 font-medium">
//                   {data["Client-TravelDate"]}
//                 </Text>
//               </View>
//             </View>

//             <Text className="text-gray-600 text-sm mb-1">Budget</Text>
//             <Text className="text-purple-600 text-2xl font-bold mb-4">
//               ₹{data["Client-Budget"].toLocaleString()}
//             </Text>
//           </>
//         )}

//         {/* ---------------------- PAGE 2 (ACTIONS) ---------------------- */}
//         {item === "actions" && (
//           <>
//             <View className="flex-row items-center justify-between mb-3">
//               <TouchableOpacity
//                 onPress={() => scrollToPage(0)}
//                 className="bg-gray-100 rounded-full p-2"
//               >
//                 <Ionicons name="chevron-back" size={16} color="#6b7280" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => scrollToPage(2)}
//                 className="bg-gray-100 rounded-full p-2"
//               >
//                 <Ionicons name="chevron-forward" size={16} color="#6b7280" />
//               </TouchableOpacity>
//             </View>

//             <Text className="text-lg font-bold text-gray-900 mb-6 text-center">
//               Quick Actions
//             </Text>

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => setIsQuotationModalVisible(true)}
//                 className="flex-1 bg-purple-100 p-4 rounded-xl items-center"
//               >
//                 <Ionicons name="document-text" size={22} color="#7c3aed" />
//                 <Text className="text-purple-600 text-sm font-medium mt-2">
//                   Quotes & PDFs
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setIsInvoiceModalVisible(true)}
//                 className="flex-1 bg-blue-100 p-4 rounded-xl items-center"
//               >
//                 <Ionicons name="receipt" size={22} color="#3b82f6" />
//                 <Text className="text-blue-600 text-sm font-medium mt-2">
//                   Invoices
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}

//         {/* ---------------------- PAGE 3 (NOTES) ---------------------- */}
//         {item === "notes" && (
//           <>
//             <View className="flex-row items-center justify-between mb-3">
//               <TouchableOpacity
//                 onPress={() => scrollToPage(1)}
//                 className="bg-gray-100 rounded-full p-2"
//               >
//                 <Ionicons name="chevron-back" size={16} color="#6b7280" />
//               </TouchableOpacity>
//             </View>

//             <Text className="text-lg font-bold text-gray-900 mb-3">
//               Notes
//             </Text>

//             <View className="bg-gray-100 rounded-lg p-3 min-h-[150px]">
//               <Text className="text-gray-800">{data?.Comments?.[0]?.Message}</Text>
//             </View>
//           </>
//         )}
//       </View>
//     ),
//     [cardWidth, data]
//   );

//   return (
//     <>
//       <View className="bg-white rounded-2xl mb-4 shadow-sm">

//         <FlatList
//           ref={listRef}
//           data={pages}
//           renderItem={renderItem}
//           horizontal
//           pagingEnabled
//           snapToInterval={cardWidth}
//           showsHorizontalScrollIndicator={false}
//           decelerationRate="fast"
//           nestedScrollEnabled
//           scrollEventThrottle={16}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           getItemLayout={(data, index) => ({
//             length: cardWidth,
//             offset: cardWidth * index,
//             index,
//           })}
//         />

//         {/* PAGE DOTS */}
//         <View className="flex-row justify-center py-3">
//           {pages.map((_, i) => (
//             <View
//               key={i}
//               className={`w-2 h-2 mx-1 rounded-full ${
//                 page === i ? "bg-purple-600" : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </View>
//       </View>
//     </>
//   );
// };

// export default FollowUpCards;
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import DocumentModal from "../DocumentModal";
import InvoiceListModal from "../InvoiceListModal";
import QuotationListModal from "../QuotationListModal";
import useStatusChange from "@/hooks/useStatusChange";

const FollowUpCards = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const [notes, setNotes] = useState(
    data?.Comments?.[0]?.Message || "No notes yet."
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  
  // Use the useStatusChange hook with quotation data
  const { status, isLoading, updateStatus } = useStatusChange(
    data?.Status || 'New',
    data // Pass the full quotation data
  );

  const listRef = useRef(null);

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

  // Same pages as before
  const pages = useMemo(() => ["page1", "page2", "page3"], []);

  // Smooth scroll logic
  const scrollToPage = useCallback(
    (pageIndex) => {
      listRef.current?.scrollToOffset({
        offset: pageIndex * cardWidth,
        animated: true,
      });
      setCurrentPage(pageIndex);
    },
    [cardWidth]
  );

  // Detect visible page
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  // Action handler (your existing logic)
  const handleActionPress = (action) => {
    if (action === "Documents") setIsDocumentModalVisible(true);
    else if (action === "Invoices") setIsInvoiceModalVisible(true);
    else if (action === "Quotations" || action === "Quotes & PDFs")
      setIsQuotationModalVisible(true);
    else Alert.alert("Action", `${action} pressed`);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    Alert.alert("Success", "Notes saved successfully!");
  };

  // -------------------- MAIN RENDER ITEM --------------------

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ width: cardWidth }} className="p-4">

        {/* ------------------ PAGE 1 (Your EXACT UI) ------------------ */}
        {item === "page1" && (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View className="bg-purple-100 rounded-full p-2">
                  <Ionicons name="person" size={20} color="#7c3aed" />
                </View>

                <View>
                  <Text className="text-gray-500 text-sm">
                    Trip #{data.TripId}
                  </Text>
                  <Text className="text-gray-700 text-base font-medium">
                    {data["Client-Name"]}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => scrollToPage(1)}
                className="bg-gray-100 rounded-full p-2"
              >
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* All your original UI below 100% SAME */}
            <Text className="text-gray-600 text-sm mb-1">Destination</Text>
            <Text className="text-gray-900 font-semibold mb-3">
              {data["Client-Destination"]}
            </Text>

            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-gray-500 text-xs">Email</Text>
                <Text className="text-gray-900 font-medium">
                  {data["Client-Email"]}
                </Text>
              </View>

              <View>
                <Text className="text-gray-500 text-xs">Travel Date</Text>
                <Text className="text-gray-900 font-medium">
                  {data["Client-TravelDate"]}
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 text-sm mb-1">Budget</Text>
            <Text className="text-purple-600 text-2xl font-bold mb-4">
              ₹{data["Client-Budget"].toLocaleString()}
            </Text>

            {/* Buttons same */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-500 rounded-lg px-4 py-2 flex-1 mr-2"
                onPress={() =>
                  Alert.alert("Call", data["Client-Contact"] || "No number")
                }
              >
                <Text className="text-white font-medium text-center">
                  Call Client
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2"
                onPress={() =>
                  Alert.alert("Email", data["Client-Email"] || "No email")
                }
              >
                <Text className="text-white font-medium text-center">
                  Send Email
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ------------------ PAGE 2 (Quick Actions SAME) ------------------ */}
        {item === "page2" && (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <TouchableOpacity
                onPress={() => scrollToPage(0)}
                className="bg-gray-100 rounded-full p-2"
              >
                <Ionicons name="chevron-back" size={16} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => scrollToPage(2)}
                className="bg-gray-100 rounded-full p-2"
              >
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-bold text-gray-900 mb-6 text-center">
              Quick Actions
            </Text>

            <View className="space-y-3">
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="bg-purple-100 rounded-lg px-3 py-4 flex-1"
                  onPress={() => handleActionPress("Quotes & PDFs")}
                >
                  <View className="items-center">
                    <Ionicons name="document-text" size={20} color="#7c3aed" />
                    <Text className="text-purple-600 font-medium text-xs mt-1">
                      Quotes & PDFs
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-blue-100 rounded-lg px-3 py-4 flex-1"
                  onPress={() => handleActionPress("Invoices")}
                >
                  <View className="items-center">
                    <Ionicons name="receipt" size={20} color="#3b82f6" />
                    <Text className="text-blue-600 font-medium text-xs mt-1">
                      Invoices
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row">


                <TouchableOpacity
                  className={`${status === 'Converted' ? 'bg-green-100' : 'bg-purple-100'} rounded-lg px-1 py-4 flex-1 mt-4`}
                  onPress={() => updateStatus('Converted')}
                  disabled={isLoading || status === 'Converted'}
                >
                  <View className="items-center">
                    {isLoading && status === 'Converted' ? (
                      <ActivityIndicator size="small" color="#7c3aed" />
                    ) : (
                      <Text className={`${status === 'Converted' ? 'text-green-600' : 'text-purple-600'} font-medium text-xs mt-1`}>
                        {status === 'Converted' ? 'Converted' : 'Convert'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`${status === 'Dumped' ? 'bg-red-100' : 'bg-purple-100'} rounded-lg px-3 py-4 flex-1 mt-4 ml-2`}
                  onPress={() => updateStatus('Dumped')}
                  disabled={isLoading || status === 'Dumped'}
                >
                  <View className="items-center">
                    {isLoading && status === 'Dumped' ? (
                      <ActivityIndicator size="small" color="#7c3aed" />
                    ) : (
                      <Text className={`${status === 'Dumped' ? 'text-red-600' : 'text-purple-600'} font-medium text-xs mt-1`}>
                        {status === 'Dumped' ? 'Dumped' : 'Dump'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </>
        )}

        {/* ------------------ PAGE 3 (NOTES SAME) ------------------ */}
        {item === "page3" && (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <TouchableOpacity
                onPress={() => scrollToPage(1)}
                className="bg-gray-100 rounded-full p-2"
              >
                <Ionicons name="chevron-back" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-900">Notes</Text>

              <TouchableOpacity
                onPress={() => setIsEditingNotes(!isEditingNotes)}
                className="bg-purple-100 rounded-lg px-3 py-1"
              >
                <Text className="text-purple-600 font-medium">
                  {isEditingNotes ? "Cancel" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 rounded-lg p-3 min-h-[150px]">
              {isEditingNotes ? (
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  className="text-gray-900 min-h-[140px]"
                />
              ) : (
                <Text className="text-gray-900">{notes}</Text>
              )}
            </View>

            {isEditingNotes && (
              <TouchableOpacity
                onPress={handleSaveNotes}
                className="bg-purple-600 py-3 rounded-lg mt-4"
              >
                <Text className="text-center text-white font-medium">
                  Save Notes
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden">

        {/* NEW SCROLL ENGINE */}
        <FlatList
          ref={listRef}
          data={pages}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          snapToInterval={cardWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: cardWidth,
            offset: cardWidth * index,
            index,
          })}
        />

        {/* PAGE DOTS EXACT SAME */}
        <View className="flex-row justify-center pb-3">
          {pages.map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${currentPage === i ? "bg-purple-600" : "bg-gray-300"
                }`}
            />
          ))}
        </View>
      </View>

      {/* MODALS SAME */}
      <DocumentModal
        visible={isDocumentModalVisible}
        onClose={() => setIsDocumentModalVisible(false)}
      />

      <InvoiceListModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        tripId={data?.TripId}
      />

      <QuotationListModal
        visible={isQuotationModalVisible}
        onClose={() => setIsQuotationModalVisible(false)}
        tripId={data?.TripId}
      />
    </>
  );
};

export default FollowUpCards;
