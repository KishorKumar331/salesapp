// HotelsSection.jsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useFormContext,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import MultiSelectDestinations from '@/components/ui/MultiSelectDestinations';
import DateRangeSelector from '../ui/DateRangeSelector';

const HotelsSection = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Hotels',
  });

  const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];

  const addHotel = () => {
    append({
      Nights: 0,
      Name: '',
      City: '',
      RoomType: '',
      Category: '',
      Meals: [],
      CheckInDate: null,
      CheckOutDate: null,
      Comments: '',
    });
  };

  const removeHotel = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const FormField = ({ label, children, required = false, error }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      {children}
      {error && (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );

  React.useEffect(() => {
    if (!fields || fields.length === 0) {
      addHotel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: '#fef3c7' }]}>
          <Ionicons name="bed" size={20} color="#f59e0b" />
        </View>
        <Text style={styles.sectionTitle}>Hotels & Accommodation</Text>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.hotelCard}>
          {/* Header */}
       <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
        <View style={{flex:1}}>
          <FormField
            label="Hotel Name"
            required
            error={errors?.Hotels?.[index]?.Name}
          >
            <Controller
              control={control}
              name={`Hotels.${index}.Name`}
              rules={{ required: 'Hotel name is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors?.Hotels?.[index]?.Name && styles.errorInput,
                  ]}
                  placeholder="Enter hotel name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
          </View>
          <View >
            {fields.length > 1 && (
              <TouchableOpacity
                onPress={() => removeHotel(index)}
                style={styles.removeButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#ef4444"
                />
              </TouchableOpacity>
            )}
            </View>
            
        </View>

          {/* Hotel Name */}
        
          <DateRangeSelector
            startDate={watch(`Hotels.${index}.CheckInDate`)}
            endDate={watch(`Hotels.${index}.CheckOutDate`)}
            onStartDateChange={(date) => {
              const normalized = new Date(date);
              normalized.setHours(0, 0, 0, 0);
              setValue(
                `Hotels.${index}.CheckInDate`,
                normalized,
                { shouldValidate: true }
              );
              setValue(
                `Hotels.${index}.CheckOutDate`,
                null,
                { shouldValidate: true }
              );
            }}
            onEndDateChange={(date) => {
              const normalized = new Date(date);
              normalized.setHours(23, 59, 59, 999);
              setValue(
                `Hotels.${index}.CheckOutDate`,
                normalized,
                { shouldValidate: true }
              );

              const startDate = watch(
                `Hotels.${index}.CheckInDate`
              );
              if (startDate && date) {
                const start = new Date(startDate);
                const end = new Date(date);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                const diffTime = end - start;
                const nights = Math.max(
                  0,
                  Math.round(
                    diffTime / (1000 * 60 * 60 * 24)
                  )
                );
                setValue(
                  `Hotels.${index}.Nights`,
                  nights,
                  { shouldValidate: true }
                );
              }
            }}
            minDate={(() => {
              const t = new Date();
              t.setHours(0, 0, 0, 0);
              return t;
            })()}
          />

          {/* City + Nights */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField
                label="City"
                required
                error={errors?.Hotels?.[index]?.City}
              >
                <Controller
                  control={control}
                  name={`Hotels.${index}.City`}
                  rules={{ required: 'City is required' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors?.Hotels?.[index]?.City &&
                        styles.errorInput,
                      ]}
                      placeholder="Enter city"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label="Nights"
                required
                error={errors?.Hotels?.[index]?.Nights}
              >
                <Controller
                  control={control}
                  name={`Hotels.${index}.Nights`}
                  rules={{
                    required: 'Number of nights is required',
                    min: {
                      value: 1,
                      message: 'Nights must be at least 1',
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors?.Hotels?.[index]?.Nights &&
                        styles.errorInput,
                      ]}
                      placeholder="Enter nights"
                      value={value?.toString() || ''}
                      onChangeText={(text) => {
                        const numValue = parseInt(text, 10) || 0;
                        onChange(numValue);
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          {/* Room Type */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Room Type">
                <Controller
                  control={control}
                  name={`Hotels.${index}.RoomType`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Deluxe, Suite"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Category">
                <Controller
                  control={control}
                  name={`Hotels.${index}.Category`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 3 Star, 4 Star"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>


          <FormField label="Meals">
            <Controller
              control={control}
              name={`Hotels.${index}.Meals`}
              render={({ field: { onChange, value } }) => (
                <MultiSelectDestinations
                  destinations={mealOptions}
                  selectedDestinations={
                    Array.isArray(value) ? value : []
                  }
                  onSelectionChange={(newMeals) => {
                    onChange(newMeals);
                  }}
                  placeholder="Select meals"
                />
              )}
            />
          </FormField>
          {/* Date Range Selector */}



          {/* Comments */}
          {/* <FormField label="Comments">
            <Controller
              control={control}
              name={`Hotels.${index}.Comments`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Additional comments or requirements"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField> */}
        </View>
      ))}

      {/* Add Hotel Button */}
      <TouchableOpacity
        onPress={addHotel}
        style={styles.addButton}
      >
        <Ionicons name="add-circle" size={24} color="#7c3aed" />
        <Text style={styles.addButtonText}>Add Another Hotel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  hotelCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hotelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  removeButton: {
    padding: 8,
    position:'relative',
    top:6,
    left:3,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1f2937',
  },
  errorInput: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    backgroundColor: '#faf5ff',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
});

export default HotelsSection;
