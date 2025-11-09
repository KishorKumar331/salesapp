import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "./DatePicker";

// Example of how to use the DatePicker component in any form
export default function DatePickerExample() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DatePicker Component Examples</Text>

      {/* Example 1: Basic usage with react-hook-form */}
      <View style={styles.example}>
        <Text style={styles.label}>Birth Date</Text>
        <Controller
          control={control}
          name="birthDate"
          rules={{ required: "Birth date is required" }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onDateChange={onChange}
              placeholder="Select your birth date"
            />
          )}
        />
        {errors.birthDate && (
          <Text style={styles.error}>{errors.birthDate.message}</Text>
        )}
      </View>

      {/* Example 2: Custom styling */}
      <View style={styles.example}>
        <Text style={styles.label}>Event Date</Text>
        <Controller
          control={control}
          name="eventDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onDateChange={onChange}
              placeholder="Choose event date"
              style={styles.customDatePicker}
            />
          )}
        />
      </View>

      {/* Example 3: Disabled state */}
      <View style={styles.example}>
        <Text style={styles.label}>Disabled Date Picker</Text>
        <DatePicker
          value="2025-01-01"
          onDateChange={() => {}}
          placeholder="This is disabled"
          disabled={true}
        />
      </View>

      {/* Example 4: Simple usage without form */}
      <View style={styles.example}>
        <Text style={styles.label}>Simple Date Selection</Text>
        <DatePicker
          onDateChange={(date) => {
            console.log("Selected date:", date);
          }}
          placeholder="Pick any date"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937",
  },
  example: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  customDatePicker: {
    borderColor: "#7c3aed",
    borderWidth: 2,
    backgroundColor: "#f3f4f6",
  },
});
