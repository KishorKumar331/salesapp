// import { View, FlatList, ActivityIndicator } from "react-native";
// import Navbar from "@/components/Navbar";
// import FollowUpCards from "@/components/ui/cards/FollowUpCards";
// import { useCallback, useState } from "react";
// import { useUserProfile } from "@/hooks/useUserProfile";
// import axios from "axios";
// import { useFocusEffect } from "@react-navigation/native"; // ✅ correct import

// export default function FollowUpPage() {
//   const { user, loading } = useUserProfile();
// const [leadData,setLeadData]=useState([]);


//   // 🔁 Refetch every time tab gains focus (or remounts)
//     const fetchFollowUps = async () => {
//         try {
//           const res = await axios.get(
//             `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${user.FullName}&SalesStatus=Cold`
//           );
//           console.log("Fetched FollowUps:", res.data);
//           setLeadData(res.data)
//         } catch (err) {
//           console.error("Error fetching follow-ups:", err);
//         }
//       };


//     const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["followup", tab],
//     queryFn: fetchFollowUps,
//     refetchInterval: 5000, // auto refresh every 5 sec
//   });

//   // 🌀 Show loader until profile is ready
//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-gray-50">
//         <ActivityIndicator size="large" color="#7c3aed" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       <Navbar
//         title="Follow Ups"
//         subtitle={`Welcome ${user?.FullName || ""}`}
//         showSearch
//         showNotifications
//         onNotificationPress={() => console.log("Notifications pressed")}
//       />

//       <FlatList
//         data={data}
//         keyExtractor={(item, index) => item.TripId?.toString() || `lead-${index}`}
//         renderItem={({ item }) => <FollowUpCards data={item} />}
//         contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }
import { View, FlatList, ActivityIndicator } from "react-native";
import Navbar from "@/components/Navbar";
import FollowUpCards from "@/components/ui/cards/FollowUpCards";
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function FollowUpPage() {
  const { user, loading } = useUserProfile();


  const { data, isLoading, refetch } = useQuery({
    enabled: !!user,
    queryKey: ["followup"],
    queryFn: async () => {
      const res = await axios.get(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${user.FullName}&SalesStatus=Cold`
      );
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  if (loading || isLoading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar
        title="Follow Ups"
        subtitle={`Welcome ${user?.FullName || ""}`}
        showSearch
        showNotifications
      />

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.TripId?.toString() || `lead-${index}`}
        renderItem={({ item }) => <FollowUpCards data={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
}
