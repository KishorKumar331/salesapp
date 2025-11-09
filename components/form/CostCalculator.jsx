// components/form/CostCalculatorNew.tsx
import React, { useEffect, useRef, memo } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { NumberParser } from "@/utils/NumberParser";
/** ---------- Small helpers ---------- */

/** ---------- Memo building blocks ---------- */
const FormField = memo(function FormField({
  label,
  children,
  required = false,
  error,
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 8 }}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      {children}
      {!!error?.message && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );
});

/** A memoized RHF numeric input that stores numbers (not strings) */
const RHFNumberInput = memo(function RHFNumberInput({
  name,
  control,
  error,
  placeholder,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          placeholder={placeholder}
          keyboardType={Platform.select({
            ios: "decimal-pad",
            android: "numeric",
          })}
          value={value == null ? "" : String(value)}
          onChangeText={(txt) => onChange(NumberParser(txt))}
          onBlur={onBlur}
          placeholderTextColor="#9ca3af"
          blurOnSubmit={false}
          importantForAutofill="no"
          autoCorrect={false}
        />
      )}
    />
  );
});

/** ---------- Main component ---------- */
const CostCalculator = () => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Watch the CORRECT nested paths under "Costs"
  const [
    flightCost,
    visaCost,
    landPackageCost,
    totalTax,
    gst,
    tcs,
    gstWaivedOff,
    tcsWaivedOff,
    packageWithGST,
    packageWithTCS,
  ] = useWatch({
    control,
    name: [
      "Costs.FlightCost",
      "Costs.VisaCost",
      "Costs.LandPackageCost",
      "Costs.TotalTax",
      "Costs.GST",
      "Costs.TCS",
      "Costs.GstWaivedOffAmt",
      "Costs.TcsWaivedOffAmt",
      "Costs.PackageWithGST",
      "Costs.PackageWithTCS",
    ],
  });

  const rafId = useRef(null);

  useEffect(() => {
    // Coerce to numbers with safe defaults
    const flight = NumberParser(flightCost);
    const visa = NumberParser(visaCost);
    const land = NumberParser(landPackageCost);
    const tax = NumberParser(totalTax);
    const gstAmt = NumberParser(gst);
    const tcsAmt = NumberParser(tcs);
    const gstW = NumberParser(gstWaivedOff);
    const tcsW = NumberParser(tcsWaivedOff);

    let total = flight + visa + land + tax;
    if (packageWithGST) total += gstAmt - gstW;
    if (packageWithTCS) total += tcsAmt - tcsW;

    const current = NumberParser(getValues("Costs.TotalCost"));

    if (current !== total) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setValue("Costs.TotalCost", total, {
          shouldDirty: true,
          shouldTouch: false,
          shouldValidate: false,
        });
      });
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [
    flightCost,
    visaCost,
    landPackageCost,
    totalTax,
    gst,
    tcs,
    gstWaivedOff,
    tcsWaivedOff,
    packageWithGST,
    packageWithTCS,
    getValues,
    setValue,
  ]);

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: "#dbeafe" }]}>
          <Ionicons name="calculator" size={20} color="#3b82f6" />
        </View>
        <Text style={styles.sectionTitle}>Cost Calculator</Text>
      </View>

      {/* Basic Costs */}
      <Text style={styles.sectionSubtitle}>Package Costs</Text>

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <FormField label="Flight Cost (₹)" error={errors?.Costs?.FlightCost}>
            <RHFNumberInput
              name="Costs.FlightCost"
              control={control}
              error={errors?.Costs?.FlightCost}
              placeholder="Enter flight cost"
            />
          </FormField>
        </View>

        <View style={{ flex: 1 }}>
          <FormField label="Visa Cost (₹)" error={errors?.Costs?.VisaCost}>
            <RHFNumberInput
              name="Costs.VisaCost"
              control={control}
              error={errors?.Costs?.VisaCost}
              placeholder="Enter visa cost"
            />
          </FormField>
        </View>
      </View>

      <FormField
        label="Land Package Cost (₹)"
        error={errors?.Costs?.LandPackageCost}
      >
        <RHFNumberInput
          name="Costs.LandPackageCost"
          control={control}
          error={errors?.Costs?.LandPackageCost}
          placeholder="Enter land package cost"
        />
      </FormField>

      {/* (Optional) Taxes / toggles — if you render these elsewhere, keep the same field paths */}
      {/* <CheckboxField ... writes to Costs.PackageWithGST / Costs.PackageWithTCS /> */}

      {/* Total Cost Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Package Cost</Text>
        <Controller
          control={control}
          name="Costs.TotalCost"
          render={({ field: { value } }) => {
            const numVal = NumberParser(value);
            const display = Number.isFinite(numVal)
              ? numVal?.toLocaleString("en-IN")
              : "0";
            return <Text style={styles.totalAmount}>₹{display}</Text>;
          }}
        />
      </View>
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
    backgroundColor: "#dbeafe",
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
  errorInput: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  totalContainer: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7c3aed",
  },
});

export default CostCalculator;
