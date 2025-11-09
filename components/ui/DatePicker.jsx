import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Inline Picker Component for DatePicker (no modal, just scrollable list)
const InlinePicker = ({ items, selectedValue, onValueChange }) => {
  return (
    <ScrollView style={styles.inlinePickerContainer} showsVerticalScrollIndicator={false}>
      {items.map((item, index) => {
        const value = typeof item === 'object' ? item.value : item;
        const label = typeof item === 'object' ? item.label : item.toString();
        const isSelected = value === selectedValue;
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.inlinePickerItem,
              isSelected && styles.selectedInlinePickerItem,
            ]}
            onPress={() => onValueChange(value)}
          >
            <Text style={[
              styles.inlinePickerText,
              isSelected && styles.selectedInlinePickerText,
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};




export default function DatePicker({
  value,
  onDateChange,
  placeholder = "Select date",
  style,
  disabled = false,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(
    value ? new Date(value) : new Date()
  );

  // Generate date options
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return [
      { label: "January", value: 0 },
      { label: "February", value: 1 },
      { label: "March", value: 2 },
      { label: "April", value: 3 },
      { label: "May", value: 4 },
      { label: "June", value: 5 },
      { label: "July", value: 6 },
      { label: "August", value: 7 },
      { label: "September", value: 8 },
      { label: "October", value: 9 },
      { label: "November", value: 10 },
      { label: "December", value: 11 },
    ];
  };

  const generateDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConfirm = () => {
    console.log('it runs')
    const formatted = formatDate(tempDate);
    console.log(formatted);
    onDateChange(formatted);
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    setTempDate(value ? new Date(value) : new Date());
    setShowDatePicker(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.dateSelector, style]}
        onPress={() => {
          if (!disabled) {
            setTempDate(value ? new Date(value) : new Date());
            setShowDatePicker(true);
          }
        }}
        disabled={disabled}
      >
        <Text style={value ? styles.dateText : styles.placeholderText}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar" size={20} color="#6b7280" />
      </TouchableOpacity>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.datePickerContainer}>
              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <InlinePicker
                  items={generateYears()}
                  selectedValue={tempDate.getFullYear()}
                  onValueChange={(value) => {
                    const newDate = new Date(tempDate);
                    newDate.setFullYear(value);
                    setTempDate(newDate);
                  }}
                />
              </View>

              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Months</Text>
                <InlinePicker
                  items={generateMonths()}
                  selectedValue={tempDate.getMonth()}
                  onValueChange={(value) => {
                    const newDate = new Date(tempDate);
                    newDate.setMonth(value);
                    setTempDate(newDate);
                  }}
                />
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <InlinePicker
                  items={generateDays(
                    tempDate.getFullYear(),
                    tempDate.getMonth()
                  )}
                  selectedValue={tempDate.getDate()}
                  onValueChange={(value) => {
                    const newDate = new Date(tempDate);
                    newDate.setDate(value);
                    setTempDate(newDate);
                  }}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dateSelector: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#1f2937",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  datePicker: {
    height: 150,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  // Custom Picker Styles
  customPickerContainer: {
    position: "relative",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    overflow: "hidden",
  },
  customPicker: {
    flex: 1,
  },
  pickerOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#7c3aed",
    zIndex: 1,
    pointerEvents: "none",
  },
  pickerItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  pickerItemText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  selectedPickerItem: {
    backgroundColor: "transparent",
  },
  selectedPickerItemText: {
    color: "#7c3aed",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#7c3aed",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  // Inline Picker Styles
  inlinePickerContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    maxHeight: 150,
    overflow: "hidden",
  },
  inlinePickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  inlinePickerText: {
    fontSize: 14,
    color: "#1f2937",
    textAlign: "center",
  },
  selectedInlinePickerItem: {
    backgroundColor: "#ede9fe",
  },
  selectedInlinePickerText: {
    color: "#7c3aed",
    fontWeight: "600",
  },
});
