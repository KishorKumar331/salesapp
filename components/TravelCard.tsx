import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from './themed-view';

interface TravelCardProps {
  day: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  location: string;
}

export function TravelCard({
  day,
  title,
  subtitle,
  description,
  imageUrl,
  location,
}: TravelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, isExpanded ? styles.containerExpanded : styles.containerCollapsed]}>
      {/* Header Section */}
      <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
        <View style={styles.headerContent}>
          {/* Location Pin Icon */}
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>📍</Text>
          </View>

          {/* Day Text */}
          <Text style={styles.dayText}>{day}</Text>

          {/* Title and Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Content Section - Only show when expanded */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.locationLabel}>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC7C7',
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  containerCollapsed: {
    height: 31,
  },
  containerExpanded: {
    height: 152,
  },
  header: {
    height: 31,
    backgroundColor: '#ECA59E',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC7C7',
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: '100%',
  },
  locationIcon: {
    width: 10,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  locationIconText: {
    fontSize: 10,
    color: '#F24E1E',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#080808',
    fontFamily: 'Helvetica',
    marginRight: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Helvetica',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 9,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 142,
    height: 100,
    borderRadius: 5,
  },
  locationLabel: {
    position: 'absolute',
    bottom: 8,
    left: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Helvetica',
    letterSpacing: 0.18,
    lineHeight: 15,
  },
  descriptionContainer: {
    flex: 1,
    paddingLeft: 9,
    paddingTop: 4,
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: '#626262',
    fontFamily: 'Helvetica',
    lineHeight: 15,
    letterSpacing: 0.24,
    textAlign: 'left',
  },
});
