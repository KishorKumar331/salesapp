import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../auth/AuthManager";
import PdfPreviewModal from "../pdf/PdfPreviewModal";
import CustomPicker from "../ui/CustomPicker";
import DatePicker from "../ui/DatePicker";

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingBox: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
});

export default function InvoiceForm({
  tripId,
  onSubmit,
  initialData = null,
  tripData = null,
  isEdit = false,
  defaultCustomerName = "",
  defaultEmail = "",
  defaultContact = "",
  defaultDestination = "",
  defaultPax = "",
  defaultTravelDate = "",
}) {
  console.log(initialData);
  const [step, setStep] = useState("fillForm"); // 'selectQuotation' or 'fillForm'
  const [quotations, setQuotations] = useState([]);
  const [TripDetail, setTripDetail] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [quotationsLoading, setQuotationsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: userProfile } = useAuth();
  console.log(userProfile?.user?.company)
  const router = useRouter();
  const [pdfUri, setPdfUri] = useState(null);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const [formData, setFormData] = useState({
    invoiceId: "",
    invoiceNumber: "",
    tripId: tripId || "",
    finalPackageQuotationId: "",
    leadId: "",
    createdAt: "",
    updatedAt: "",
    invoiceDate: "",
    invoiceStatus: "Pending",
    currency: "INR",
    customer: {
      name: "",
      email: "",
      contact: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
    travelerSummary: {
      adults: 0,
      children: 0,
      infants: 0,
      totalTravelers: 0,
    },
    destination: "",
    travelDate: "",
    startDate: "",
    endDate: "",
    packageSummary: {
      packageName: "",
      packageType: "International",
      nights: 0,
      days: 0,
    },
    pricing: {
      baseAmount: 0,
      discountAmount: 0,
      taxableAmount: 0,
      gstPercentage: 0,
      gstAmount: 0,
      tcsPercentage: 0,
      tcsAmount: 0,
      otherCharges: [],
      totalAmount: 0,
      amountInWords: "",
      tcsClaim: Array.isArray(initialData?.pricing?.tcsClaim)
        ? initialData.pricing.tcsClaim
        : [{ panNumber: "", name: "", percentage: 0 }],
    },
    payment: {
      dueDate: "",
      totalPaid: 0,
      balanceAmount: 0,
      installments: [
        {
          installmentId: "",
          sequence: 1,
          installmentAmount: 0,
          installmentDate: "",
          status: "Pending",
          paymentMethod: "",
          paymentVerification: null,
          receivedDate: "",
          amountReceived: 0,
          utrNumber: "",
          amountReceivedBy: "",
          amountConfirmedBy: "",
          lastUpdatedDate: "",
          lastUpdatedBy: "",
        },
      ],
    },
    cancellationPolicy: {
      flights: "As per airline policy",
      hotel: "As per the hotel policy",
      land: [
        {
          fromDaysBeforeTravel: 20,
          toDaysBeforeTravel: null,
          chargeType: "PERCENT",
          value: 25,
        },
        {
          fromDaysBeforeTravel: 0,
          toDaysBeforeTravel: 19,
          chargeType: "PERCENT",
          value: 100,
        },
      ],
      nonRefundableComponents: ["Visa", "TCS", "Taxes", "Remittance charges"],
      jrCancellationChargePerPax: 2500,
      rescheduleChargePerPax: {
        amount: 2000,
        notes: "Per pax + fare difference for flights and land part",
      },
      latePaymentFee: {
        amount: 5000,
        notes: "Within allowable limits",
      },
    },
    deliverables: [
      { item: "Hotel Vouchers", required: true, provided: false },
      { item: "Cab/Driver Details", required: true, provided: false },
      { item: "Scanned copy of passport", required: true, provided: false },
      {
        item: "Scanned copy of flights and tickets",
        required: true,
        provided: false,
      },
      {
        item: "Payment screenshot (esp. NEFT)",
        required: true,
        provided: false,
      },
      { item: "Scanned copy of PAN card", required: true, provided: false },
    ],
    notes: "",
    meta: {
      createdBy: "",
      lastUpdatedBy: "",
      source: "mobile",
      companyProfileId: "",
      companyName: "",
      bankDetails: {},
    },
    auditTrail: [
      {
        action: "CREATE",
        performedBy: "",
        timestamp: "",
        details: "",
      },
    ],
  });

  // Load quotations when TripId is available
  useEffect(() => {
    if (tripId) {
      setFormData((prev) => ({ ...prev, tripId }));
      fetchQuotations();
      fetchTrips();
    }
  }, [tripId, userProfile]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?company=${userProfile?.user?.company}&tripId=${tripId}`
      );

      if (!response.ok) throw new Error("Failed to fetch trip details");

      const data = await response.json();
      setTripDetail(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching trip details:", error);
    }
  };

  // Apply initialData if passed (not used from screen currently, but kept)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Prefill from navigation params (customer, dest, pax, date)
  useEffect(() => {
    setFormData((prev) => {
      const pax = defaultPax
        ? parseInt(defaultPax, 10) || 0
        : prev.travelerSummary.totalTravelers;
      return {
        ...prev,
        customer: {
          ...prev.customer,
          name: defaultCustomerName || prev.customer.name,
          email: defaultEmail || prev.customer.email,
          contact: defaultContact || prev.customer.contact,
        },
        destination: defaultDestination || prev.destination,
        travelDate: defaultTravelDate || prev.travelDate,
        travelerSummary: {
          ...prev.travelerSummary,
          totalTravelers: pax || prev.travelerSummary.totalTravelers,
          adults: pax || prev.travelerSummary.adults,
        },
      };
    });
  }, [
    defaultCustomerName,
    defaultEmail,
    defaultContact,
    defaultDestination,
    defaultPax,
    defaultTravelDate,
  ]);

  // Load user profile meta
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        company: userProfile?.user?.company,

        meta: {
          ...prev.meta,
          lastUpdatedBy: userProfile?.user?.Email,
          source: "mobile",
          companyProfileId: userProfile?.user?.company,
          companyName: userProfile?.organization?.details?.companyname,
          bankDetails: userProfile?.organization?.financials || {},
        },
      }));
    }
  }, [userProfile]);

  const fetchQuotations = async () => {
    try {
      setQuotationsLoading(true);
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
      setQuotationsLoading(false);
    }
  };

  const handleQuotationSelectFromPicker = (quoteId) => {
    const quotation = quotations.find((q) => q.QuoteId === quoteId);
    if (quotation) {
      handleSelectQuotation(quotation);
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
      customer: {
        ...prev.customer,
        address: {
          ...prev.customer.address,
          [field]: value,
        },
      },
    }));
  };

  const addInstallment = () => {
    setFormData((prev) => {
      const currentInstallments = prev?.payment?.installments || [];
      return {
        ...prev,
        payment: {
          ...prev.payment,
          installments: [
            ...currentInstallments,
            {
              installmentId: "",
              sequence: currentInstallments.length + 1,
              installmentAmount: 0,
              installmentDate: "",
              status: "Pending",
              paymentMethod: "",
              paymentVerification: null,
              receivedDate: "",
              amountReceived: 0,
              utrNumber: "",
              amountReceivedBy: "",
              amountConfirmedBy: "",
              lastUpdatedDate: "",
              lastUpdatedBy: "",
            },
          ],
        },
      };
    });
  };

  const removeInstallment = (index) => {
    if ((formData?.payment?.installments?.length || 0) <= 1) {
      Alert.alert("Error", "At least one installment is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        installments: (prev?.payment?.installments || []).filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const updateInstallment = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        installments: (prev?.payment?.installments || []).map((inst, i) =>
          i === index ? { ...inst, [field]: value } : inst
        ),
      },
    }));
  };

  const addTcsClaim = () => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        tcsClaim: [
          ...(prev.pricing.tcsClaim || []),
          { panNumber: "", name: "", percentage: 0 },
        ],
      },
    }));
  };

  const removeTcsClaim = (index) => {
    if (!formData.pricing.tcsClaim || formData.pricing.tcsClaim.length <= 1) {
      Alert.alert("Error", "At least one TCS claim entry is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        tcsClaim: (prev.pricing.tcsClaim || []).filter((_, i) => i !== index),
      },
    }));
  };

  const updateTcsClaim = (index, field, value) => {
    setFormData((prev) => {
      const currentClaims = Array.isArray(prev.pricing.tcsClaim)
        ? [...prev.pricing.tcsClaim]
        : [];

      if (index >= currentClaims.length) {
        currentClaims.push({ panNumber: "", name: "", percentage: 0 });
      }

      const updatedClaims = currentClaims.map((claim, i) =>
        i === index ? { ...claim, [field]: value } : claim
      );

      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          tcsClaim: updatedClaims,
        },
      };
    });
  };

  const calculateInvoiceTotal = () => {
    const baseAmount = parseFloat(formData?.pricing?.totalAmount) || 0;
    const gst = parseFloat(formData?.pricing?.gstAmount) || 0;
    const tcs = parseFloat(formData?.pricing?.tcsAmount) || 0;
    return baseAmount + gst + tcs;
  };

  const generateInvoiceNumberValue = () => {
    const companyName = userProfile?.companyName || "JR";
    const initials =
      companyName
        .split(/\s+/)
        .map((w) => w[0]?.toUpperCase())
        .join("")
        .substring(0, 3) || "INV";
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
    return `${initials}-Inv-${timestamp}`;
  };

  const ensureInvoiceNumber = () => {
    if (formData.invoiceNumber && formData.invoiceNumber.length > 0) {
      return formData.invoiceNumber;
    }
    const newNumber = generateInvoiceNumberValue();
    setFormData((prev) => ({ ...prev, invoiceNumber: newNumber }));
    return newNumber;
  };

  const handleOpenPreview = async () => {
    if (!validateForm()) return;
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const dataWithUser = {
        ...formData,
        company: userProfile?.user?.company,
      };

      console.log("Invoice data with user:", dataWithUser);

      // Call the API endpoint to get HTML
      const response = await axios.post(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/packages-pdf-html",
        {
          type: "invoice",
          data: dataWithUser,
          templateName: userProfile?.user?.preferences?.invoicepdf || userProfile?.user?.Preference?.invoicepdf || userProfile?.user?.invoicepdf || "invoiceip.hbs",
          mode: "html",
          tripId: formData?.tripId,
        }
      );

      if (response.data) {
        console.log("HTML Content received from API");
        setPdfHtml(response.data);
        setPdfUri(null);
        setFormDataToSubmit({
          ...dataWithUser,
          CompanyId: userProfile?.user?.company,
          CompanyEmail: userProfile?.user?.Email,
        });
        setShowPdfModal(true);
        setRefreshKey((prev) => prev + 1);
        console.log("✅ HTML set for preview");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Error generating preview:", error);
      Alert.alert("Error", "Failed to generate preview. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePreviewClose = () => {
    setShowPdfModal(false);
  };

  const handleShare = async () => {
    if (!formDataToSubmit) {
      Alert.alert("Error", "No invoice data to submit");
      return;
    }

    try {
      console.log("📤 Submitting invoice to API...");
      await handleSubmitInvoice();
    } catch (error) {
      console.error("❌ Error submitting:", error);
      Alert.alert(
        "Error",
        "Failed to submit invoice: " + (error?.message || error)
      );
    }
  };

  const handleSelectQuotation = (quotation) => {
    if (!quotation) return;

    const totalCost =
      (Number(quotation.Costs?.FlightCost) || 0) +
      (Number(quotation.Costs?.VisaCost) || 0) +
      (Number(quotation.Costs?.LandPackageCost) || 0);

    const adults =
      (quotation.NoOfPax || 0) -
      (quotation.Child || 0) -
      (parseInt(quotation.Infant) || 0);

    setSelectedQuotation(quotation);
    setFormData((prev) => ({
      ...prev,
      finalPackageQuotationId: quotation.QuoteId || "",
      leadId: quotation.LeadId || "",
      customer: {
        ...prev.customer,
        name: quotation["Client-Name"] || "",
        email: quotation["Client-Email"] || "",
        contact: quotation["Client-Contact"] || "",
      },
      destination: quotation.DestinationName || "",
      startDate: quotation.TravelDate || "",
      endDate: quotation.TravelEndDate || "",
      // travelDate: quotation.TravelDate || "",
      travelerSummary: {
        ...prev.travelerSummary,
        adults: adults,
        children: quotation.Child || 0,
        infants: parseInt(quotation.Infant) || 0,
        totalTravelers: quotation.NoOfPax || 0,
      },
      packageSummary: {
        ...prev.packageSummary,
        nights: quotation.Nights || 0,
        days: quotation.Days || 0,
        packageName: quotation.QuoteId || "",
      },
      pricing: {
        ...prev.pricing,
        baseAmount: quotation.Costs?.TotalCost || totalCost,
        gstAmount: quotation.Costs?.GSTAmount || 0,
        tcsAmount: quotation.Costs?.TCSAmount || 0,
        totalAmount: totalCost,
      },
    }));
    setStep("fillForm");
  };

  const validateForm = () => {
    if (!formData.finalPackageQuotationId) {
      Alert.alert("Error", "Please select a quotation");
      return false;
    }
    if (!formData.customer.name) {
      Alert.alert("Error", "Customer name is required");
      return false;
    }
    if (!formData.pricing.totalAmount) {
      Alert.alert("Error", "Total amount is required");
      return false;
    }
    return true;
  };
  const query = useQueryClient();
  const handleSubmitInvoice = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const invoiceNumber = ensureInvoiceNumber();
      const today = new Date().toISOString();

      const auditEntry = {
        action: "Created",
        timestamp: today,
        performedBy: userProfile?.user?.Email || "system",
        changes: {
          status: "Pending",
          invoiceNumber,
        },
      };

      const cleanedData = {
        invoiceNumber,
        invoiceId: formData.tripId || tripId,
        tripId: formData.tripId || tripId,
        company: formData.company,
        finalPackageQuotationId: formData.finalPackageQuotationId,
        customer: formData.customer,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelDate: formData.travelDate,
        travelerSummary: formData.travelerSummary,
        pricing: formData.pricing,
        payment: formData.payment,
        cancellationPolicy: formData.cancellationPolicy,
        deliverables: formData.deliverables,
        notes: formData.notes,
        invoiceDate: today.split("T")[0],
        meta: {
          createdBy: userProfile?.user?.Email || "",
          companyProfileId: userProfile?.user?.company || "",
          companyName: userProfile?.organization?.details?.companyname || "",
          bankDetails: userProfile?.organization?.financials || {},
          source: "mobile",
        },
        auditTrail: [auditEntry],
      };

      console.log("📋 Invoice Payload:", cleanedData);

      const response = await fetch(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/invoice-management/invoice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanedData),
        }
      );
      if (!response.ok) {
        const text = await response.text();
        console.log("Invoice API error:", text);
        throw new Error("Failed to save invoice");
      }

      let data = null;
      try {
        data = await response.json();

        await axios.put(
          `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote`,
          {
            invoiceId: data?.invoiceId,
            TripId: TripDetail[0]?.TripId || formData.tripId,
            LeadId: TripDetail[0]?.LeadId || formData.leadId,
            company: TripDetail[0]?.company || userProfile?.user?.company,
            CreatedAt: TripDetail[0]?.CreatedAt,
            LatestQuotationId: cleanedData?.finalPackageQuotationId,
            InvoiceCreated: true,
            latestStatus: "Cold"
          }
        );

        setTimeout(() => {
          router.replace("/(tabs)/invoices");
        }, 1000);
      } catch (err) {
        console.error("Error updating lead after invoice:", err);
      }
      await query.invalidateQueries({ queryKey: ["followup"] });

      Alert.alert("Success", "Invoice submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            setShowPdfModal(false);
            if (onSubmit) {
              onSubmit(data || cleanedData);
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving invoice:", error);
      Alert.alert("Error", error.message || "Failed to save invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quotationOptions = quotations.map((q) => ({
    label: `${q.QuoteId} - ₹${q.Costs?.TotalCost?.toLocaleString("en-IN") || 0
      }`,
    value: q.QuoteId,
  }));

  // Form Filling Step
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-1">
        {selectedQuotation && (
          <View className="bg-blue-50 p-3 rounded-lg mb-4 flex-row justify-between items-center">
            <Text className="text-blue-800">
              Using Quotation #
              {selectedQuotation?.QuoteId || selectedQuotation?.id}
            </Text>
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
          {quotationsLoading ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : (
            <CustomPicker
              items={quotationOptions}
              selectedValue={formData?.finalPackageQuotationId}
              onValueChange={handleQuotationSelectFromPicker}
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
            value={formData?.customer?.name || ""}
            onChangeText={(value) =>
              updateNestedField("customer", "name", value)
            }
            placeholder="Customer name"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData?.customer?.email || ""}
            onChangeText={(value) =>
              updateNestedField("customer", "email", value)
            }
            placeholder="customer@email.com"
            keyboardType="email-address"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">
            Contact
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={formData?.customer?.contact || ""}
            onChangeText={(value) =>
              updateNestedField("customer", "contact", value)
            }
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
            value={formData?.customer?.address?.street || ""}
            onChangeText={(value) => updateAddressField("street", value)}
            placeholder="Street address"
          />

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                City
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData?.customer?.address?.city || ""}
                onChangeText={(value) => updateAddressField("city", value)}
                placeholder="City"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                State
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData?.customer?.address?.state || ""}
                onChangeText={(value) => updateAddressField("state", value)}
                placeholder="State"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData?.customer?.address?.zipCode || ""}
                onChangeText={(value) => updateAddressField("zipCode", value)}
                placeholder="Zip"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Country
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={formData?.customer?.address?.country || ""}
                onChangeText={(value) => updateAddressField("country", value)}
                placeholder="Country"
              />
            </View>
          </View>
        </View>

        {/* Financial Details */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Financial Details
          </Text>

          {/* Package Amount (Read-only from quotation) */}
          <View className="bg-gray-50 rounded-lg p-3 mb-3">
            <Text className="text-sm text-gray-600 mb-1">Package Amount</Text>
            <Text className="text-2xl font-bold text-gray-900">
              ₹
              {parseFloat(formData?.pricing?.totalAmount || 0).toLocaleString(
                "en-IN"
              )}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              From selected quotation
            </Text>
          </View>

          {/* Editable GST and TCS */}
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                GST (₹)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={(formData?.pricing?.gstAmount || 0).toString()}
                onChangeText={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      gstAmount: parseFloat(value) || 0,
                    },
                  }))
                }
                placeholder="GST amount"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                TCS (₹)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white"
                value={(formData?.pricing?.tcsAmount || 0).toString()}
                onChangeText={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      tcsAmount: parseFloat(value) || 0,
                    },
                  }))
                }
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
                  ₹
                  {parseFloat(
                    formData?.pricing?.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">GST:</Text>
                <Text className="font-semibold text-gray-900">
                  ₹
                  {parseFloat(formData?.pricing?.gstAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">TCS:</Text>
                <Text className="font-semibold text-gray-900">
                  ₹
                  {parseFloat(formData?.pricing?.tcsAmount || 0).toLocaleString(
                    "en-IN"
                  )}
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
            <Text className="text-lg font-semibold text-gray-900">
              Installments
            </Text>
            <TouchableOpacity
              onPress={addInstallment}
              className="bg-purple-600 rounded-lg px-4 py-2 flex-row items-center"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-medium ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {formData?.payment?.installments?.map((installment, index) => (
            <View
              key={index}
              className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-gray-900">
                  Installment {index + 1}
                </Text>
                {formData?.payment?.installments?.length > 1 && (
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
                value={installment.installmentAmount.toString()}
                onChangeText={(value) =>
                  updateInstallment(
                    index,
                    "installmentAmount",
                    parseFloat(value) || 0
                  )
                }
                placeholder="Installment amount"
                keyboardType="numeric"
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Installment Date
              </Text>
              <DatePicker
                value={installment.installmentDate}
                onDateChange={(value) =>
                  updateInstallment(index, "installmentDate", value)
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
                {(formData?.payment?.installments || [])
                  .reduce((sum, inst) => sum + (inst.installmentAmount || 0), 0)
                  .toLocaleString("en-IN")}
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-700">
                Invoice Total (with GST & TCS):
              </Text>
              <Text className="font-semibold text-purple-700">
                ₹{calculateInvoiceTotal().toLocaleString("en-IN")}
              </Text>
            </View>
            {calculateInvoiceTotal() > 0 &&
              (formData?.payment?.installments || []).reduce(
                (sum, inst) => sum + (inst.installmentAmount || 0),
                0
              ) !== calculateInvoiceTotal() && (
                <Text className="text-red-600 text-xs mt-2">
                  ⚠️ Installments don&apos;t match invoice total (₹
                  {calculateInvoiceTotal().toLocaleString("en-IN")})
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
            value={formData?.cancellationPolicy?.flights || ""}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                cancellationPolicy: {
                  ...prev.cancellationPolicy,
                  flights: value,
                },
              }))
            }
            placeholder="Enter cancellation policy details..."
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* TCS Claim */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              TCS Claim
            </Text>
            <TouchableOpacity
              onPress={addTcsClaim}
              className="bg-purple-600 rounded-lg px-4 py-2 flex-row items-center"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-medium ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {formData?.pricing?.tcsClaim &&
            Array.isArray(formData.pricing.tcsClaim) &&
            formData.pricing.tcsClaim.map((claim, index) => (
              <View
                key={index}
                className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-semibold text-gray-900">
                    TCS Claim {index + 1}
                  </Text>
                  {formData.pricing.tcsClaim.length > 1 && (
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
                  onChangeText={(value) => updateTcsClaim(index, "name", value)}
                  placeholder="Name"
                />

                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Percentage (%)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                  value={claim.percentage.toString()}
                  onChangeText={(value) =>
                    updateTcsClaim(index, "percentage", parseFloat(value) || 0)
                  }
                  placeholder="Percentage"
                  keyboardType="numeric"
                />
              </View>
            ))}
        </View>

        {/* Notes */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Notes
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={formData?.notes || ""}
            onChangeText={(value) => updateFormData("notes", value)}
            placeholder="Additional notes..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-6 mb-8">
          <TouchableOpacity
            onPress={() => setStep("selectQuotation")}
            className="border border-purple-600 rounded-xl p-4 flex-1 mr-2 items-center"
          >
            <Text className="text-purple-600 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOpenPreview}
            className="bg-purple-600 rounded-xl p-4 flex-1 ml-2 items-center"
          >
            <Text className="text-white font-bold">Preview & Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Overlay */}
      {isGeneratingPdf && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Preparing Preview...</Text>
          </View>
        </View>
      )}

      <PdfPreviewModal
        key={refreshKey}
        visible={showPdfModal}
        pdfUri={pdfUri}
        pdfHtml={pdfHtml}
        onClose={handlePreviewClose}
        onShare={handleShare}
      />
    </ScrollView>
  );
}
