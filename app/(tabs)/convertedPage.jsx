

import Navbar from "@/components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../components/auth/AuthManager";
import ConvertedCards from "../../components/ui/cards/ConvertedCards";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function ConvertedPage() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();
  console.log("👤 Current user object:", user);
  console.log("👤 User email:", user?.email || user?.Email);
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const parseLeads = useCallback((raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.leads)) return raw.leads;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  }, []);

  const fetchLeads = useCallback(
    async (mode = "initial", signal) => {
      const userEmail = user?.email || user?.Email;
      
      if (!userEmail) {
        console.log("❌ No user email found. User object:", user);
        return [];
      }

      if (mode === "initial") setLoading(true);
      else setRefreshing(true);

      try {
        setError(null);

        const url = `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?salesPersonUid=${user.user?.Email}&latestStatus=Converted&case=maxcase`;

        console.log("🌐 Fetching URL:", url);

        const response = await fetch(url, {
          signal,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ API Error Response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log("📊 API Response:", responseData);

        const data = parseLeads(responseData);
        console.log("📋 Parsed data:", data);

        setLeads(Array.isArray(data) ? data : []);
        return data;
      } catch (error) {
        if (error?.name === "AbortError") {
          return [];
        }

        console.error("❌ Error in fetchLeads:", {
          error,
          message: error?.message,
          stack: error?.stack
        });

        setError(error?.message || "Failed to fetch leads. Please try again.");
        setLeads([]);
        throw error;
      } finally {
        if (mode === "initial") setLoading(false);
        setRefreshing(false);
      }
    },
    [parseLeads, user]
  );

  // Refetch on focus; cancel on blur
  useFocusEffect(
    useCallback(() => {
      const userEmail = user?.email || user?.Email;
      
      if (!userEmail) {
        console.log("❌ No user email, skipping fetch. User object:", user);
        return;
      }

      const controller = new AbortController();

      const timer = setTimeout(() => {
        fetchLeads("initial", controller.signal).catch(console.error);
      }, 100);

      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    }, [fetchLeads, user?.email, user?.Email])
  );

  const onRefresh = useCallback(() => fetchLeads("refresh"), [fetchLeads]);

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      ),
    [scrollY]
  );

  const keyExtractor = useCallback((item, index) => String(item?.id ?? item?._id ?? index), []);

  const renderItem = useCallback(({ item }) => {
    if (!item) return null;
    return <ConvertedCards data={item} onStatusChange={fetchLeads} />;
  }, [fetchLeads]);

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar
        title="Journey Readdy"
        subtitle="Explore beautiful destinations"
        showSearch
        showNotifications
        onNotificationPress={() => console.log("Notifications pressed")}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16, fontSize: 16, color: "#6b7280" }}>Loading leads...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600", color: "#1f2937", textAlign: "center" }}>
            Error Loading Leads
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: "#6b7280", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchLeads("initial")}
            style={{ marginTop: 24, backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : leads.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <Ionicons name="document-outline" size={64} color="#9ca3af" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600", color: "#1f2937", textAlign: "center" }}>
            No Leads Found
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: "#6b7280", textAlign: "center" }}>
            You haven't created any leads yet. Create your first lead to get started.
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            style={{ marginTop: 24, backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AnimatedFlatList
          data={leads}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScroll={onScroll}
          scrollEventThrottle={16}
          removeClippedSubviews
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </View>
  );
}
