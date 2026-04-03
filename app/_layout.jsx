
import { AuthProvider, useAuth } from "@/components/auth/AuthManager";
import {
  triggerLocalTestNotification,
  usePushNotifications,
} from "@/hooks/usePushNotifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Amplify } from 'aws-amplify';
import { Stack, router } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import awsExports from '../aws-exports';
import "../global.css";
import amplifyconfig from './src/amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

/* ==================== CONFIG ==================== */
Amplify.configure(awsExports);

const REGISTRATION_URL =
  "https://azlekhl3z9.execute-api.ap-south-1.amazonaws.com/registration/push-notification";

/* ==================== BACKEND ==================== */

async function registerDeviceWithBackend({ userId, pushToken }) {
  try {
    const payload = {
      UserId: userId,
      Platform: Platform.OS,
      DeviceId: '-dev-deviceid',

      PushToken: pushToken,
      AppVersion: "1.0.0",
      LastActiveAt: new Date().toISOString(),
    };

    console.log("📡 Registering device:", payload);

    const res = await fetch(REGISTRATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("🌐 Registration status:", res.status);
  } catch (e) {
    console.error("❌ Device registration failed:", e);
  }
}



/* ==================== ROOT ==================== */

function RootLayoutContent() {
  const { isReady, isAuthenticated, user, loading: authLoading } = useAuth();
  const { devicePushToken } = usePushNotifications();
  const registrationRef = useRef({ userId: null, token: null });
  const localTestRef = useRef(false);

  /* ---------- Auth Check ---------- */
  useEffect(() => {
    if (isReady && !isAuthenticated && !authLoading) {
      router.replace("/(auth)");
    }
  }, [isReady, isAuthenticated, authLoading]);

  /* ---------- Register Device ---------- */
  useEffect(() => {
    const userEmail = user?.user?.Email ?? null;
    if (!userEmail || !devicePushToken) return;

    console.log("👤 User:", userEmail);
    console.log("📲 Push Token:", devicePushToken);

    if (
      registrationRef.current.userId === userEmail &&
      registrationRef.current.token === devicePushToken
    ) {
      return;
    }

    registerDeviceWithBackend({
      userId: userEmail,
      pushToken: devicePushToken,
    }).then(() => {
      registrationRef.current = {
        userId: userEmail,
        token: devicePushToken,
      };
    });
  }, [user, devicePushToken]);

  /* ---------- DEV Local Test ---------- */
  useEffect(() => {
    if (!__DEV__) return;
    if (!devicePushToken) return;
    if (localTestRef.current) return;

    triggerLocalTestNotification();
    localTestRef.current = true;
  }, [devicePushToken]);

  if (!isReady || authLoading) return null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutContent />
      </QueryClientProvider>
    </AuthProvider>
  );
}
