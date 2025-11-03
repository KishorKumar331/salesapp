import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function PackageOverview() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Package Overview</Text>
      <Text style={styles.description}>
        Bali: The Island of Gods - Discover Bali, an Island paradise known for its lush landscapes, serene beaches, and adventurous trip or a peaceful retreat, Bali offers thw perfect blend of relaxation, exploration, and spiritual awakening. From world - class beaches to ancient temples and tranquil rice terraces, Bali provides an unforgettable exprience for all type of travelers.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 388,
    height: 153,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 19,
    paddingTop: 10,
    paddingBottom: 19,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Helvetica',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5C5C5C',
    fontFamily: 'Inter',
    lineHeight: 15,
    textAlign: 'left',
  },
});
