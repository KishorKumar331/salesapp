import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from '@/components/ui/DatePicker';
import CustomPicker from '@/components/ui/CustomPicker';
import MultiSelectDestinations from '@/components/ui/MultiSelectDestinations';


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
  "Sri Lanka"
];

const DepartureCityList = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Kochi",
  "Goa"
];

const BasicDetails = () => {
  const { control, formState: { errors }, watch, setValue } = useFormContext();
  const isMultiDestination = watch('IsMultiDestination', false);
  const destinations = watch('Destinations', []);

  const FormField = ({ 
    label, 
    children, 
    required = false, 
    error 
  }) => (
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
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: "#ede9fe" }]}>
          <Ionicons name="person" size={20} color="#7c3aed" />
        </View>
        <Text style={styles.sectionTitle}>Basic Details</Text>
      </View>

      <FormField label="Full Name" required error={errors["Client-Name"]}>
        <Controller
          control={control}
          name="Client-Name"
          rules={{ required: "Full name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors["Client-Name"] && styles.errorInput]}
              placeholder="Enter customer full name"
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      <FormField label="Contact Number" required error={errors["Client-Contact"]}>
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

      <FormField label="Email Address" error={errors["Client-Email"]}>
        <Controller
          control={control}
          name="Client-Email"
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Enter a valid email address",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors["Client-Email"] && styles.errorInput]}
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

      <FormField label="Travel Date" required error={errors.TravelDate}>
        <Controller
          control={control}
          name="TravelDate"
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

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Adults" error={errors.NoOfPax}>
            <Controller
              control={control}
              name="NoOfPax"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.NoOfPax && styles.errorInput]}
                  placeholder="1"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseInt(text) || 0 : 0)}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Children" error={errors.Child}>
            <Controller
              control={control}
              name="Child"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.Child && styles.errorInput]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseInt(text) || 0 : 0)}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Infants" error={errors.Infant}>
            <Controller
              control={control}
              name="Infant"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.Infant && styles.errorInput]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseInt(text) || 0 : 0)}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Days" error={errors.Days}>
            <Controller
              control={control}
              name="Days"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.Days && styles.errorInput]}
                  placeholder="Enter days"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseInt(text) || 0 : 0)}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Budget (₹)" error={errors.Budget}>
            <Controller
              control={control}
              name="Budget"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.Budget && styles.errorInput]}
                  placeholder="Enter budget"
                  keyboardType="numeric"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseFloat(text) || 0 : 0)}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      {/* Destination Section */}
      <FormField label="Multi-Destination Trip" error={errors.IsMultiDestination}>
        <Controller
          control={control}
          name="IsMultiDestination"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
              <Text style={{ color: '#374151', fontSize: 16 }}>Enable multiple destinations</Text>
              <Switch
                value={value || false}
                onValueChange={(newValue) => {
                  onChange(newValue);
                  // Don't clear destinations when switching modes
                  // Let user keep their selections
                }}
                trackColor={{ false: '#e5e7eb', true: '#c084fc' }}
                thumbColor={value ? '#7c3aed' : '#9ca3af'}
              />
            </View>
          )}
        />
      </FormField>

      <FormField label="Departure City" required error={errors.DepartureCity}>
        <Controller
          control={control}
          name="DepartureCity"
          rules={{ required: "Departure city is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.DepartureCity && styles.errorInput]}
              placeholder="Enter departure city"
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      {!isMultiDestination ? (
        <FormField label="Destination" required error={errors.DestinationName}>
          <Controller
            control={control}
            name="DestinationName"
            rules={{ required: "Destination is required" }}
            render={({ field: { onChange, value } }) => (
              <CustomPicker
                items={DestinationList}
                selectedValue={value}
                onValueChange={(selectedValue) => {
                  onChange(selectedValue);
                  setValue('Destinations', [selectedValue]);
                }}
                placeholder="Select destination"
                title="Select Destination"
              />
            )}
          />
        </FormField>
      ) : (
        <FormField 
          label="Destinations" 
          required 
          error={destinations.length === 0 ? { message: "At least one destination is required" } : undefined}
        >
          <MultiSelectDestinations
            destinations={DestinationList}
            selectedDestinations={destinations}
            onSelectionChange={(newDestinations) => {
              setValue('Destinations', newDestinations);
            }}
            placeholder="Select multiple destinations"
          />
        </FormField>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default BasicDetails;
