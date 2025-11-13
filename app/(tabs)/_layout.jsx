import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          height: 100,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
      
        name="index"
        options={{
          unmountOnBlur: true,
          title: "Quotations",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "document-text" : "document-text-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
   
      {/* <Tabs.Screen
        name="newLeadForm"
        options={{
          unmountOnBlur: true,
          title: "",
          tabBarIcon: ({ color }) => (
            <View className="bg-purple-500 rounded-full w-12 h-12  flex justify-center items-center shadow-lg">
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          ),
         
        }}
      /> */}
      <Tabs.Screen
        name="followUps"
        options={{
          unmountOnBlur: true,
          title: "Follow Ups",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />  
        <Tabs.Screen
        name="convertedPage"
        options={{
          unmountOnBlur: true,
          title: "Converted",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />  
      <Tabs.Screen
        name="profile"
        options={{
          unmountOnBlur: true,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* Hidden screens - not shown in tab bar */}
      <Tabs.Screen
        name="QuotationScreen"
        options={{
          href: null, // This hides the screen from tab bar
        }}
      />
      
      <Tabs.Screen
        name="newLeadForm"
        options={{
          href: null, // This hides the screen from tab bar
        }}
      />
    </Tabs>
  );
}
