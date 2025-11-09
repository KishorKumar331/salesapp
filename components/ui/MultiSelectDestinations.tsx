import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MultiSelectDestinationsProps {
  destinations: string[];
  selectedDestinations: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  style?: any;
  disabled?: boolean;
}

export default function MultiSelectDestinations({
  destinations,
  selectedDestinations,
  onSelectionChange,
  placeholder = "Select destinations",
  style,
  disabled = false,
}: MultiSelectDestinationsProps) {
  const [showModal, setShowModal] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(Array.isArray(selectedDestinations) ? selectedDestinations : []);

  const toggleDestination = (destination: string) => {
    if (tempSelected.includes(destination)) {
      setTempSelected(tempSelected.filter(item => item !== destination));
    } else {
      setTempSelected([...tempSelected, destination]);
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelected);
    setShowModal(false);
  };

  const handleCancel = () => {
    setTempSelected(Array.isArray(selectedDestinations) ? selectedDestinations : []);
    setShowModal(false);
  };

  const getDisplayText = () => {
    const safeSelectedDestinations = Array.isArray(selectedDestinations) ? selectedDestinations : [];
    if (safeSelectedDestinations.length === 0) {
      return placeholder;
    } else if (safeSelectedDestinations.length === 1) {
      return safeSelectedDestinations[0];
    } else {
      return `${safeSelectedDestinations.length} destinations selected`;
    }
  };

  const renderDestinationItem = ({ item }: { item: string }) => {
    const isSelected = tempSelected.includes(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.destinationItem,
          isSelected && styles.selectedDestinationItem
        ]}
        onPress={() => toggleDestination(item)}
      >
        <Text style={[
          styles.destinationText,
          isSelected && styles.selectedDestinationText
        ]}>
          {item}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, style]}
        onPress={() => {
          if (!disabled) {
            setTempSelected(Array.isArray(selectedDestinations) ? selectedDestinations : []);
            setShowModal(true);
          }
        }}
        disabled={disabled}
      >
        <Text style={(Array.isArray(selectedDestinations) ? selectedDestinations : []).length > 0 ? styles.selectedText : styles.placeholderText}>
          {getDisplayText()}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6b7280" />
      </TouchableOpacity>

      {/* Selected destinations display */}
      {(Array.isArray(selectedDestinations) ? selectedDestinations : []).length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(Array.isArray(selectedDestinations) ? selectedDestinations : []).map((destination, index) => (
              <View key={index} style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{destination}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const safeSelected = Array.isArray(selectedDestinations) ? selectedDestinations : [];
                    const newSelected = safeSelected.filter(item => item !== destination);
                    onSelectionChange(newSelected);
                  }}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={14} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Multi-select Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destinations</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.selectedCount}>
              <Text style={styles.selectedCountText}>
                {tempSelected.length} destination{tempSelected.length !== 1 ? 's' : ''} selected
              </Text>
            </View>

            <FlatList
              data={destinations}
              renderItem={renderDestinationItem}
              keyExtractor={(item) => item}
              style={styles.destinationList}
              showsVerticalScrollIndicator={false}
            />

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
                <Text style={styles.confirmButtonText}>
                  Confirm ({tempSelected.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 16,
    color: "#1f2937",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  selectedContainer: {
    marginTop: 8,
  },
  selectedChip: {
    backgroundColor: "#ede9fe",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedChipText: {
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  selectedCount: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedCountText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  destinationList: {
    maxHeight: 300,
  },
  destinationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "#f9fafb",
  },
  selectedDestinationItem: {
    backgroundColor: "#ede9fe",
    borderColor: "#7c3aed",
    borderWidth: 1,
  },
  destinationText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedDestinationText: {
    color: "#7c3aed",
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
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
});
