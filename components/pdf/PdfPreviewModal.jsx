import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import { generatePdfFromHtml } from '../../utils/pdfUtils';

const PdfPreviewModal = ({ visible, pdfUri, pdfHtml, onClose, onShare, clientName = 'Quotation' }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const handleDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      
      let finalPdfUri = pdfUri;
      
      // 🐌 LAZY PDF GENERATION - Only generate PDF when user clicks download
      if (!finalPdfUri && pdfHtml) {
        console.log("🔄 Generating PDF from HTML for download...");
        finalPdfUri = await generatePdfFromHtml(pdfHtml);
        console.log("✅ PDF generated for download:", finalPdfUri);
      }
      
      if (finalPdfUri) {
        await Sharing.shareAsync(finalPdfUri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
        console.log("✅ PDF shared successfully");
        
        // Call onShare callback to submit quotation to API
        if (onShare) {
          await onShare();
        }
      } else {
        throw new Error("No PDF available to share");
      }
    } catch (error) {
      console.error('❌ Error generating/sharing PDF:', error);
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
              source={{ html: pdfHtml }}
              style={styles.webview}
              // onLoadStart={() => setLoading(true)}
              // onLoadEnd={() => setLoading(false)}
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


// import React from 'react'

// const PdfPreviewModal = () => {
//   return (
//     <div>PdfPreviewModal</div>
//   )
// }

// export default PdfPreviewModal



// import React from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
// import * as Sharing from 'expo-sharing';
// import { generatePdfFromHtml } from '../../utils/pdfUtils';

// const PdfPreviewModal = ({ visible, pdfUri, pdfHtml, onClose, onShare }) => {
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(false);
//   const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
//   const webViewRef = React.useRef(null);

//   // Reset loading state when modal is opened/closed or content changes
//   React.useEffect(() => {
//     if (visible) {
//       setLoading(true);
//       setError(false);
//     }
//   }, [visible, pdfHtml]);

//   const handleDownload = async () => {
//     try {
//       setIsGeneratingPdf(true);
      
//       let finalPdfUri = pdfUri;
      
//       // 🐌 LAZY PDF GENERATION - Only generate PDF when user clicks download
//       if (!finalPdfUri && pdfHtml) {
//         console.log("🔄 Generating PDF from HTML for download...");
//         finalPdfUri = await generatePdfFromHtml(pdfHtml);
//         console.log("✅ PDF generated for download:", finalPdfUri);
//       }
      
//       if (finalPdfUri) {
//         await Sharing.shareAsync(finalPdfUri, {
//           UTI: '.pdf',
//           mimeType: 'application/pdf',
//         });
//         console.log("✅ PDF shared successfully");
        
//         // Call onShare callback to submit quotation to API
//         if (onShare) {
//           await onShare();
//         }
//       } else {
//         throw new Error("No PDF available to share");
//       }
//     } catch (error) {
//       console.error('❌ Error generating/sharing PDF:', error);
//       Alert.alert('Error', 'Failed to generate PDF: ' + (error?.message || error));
//     } finally {
//       setIsGeneratingPdf(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={onClose}
//     >
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Ionicons name="close" size={24} color="#374151" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Quotation Preview</Text>
//           <TouchableOpacity 
//             onPress={handleDownload} 
//             style={[styles.downloadButton, isGeneratingPdf && styles.downloadButtonDisabled]}
//             disabled={isGeneratingPdf}
//           >
//             {isGeneratingPdf ? (
//               <ActivityIndicator size={20} color="#7c3aed" />
//             ) : (
//               <Ionicons name="download-outline" size={24} color="#7c3aed" />
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* PDF Preview */}
//         <View style={styles.pdfContainer}>
//           {loading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#7c3aed" />
//               <Text style={styles.loadingText}>Loading preview...</Text>
//             </View>
//           )}
//           {error && (
//             <View style={styles.errorContainer}>
//               <Ionicons name="alert-circle" size={60} color="#ef4444" />
//               <Text style={styles.errorText}>Unable to load preview</Text>
//               <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
//               <TouchableOpacity 
//                 style={styles.retryButton}
//                 onPress={() => {
//                   setLoading(true);
//                   setError(false);
//                   webViewRef.current?.reload();
//                 }}
//               >
//                 <Text style={styles.retryText}>Try Again</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//           {!loading && !error && pdfHtml && (
//             <View style={styles.webviewContainer}>
//               <WebView
//                 ref={webViewRef}
//                 source={{ 
//                   html: `
//                     <!DOCTYPE html>
//                     <html>
//                       <head>
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
//                         <style>
//                           body { 
//                             margin: 0; 
//                             padding: 16px; 
//                             -webkit-text-size-adjust: 100%;
//                             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//                           }
//                           img { max-width: 100%; height: auto; }
//                           table { width: 100%; border-collapse: collapse; }
//                           th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
//                         </style>
//                       </head>
//                       <body>
//                         ${pdfHtml}
//                       </body>
//                     </html>
//                   `
//                 }}
//                 style={styles.webview}
//                 onLoadStart={() => setLoading(true)}
//                 onLoadEnd={() => setLoading(false)}
//                 onError={(e) => {
//                   console.error('WebView error:', e.nativeEvent);
//                   setLoading(false);
//                   setError(true);
//                 }}
//                 startInLoadingState={true}
//                 renderLoading={() => (
//                   <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#7c3aed" />
//                   </View>
//                 )}
//               />
//             </View>
//           )}
//         </View>

//         {/* Bottom Actions */}
//         <View style={styles.footer}>
//           <TouchableOpacity 
//             style={[styles.downloadButtonLarge, isGeneratingPdf && styles.downloadButtonLargeDisabled]}
//             onPress={handleDownload}
//             disabled={isGeneratingPdf}
//           >
//             {isGeneratingPdf ? (
//               <>
//                 <ActivityIndicator size={20} color="white" />
//                 <Text style={styles.buttonText}>Generating PDF...</Text>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="download" size={20} color="white" />
//                 <Text style={styles.buttonText}>Download & Share PDF</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingTop: Platform.OS === 'ios' ? 60 : 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   closeButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#f3f4f6',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   downloadButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#f3f4f6',
//   },
//   downloadButtonDisabled: {
//     opacity: 0.6,
//   },
//   pdfContainer: {
//     flex: 1,
//     backgroundColor: '#e5e7eb',
//   },
//   webview: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f9fafb',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f9fafb',
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#ef4444',
//     marginTop: 16,
//     fontWeight: '600',
//   },
//   errorSubtext: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginTop: 8,
//   },
//   retryButton: {
//     marginTop: 16,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#7c3aed',
//     borderRadius: 8,
//   },
//   retryText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   webviewContainer: {
//     flex: 1,
//     zIndex: 1,
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//   },
//   downloadButtonLarge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#7c3aed',
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//   },
//   downloadButtonLargeDisabled: {
//     opacity: 0.7,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default PdfPreviewModal;


// import React from 'react'

// const PdfPreviewModal = () => {
//   return (
//     <div>PdfPreviewModal</div>
//   )
// }

// export default PdfPreviewModal