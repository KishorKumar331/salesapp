
import { useAuth } from "@/components/auth/AuthManager";
import Navbar from "@/components/Navbar";
import FollowUpCards from "@/components/ui/cards/FollowUpCards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function FollowUpPage() {
  const { user, isLoading: loading } = useAuth()

  const { data, isLoading, refetch } = useQuery({
    enabled: !!user,
    queryKey: ["followup"],
    queryFn: async () => {
      const res = await axios.get(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?salesPersonUid=${user.user?.Email}&latestStatus=Cold&case=maxcase`
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
