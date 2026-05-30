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
import CustomPicker from '../ui/CustomPicker';

const RoomCategorySection = ({ control, hotelIndex, roomList, watch, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `Hotels.${hotelIndex}.roomCategory`,
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append({ roomtype: '', nights: [''], checkInDate: null, checkOutDate: null });
    }
  }, [fields.length, append]);

  return (
    <View style={styles.roomSectionContainer}>
      <Text style={styles.roomSectionTitle}>Rooms</Text>
      {fields.map((field, rIndex) => (
        <View key={field.id} style={styles.roomItemCard}>
          <View style={styles.roomHeader}>
            <Text style={styles.roomNumberText}>Room #{rIndex + 1}</Text>
            {fields.length > 1 && (
              <TouchableOpacity
                onPress={() => remove(rIndex)}
                style={styles.removeRoomButton}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>

          {/* Room Type */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.inputLabel}>Room Type</Text>
            <Controller
              control={control}
              name={`Hotels.${hotelIndex}.roomCategory.${rIndex}.roomtype`}
              render={({ field: { onChange, value } }) => (
                <CustomPicker
                  items={roomList.map((r) => ({ label: r.name, value: r.room_id || r.name }))}
                  selectedValue={value}
                  onValueChange={(val) => {
                    onChange(val);
                    const matchedRoom = roomList.find((r) => (r.room_id || r.name) === val);
                    if (matchedRoom) {
                      setValue(`Hotels.${hotelIndex}.roomCategory.${rIndex}.RoomImage`, matchedRoom.image_urls?.[0] || '');
                      setValue(`Hotels.${hotelIndex}.roomCategory.${rIndex}.RoomId`, matchedRoom.room_id || '');
                    }
                  }}
                  placeholder="Select Room Type"
                  title="Select Room Type"
                />
              )}
            />
          </View>

          {/* Dates & Nights */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1.5 }}>
              <DateRangeSelector
                startDate={watch(`Hotels.${hotelIndex}.roomCategory.${rIndex}.checkInDate`)}
                endDate={watch(`Hotels.${hotelIndex}.roomCategory.${rIndex}.checkOutDate`)}
                showLabel={false}
                onStartDateChange={(date) => {
                  const d = new Date(date);
                  const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  setValue(`Hotels.${hotelIndex}.roomCategory.${rIndex}.checkInDate`, formatted);
                  setValue(`Hotels.${hotelIndex}.roomCategory.${rIndex}.checkOutDate`, null);
                }}
                onEndDateChange={(date) => {
                  const d = new Date(date);
                  const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  setValue(`Hotels.${hotelIndex}.roomCategory.${rIndex}.checkOutDate`, formatted);

                  const startDateStr = watch(`Hotels.${hotelIndex}.roomCategory.${rIndex}.checkInDate`);
                  if (startDateStr && date) {
                    const startD = new Date(startDateStr);
                    const diff = Math.max(0, Math.round((d - startD) / (1000 * 60 * 60 * 24)));
                    setValue(`Hotels.${hotelIndex}.roomCategory.${rIndex}.nights`, [`${diff}N`]);
                  }
                }}
              />
            </View>
            <View style={{ width: 80 }}>
              <Text style={styles.inputLabel}>Nights</Text>
              <Controller
                control={control}
                name={`Hotels.${hotelIndex}.roomCategory.${rIndex}.nights`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, { height: 50 }]}
                    value={value?.[0] || ''}
                    onChangeText={(text) => onChange([text])}
                    placeholder="e.g. 1N"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append({ roomtype: '', nights: [''], checkInDate: null, checkOutDate: null })}
        style={styles.addRoomButton}
      >
        <Ionicons name="add-circle-outline" size={18} color="#7c3aed" />
        <Text style={styles.addRoomButtonText}>Add Room</Text>
      </TouchableOpacity>
    </View>
  );
};

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

  const [properties, setProperties] = React.useState([]);
  const [roomsCache, setRoomsCache] = React.useState({});

  const dests = watch('Destinations');
  const destinations = Array.isArray(dests) ? dests : [];
  const singleDest = watch('DestinationName');
  const isMaldives = destinations.includes('Maldives') || singleDest === 'Maldives';

  React.useEffect(() => {
    if (isMaldives && properties.length === 0) {
      fetch('https://uusxwsw865.execute-api.ap-south-1.amazonaws.com/dev/properties')
        .then((res) => res.json())
        .then((data) => {
          setProperties(data || []);
        })
        .catch((err) => console.error('Error fetching properties:', err));
    }
  }, [isMaldives, properties.length]);

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
      HotelImage: '',
      PropertyId: '',
      RoomImage: '',
      RoomId: '',
      propertyName: '',
      transferType: '',
      mealPlan: '',
      noOfRoom: '01',
      roomCategory: [{ roomtype: '', nights: [''], checkInDate: null, checkOutDate: null }]
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

      {fields.map((field, index) => {
        const hotelName = watch(`Hotels.${index}.propertyName`);
        const matchedProp = properties.find((p) => (p.property_id || p.name) === hotelName);
        const roomList = matchedProp && roomsCache[matchedProp.property_id] ? roomsCache[matchedProp.property_id] : [];

        return (
          <View key={field.id} style={styles.hotelCard}>
            {isMaldives ? (
              <View>
                {/* Property Name & Trash header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Property Name" required>
                      <Controller
                        control={control}
                        name={`Hotels.${index}.propertyName`}
                        rules={{ required: 'Property name is required' }}
                        render={({ field: { onChange, value } }) => (
                          <CustomPicker
                            items={properties.map((p) => ({
                              label: p.name,
                              value: p.property_id || p.name,
                            }))}
                            selectedValue={value}
                            onValueChange={(val) => {
                              onChange(val);
                              const prop = properties.find(
                                (p) => (p.property_id || p.name) === val
                              );
                              if (prop) {
                                setValue(`Hotels.${index}.HotelImage`, prop.image_url || '');
                                setValue(`Hotels.${index}.PropertyId`, prop.property_id || '');
                                if (!roomsCache[prop.property_id]) {
                                  fetch(
                                    `https://uusxwsw865.execute-api.ap-south-1.amazonaws.com/dev/properties/${prop.property_id}/rooms`
                                  )
                                    .then((res) => res.json())
                                    .then((data) =>
                                      setRoomsCache((prev) => ({
                                        ...prev,
                                        [prop.property_id]: data.rooms || [],
                                      }))
                                    )
                                    .catch((err) =>
                                      console.error('Error fetching rooms:', err)
                                    );
                                }
                              }
                            }}
                            placeholder="Select property"
                            title="Select Property"
                          />
                        )}
                      />
                    </FormField>
                  </View>
                  {fields.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeHotel(index)}
                      style={[styles.removeButton, { marginTop: 12 }]}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Transfer Type & Meal Plan */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FormField label="Transfer Type">
                      <Controller
                        control={control}
                        name={`Hotels.${index}.transferType`}
                        render={({ field: { onChange, value } }) => (
                          <CustomPicker
                            items={[
                              { label: 'SpeedBoat', value: 'SpeedBoat' },
                              { label: 'Seaplane', value: 'Seaplane' },
                              { label: 'Domestic Flight', value: 'DomesticFlight' },
                            ]}
                            selectedValue={value}
                            onValueChange={onChange}
                            placeholder="Select transfer"
                            title="Transfer Type"
                          />
                        )}
                      />
                    </FormField>
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField label="Meal Plan">
                      <Controller
                        control={control}
                        name={`Hotels.${index}.mealPlan`}
                        render={({ field: { onChange, value } }) => (
                          <CustomPicker
                            items={[
                              { label: 'Breakfast', value: 'BreakFast' },
                              { label: 'Half Board', value: 'HalfBoard' },
                              { label: 'Full Board', value: 'FullBoard' },
                              { label: 'All Inclusive', value: 'AllInclusive' },
                            ]}
                            selectedValue={value}
                            onValueChange={onChange}
                            placeholder="Meal Plan"
                            title="Select Meal Plan"
                          />
                        )}
                      />
                    </FormField>
                  </View>
                </View>

                {/* No of Rooms */}
                <View style={{ marginBottom: 12 }}>
                  <FormField label="No. of Rooms">
                    <Controller
                      control={control}
                      name={`Hotels.${index}.noOfRoom`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={[styles.input, { height: 50 }]}
                          value={value}
                          onChangeText={onChange}
                          placeholder="e.g. 01"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </FormField>
                </View>

                {/* Rooms categories array section */}
                <RoomCategorySection
                  control={control}
                  hotelIndex={index}
                  roomList={roomList}
                  watch={watch}
                  setValue={setValue}
                />
              </View>
            ) : (
              <View>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
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
                  <View>
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
                        type={'meals'}
                        placeholder="Select meals"
                      />
                    )}
                  />
                </FormField>
              </View>
            )}
          </View>
        );
      })}

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
    position: 'relative',
    top: 6,
    left: 3,
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
  inputLabel: {
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  roomSectionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  roomSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#4b5563',
  },
  roomItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  removeRoomButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  addRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    backgroundColor: '#faf5ff',
  },
  addRoomButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
});

export default HotelsSection;
