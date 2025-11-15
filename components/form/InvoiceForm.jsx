import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import DatePicker from "@/components/ui/DatePicker";
import CustomPicker from "@/components/ui/CustomPicker";
import { generateInvoiceHtml } from "@/utils/invoiceGenerator";

// Styles for the modal and buttons
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    padding: 10,
  },
  webview: {
    flex: 1,
  },
});

export default function InvoiceForm({ tripId, onSubmit, initialData = null, onCancel }) {
  const [step, setStep] = useState('selectQuotation'); // 'selectQuotation' or 'fillForm'
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [formData, setFormData] = useState({
    TripId: tripId,
    FinalPackageQuotationId: "",
    CustomerDetails: {
      Name: "",
      Email: "",
      Contact: "",
      Address: {
        Street: "",
        City: "",
        State: "",
        ZipCode: "",
        Country: "",
      },
    },
    Destination: "",
    StartDate: "",
    EndDate: "",
    TravelDate: "",
    NumberOfTravelers: 0,
    TCS: "",
    GST: "",
    TotalAmount: "",
    TcsClaim: initialData?.TcsClaim || [{ panNumber: "", name: "", percentage: "" }],
    Installments: [
      {
        InstallmentAmount: 0,
        InstallmentDate: "",
        Status: "Pending",
        PaymentVerification: null,
        VerifiedBy: null,
        ReceivedDate: "",
        AmountRecieved: "",
        UTR_Number: "",
        AmountReceivedBy: "",
        AmountConfirmedBy: "",
        LastUpdatedDate: "",
        LastUpdatedBy: "",
      },
    ],

      CancellationDetails:
        "Flight - As Per Airline Policy\n\nHotel - As Per the Hotel Policy\n\nLand Part - 25% Cancel Charges Before 20 Days of Travel\n\nLand Part - Within 20 Days of Travel No Refund\n\nAny Visa, TCS, Taxes, and Remittance charges paid will be Non-refundable\nJourney Routers Cancellation Charges - INR 2500 Per Pax\n\nReschedule Charges - INR 2,000 Per Pax + Fare Difference If any (For Flights and Land Part)\n\nLate Payment Fee - INR 5,000 (within allowable limits)",
    Notes: "",
    AuditTrail: [
      {
        Action: "",
        PerformedBy: "",
        Timestamp: "",
        Details: "",
      },
    ],
    TcsClaim: [{ panNumber: "", name: "", percentage: "" }],
    Deliverables:
      "Hotel Vouchers\n\nCab/Driver Details (*Before Trip Start Date)\n\nScanned copy of passport\n\nScanned copy of flights and tickets\n\nScreenshot of payment when done - especially for NEFT Payment\n\nScanned copy of PAN card",
  });

  useEffect(() => {
    if (tripId) {
      fetchQuotations();
    }
  }, [tripId]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations?TripId=${tripId}`
      );

      if (!response.ok) throw new Error("Failed to fetch quotations");

      const data = await response.json();
      setQuotations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      Alert.alert("Error", "Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  const handleQuotationSelect = (quoteId) => {
    const quotation = quotations.find((q) => q.QuoteId === quoteId);
    if (quotation) {
      setSelectedQuotation(quotation);

      // Calculate total from costs
      const totalCost =
        (quotation.Costs?.FlightCost || 0) +
        (quotation.Costs?.VisaCost || 0) +
        (quotation.Costs?.LandPackageCost || 0);

      // Auto-fill form with quotation data
      setFormData((prev) => ({
        ...prev,
        FinalPackageQuotationId: quoteId,
        CustomerDetails: {
          ...prev.CustomerDetails,
          Name: quotation["Client-Name"] || "",
          Email: quotation["Client-Email"] || "",
          Contact: quotation["Client-Contact"] || "",
        },
        Destination: quotation.DestinationName || "",
        StartDate: quotation.TravelDate || "",
        EndDate: quotation.TravelEndDate || "",
        TravelDate: quotation.TravelDate || "",
        NumberOfTravelers: quotation.NoOfPax || 0,
        TotalAmount: totalCost.toString(),
        GST: quotation.Costs?.GSTAmount?.toString() || "",
        TCS: quotation.Costs?.TCSAmount?.toString() || "",
      }));
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const updateAddressField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      CustomerDetails: {
        ...prev.CustomerDetails,
        Address: {
          ...prev.CustomerDetails.Address,
          [field]: value,
        },
      },
    }));
  };

  const addInstallment = () => {
    setFormData((prev) => ({
      ...prev,
      Installments: [
        ...prev.Installments,
        {
          InstallmentAmount: 0,
          InstallmentDate: "",
          Status: "Pending",
          PaymentVerification: null,
          VerifiedBy: null,
          ReceivedDate: "",
          AmountRecieved: "",
          UTR_Number: "",
          AmountReceivedBy: "",
          AmountConfirmedBy: "",
          LastUpdatedDate: "",
          LastUpdatedBy: "",
        },
      ],
    }));
  };

  const removeInstallment = (index) => {
    if (formData.Installments.length === 1) {
      Alert.alert("Error", "At least one installment is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Installments: prev.Installments.filter((_, i) => i !== index),
    }));
  };

  const updateInstallment = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      Installments: prev.Installments.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      ),
    }));
  };

  const addTcsClaim = () => {
    setFormData((prev) => ({
      ...prev,
      // Ensure TcsClaim exists and is an array before spreading
      TcsClaim: [...(prev.TcsClaim || []), { panNumber: "", name: "", percentage: "" }],
    }));
  };

  const removeTcsClaim = (index) => {
    if (!formData.TcsClaim || formData.TcsClaim.length <= 1) {
      Alert.alert("Error", "At least one TCS claim entry is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      TcsClaim: (prev.TcsClaim || []).filter((_, i) => i !== index),
    }));
  };

  const updateTcsClaim = (index, field, value) => {
    setFormData((prev) => {
      // Ensure TcsClaim exists and is an array
      const currentClaims = Array.isArray(prev.TcsClaim) ? [...prev.TcsClaim] : [];
      
      // If the index is out of bounds, add a new claim
      if (index >= currentClaims.length) {
        currentClaims.push({ panNumber: "", name: "", percentage: "" });
      }
      
      // Update the specific claim
      const updatedClaims = currentClaims.map((claim, i) =>
        i === index ? { ...claim, [field]: value } : claim
      );
      
      return {
        ...prev,
        TcsClaim: updatedClaims,
      };
    });
  };

  // Calculate invoice total with GST and TCS
  const calculateInvoiceTotal = () => {
    const baseAmount = parseFloat(formData.TotalAmount) || 0;
    const gst = parseFloat(formData.GST) || 0;
    const tcs = parseFloat(formData.TCS) || 0;
    return baseAmount + gst + tcs;
  };

  const generatePreviewHtml = () => {
    // Generate HTML for the invoice preview
    const previewData = {
      ...formData,
      InvoiceNumber: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      InvoiceDate: new Date().toISOString().split('T')[0],
      DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    
    return generateInvoiceHtml(previewData);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const generatePdf = async (forSharing = false) => {
    try {
      setIsGeneratingPdf(true);
      
      // First save the form data if needed
      if (!forSharing) {
        await handleSubmit(false);
      }
      
      // Generate HTML for the invoice
      const invoiceNumber = 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const html = generateInvoiceHtml({
        ...formData,
        InvoiceNumber: invoiceNumber,
        InvoiceDate: new Date().toISOString().split('T')[0],
        DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
      });
      
      // Generate a filename
      const customerName = formData.CustomerDetails?.Name?.replace(/\s+/g, '_') || 'Customer';
      const filename = `Invoice_${customerName}_${invoiceNumber}.pdf`;
      const newUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Move the file to a permanent location
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });
      
      return newUri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      throw error;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const pdfUri = await generatePdf(false);
      // For Android, we'll use the share dialog as a save option
      await shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Invoice',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      // Error already handled in generatePdf
    }
  };

  const sharePdf = async () => {
    try {
      const pdfUri = await generatePdf(true);
      await shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Invoice',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      // Error already handled in generatePdf
    }
  };

  // Fetch quotations when the component mounts or tripId changes
  useEffect(() => {
    const fetchQuotations = async () => {
      if (!tripId) return;
      
      try {
        setLoading(true);
        // Replace this with your actual API call to fetch quotations
        // const response = await fetch(`/api/quotations?tripId=${tripId}`);
        // const data = await response.json();
        // setQuotations(data);
        
        // Mock data for now
        const mockQuotations = [
          {
            id: "Q123",
            customerName: initialData?.CustomerDetails?.Name || "John Doe",
            customerEmail: initialData?.CustomerDetails?.Email || "john@example.com",
            customerContact: initialData?.CustomerDetails?.Contact || "+1234567890",
            destination: initialData?.Destination || "Paris, France",
            numberOfTravelers: initialData?.NumberOfTravelers || 2,
            travelDate: initialData?.TravelDate || "2023-12-15",
            totalAmount: initialData?.TotalAmount || 2500,
            createdAt: new Date().toISOString(),
          },
        ];
        
        setQuotations(mockQuotations);
        
        // If initialData is provided, pre-select the first quotation
        if (initialData?.FinalPackageQuotationId) {
          const selected = mockQuotations.find(q => q.id === initialData.FinalPackageQuotationId);
          if (selected) {
            handleSelectQuotation(selected);
          }
        } else if (mockQuotations.length === 1) {
          // Auto-select if there's only one quotation
          handleSelectQuotation(mockQuotations[0]);
        }
      } catch (error) {
        console.error('Error fetching quotations:', error);
        Alert.alert('Error', 'Failed to load quotations');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [tripId, initialData]);

  const handleSelectQuotation = (quotation) => {
    if (!quotation) return;
    
    setSelectedQuotation(quotation);
    setFormData(prev => ({
      ...prev,
      FinalPackageQuotationId: quotation.id || "",
      CustomerDetails: {
        ...prev.CustomerDetails,
        Name: quotation.customerName || "",
        Email: quotation.customerEmail || "",
        Contact: quotation.customerContact || "",
      },
      Destination: quotation.destination || "",
      NumberOfTravelers: quotation.numberOfTravelers || 1,
      TravelDate: quotation.travelDate || "",
      TotalAmount: quotation.totalAmount?.toString() || "",
      // Ensure TcsClaim is always an array with at least one empty object
      TcsClaim: prev.TcsClaim?.length > 0 ? prev.TcsClaim : [{ panNumber: "", name: "", percentage: "" }]
    }));
    setStep('fillForm');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.FinalPackageQuotationId) {
      Alert.alert("Error", "Please select a quotation");
      return false;
    }
    if (!formData.CustomerDetails.Name) {
      Alert.alert("Error", "Customer name is required");
      return false;
    }
    if (!formData.TotalAmount) {
      Alert.alert("Error", "Total amount is required");
      return false;
    }

    try {
      // Generate preview first
      const previewData = {
        ...formData,
        TripId: tripId,
        InvoiceDate: new Date().toISOString().split('T')[0],
      };
      
      // Call the parent's onSubmit with the form data
      await onSubmit(previewData);
      return true;
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert("Error", error.message || "Failed to save invoice. Please try again.");
      return false;
    }
  };

  const quotationOptions = quotations.map((q) => ({
    label: `${q.QuoteId} - ₹${q.Costs?.TotalCost?.toLocaleString("en-IN") || 0}`,
    value: q.QuoteId,
  }));

  // Quotation Selection Step
  if (step === 'selectQuotation') {
    return (
      <View className="flex-1 bg-gray-50 p-4">
        <Text className="text-xl font-bold mb-4">Select Quotation</Text>
        {quotations.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">No quotations found for this trip</Text>
          </View>
        ) : (
          <ScrollView className="flex-1">
            {quotations.map((quotation) => (
              <TouchableOpacity
                key={quotation.id}
                className="bg-white p-4 rounded-lg mb-3 shadow-sm"
                onPress={() => handleSelectQuotation(quotation)}
              >
                <Text className="font-bold text-lg">Quotation #{quotation.id}</Text>
                <Text className="text-gray-600">{quotation.customerName}</Text>
                <Text className="text-gray-600">Amount: ₹{quotation.totalAmount?.toLocaleString()}</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {quotation.destination} • {new Date(quotation.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-gray-200 px-6 py-3 rounded-lg"
            onPress={onCancel}
          >
            <Text className="text-gray-800 font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-purple-600 px-6 py-3 rounded-lg"
            onPress={() => setStep('fillForm')}
          >
            <Text className="text-white font-medium">Skip & Create Blank</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Form Filling Step
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {selectedQuotation && (
          <View className="bg-blue-50 p-3 rounded-lg mb-4 flex-row justify-between items-center">
            <Text className="text-blue-800">
              Using Quotation #{selectedQuotation.id}
            </Text>
            <TouchableOpacity onPress={() => setStep('selectQuotation')}>
              <Text className="text-blue-600 font-medium">Change</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Header */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Create Invoice
          </Text>
          <Text className="text-gray-600">
            Select a quotation and fill in the details
          </Text>
        </View>

        {/* Quotation Selection */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Select Quotation
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : (
            <CustomPicker
              items={quotationOptions}
              selectedValue={formData.FinalPackageQuotationId}
              onValueChange={handleQuotationSelect}
              placeholder="Select a quotation"
              title="Select Quotation"
            />
          )}
        </View>

        {/* Customer Details */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Customer Details
          </Text>

          <Text className="text-sm font-medium text-gray-700 mb-2">Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData.CustomerDetails.Name}
            onChangeText={(value) => updateNestedField("CustomerDetails", "Name", value)}
            placeholder="Customer name"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData.CustomerDetails.Email}
            onChangeText={(value) => updateNestedField("CustomerDetails", "Email", value)}
            placeholder="customer@email.com"
            keyboardType="email-address"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">Contact</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData.CustomerDetails.Contact}
            onChangeText={(value) => updateNestedField("CustomerDetails", "Contact", value)}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />

          {/* Address */}
          <Text className="text-base font-semibold text-gray-900 mt-3 mb-2">
            Address
          </Text>

          <Text className="text-sm font-medium text-gray-700 mb-2">Street</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData?.CustomerDetails?.Address?.Street}
            onChangeText={(value) => updateAddressField("Street", value)}
            placeholder="Street address"
          />

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData.CustomerDetails.Address.City}
                onChangeText={(value) => updateAddressField("City", value)}
                placeholder="City"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">State</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData.CustomerDetails.Address.State}
                onChangeText={(value) => updateAddressField("State", value)}
                placeholder="State"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">Zip Code</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData.CustomerDetails.Address.ZipCode}
                onChangeText={(value) => updateAddressField("ZipCode", value)}
                placeholder="Zip"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">Country</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData.CustomerDetails.Address.Country}
                onChangeText={(value) => updateAddressField("Country", value)}
                placeholder="Country"
              />
            </View>
          </View>
        </View>

        {/* Trip Details */}
        {/* <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Trip Details
          </Text>

          <Text className="text-sm font-medium text-gray-700 mb-2">Destination</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData.Destination}
            onChangeText={(value) => updateFormData("Destination", value)}
            placeholder="Destination"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">Travel Date</Text>
          <DatePicker
            value={formData.TravelDate}
            onDateChange={(value) => updateFormData("TravelDate", value)}
            placeholder="Select travel date"
          />

          <View className="flex-row gap-3 mt-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">Start Date</Text>
              <DatePicker
                value={formData.StartDate}
                onDateChange={(value) => updateFormData("StartDate", value)}
                placeholder="Start date"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">End Date</Text>
              <DatePicker
                value={formData.EndDate}
                onDateChange={(value) => updateFormData("EndDate", value)}
                placeholder="End date"
              />
            </View>
          </View>

          <Text className="text-sm font-medium text-gray-700 mb-2 mt-3">
            Number of Travelers
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={formData.NumberOfTravelers.toString()}
            onChangeText={(value) => updateFormData("NumberOfTravelers", parseInt(value) || 0)}
            placeholder="Number of travelers"
            keyboardType="numeric"
          />
        </View> */}

        {/* Financial Details */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Financial Details
          </Text>

          {/* Package Amount (Read-only from quotation) */}
          <View className="bg-gray-50 rounded-lg p-3 mb-3">
            <Text className="text-sm text-gray-600 mb-1">Package Amount</Text>
            <Text className="text-2xl font-bold text-gray-900">
              ₹{parseFloat(formData.TotalAmount || 0).toLocaleString("en-IN")}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              From selected quotation
            </Text>
          </View>

          {/* Editable GST and TCS */}
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">GST (₹)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData.GST}
                onChangeText={(value) => updateFormData("GST", value)}
                placeholder="GST amount"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">TCS (₹)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData.TCS}
                onChangeText={(value) => updateFormData("TCS", value)}
                placeholder="TCS amount"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Invoice Total Calculation */}
          <View className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Invoice Breakdown
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Package Amount:</Text>
                <Text className="font-semibold text-gray-900">
                  ₹{parseFloat(formData.TotalAmount || 0).toLocaleString("en-IN")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">GST:</Text>
                <Text className="font-semibold text-gray-900">
                  ₹{parseFloat(formData.GST || 0).toLocaleString("en-IN")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">TCS:</Text>
                <Text className="font-semibold text-gray-900">
                  ₹{parseFloat(formData.TCS || 0).toLocaleString("en-IN")}
                </Text>
              </View>
              <View className="border-t border-purple-300 pt-2 mt-2">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-bold text-purple-700">
                    Invoice Total:
                  </Text>
                  <Text className="text-lg font-bold text-purple-700">
                    ₹{calculateInvoiceTotal().toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Installments */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">Installments</Text>
            <TouchableOpacity
              onPress={addInstallment}
              className="bg-purple-600 rounded-lg px-4 py-2 flex-row items-center"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-medium ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {formData.Installments.map((installment, index) => (
            <View
              key={index}
              className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-gray-900">
                  Installment {index + 1}
                </Text>
                {formData.Installments.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeInstallment(index)}
                    className="bg-red-100 rounded-full p-1"
                  >
                    <Ionicons name="trash" size={16} color="#dc2626" />
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
                value={installment.InstallmentAmount.toString()}
                onChangeText={(value) =>
                  updateInstallment(index, "InstallmentAmount", parseFloat(value) || 0)
                }
                placeholder="Installment amount"
                keyboardType="numeric"
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Installment Date
              </Text>
              <DatePicker
                value={installment.InstallmentDate}
                onDateChange={(value) =>
                  updateInstallment(index, "InstallmentDate", value)
                }
                placeholder="Select installment date"
              />
            </View>
          ))}

          {/* Installment Summary */}
          <View className="bg-purple-50 rounded-lg p-3 mt-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Total Installments:</Text>
              <Text className="font-semibold text-gray-900">
                ₹
                {formData.Installments.reduce(
                  (sum, inst) => sum + (inst.InstallmentAmount || 0),
                  0
                ).toLocaleString("en-IN")}
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-700">Invoice Total (with GST & TCS):</Text>
              <Text className="font-semibold text-purple-700">
                ₹{calculateInvoiceTotal().toLocaleString("en-IN")}
              </Text>
            </View>
            {calculateInvoiceTotal() > 0 &&
              formData.Installments.reduce(
                (sum, inst) => sum + (inst.InstallmentAmount || 0),
                0
              ) !== calculateInvoiceTotal() && (
                <Text className="text-red-600 text-xs mt-2">
                  ⚠️ Installments don't match invoice total (₹{calculateInvoiceTotal().toLocaleString("en-IN")})
                </Text>
              )}
          </View>
        </View>

        {/* Cancellation Details */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Cancellation Policy
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={formData.CancellationDetails}
            onChangeText={(value) => updateFormData("CancellationDetails", value)}
            placeholder="Enter cancellation policy details..."
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* TCS Claim */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">TCS Claim</Text>
            <TouchableOpacity
              onPress={addTcsClaim}
              className="bg-purple-600 rounded-lg px-4 py-2 flex-row items-center"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-medium ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {formData.TcsClaim.map((claim, index) => (
            <View
              key={index}
              className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-gray-900">
                  TCS Claim {index + 1}
                </Text>
                {formData.TcsClaim.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeTcsClaim(index)}
                    className="bg-red-100 rounded-full p-1"
                  >
                    <Ionicons name="trash" size={16} color="#dc2626" />
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
                value={claim.panNumber}
                onChangeText={(value) =>
                  updateTcsClaim(index, "panNumber", value)
                }
                placeholder="PAN Number"
                autoCapitalize="characters"
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
                value={claim.name}
                onChangeText={(value) =>
                  updateTcsClaim(index, "name", value)
                }
                placeholder="Name"
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Percentage (%)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={claim.percentage}
                onChangeText={(value) =>
                  updateTcsClaim(index, "percentage", value)
                }
                placeholder="Percentage"
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>

        {/* Notes */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Notes</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={formData.Notes}
            onChangeText={(value) => updateFormData("Notes", value)}
            placeholder="Additional notes..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-6 mb-6">
          <TouchableOpacity
            className="flex-1 bg-purple-600 py-3 rounded-xl"
            onPress={handlePreview}
            disabled={isGeneratingPdf}
          >
            <Text className="text-white text-center font-semibold text-sm">
              {isGeneratingPdf ? 'Generating...' : 'Preview'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-green-600 py-3 rounded-xl"
            onPress={downloadPdf}
            disabled={isGeneratingPdf}
          >
            <Text className="text-white text-center font-semibold text-sm">
              {isGeneratingPdf ? 'Generating...' : 'Save PDF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-600 py-3 rounded-xl"
            onPress={sharePdf}
            disabled={isGeneratingPdf}
          >
            <Text className="text-white text-center font-semibold text-sm">
              {isGeneratingPdf ? 'Generating...' : 'Share'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PDF Preview Modal */}
        <Modal
          visible={showPreview}
          animationType="slide"
          onRequestClose={() => setShowPreview(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice Preview</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPreview(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <WebView
              source={{ html: generatePreviewHtml() }}
              style={styles.webview}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#7c3aed" />
                </View>
              )}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#6b7280' }]}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className="flex-row justify-between mt-6 mb-8">
          <TouchableOpacity
            onPress={() => setStep('selectQuotation')}
            className="border border-purple-600 rounded-xl p-4 flex-1 mr-2 items-center"
          >
            <Text className="text-purple-600 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-purple-600 rounded-xl p-4 flex-1 ml-2 items-center"
          >
            <Text className="text-white font-bold">Preview & Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
