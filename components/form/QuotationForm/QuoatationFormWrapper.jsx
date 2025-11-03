import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QuoatationFormWrapper = ({ sections, value, onChange, header, footer }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const { height: windowHeight } = Dimensions.get('window');
  const screenH = windowHeight - 120;
  const [currentSection, setCurrentSection] = useState(0);

  const scrollToSection = useCallback((sectionIndex) => {
    const clamped = Math.max(0, Math.min(sectionIndex, sections.length - 1));
    scrollViewRef.current?.scrollTo({
      y: clamped * screenH,
      animated: true,
    });
    // Don't set current section immediately, let onMomentumScrollEnd handle it
  }, [sections.length, screenH]);

  const handleScrollEnd = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const sectionIndex = Math.round(offsetY / screenH);
    const clampedIndex = Math.max(0, Math.min(sectionIndex, sections.length - 1));
    setCurrentSection(clampedIndex);
  }, [screenH, sections.length]);

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const sectionIndex = Math.round(offsetY / screenH);
    const clampedIndex = Math.max(0, Math.min(sectionIndex, sections.length - 1));
    setCurrentSection(clampedIndex);
  }, [screenH, sections.length]);

  const SectionWrapper = ({ index, children }) => (
    <View style={{ height: screenH, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Section Header */}
        <View style={{ 
          paddingHorizontal: 16, 
          paddingVertical: 12, 
          backgroundColor: '#f9fafb',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            Section {index + 1} of {sections.length}
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {header}
          
          <View style={{ flex: 1 }}>
            {children}
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          padding: 16,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6'
        }}>
          <TouchableOpacity
            onPress={() => scrollToSection(index - 1)}
            disabled={index === 0}
            style={{
              opacity: index === 0 ? 0.5 : 1,
              backgroundColor: '#e5e7eb',
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              minWidth: 100,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#374151', fontWeight: '600', fontSize: 16 }}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => scrollToSection(index + 1)}
            disabled={index === sections.length - 1}
            style={{
              backgroundColor: '#7c3aed',
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              minWidth: 100,
              alignItems: 'center',
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
              {index === sections.length - 1 ? 'Submit' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {footer && (
          <View style={{ padding: 16, paddingTop: 0 }}>
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#7c3aed' }}>
      <LinearGradient
        colors={['#7c3aed', '#5b21b6']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 2,
          paddingBottom: 2,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              padding: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Create Quotation
          </Text>
        
        </View>
        </View>

     
      </LinearGradient>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        bounces={true}
        decelerationRate="normal"
        snapToInterval={screenH}
        snapToAlignment="start"
        disableIntervalMomentum={true}
        pagingEnabled={false}
      >
        {sections.map((Section, i) => (
          <SectionWrapper key={`section-${i}`} index={i}>
            <Section
              value={value}
              onChange={onChange}
              goNext={() => scrollToSection(i + 1)}
              goPrev={() => scrollToSection(i - 1)}
            />
          </SectionWrapper>
        ))}
      </ScrollView>

      <View style={{
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -((sections.length * 12) / 2) }],
        alignItems: 'center',
      }}>
        {sections.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => scrollToSection(i)}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: i === currentSection ? '#7c3aed' : '#d1d5db',
              marginVertical: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default QuoatationFormWrapper;
