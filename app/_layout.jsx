import {
  registerDeviceWithBackend,
  triggerLocalTestNotification,
  usePushNotifications,
} from "@/hooks/usePushNotifications";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfile } from "@/hooks/useUserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import "../global.css";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { expoPushToken, nativePushToken } = usePushNotifications();
  const { user } = useUserProfile();
  const registrationRef = useRef({ userId: null, token: null });
  const localTestRef = useRef(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("userProfile");
        setIsAuthenticated(userProfile !== null && userProfile !== undefined);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
      setIsReady(true);
    };

    checkAuthStatus();
  }, []);

  // Not authenticated → redirect to auth stack
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/(auth)");
    }
  }, [isReady, isAuthenticated]);

  useEffect(() => {
    if (expoPushToken) {
      console.log("Expo push token:", expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    const userEmail = user?.Email ?? user?.email ?? null;
    if (!userEmail || !nativePushToken) return;

    if (
      registrationRef.current.userId === userEmail &&
      registrationRef.current.token === nativePushToken
    ) {
      return;
    }

    registerDeviceWithBackend({
      userId: userEmail,
      pushToken: nativePushToken,
    }).then(() => {
      registrationRef.current = { userId: userEmail, token: nativePushToken };
    });
  }, [user, nativePushToken]);

  useEffect(() => {
    if (!__DEV__) return;
    if (localTestRef.current) return;
    if (!nativePushToken) return;

    triggerLocalTestNotification();
    localTestRef.current = true;
  }, [nativePushToken]);

  // Still loading → render nothing or splash screen
  if (!isReady) return null;

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>

  );
}
