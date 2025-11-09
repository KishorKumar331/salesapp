import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function PackageDetails() {
  return (
    <View style={styles.container}>
      {/* Top Section - Duration and Places */}
      <View style={styles.topSection}>
        {/* Duration Row */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.clockIcon}>🕐</Text>
          </View>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>6 Nights & 7 Days</Text>
        </View>

        {/* Places Row */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <Text style={styles.label}>Places to Visit:</Text>
          <Text style={styles.value}>3N Kuta 3N Seminyak</Text>
        </View>
      </View>

      {/* Package Include Button */}
      <View style={styles.packageIncludeContainer}>
        <View style={styles.packageIncludeButton}>
          <Text style={styles.packageIncludeText}>Package Include</Text>
        </View>
      </View>

      {/* Icons Section */}
      <View style={styles.iconsSection}>
        <View style={styles.iconItem}>
          <Text style={styles.serviceIcon}>🏨</Text>
          <Text style={styles.serviceLabel}>Hotel</Text>
        </View>
        <View style={styles.iconItem}>
          <Text style={styles.serviceIcon}>👁️</Text>
          <Text style={styles.serviceLabel}>Sightseeing</Text>
        </View>
        <View style={styles.iconItem}>
          <Text style={styles.serviceIcon}>🍽️</Text>
          <Text style={styles.serviceLabel}>Meal</Text>
        </View>
        <View style={styles.iconItem}>
          <Text style={styles.serviceIcon}>🚗</Text>
          <Text style={styles.serviceLabel}>Transfer</Text>
        </View>
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <View style={styles.helpContent}>
          <Text style={styles.avatarIcon}>👩‍💼</Text>
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>Call us: 9126972980</Text>
            <Text style={styles.helpText}>Mail us: Journeyrouters@gmail.com</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 390,
    marginVertical: 10,
  },
  topSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    width: 16,
    marginRight: 8,
  },
  clockIcon: {
    fontSize: 14,
    color: '#F24E1E',
  },
  locationIcon: {
    fontSize: 14,
    color: '#F24E1E',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Helvetica',
    marginRight: 8,
  },
  value: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5B5B5B',
    fontFamily: 'Helvetica',
  },
  packageIncludeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIncludeButton: {
    backgroundColor: '#E9E9E9',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: 115,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageIncludeText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'Helvetica',
  },
  iconsSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  iconItem: {
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#919191',
    fontFamily: 'Helvetica',
  },
  helpSection: {
    backgroundColor: '#D3E5E6',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Helvetica',
    letterSpacing: 0.32,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#454545',
    fontFamily: 'Helvetica',
    letterSpacing: 0.26,
    marginBottom: 2,
  },
});
