

import React, { useRef, useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, FlatList } from "react-native";
import Navbar from "@/components/Navbar";
import QuotationCards from "@/components/ui/cards/QuotationCards";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useUserProfile } from "@/hooks/useUserProfile";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function ConvertedPage() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user, loading: userLoading } = useUserProfile();

  const [leads, setLeads] = useState([]);
  console.log(leads)
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
      if (!user?.FullName) {
        console.log("⏳ Waiting for user data...");
        return [];
      }

      console.log(`🔄 [${mode}] Starting to fetch leads...`);
      
      if (mode === "initial") setLoading(true);
      else setRefreshing(true);

      try {
        setError(null);

        const url = `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${user.FullName}&SalesStatus=Converted`;
        console.log("🌐 API URL:", url);

        const response = await fetch(url, { 
          signal,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log("📡 Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ API Error Response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log("✅ API Response:", responseData);

        const data = parseLeads(responseData);
        console.log("📊 Parsed leads data:", data);
        
        setLeads(Array.isArray(data) ? data : []);
        return data;
      } catch (error) {
        if (error?.name === "AbortError") {
          console.log("⏹️ Request was aborted");
          return [];
        }
        
        console.error("❌ Error in fetchLeads:", {
          error,
          message: error?.message,
          stack: error?.stack
        });
        
        setError(error?.message || "Failed to fetch leads. Please try again.");
        setLeads([]);
        throw error; // Re-throw to handle in the caller if needed
      } finally {
        console.log("🏁 Fetch completed, updating UI state...");
        if (mode === "initial") setLoading(false);
        setRefreshing(false);
      }
    },
    [parseLeads, user]
  );

  // Refetch on focus; cancel on blur
  useFocusEffect(
    useCallback(() => {
      console.log("🔍 Tab focused, checking user...");
      
      if (!user?.FullName) {
        console.log("⏳ User not loaded yet, skipping fetch");
        return;
      }
      
      console.log("🔄 Fetching leads for user:", user.FullName);
      const controller = new AbortController();
      
      // Add a small delay to ensure the tab is properly focused
      const timer = setTimeout(() => {
        fetchLeads("initial", controller.signal).catch(console.error);
      }, 100);
      
      return () => {
        console.log("🧹 Cleaning up...");
        clearTimeout(timer);
        controller.abort();
      };
    }, [fetchLeads, user?.FullName]) // Only depend on FullName to prevent unnecessary re-renders
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
    return <QuotationCards leadData={item} onStatusChange={fetchLeads} />;
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
