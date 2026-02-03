
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';

import { usePricingPlan } from '../../../hooks/usePricingPlan';

const { width } = Dimensions.get('window');

/**
 * ✅ Normalize destination coming from backend
 * Backend sends inconsistent structure:
 * - Object { Domestic, International }
 * - OR Array []
 */
const normalizeDestination = (destination: any) => {
  if (!destination) {
    return { Domestic: [], International: [] };
  }

  // Case 1: Already grouped
  if (typeof destination === 'object' && !Array.isArray(destination)) {
    return {
      Domestic: destination.Domestic || [],
      International: destination.International || [],
    };
  }

  // Case 2: Flat array → treat as International
  if (Array.isArray(destination)) {
    return {
      Domestic: [],
      International: destination,
    };
  }

  return { Domestic: [], International: [] };
};

const PricingCard = ({ plan, isSelected, onSelect }) => {
  const priceInRupees = (plan.PricePaise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: plan.Currency || 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const isInternational = Array.isArray(plan.Destination) 
    ? plan.Destination.some(dest => !['Kerala', 'Rajasthan', 'Kashmir', 'Ladakh', 'Andaman', 'Northeast', 'Himachal', 'Goa'].includes(dest))
    : plan.Destination?.International?.length > 0;

  const destinationType = isInternational ? 'International' : 'Domestic';
  const destinations = Array.isArray(plan.Destination) 
    ? plan.Destination 
    : plan.Destination?.[destinationType] || [];

  return (
    <TouchableOpacity 
      onPress={() => onSelect(plan)}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        isInternational && styles.internationalCard
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.planName}>{plan.Name}</Text>
        <Text style={styles.planPrice}>{priceInRupees}</Text>
        <Text style={styles.credits}>{plan.QuoteCredits} Quotation Credits</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.destinationsContainer}>
        <Text style={styles.destinationTitle}>
          {isInternational ? '🌍 International' : '🏠 Domestic'} Destinations
        </Text>
        <View style={styles.destinationsGrid}>
          {destinations.slice(0, 6).map((dest, index) => (
            <View key={index} style={styles.destinationItem}>
              <Text style={styles.destinationText}>{dest}</Text>
            </View>
          ))}
          {destinations.length > 6 && (
            <View style={styles.destinationItem}>
              <Text style={styles.destinationText}>+{destinations.length - 6} more</Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.selectButton,
          isSelected && styles.selectedButton
        ]}
        onPress={() => onSelect(plan)}
      >
        <Text style={styles.selectButtonText}>
          {isSelected ? 'Selected' : 'Select Plan'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function PaymentPage() {
  const router = useRouter();
  const { planId } = useLocalSearchParams();
  const { plans, loading, error } = usePricingPlan();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Auto-select plan if coming from a direct link
  React.useEffect(() => {
    if (planId && plans.length > 0) {
      const plan = plans.find(p => p.PlanId === planId);
      if (plan) setSelectedPlan(plan);
    }
  }, [planId, plans]);
  
  const activePlans = useMemo(() => 
    plans.filter(plan => plan.IsActive).sort((a, b) => a.PricePaise - b.PricePaise)
  , [plans]);
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const price = selectedPlan
    ? (selectedPlan.PricePaise / 100).toLocaleString('en-IN')
    : '0';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Failed to load pricing plans</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.replace('/pricing')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =============================
  // PAYMENT HANDLER
  // =============================
  const handlePayment = async () => {
    if (!selectedPlan) {
      Alert.alert('No Plan Selected', 'Please select a plan to continue');
      return;
    }

    try {
      const options = {
        description: `Subscription for ${selectedPlan.Name}`,
        image: 'https://your-logo-url.png',
        currency: selectedPlan.Currency || 'INR',
        key: 'rzp_test_S5OVwU720vAaEY', // 🔴 Replace in production
        amount: selectedPlan.PricePaise.toString(),
        name: 'Sales App',
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'Customer',
        },
        theme: { color: '#7c3aed' },
      };

      const response = await RazorpayCheckout.open(options);
      console.log('✅ Payment Success:', response);

      Alert.alert('Payment Successful 🎉', 'Your subscription is active!', [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (err) {
      console.error('❌ Payment failed:', err);

      if (err?.code === RazorpayCheckout.PAYMENT_CANCELLED) {
        Alert.alert('Payment Cancelled', 'You cancelled the payment.');
      } else {
        Alert.alert(
          'Payment Failed',
          err?.description || 'Something went wrong'
        );
      }
    }
  };

  // =============================
  // LOADING STATE
  // =============================
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  // =============================
  // ERROR / INVALID PLAN STATE
  // =============================
  // if (error || !selectedPlan) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white px-6">
  //       <Ionicons name="alert-circle" size={48} color="#ef4444" />
  //       <Text className="text-lg text-gray-800 mt-4 text-center">
  //         {error || 'Plan not found or inactive. Please choose another plan.'}
  //       </Text>

  //       <TouchableOpacity
  //         className="mt-6 bg-purple-600 py-3 px-6 rounded-lg"
  //         onPress={() => router.back()}
  //       >
  //         <Text className="text-white font-medium">Go Back</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  // =============================
  // MAIN UI
  // =============================
  return (
    <View style={styles.container}>
  

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.plansContainer}>
          {activePlans.map((plan) => (
            <PricingCard
              key={plan.PlanId}
              plan={plan}
              isSelected={selectedPlan?.PlanId === plan.PlanId}
              onSelect={handleSelectPlan}
            />
          ))}
        </View>

        {selectedPlan && (
          <View style={styles.selectedPlanContainer}>
            <Text style={styles.selectedPlanTitle}>Selected Plan</Text>
            <View style={styles.selectedPlanCard}>
              <Text style={styles.selectedPlanName}>{selectedPlan.Name}</Text>
              <Text style={styles.selectedPlanPrice}>
                {(selectedPlan.PricePaise / 100).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: selectedPlan.Currency || 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
              <Text style={styles.selectedPlanCredits}>
                {selectedPlan.QuoteCredits} Quotation Credits
              </Text>
            </View>
          </View>
        )}

        <View style={styles.paymentButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.paymentButton,
              !selectedPlan && styles.paymentButtonDisabled
            ]}
            onPress={handlePayment}
            disabled={!selectedPlan}
          >
            <Text style={styles.paymentButtonText}>
              {selectedPlan 
                ? `Pay Now - ${(selectedPlan.PricePaise / 100).toLocaleString('en-IN', {
                    style: 'currency',
                    currency: selectedPlan.Currency || 'INR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                : 'Select a Plan'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.paymentInfo}>
            <Ionicons name="lock-closed" size={16} color="#64748b" />
            <Text style={styles.paymentInfoText}>Secure payment powered by Razorpay</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  plansContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCard: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  internationalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  cardHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#7c3aed',
    marginBottom: 4,
  },
  credits: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  destinationsContainer: {
    marginBottom: 20,
  },
  destinationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  destinationItem: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  destinationText: {
    fontSize: 13,
    color: '#475569',
  },
  selectButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#7c3aed',
  },
  selectButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  selectedButtonText: {
    color: 'white',
  },
  selectedPlanContainer: {
    marginBottom: 24,
  },
  selectedPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  selectedPlanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedPlanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  selectedPlanPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#7c3aed',
    marginBottom: 4,
  },
  selectedPlanCredits: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  paymentButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentButton: {
    backgroundColor: '#7c3aed',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfoText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
