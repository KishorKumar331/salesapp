import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { TemplateWinterfell } from './winterFellPdf';

// 🔥 REAL-TIME PDF PREVIEW COMPONENT
// Use this for development to see winterFellPdf changes instantly
const RealtimePdfPreview = () => {
  const [html, setHtml] = useState('');
  const [sampleData, setSampleData] = useState({
    ClientName: "John Doe",
    DestinationName: "Goa Beach Paradise",
    NoOfPax: 4,
    TravelDate: new Date().toISOString(),
    Days: 5,
    Nights: 4,
    Costs: {
      TotalCost: 45000
    },
    Itinerary: [
      {
        Date: new Date().toISOString(),
        Title: "Arrival & Beach Exploration"
      },
      {
        Date: new Date(Date.now() + 86400000).toISOString(),
        Title: "Water Sports & Adventure"
      },
      {
        Date: new Date(Date.now() + 172800000).toISOString(),
        Title: "Cultural Tour & Local Markets"
      }
    ],
    Hotels: [
      {
        Name: "Beach Resort Goa",
        RoomType: "Deluxe Sea View",
        ImageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=300&fit=crop",
        CheckInDate: new Date().toLocaleDateString(),
        CheckOutDate: new Date(Date.now() + 345600000).toLocaleDateString()
      }
    ],
    Inclusions: [
      "Accommodation in 4-star hotels",
      "Daily breakfast",
      "Airport transfers",
      "Sightseeing as per itinerary"
    ],
    Exclusions: [
      "Airfare/train fare",
      "Personal expenses",
      "Travel insurance",
      "Tips and gratuities"
    ]
  });
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  // 🔥 AUTO-REFRESH: Continuously regenerate HTML to pick up winterFellPdf changes
  useEffect(() => {
    const generateHtml = () => {
      try {
        // Generate HTML directly with template (Metro bundler handles hot reloading)
        const html = TemplateWinterfell(sampleData);
        setHtml(html);
        console.log('🔄 Auto-refreshed PDF preview - Metro will handle hot reload');
      } catch (error) {
        console.error('Error generating HTML:', error);
      }
    };

    // Initial generation
    generateHtml();

    // Set up auto-refresh interval if enabled
    if (isAutoRefresh) {
      intervalRef.current = setInterval(generateHtml, 2000); // Refresh every 2 seconds
      console.log('⚡ Auto-refresh enabled (2s interval)');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🛑 Auto-refresh disabled');
      }
    };
  }, [sampleData, refreshKey, isAutoRefresh]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered...');
    setRefreshKey(prev => prev + 1);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(prev => !prev);
    console.log('🔄 Auto-refresh toggled:', !isAutoRefresh);
  };

  const updateSampleData = (field, value) => {
    setSampleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Real-time PDF Preview</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleAutoRefresh} style={[styles.autoRefreshButton, isAutoRefresh && styles.autoRefreshActive]}>
            <Ionicons name={isAutoRefresh ? "pause" : "play"} size={16} color={isAutoRefresh ? "white" : "#7c3aed"} />
            <Text style={[styles.autoRefreshText, isAutoRefresh && styles.autoRefreshTextActive]}>
              {isAutoRefresh ? "Auto ON" : "Auto OFF"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#7c3aed" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Controls */}
      <ScrollView style={styles.controls} showsVerticalScrollIndicator={false}>
        <Text style={styles.controlsTitle}>📝 Test Data Controls</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Name:</Text>
          <TextInput
            style={styles.input}
            value={sampleData.ClientName}
            onChangeText={(value) => updateSampleData('ClientName', value)}
            placeholder="Enter client name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destination:</Text>
          <TextInput
            style={styles.input}
            value={sampleData.DestinationName}
            onChangeText={(value) => updateSampleData('DestinationName', value)}
            placeholder="Enter destination"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Cost:</Text>
          <TextInput
            style={styles.input}
            value={sampleData.Costs.TotalCost.toString()}
            onChangeText={(value) => updateSampleData('Costs', { TotalCost: parseInt(value) || 0 })}
            placeholder="Enter total cost"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>No of Pax:</Text>
          <TextInput
            style={styles.input}
            value={sampleData.NoOfPax.toString()}
            onChangeText={(value) => updateSampleData('NoOfPax', parseInt(value) || 1)}
            placeholder="Number of passengers"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      {/* PDF Preview */}
      <View style={styles.previewContainer}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>📄 Live Preview</Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, isAutoRefresh && styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {isAutoRefresh ? "Auto-refreshing every 2s" : "Manual refresh only"}
            </Text>
          </View>
        </View>
        {html ? (
          <WebView
            key={refreshKey}
            source={{ html }}
            style={styles.webview}
            onError={(e) => console.error('WebView error:', e.nativeEvent)}
            startInLoadingState={true}
          />
        ) : (
          <View style={styles.noPreview}>
            <Ionicons name="document-outline" size={60} color="#9ca3af" />
            <Text style={styles.noPreviewText}>No preview available</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoRefreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  autoRefreshActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  autoRefreshText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7c3aed',
    marginLeft: 4,
  },
  autoRefreshTextActive: {
    color: 'white',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  controls: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  controlsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  webview: {
    flex: 1,
    backgroundColor: 'white',
  },
  noPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  noPreviewText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
});

export default RealtimePdfPreview;
