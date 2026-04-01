// import {
//   registerDeviceWithBackend,
//   triggerLocalTestNotification,
//   usePushNotifications,
// } from "@/hooks/usePushNotifications";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useUserProfile } from "@/hooks/useUserProfile";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Stack, router } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import "../global.css";

// export default function RootLayout() {
//   const [isReady, setIsReady] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const { expoPushToken, nativePushToken } = usePushNotifications();
//   const { user } = useUserProfile();
//   const registrationRef = useRef({ userId: null, token: null });
//   const localTestRef = useRef(false);
// console.log( "expoPushToken:", expoPushToken, "nativePushToken:", nativePushToken);
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const userProfile = await AsyncStorage.getItem("userProfile");
//         setIsAuthenticated(userProfile !== null && userProfile !== undefined);
//       } catch (error) {
//         console.error("Error checking auth status:", error);
//         setIsAuthenticated(false);
//       }
//       setIsReady(true);
//     };

//     checkAuthStatus();
//   }, []);

//   // Not authenticated → redirect to auth stack
//   useEffect(() => {
//     if (isReady && !isAuthenticated) {
//       router.replace("/(auth)");
//     }
//   }, [isReady, isAuthenticated]);

//   useEffect(() => {
//     if (expoPushToken) {
//       console.log("Expo push token:", expoPushToken);
//     }
//   }, [expoPushToken]);

//   useEffect(() => {
//     const userEmail = user?.Email ?? user?.email ?? null;
//     if (!userEmail || !nativePushToken) return;

//     if (
//       registrationRef.current.userId === userEmail &&
//       registrationRef.current.token === nativePushToken
//     ) {
//       return;
//     }

//     registerDeviceWithBackend({
//       userId: userEmail,
//       pushToken: nativePushToken,
//     }).then(() => {
//       registrationRef.current = { userId: userEmail, token: nativePushToken };
//     });
//   }, [user, nativePushToken]);

//   useEffect(() => {
//     if (!__DEV__) return;
//     if (localTestRef.current) return;
//     if (!nativePushToken) return;

//     triggerLocalTestNotification();
//     localTestRef.current = true;
//   }, [nativePushToken]);

//   // Still loading → render nothing or splash screen
//   if (!isReady) return null;

//   const queryClient = new QueryClient()
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//       </Stack>
//     </QueryClientProvider>

//   );
// }
import {
  usePushNotifications,
  triggerLocalTestNotification,
} from "@/hooks/usePushNotifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import "../global.css";
import { Platform } from "react-native";
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import { AuthProvider } from "@/components/auth/AuthManager";

Amplify.configure(amplifyconfig);

/* ==================== CONFIG ==================== */

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

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { devicePushToken } = usePushNotifications();
  const { user } = useUserProfile();

  const registrationRef = useRef({ userId: null, token: null });
  const localTestRef = useRef(false);

  /* ---------- Auth Check ---------- */

  useEffect(() => {
    (async () => {
      const userProfile = await AsyncStorage.getItem("userProfile");
      setIsAuthenticated(!!userProfile);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/(auth)");
    }
  }, [isReady, isAuthenticated]);

  /* ---------- Register Device ---------- */

  useEffect(() => {
    const userEmail = user?.Email ?? user?.email ?? null;
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

  if (!isReady) return null;

  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </AuthProvider>
  );
}
