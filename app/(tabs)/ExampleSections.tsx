// ExampleSections.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const BasicDetails: React.FC<any> = ({ value, onChange }) => (
  <View>
    <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 8 }}>Basic details</Text>

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Client name</Text>
    <TextInput
      value={value.name}
      onChangeText={(t) => onChange({ name: t })}
      placeholder="Enter full name"
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
    />

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Email</Text>
    <TextInput
      value={value.email}
      onChangeText={(t) => onChange({ email: t })}
      placeholder="name@example.com"
      keyboardType="email-address"
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
    />

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Phone</Text>
    <TextInput
      value={value.phone}
      onChangeText={(t) => onChange({ phone: t })}
      placeholder="98765 43210"
      keyboardType="phone-pad"
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
    />
  </View>
);

export const TripDetails: React.FC<any> = ({ value, onChange }) => (
  <View>
    <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 8 }}>Trip details</Text>

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Destination</Text>
    <TextInput
      value={value.destination}
      onChangeText={(t) => onChange({ destination: t })}
      placeholder="Bali / Europe / Dubai..."
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
    />

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Days</Text>
    <TextInput
      value={String(value.days ?? '')}
      onChangeText={(t) => onChange({ days: Number(t) || 0 })}
      placeholder="7"
      keyboardType="numeric"
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
    />

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Budget (₹)</Text>
    <TextInput
      value={value.budget}
      onChangeText={(t) => onChange({ budget: t })}
      placeholder="150000"
      keyboardType="numeric"
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12 }}
    />
  </View>
);

export const Notes: React.FC<any> = ({ value, onChange }) => (
  <View>
    <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 8 }}>Notes</Text>

    <Text style={{ color: '#6b7280', marginTop: 12 }}>Special requests</Text>
    <TextInput
      value={value.notes}
      onChangeText={(t) => onChange({ notes: t })}
      placeholder="Hotel preferences, activities, etc."
      multiline
      numberOfLines={6}
      style={{
        borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: 'top',
      }}
    />
  </View>
);
