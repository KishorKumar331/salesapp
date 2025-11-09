import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const InclusionsExclusions: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  
  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control,
    name: 'Inclusions',
  });

  const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({
    control,
    name: 'Exclusions',
  });

  // Predefined common inclusions
  const commonInclusions = [
    'Accommodation as per itinerary',
    'Daily breakfast',
    'Airport transfers',
    'Sightseeing as per itinerary',
    'All transportation',
    'Professional tour guide',
    'All entrance fees',
    'Travel insurance',
  ];

  // Predefined common exclusions
  const commonExclusions = [
    'International flights',
    'Visa fees',
    'Personal expenses',
    'Tips and gratuities',
    'Meals not mentioned',
    'Optional activities',
    'Travel insurance',
    'Emergency expenses',
  ];

  const addInclusion = (item: string) => {
    if (item.trim()) {
      appendInclusion({ item: item.trim() });
      setNewInclusion('');
    }
  };

  const addExclusion = (item: string) => {
    if (item.trim()) {
      appendExclusion({ item: item.trim() });
      setNewExclusion('');
    }
  };

  const QuickAddButton = ({ 
    title, 
    onPress, 
    color = '#7c3aed' 
  }: { 
    title: string; 
    onPress: () => void; 
    color?: string; 
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.quickAddButton, { borderColor: color }]}
    >
      <Text style={[styles.quickAddText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: "#fef3c7" }]}>
          <Ionicons name="list" size={20} color="#f59e0b" />
        </View>
        <Text style={styles.sectionTitle}>Inclusions & Exclusions</Text>
      </View>

      {/* Inclusions Section */}
      <View style={styles.subsection}>
        <View style={styles.subsectionHeader}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text style={[styles.subsectionTitle, { color: '#10b981' }]}>Inclusions</Text>
        </View>

        {/* Quick Add Inclusions */}
        <Text style={styles.quickAddLabel}>Quick Add:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickAddContainer}
        >
          {commonInclusions.map((item, index) => (
            <QuickAddButton
              key={index}
              title={item}
              onPress={() => addInclusion(item)}
              color="#10b981"
            />
          ))}
        </ScrollView>

        {/* Custom Inclusion Input */}
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add custom inclusion"
            value={newInclusion}
            onChangeText={setNewInclusion}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={() => addInclusion(newInclusion)}
            style={[styles.addButton, { backgroundColor: '#10b981' }]}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Inclusions List */}
        {inclusionFields.map((field, index) => (
          <View key={field.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Ionicons name="checkmark" size={16} color="#10b981" />
              <Controller
                control={control}
                name={`Inclusions.${index}.item`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.listItemText}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Inclusion item"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>
            <TouchableOpacity
              onPress={() => removeInclusion(index)}
              style={styles.removeItemButton}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Exclusions Section */}
      <View style={styles.subsection}>
        <View style={styles.subsectionHeader}>
          <Ionicons name="close-circle" size={20} color="#ef4444" />
          <Text style={[styles.subsectionTitle, { color: '#ef4444' }]}>Exclusions</Text>
        </View>

        {/* Quick Add Exclusions */}
        <Text style={styles.quickAddLabel}>Quick Add:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickAddContainer}
        >
          {commonExclusions.map((item, index) => (
            <QuickAddButton
              key={index}
              title={item}
              onPress={() => addExclusion(item)}
              color="#ef4444"
            />
          ))}
        </ScrollView>

        {/* Custom Exclusion Input */}
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add custom exclusion"
            value={newExclusion}
            onChangeText={setNewExclusion}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={() => addExclusion(newExclusion)}
            style={[styles.addButton, { backgroundColor: '#ef4444' }]}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Exclusions List */}
        {exclusionFields.map((field, index) => (
          <View key={field.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Ionicons name="close" size={16} color="#ef4444" />
              <Controller
                control={control}
                name={`Exclusions.${index}.item`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.listItemText}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Exclusion item"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>
            <TouchableOpacity
              onPress={() => removeExclusion(index)}
              style={styles.removeItemButton}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Terms & Conditions */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Terms & Conditions</Text>
        <Controller
          control={control}
          name="TermsAndConditions"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter terms and conditions, cancellation policy, payment terms, etc."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={5}
              placeholderTextColor="#9ca3af"
            />
          )}
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
    backgroundColor: "#fef3c7",
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  subsection: {
    marginBottom: 24,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickAddLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  quickAddContainer: {
    marginBottom: 16,
  },
  quickAddButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: 'white',
  },
  quickAddText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  removeItemButton: {
    padding: 4,
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
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});

export default InclusionsExclusions;
