import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";
import DatePicker from "@/components/ui/DatePicker";
import CustomPicker from "@/components/ui/CustomPicker";
import { getUserProfile } from "@/utils/userProfile";

const DestinationList = [
  "Bali",
  "Maldives",
  "Dubai",
  "Thailand",
  "Singapore",
  "Japan",
  "Europe",
  "Switzerland",
  "Paris",
  "London",
  "Vietnam",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "South Korea",
  "Nepal",
  "Bhutan",
  "Sri Lanka",
];

export default function NewLeadForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // State for multi-select destinations
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [isMultiDestination, setIsMultiDestination] = useState(false);

  // Loading state for API call
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Calculate end date
      const calculateEndDate = (startDate, days) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + days - 1);
        return end.toISOString().split("T")[0];
      };
      // make commment on this
      // Get sales person info from AsyncStorage
      const salesPersonInfo = await getUserProfile();
      console.log(salesPersonInfo);

      // Create the lead object matching your JSON structure
      const leadData = {
        CompanyId: salesPersonInfo.companyId,
        CompanyName: salesPersonInfo.companyName,

        "Client-Name": data["Client-Name"],
        "Client-Email": data["Client-Email"],
        "Client-Contact": data["Client-Contact"],
        "Client-DepartureCity": data["Client-DepartureCity"],
        "Client-Destination": isMultiDestination
          ? selectedDestinations.length > 0
            ? selectedDestinations[0]
            : data["Client-Destination"]
          : data["Client-Destination"],
        "Client-Destinations": isMultiDestination
          ? selectedDestinations
          : [data["Client-Destination"]],
        IsMultiDestination: isMultiDestination,
        "Client-Pax": parseInt(data["Client-Pax"]) || 0,
        "Client-Child": parseInt(data["Client-Child"]) || 0,
        "Client-Infant": parseInt(data["Client-Infant"]) || 0,
        "Client-Days": parseInt(data["Client-Days"]) || 0,
        "Client-Budget": parseInt(data["Client-Budget"]) || 0,
        "Client-TravelDate":
          data["Client-TravelDate"]?.date || data["Client-TravelDate"],
        "Client-TravelEndDate": data["Client-TravelDate"]?.date
          ? calculateEndDate(
              data["Client-TravelDate"].date,
              parseInt(data["Client-Days"]) || 0
            )
          : calculateEndDate(
              data["Client-TravelDate"],
              parseInt(data["Client-Days"]) || 0
            ),

        LeadSource: data.LeadSource || "WebApp",
        LeadPotential: data.LeadPotential || "Medium",
        LeadRating: data.LeadRating || "Warm",

        SalesStatus: "LeadCreate",
        LatestStatus: "LeadCreate",
        SalesPersonUid: salesPersonInfo.FullName,
        SalesPersonName: salesPersonInfo.FullName,
        SalesPersonEmail: salesPersonInfo.Email,

        Quotations: [],

        Comments: [
          {
            By: salesPersonInfo.salesPersonEmail,
            Role: "Sales",
            Message: data.Comments || "Initial lead created",
            At: new Date().toISOString(),
          },
        ],
      };

      console.log("Lead Data:", JSON.stringify(leadData, null, 2));

      const response = await fetch(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Lead created successfully!", [
          {
            text: "OK",
            onPress: () => {
              reset();
              setSelectedDestinations([]);
              setIsMultiDestination(false);
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          responseData.message || "Failed to create lead. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      Alert.alert(
        "Error",
        "Network error. Please check your connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormField = ({ label, children, required = false, error }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 8 }}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      {children}
      {error && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Navbar
        title="Add New Lead"
        subtitle="Create a new customer lead"
        showSearch={false}
        showNotifications={false}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Information Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconWrapper}>
              <Ionicons name="person" size={20} color="#7c3aed" />
            </View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <FormField label="Client Name" required error={errors["Client-Name"]}>
            <Controller
              control={control}
              name="Client-Name"
              rules={{ required: "Client name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors["Client-Name"] && styles.errorInput,
                  ]}
                  placeholder="Enter client full name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField
            label="Contact Number"
            required
            error={errors["Client-Contact"]}
          >
            <Controller
              control={control}
              name="Client-Contact"
              rules={{
                required: "Contact is required",
                minLength: { value: 10, message: "Enter 10 digits" },
              }}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.prefix}>
                    <Text style={{ color: "#4b5563", fontWeight: "500" }}>
                      +91
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.inputWithPrefix,
                      errors["Client-Contact"] && styles.errorInput,
                    ]}
                    placeholder="Enter 10-digit number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              )}
            />
          </FormField>

          <FormField
            label="Email Address"
            required
            error={errors["Client-Email"]}
          >
            <Controller
              control={control}
              name="Client-Email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors["Client-Email"] && styles.errorInput,
                  ]}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>

        {/* Travel Information Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: "#dbeafe" }]}>
              <Ionicons name="airplane" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.sectionTitle}>Travel Information</Text>
          </View>

          <FormField label="Departure City">
            <Controller
              control={control}
              name="Client-DepartureCity"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Departure"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Multi-destination toggle */}
          {/* <ToggleSwitch
            label="Multiple Destinations"
            value={isMultiDestination}
            onValueChange={(value) => {
              setIsMultiDestination(value);
              if (value) {
                // Reset single destination when switching to multi
                setValue("Client-Destination", "");
              } else {
                // Reset multi destinations when switching to single
                setSelectedDestinations([]);
              }
            }}
          /> */}
          <FormField
            label="Destination"
            required
            error={errors["Client-Destination"]}
          >
            <Controller
              control={control}
              name="Client-Destination"
              rules={{ required: "Destination is required" }}
              render={({ field: { onChange, value } }) => (
                <CustomPicker
                  items={DestinationList}
                  selectedValue={value}
                  onValueChange={onChange}
                  placeholder="Select destination"
                  title="Select Destination"
                />
              )}
            />
          </FormField>
          {/* {!isMultiDestination ? (
            <FormField label="Destination" required error={errors["Client-Destination"]}>
              <Controller
                control={control}
                name="Client-Destination"
                rules={{ required: "Destination is required" }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      style={styles.picker}
                      onValueChange={onChange}
                    >
                      <Picker.Item label="Select destination" value="" />
                      {DestinationList.map((destination, idx) => (
                        <Picker.Item
                          label={destination}
                          value={destination}
                          key={idx}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
            </FormField>
          ) : (
            <FormField label="Destinations" required error={selectedDestinations.length === 0 ? { message: "At least one destination is required" } : undefined}>
              <MultiSelectDestinations
                destinations={DestinationList}
                selectedDestinations={selectedDestinations}
                onSelectionChange={setSelectedDestinations}
                placeholder="Select multiple destinations"
              />
            </FormField>
          )} */}

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField
                label="Duration (Days)"
                required
                error={errors["Client-Days"]}
              >
                <Controller
                  control={control}
                  name="Client-Days"
                  rules={{ required: "Duration is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter number of days"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  )}
                />
              </FormField>
            </View>

            <View style={{ flex: 1 }}>
              <FormField
                label="Travel Date"
                required
                error={errors["Client-TravelDate"]}
              >
                <Controller
                  control={control}
                  name="Client-TravelDate"
                  rules={{ required: "Travel date is required" }}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onDateChange={onChange}
                      placeholder="Select travel date"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          <FormField label="Budget (₹)" error={errors["Client-Budget"]}>
            <Controller
              control={control}
              name="Client-Budget"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter approximate budget"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  maxLength={10}
                />
              )}
            />
          </FormField>

          {/* Passenger Information */}
          <Text style={styles.sectionSubtitle}>Passenger Information</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Adults" required error={errors["Client-Pax"]}>
                <Controller
                  control={control}
                  name="Client-Pax"
                  rules={{ required: "Number of adults is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Adults"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>

            <View style={{ flex: 1 }}>
              <FormField label="Children" error={errors["Client-Child"]}>
                <Controller
                  control={control}
                  name="Client-Child"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Children"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>

            <View style={{ flex: 1 }}>
              <FormField label="Infants" error={errors["Client-Infant"]}>
                <Controller
                  control={control}
                  name="Client-Infant"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Infants"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>
        </View>

        {/* Additional Details Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: "#dcfce7" }]}>
              <Ionicons name="information-circle" size={20} color="#16a34a" />
            </View>
            <Text style={styles.sectionTitle}>Additional Details</Text>
          </View>

          <FormField label="Additional Comments" error={errors.Comments}>
            <Controller
              control={control}
              name="Comments"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter any additional details, special requirements, or comments..."
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
          </FormField>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          disabled={isSubmitting}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isSubmitting ? (
              <>
                <View style={styles.loadingSpinner} />
                <Text style={styles.submitBtnText}>Creating Lead...</Text>
              </>
            ) : (
              <>
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.submitBtnText}>Create Lead</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrapper: {
    backgroundColor: "#ede9fe",
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: "#1f2937",
  },
  inputWithPrefix: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
  },
  prefix: {
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  errorInput: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    color: "#1f2937",
  },
  submitBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  submitBtnDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.7,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    borderTopColor: "transparent",
    marginRight: 8,
    // Note: You might want to add animation here
  },
});
