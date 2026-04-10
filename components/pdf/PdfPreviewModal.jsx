import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Configure notifications to show alerts even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PdfPreviewModal = ({ visible, pdfUri, pdfHtml, onClose, onShare, clientName = 'Quotation' }) => {
  const API_URL = "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/packages-pdf-html";

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  useEffect(() => {
    // Request notification permissions
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    })();
  }, []);

  const showDownloadNotification = async (fileName) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Download Complete 📄",
          body: `${fileName} has been downloaded and is ready to share.`,
          data: { data: 'goes here' },
        },
        trigger: null, // show immediately
      });
    } catch (e) {
      console.error('Error showing notification:', e);
    }
  };

  const handleDownload = async () => {
    try {
      setIsGeneratingPdf(true);

      if (!pdfHtml) {
        throw new Error("No HTML content available to generate PDF");
      }

      console.log("🔄 Requesting PDF from API...");
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: pdfHtml, fileName: "Quotation.pdf", mode: "pdf", type: "quotation" }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      // The user says "returns lihnks of pdf". Assuming the key is pdfLink or data.url or similar.
      // Based on common patterns for these APIs, it's often a direct link or in a specific key.
      const pdfUrl = data.pdfLink || data.link || data.url || (Array.isArray(data) ? data[0] : (typeof data === 'string' ? data : null));

      if (!pdfUrl) {
        throw new Error("No PDF link returned from API. Response: " + JSON.stringify(data));
      }

      console.log("🔄 Downloading PDF from:", pdfUrl);

      const timestamp = new Date().getTime();
      const fileName = `${clientName.replace(/\s+/g, '_')}_Quotation_${timestamp}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(pdfUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error(`Failed to download PDF file (status: ${downloadResult.status})`);
      }

      console.log("✅ PDF downloaded to:", downloadResult.uri);

      if (downloadResult.uri) {
        // 1. Show local notification
        await showDownloadNotification(fileName);

        // 2. Trigger Share
        await Sharing.shareAsync(downloadResult.uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Share ${fileName}`,
        });
        
        console.log("✅ PDF shared successfully");

        // 3. Call onShare callback to submit quotation to API
        if (onShare) {
          console.log("🔄 Triggering onShare callback...");
          await onShare();
        }
        
        Alert.alert("Success", "Quotation downloaded and shared successfully!");
      } else {
        throw new Error("No PDF available to share");
      }
    } catch (error) {
      console.error('❌ Error in PDF generation/download:', error);
      Alert.alert('Error', 'Failed to generate PDF: ' + (error?.message || error));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Quotation Preview</Text>
          <TouchableOpacity
            onPress={handleDownload}
            style={[styles.downloadButton, isGeneratingPdf && styles.downloadButtonDisabled]}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <ActivityIndicator size={20} color="#7c3aed" />
            ) : (
              <Ionicons name="download-outline" size={24} color="#7c3aed" />
            )}
          </TouchableOpacity>
        </View>

        {/* PDF Preview */}
        <View style={styles.pdfContainer}>
          {/* {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text style={styles.loadingText}>Loading PDF Preview...</Text>
            </View>
          )} */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={60} color="#ef4444" />
              <Text style={styles.errorText}>Unable to preview PDF</Text>
              <Text style={styles.errorSubtext}>Use the download button below to view</Text>
            </View>
          )}
          {pdfHtml && (
            <WebView
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          margin: 0;
                          padding: 20px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          zoom:0.44;
                          min-height: 100vh;
                        }
                     
                      </style>
                    </head>
                    <body>
                      <div>
                        ${pdfHtml}
                      </div>
                    </body>
                  </html>
                `
              }}
              style={styles.webview}
              onError={(e) => {
                console.error('WebView error:', e.nativeEvent);
                setLoading(false);
                setError(true);
              }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#7c3aed" />
                </View>
              )}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.downloadButtonLarge, isGeneratingPdf && styles.downloadButtonLargeDisabled]}
            onPress={handleDownload}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <>
                <ActivityIndicator size={20} color="white" />
                <Text style={styles.buttonText}>Generating PDF...</Text>
              </>
            ) : (
              <>
                <Ionicons name="download" size={20} color="white" />
                <Text style={styles.buttonText}>Download & Share PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  webview: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  downloadButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  downloadButtonLargeDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PdfPreviewModal;