import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const RestrictedAccessScreen = ({ paymentUrl, onLogout, userEmail, checkSession }) => {
  const insets = useSafeAreaInsets();
  const [timeLeft, setTimeLeft] = useState(5);
  const [hasStartedPayment, setHasStartedPayment] = useState(false);

  // Animated bounce for the lock icon container
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // Bounce Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim, pulseAnim]);

  const handleRedirect = useCallback(async () => {
    if (!paymentUrl) return;
    try {
      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) {
        await Linking.openURL(paymentUrl);
        setHasStartedPayment(true);
      } else {
        console.warn("Cannot open payment URL: " + paymentUrl);
        // Fallback: try to open directly anyway
        await Linking.openURL(paymentUrl);
        setHasStartedPayment(true);
      }
    } catch (err) {
      console.error("Failed to open payment URL:", err);
    }
  }, [paymentUrl]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleRedirect();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, handleRedirect]);

  // Session check interval
  useEffect(() => {
    if (!hasStartedPayment || !checkSession || !userEmail) return;

    // Trigger immediate check
    const performCheck = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;
      try {
        await checkSession(userEmail, true);
      } catch (err) {
        console.error("Error during profile status check:", err);
      } finally {
        isCheckingRef.current = false;
      }
    };

    performCheck();

    const interval = setInterval(performCheck, 5000);
    return () => clearInterval(interval);
  }, [hasStartedPayment, checkSession, userEmail]);

  const handlePayNow = () => {
    handleRedirect();
  };

  return (
    <View 
      style={{ 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom,
      }} 
      className="flex-1 bg-slate-950 justify-center px-6 relative"
    >
      {/* Background Glows */}
      <View className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <View 
          className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-purple-900/20" 
          style={{ transform: [{ scale: 1.5 }] }} 
        />
        <View 
          className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-indigo-900/20" 
          style={{ transform: [{ scale: 1.5 }] }} 
        />
      </View>

      {/* Main Content Card */}
      <View className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 items-center shadow-2xl relative">
        
        {/* Lock badge with pulsating glow and bounce */}
        <View className="relative mb-6 justify-center items-center">
          <Animated.View 
            className="absolute w-24 h-24 bg-purple-500/20 rounded-full"
            style={{ transform: [{ scale: pulseAnim }] }}
          />
          <Animated.View
            style={{ transform: [{ translateY: bounceAnim }] }}
          >
            <LinearGradient
              colors={['#a855f7', '#4f46e5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-20 h-20 rounded-2xl items-center justify-center shadow-lg border border-white/10"
            >
              <Feather name="lock" size={32} color="white" />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-black tracking-tight text-white mb-2 text-center">
          Access Restricted
        </Text>

        {/* Status Badge */}
        <View className="flex-row items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
          <View className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <Text className="text-red-400 text-[10px] font-black uppercase tracking-widest">
            Subscription Expired
          </Text>
        </View>

        {/* Description */}
        <Text className="text-slate-400 text-sm font-medium text-center mb-8 leading-relaxed max-w-[280px]">
          Your account access has been restricted. Please complete your subscription payment to unlock the full dashboard and restore all services.
        </Text>

        {/* Status indicator / info box */}
        <View className="w-full bg-slate-800/40 border border-slate-800/50 rounded-2xl p-4 mb-6 flex-row items-center justify-center gap-2">
          {timeLeft > 0 ? (
            <Text className="text-xs text-slate-400 font-medium text-center">
              Opening payment page in <Text className="text-purple-400 font-bold">{timeLeft}</Text> seconds...
            </Text>
          ) : (
            <View className="flex-row items-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <Text className="text-xs text-slate-400 font-medium text-center">
                Please return to the app after payment succeeds
              </Text>
            </View>
          )}
        </View>

        {/* Pay Button */}
        <Pressable
          onPress={handlePayNow}
          className="w-full rounded-2xl overflow-hidden shadow-lg active:scale-[0.98]"
        >
          <LinearGradient
            colors={['#9333ea', '#4f46e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center justify-center gap-2 p-4.5 py-4"
          >
            <Text className="text-white font-black text-xs uppercase tracking-[0.2em]">
              Pay & Unlock Now
            </Text>
            <Feather name="arrow-right" size={16} color="white" />
          </LinearGradient>
        </Pressable>

        {/* Logout Button */}
        <Pressable
          onPress={onLogout}
          className="mt-6 flex-row items-center gap-2 py-2"
        >
          <Feather name="log-out" size={14} color="#64748b" />
          <Text className="text-xs font-bold text-slate-500 hover:text-slate-300">
            Sign Out of Account
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RestrictedAccessScreen;
