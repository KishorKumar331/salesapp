import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs?: Tab[];
  onTabChange?: (tabId: string) => void;
}

const defaultTabs: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'photos', label: 'Photos' },
  { id: 'reviews', label: 'Reviews' }
];

export function TabNavigation({ tabs = defaultTabs, onTabChange }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'overview');

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => handleTabPress(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id ? styles.activeTabText : styles.inactiveTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 0,
    gap: 5,
  },
  tab: {
    width: 120,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  activeTab: {
    backgroundColor: '#FE6F61',
  },
  inactiveTab: {
    backgroundColor: '#D9D9D9',
  },
  tabText: {
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#8B8B8B',
  },
});
