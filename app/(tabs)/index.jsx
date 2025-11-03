import React, { useRef, useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, FlatList } from "react-native";
import Navbar from "@/components/Navbar";
import QuotationCards from "@/components/ui/cards/QuotationCards";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

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
      if (mode === "initial") setLoading(true);
      else setRefreshing(true);

      try {
        setError(null);

        const salesPersonUid = encodeURIComponent("Devesh bisht");
        console.log(salesPersonUid)
        const url = `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${salesPersonUid}&SalesStatus=LeadCreate`;

        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const data = parseLeads(json);
        setLeads(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error("Error fetching leads:", e);
        setError(e?.message || "Failed to fetch leads");
        setLeads([]);
      } finally {
        if (mode === "initial") setLoading(false);
        setRefreshing(false);
      }
    },
    [parseLeads]
  );

  // Refetch on focus; cancel on blur
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      fetchLeads("initial", controller.signal);
      return () => controller.abort();
    }, [fetchLeads])
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
    return <QuotationCards leadData={item} />;
  }, []);

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
