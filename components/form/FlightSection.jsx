import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from '@/components/ui/DatePicker';

const FlightSection = () => {
  const { control, formState: { errors }, watch, setValue } = useFormContext();

  // Flight search state
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlights, setSelectedFlights] = useState(watch('selectedFlights') || []);

  // Update selectedFlights when form value changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'selectedFlights') {
        setSelectedFlights(value.selectedFlights || []);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Flight search function
  const searchFlights = async () => {
    // Get values at submit-time (avoid continuous watches causing re-renders)
    const from = watch('OutboundFlight.from');
    const to = watch('OutboundFlight.to');
    const departureDate = watch('OutboundFlight.departureDate');
    const adults = watch('NoOfPax');

    if (!from || !to || !departureDate || !adults) {
      Alert.alert(
        'Missing Information',
        'Please fill in departure city, arrival city, departure date, and number of adults before searching.'
      );
      return;
    }

    // IMPORTANT: explicitly dismiss the keyboard before opening modal to avoid accidental blurs/focus flips
    Keyboard.dismiss();

    setLoading(true);
    setShowFlightModal(true);

    try {
      const qs = new URLSearchParams({
        departure_id: String(from),
        arrival_id: String(to),
        outbound_date: String(departureDate),
        type: '2',
        adults: String(adults),
        currency: 'INR',
        deep_search: 'False',
        sort_by: '2',
        isBase64Encoded: 'false',
      });

      const response = await fetch(
        `https://zkfiphmsa5.execute-api.ap-south-1.amazonaws.com/salesapp/flights-search?${qs.toString()}`
      );

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle Google Flights API response structure
      let results = [];
      if (data && data.other_flights && Array.isArray(data.other_flights)) {
        results = data.other_flights;
      } else if (Array.isArray(data)) {
        results = data;
      } else if (data && typeof data === 'object') {
        // If it's a single object, wrap it in an array
        results = [data];
      }
      
      setFlightResults(results);
    } catch (error) {
      console.error('Flight search error:', error);
      Alert.alert('Search Error', 'Failed to search flights. Please try again.');
      setFlightResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle flight selection
  const toggleFlightSelection = (flight) => {
    const isSelected = selectedFlights.find(f => f.booking_token === flight.booking_token);
    if (isSelected) {
      setSelectedFlights(prev => prev.filter(f => f.booking_token !== flight.booking_token));
    } else {
      setSelectedFlights(prev => [...prev, flight]);
    }
  };

  // Save selected flights
  const saveSelectedFlights = () => {
    setValue('selectedFlights', selectedFlights, { shouldDirty: true, shouldValidate: true });
    setShowFlightModal(false);
    Alert.alert('Success', `${selectedFlights.length} flight(s) selected successfully!`);
  };

  const FormField = ({
    label,
    children,
    required = false,
    error,
  }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      {children}
      {!!error && (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {error?.message}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="airplane" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.sectionTitle}>Flight Information</Text>
        </View>

        {/* Outbound Flight */}
        <Text style={styles.sectionSubtitle}>Outbound Flight</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="From" required error={errors?.OutboundFlight?.from}>
              <Controller
                control={control}
                name="OutboundFlight.from"
                rules={{ required: 'Departure city is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors?.OutboundFlight?.from && styles.errorInput]}
                    placeholder="Departure city"
                    value={value ?? ''} // keep controlled
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="characters"
                    returnKeyType="next"
                  />
                )}
              />
            </FormField>
          </View>

          <View style={{ flex: 1 }}>
            <FormField label="To" required error={errors?.OutboundFlight?.to}>
              <Controller
                control={control}
                name="OutboundFlight.to"
                rules={{ required: 'Arrival city is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors?.OutboundFlight?.to && styles.errorInput]}
                    placeholder="Arrival city"
                    value={value ?? ''} // keep controlled
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="characters"
                    returnKeyType="next"
                  />
                )}
              />
            </FormField>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="Departure Date" required error={errors?.OutboundFlight?.departureDate}>
              <Controller
                control={control}
                name="OutboundFlight.departureDate"
                rules={{ required: 'Departure date is required' }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={value ?? ''}          // keep controlled
                    onDateChange={onChange}      // make sure your DatePicker calls this prop
                    placeholder="Select departure date"
                    style={styles.datePickerStyle}
                  />
                )}
              />
            </FormField>
          </View>
        </View>

        {/* Flight Search Button */}
        <TouchableOpacity onPress={searchFlights} style={styles.searchButton} activeOpacity={0.9}>
          <Ionicons name="search" size={20} color="white" />
          <Text style={styles.searchButtonText}>Search Flights</Text>
        </TouchableOpacity>

        {/* Selected Flights Display */}
        {selectedFlights.length > 0 && (
          <View style={styles.selectedFlightsSection}>
            <Text style={styles.selectedFlightsTitle}>Selected Flights ({selectedFlights.length})</Text>
            
            {selectedFlights.map((flightOption, index) => {
              const firstFlight = flightOption?.flights?.[0];
              const lastFlight = flightOption?.flights?.[flightOption.flights.length - 1];
              
              return (
                <View key={flightOption?.booking_token || index} style={styles.selectedFlightCard}>
                  <View style={styles.selectedFlightHeader}>
                    <View style={styles.selectedFlightInfo}>
                      <Text style={styles.selectedAirlineName}>
                        {firstFlight?.airline || 'Unknown Airline'}
                      </Text>
                      <Text style={styles.selectedFlightRoute}>
                        {firstFlight?.departure_airport?.id} → {lastFlight?.arrival_airport?.id}
                      </Text>
                      <Text style={styles.selectedFlightTime}>
                        {firstFlight?.departure_airport?.time?.split(' ')[1]} - {lastFlight?.arrival_airport?.time?.split(' ')[1]}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => toggleFlightSelection(flightOption)}
                      style={styles.removeFlightButton}
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Price Change Section */}
                  <View style={styles.priceChangeSection}>
                    <Text style={styles.priceLabel}>Original Price: ₹{flightOption?.price}</Text>
                    <View style={styles.priceInputContainer}>
                      <Text style={styles.priceInputLabel}>Custom Price:</Text>
                      <Controller
                        control={control}
                        name={`selectedFlights.${index}.customPrice`}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={styles.priceInput}
                            placeholder="Enter custom price"
                            value={value ?? ''}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            placeholderTextColor="#9ca3af"
                          />
                        )}
                      />
                    </View>
                  </View>

                  {flightOption?.layovers?.length > 0 && (
                    <View style={styles.selectedLayoverInfo}>
                      <Text style={styles.selectedLayoverText}>
                        Layover: {flightOption.layovers[0].id} ({Math.floor(flightOption.layovers[0].duration / 60)}h {flightOption.layovers[0].duration % 60}m)
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Additional Notes */}
        <FormField label="Flight Notes" error={errors?.FlightNotes}>
          <Controller
            control={control}
            name="FlightNotes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional flight information or special requirements"
                value={value ?? ''} // keep controlled
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
                textAlignVertical="top"
              />
            )}
          />
        </FormField>

        {/* Flight Search Results Modal */}
        <Modal
          visible={showFlightModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowFlightModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Flight Search Results</Text>
              <TouchableOpacity onPress={() => setShowFlightModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={styles.loadingText}>Searching flights...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.resultsContainer}
                keyboardShouldPersistTaps="always" // keep taps while keyboard might be up
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {flightResults.length === 0 ? (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="airplane-outline" size={48} color="#9ca3af" />
                    <Text style={styles.noResultsText}>No flights found</Text>
                    <Text style={styles.noResultsSubtext}>Try adjusting your search criteria</Text>
                  </View>
                ) : (
                  flightResults.map((flightOption, index) => {
                    const isSelected = selectedFlights.find(f => f.booking_token === flightOption?.booking_token);
                    const firstFlight = flightOption?.flights?.[0];
                    const lastFlight = flightOption?.flights?.[flightOption.flights.length - 1];
                    
                    return (
                      <TouchableOpacity
                        key={flightOption?.booking_token || index}
                        style={[styles.flightCard, isSelected && styles.selectedFlightCard]}
                        onPress={() => toggleFlightSelection(flightOption)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.flightHeader}>
                          <Text style={styles.airlineName}>
                            {firstFlight?.airline || 'Unknown Airline'}
                          </Text>
                          <Text style={styles.flightPrice}>₹{flightOption?.price ?? 'N/A'}</Text>
                        </View>

                        <View style={styles.flightDetails}>
                          <View style={styles.flightRoute}>
                            <Text style={styles.cityCode}>
                              {firstFlight?.departure_airport?.id || 'DEP'}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="#6b7280" />
                            <Text style={styles.cityCode}>
                              {lastFlight?.arrival_airport?.id || 'ARR'}
                            </Text>
                          </View>

                          <View style={styles.flightTimes}>
                            <Text style={styles.timeText}>
                              {firstFlight?.departure_airport?.time?.split(' ')[1] || 'N/A'}
                            </Text>
                            <Text style={styles.durationText}>
                              {flightOption?.total_duration ? `${Math.floor(flightOption.total_duration / 60)}h ${flightOption.total_duration % 60}m` : 'N/A'}
                            </Text>
                            <Text style={styles.timeText}>
                              {lastFlight?.arrival_airport?.time?.split(' ')[1] || 'N/A'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.flightMeta}>
                          <Text style={styles.flightNumber}>
                            {flightOption?.flights?.length > 1 
                              ? `${flightOption.flights.length} stops` 
                              : `Flight: ${firstFlight?.flight_number || 'N/A'}`
                            }
                          </Text>
                          <Text style={styles.flightClass}>
                            {firstFlight?.travel_class || 'Economy'}
                          </Text>
                        </View>

                        {flightOption?.layovers?.length > 0 && (
                          <View style={styles.layoverInfo}>
                            <Text style={styles.layoverText}>
                              Layover: {flightOption.layovers[0].id} ({Math.floor(flightOption.layovers[0].duration / 60)}h {flightOption.layovers[0].duration % 60}m)
                            </Text>
                          </View>
                        )}

                        {isSelected && (
                          <View style={styles.selectedIndicator}>
                            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            )}

            {selectedFlights.length > 0 && !loading && (
              <View style={styles.modalFooter}>
                <Text style={styles.selectedCount}>{selectedFlights.length} flight(s) selected</Text>
                <TouchableOpacity onPress={saveSelectedFlights} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Selected Flights</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#dbeafe',
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
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
  },
  datePickerStyle: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFlightCard: {
    borderColor: '#10b981',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  flightPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7c3aed',
  },
  flightDetails: {
    marginBottom: 12,
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cityCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 12,
  },
  flightTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  flightMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightNumber: {
    fontSize: 12,
    color: '#6b7280',
  },
  flightClass: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  layoverInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  layoverText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  // Selected flights section styles
  selectedFlightsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  selectedFlightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  selectedFlightCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  selectedFlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  selectedFlightInfo: {
    flex: 1,
  },
  selectedAirlineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  selectedFlightRoute: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  selectedFlightTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  removeFlightButton: {
    padding: 4,
  },
  priceChangeSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    minWidth: 80,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#1f2937',
  },
  selectedLayoverInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  selectedLayoverText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  selectedCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FlightSection;
