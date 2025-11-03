import { View, FlatList, ActivityIndicator } from "react-native";
import Navbar from "@/components/Navbar";
import FollowUpCards from "@/components/ui/cards/FollowUpCards";
import { useCallback, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native"; // ✅ correct import

export default function FollowUpPage() {
  const { user, loading } = useUserProfile();
const [leadData,setLeadData]=useState([]);
console.log(leadData)
  const followUpData = [
    { id: "1", name: "Vikash Singh" },
    { id: "2", name: "Priya Sharma" },
    { id: "3", name: "Amit Patel" },
  ];

  // 🔁 Refetch every time tab gains focus (or remounts)
  useFocusEffect(
    useCallback(() => {
      if (!user?.FullName) return; // wait until user is loaded

      const fetchFollowUps = async () => {
        try {
          const res = await axios.get(
            `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${user.FullName}&SalesStatus=Cold`
          );
          console.log("Fetched FollowUps:", res.data);
          setLeadData(res.data)
        } catch (err) {
          console.error("Error fetching follow-ups:", err);
        }
      };

      fetchFollowUps();

      // optional cleanup when screen loses focus
      return () => {
        console.log("FollowUpPage blurred/unfocused");
      };
    }, [user])
  );

  // 🌀 Show loader until profile is ready
  if (loading) {
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
        onNotificationPress={() => console.log("Notifications pressed")}
      />

      <FlatList
        data={leadData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FollowUpCards data={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
