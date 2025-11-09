import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CustomPicker({ 
  items, 
  selectedValue, 
  onValueChange, 
  placeholder = "Select option",
  style,
  disabled = false,
  title = "Select Option"
}) {
  const [showPicker, setShowPicker] = useState(false);
  const scrollViewRef = useRef(null);
  const itemHeight = 50;
  const visibleItems = 6;
  const containerHeight = 300; // Fixed height for better visibility

  useEffect(() => {
    if (scrollViewRef.current && items.length > 0 && selectedValue) {
      const selectedIndex = items.findIndex(item => 
        typeof item === 'object' ? item.value === selectedValue : item === selectedValue
      );
      if (selectedIndex >= 0) {
        scrollViewRef.current.scrollTo({
          y: selectedIndex * itemHeight,
          animated: false,
        });
      }
    }
  }, [selectedValue, items, showPicker]);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (index >= 0 && index < items.length) {
      const item = items[index];
      const value = typeof item === 'object' ? item.value : item;
      if (value !== selectedValue) {
        onValueChange(value);
      }
    }
  };

  const handleSelect = (item) => {
    const value = typeof item === 'object' ? item.value : item;
    onValueChange(value);
    setShowPicker(false);
  };

  const getDisplayText = () => {
    if (!selectedValue) return placeholder;
    
    const selectedItem = items.find(item => 
      typeof item === 'object' ? item.value === selectedValue : item === selectedValue
    );
    
    if (selectedItem) {
      return typeof selectedItem === 'object' ? selectedItem.label : selectedItem;
    }
    
    return selectedValue;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.pickerSelector, style, disabled && styles.disabledSelector]}
        onPress={() => {
          if (!disabled) {
            setShowPicker(true);
          }
        }}
        disabled={disabled}
      >
        <Text style={selectedValue ? styles.selectedText : styles.placeholderText}>
          {getDisplayText()}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={disabled ? "#d1d5db" : "#6b7280"} 
        />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.customPickerContainer}>
              <View style={styles.pickerOverlay} />
              <ScrollView
                ref={scrollViewRef}
                style={[styles.customPicker, { height: containerHeight }]}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                onMomentumScrollEnd={handleScroll}
                contentContainerStyle={{
                  paddingVertical: (containerHeight - itemHeight) / 2,
                }}
              >
                {items.map((item, index) => {
                  const value = typeof item === 'object' ? item.value : item;
                  const label = typeof item === 'object' ? item.label : item;
                  const isSelected = value === selectedValue;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.pickerItem,
                        { height: itemHeight },
                        isSelected && styles.selectedPickerItem,
                      ]}
                      onPress={() => {
                        handleSelect(item);
                        scrollViewRef.current?.scrollTo({
                          y: index * itemHeight,
                          animated: true,
                        });
                      }}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        isSelected && styles.selectedPickerItemText,
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.confirmButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerSelector: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
  },
  disabledSelector: {
    backgroundColor: "#f9fafb",
    opacity: 0.6,
  },
  selectedText: {
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: "#9ca3af",
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
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
  // Custom Picker Styles
  customPickerContainer: {
    position: "relative",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 300,
    height: 300,
  },
  customPicker: {
    width: "100%",
  },
  pickerOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#7c3aed",
    zIndex: 0,
    pointerEvents: "none",
  },
  pickerItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    width: "100%",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#1f2937",
    textAlign: "center",
    fontWeight: "500",
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
});
