import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Print from "expo-print";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PdfPreviewModal from "../pdf/PdfPreviewModal";


export default function InvoiceListModal({
  visible,
  onClose,
  onCreateNew,
  data
}) {
  console.log(data)
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (visible && data?.TripId && data?.invoiceId) {
      fetchInvoices();
    }
  }, [visible, data?.TripId]);

  const fetchInvoices = async () => {
    if (!data?.TripId) {
      setError("Trip ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (data?.TripId) params.append('tripId', data.TripId);
      if (data?.invoiceId) params.append('invoiceId', data.invoiceId);

      const url = `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/invoice-management/invoice?${params.toString()}`;

      console.log('Fetching invoices from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch invoices: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Invoices response:', responseData);
      setInvoices(Array.isArray(responseData) ? responseData : [responseData]);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message || "Failed to load invoices. Please try again later.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = (invoice) => {
    onClose();
    // Ensure we have all required fields with proper fallbacks
    const invoiceData = {
      ...invoice,
      tripId: invoice.tripId || '000149-8585',
      customer: {
        name: invoice.customer?.name || '',
        email: invoice.customer?.email || '',
        contact: invoice.customer?.contact || '',
        address: {
          street: invoice.customer?.address?.street || '',
          city: invoice.customer?.address?.city || '',
          state: invoice.customer?.address?.state || '',
          zipCode: invoice.customer?.address?.zipCode || '',
          country: invoice.customer?.address?.country || '',
        }
      },
      destination: invoice.destination || '',
      travelDate: invoice.travelDate || new Date().toISOString().split('T')[0],
      pricing: invoice.pricing || {
        totalAmount: 0,
        gstAmount: 0,
        tcsAmount: 0,
        tcsClaim: []
      },
      payment: invoice.payment || {
        installments: []
      }
    };

    router.push({
      pathname: "/(tabs)/invoices/create",
      params: {
        initialData: JSON.stringify(invoiceData),
        tripId: invoiceData.tripId,
        isEdit: 'true'
      },
    });
  };

  const onViewInvoice = async (invoice) => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/packages-pdf-html",
        {
          "type": "invoice",
          "mode": "html",
          "tripId": invoice.tripId || data?.TripId,
          "invoiceId": invoice.invoiceId || invoice.invoiceNumber
        }
      );

      if (response.data) {
        setPdfHtml(response.data);
        setShowPdfModal(true);
        setRefreshKey((prev) => prev + 1);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      Alert.alert(
        "Error",
        "Failed to load invoice preview. Please try again."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePreviewClose = () => {
    setShowPdfModal(false);
    setPdfHtml(null);
  };

  const handleShareInvoice = async (invoice) => {
    try {
      // Generate PDF
      const html = generateInvoiceHtml(invoice);
      const { uri } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
      });

      // Share the PDF
      await Share.share({
        url: uri,
        title: `Invoice ${invoice.invoiceNumber}`,
        dialogTitle: `Share Invoice ${invoice.invoiceNumber}`,
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('Error', 'Failed to share invoice. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
      case "overdue":
        return { bg: "bg-red-100", text: "text-red-800" };
      case "partial":
        return { bg: "bg-blue-100", text: "text-blue-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  const getStatusText = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Draft";

  const latest = invoices[0];
  const previous = invoices.slice(1);

  // Add this function at the top level of your component
  const generateInvoiceHtml = (invoice) => {
    // This is a simplified version - you'll need to implement your actual invoice HTML template
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-info { margin-bottom: 30px; }
            .customer-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>${invoice.invoiceNumber || 'N/A'}</p>
          </div>
          
          <div class="invoice-info">
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${invoice.invoiceStatus || 'Pending'}</p>
          </div>
          
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p>${invoice.customer?.name || 'N/A'}</p>
            <p>${invoice.customer?.email || ''}</p>
            <p>${invoice.customer?.contact || ''}</p>
            <p>${invoice.customer?.address?.street || ''}</p>
            <p>${invoice.customer?.address?.city || ''}, ${invoice.customer?.address?.state || ''} ${invoice.customer?.address?.zipCode || ''}</p>
            <p>${invoice.customer?.address?.country || ''}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Package Amount</td>
                <td>₹${invoice.pricing?.totalAmount?.toLocaleString('en-IN') || '0'}</td>
              </tr>
              <tr>
                <td>GST (${invoice.pricing?.gstPercentage || 0}%)</td>
                <td>₹${invoice.pricing?.gstAmount?.toLocaleString('en-IN') || '0'}</td>
              </tr>
              <tr>
                <td>TCS (${invoice.pricing?.tcsPercentage || 0}%)</td>
                <td>₹${invoice.pricing?.tcsAmount?.toLocaleString('en-IN') || '0'}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total">
            <p>Total Amount: ₹${(invoice.pricing?.totalAmount +
        (invoice.pricing?.gstAmount || 0) +
        (invoice.pricing?.tcsAmount || 0)).toLocaleString('en-IN')}</p>
          </div>
          
          <div class="notes">
            <h3>Notes:</h3>
            <p>${invoice.notes || 'Thank you for your business!'}</p>
          </div>
        </body>
      </html>
    `;
  };

  const renderInvoiceItem = (invoice, isLatest = false) => (
    <View key={invoice.invoiceId || invoice.invoiceNumber} className={`bg-white p-4 mb-4 rounded-xl ${isLatest ? 'border border-purple-300' : ''}`}>
      {isLatest && (
        <Text className="text-xs text-gray-500 mb-1 font-medium">
          LATEST INVOICE
        </Text>
      )}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-purple-600 font-bold text-lg">
          {invoice.invoiceNumber || invoice.invoiceId}
        </Text>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(invoice.invoiceStatus || invoice.Status).bg}`}>
          <Text className={`text-xs font-medium ${getStatusColor(invoice.invoiceStatus || invoice.Status).text}`}>
            {getStatusText(invoice.invoiceStatus || invoice.Status)}
          </Text>
        </View>
      </View>

      <Text className="text-gray-900 font-semibold text-lg">
        ₹{invoice.pricing?.totalAmount?.toLocaleString('en-IN') || '0'}
      </Text>
      <Text className="text-gray-500 text-sm mb-1">
        Destination: {invoice.destination || 'N/A'}
      </Text>
      <Text className="text-gray-500 text-xs">
        {invoice.customer?.name} • {invoice.customer?.contact}
      </Text>

      <View className="flex-row justify-end mt-3 space-x-2">
        <TouchableOpacity
          className="bg-blue-100 p-2 rounded-full"
          onPress={() => onViewInvoice(invoice)}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Ionicons name="eye" size={18} color="#3b82f6" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-purple-100 p-2 rounded-full"
          onPress={() => handleEditInvoice(invoice)}
        >
          <Ionicons name="pencil" size={18} color="#7c3aed" />
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-purple-600 p-4 pt-12 rounded-b-3xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-bold">Quick Quotes</Text>
            <TouchableOpacity onPress={onClose} className="bg-white/20 p-2 rounded-full">
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/80 text-sm mt-2">Invoice Management</Text>
        </View>

        {/* Content */}
        <View className="flex-1 p-4">
          {/* Create New Invoice Button */}
          {!data?.invoiceId && <TouchableOpacity
            onPress={() => {
              onClose();
              setTimeout(() => onCreateNew(), 100);
            }}
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-2">Create New Invoice</Text>
          </TouchableOpacity>
          }
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text className="mt-2 text-gray-600">Loading invoices...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center p-6">
              <View className="bg-red-50 p-4 rounded-full mb-4">
                <Ionicons name="alert-circle" size={32} color="#ef4444" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">Couldn't load invoices</Text>
              <Text className="text-red-600 text-center mb-6">{error}</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={onClose}
                  className="border border-gray-300 px-6 py-2 rounded-lg"
                >
                  <Text className="text-gray-700">Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={fetchInvoices}
                  className="bg-purple-600 px-6 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : invoices.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
              <Text className="text-center text-gray-500 mt-4">No invoices found.</Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Create your first invoice to get started
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Latest Invoice */}
              {latest && renderInvoiceItem(latest, true)}

              {/* Previous Invoices */}
              {previous.length > 0 && (
                <View className="mt-2">
                  <Text className="text-xs text-gray-500 font-medium mb-2">
                    PREVIOUS INVOICES
                  </Text>
                  {previous.map((invoice) => renderInvoiceItem(invoice))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>

      <PdfPreviewModal
        key={refreshKey}
        visible={showPdfModal}
        pdfHtml={pdfHtml}
        onClose={handlePreviewClose}
        onShare={() => {
          // Additional onShare logic if needed
        }}
      />
    </Modal>
  );
}
