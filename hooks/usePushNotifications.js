// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { useEffect, useRef, useState } from "react";
// import { AppState, Platform } from "react-native";

// /* ==================== CONFIG ==================== */

// const REGISTRATION_URL =
//   "https://azlekhl3z9.execute-api.ap-south-1.amazonaws.com/registration/push-notification";

// const resolveAppVersion = () => Constants?.expoConfig?.version ?? "1.0.0";
// const APP_VERSION = resolveAppVersion();
// const DEVICE_ID_KEY = "DEVICE_ID";
// const LAST_PUSH_TOKEN_KEY = "LAST_PUSH_TOKEN";


// /* ==================== NOTIFICATION HANDLER ==================== */

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });


// export async function registerDeviceWithBackend({ userId, pushToken }) {
//   try {
//     if (!Device.isDevice) return;
//     if (!userId || !pushToken) {
//       console.warn("Missing userId or pushToken for device registration");
//       return;
//     }

//     const endpointUrl = REGISTRATION_URL;
//     if (!endpointUrl) {
//       console.warn("Device registration URL is not configured");
//       return;
//     }

//     const deviceId = await getOrCreateDeviceId();

//     const payload = {
//       UserId: userId,
//       DeviceId: deviceId,
//       Platform: Platform.OS,              // "android" / "ios"
//       PushToken: pushToken,
//       AppVersion: resolveAppVersion(),
//       LastActiveAt: new Date().toISOString(), // extra field, backend just ignores it
//     };

//     console.log("📡 Register payload:", payload);

//     const response = await fetch(endpointUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     console.log("🌐 Backend response status:", response.status);
//     if (!response.ok) {
//       // Attempt to read JSON body for better debugging
//       let errorText = null;
//       try {
//         const text = await response.text();
//         // Try parse JSON
//         try {
//           errorText = JSON.parse(text);
//         } catch (e) {
//           errorText = text;
//         }
//       } catch (e) {
//         errorText = `Unable to read response body: ${String(e)}`;
//       }

//       throw new Error(`Registration failed (${response.status}): ${JSON.stringify(errorText)}`);
//     }

//     console.log("✅ Device registered with backend");
//   } catch (error) {
//     console.error("Failed to register device with backend:", error);
//   }
// }

// /* ==================== ANDROID CHANNEL ==================== */

// async function ensureAndroidChannel() {
//   if (Platform.OS !== "android") return;

//   await Notifications.setNotificationChannelAsync("default", {
//     name: "default",
//     importance: Notifications.AndroidImportance.HIGH,
//     sound: "default",
//     enableVibrate: true,
//   });
// }

// /* ==================== DEVICE ID ==================== */

// async function getOrCreateDeviceId() {
//   const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
//   if (existing) return existing;

//   const id = `DEVICE-${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2)}`;

//   await AsyncStorage.setItem(DEVICE_ID_KEY, id);
//   return id;
// }

// /* ==================== TOKEN ==================== */

// async function getNativePushToken() {
//   console.log("getNativePushToken called - Device.isDevice:", Device.isDevice);
//   if (!Device.isDevice) return null;

//   const { status } = await Notifications.getPermissionsAsync();
//   console.log("getNativePushToken - current permission status:", status);
//   if (status !== "granted") {
//     const req = await Notifications.requestPermissionsAsync();
//     console.log("getNativePushToken - permission request result:", req?.status);
//     if (req.status !== "granted") return null;
//   }

//   console.log("getNativePushToken - ensuring Android channel on:", Platform.OS);
//   await ensureAndroidChannel();

//   console.log("getNativePushToken - requesting token from Expo/FCM...");
//   const token = await Notifications.getDevicePushTokenAsync();
//   console.log("🎫 Raw token object from getDevicePushTokenAsync:", token);
//   console.log("🎫 Native token data:", token?.data ?? null);
//   return token?.data ?? null;
// }

// async function getExpoPushToken() {
//   if (!Device.isDevice) return null;
//   try {
//     const tokenObj = await Notifications.getExpoPushTokenAsync();
//     console.log("🎯 Obtained expo push token:", tokenObj);
//     return tokenObj?.data ?? null;
//   } catch (e) {
//     console.warn("Failed to get Expo push token:", e?.message ?? e);
//     return null;
//   }
// }

// /* ==================== BACKEND ==================== */

// async function registerDevice(userId, pushToken) {
//   const deviceId = await getOrCreateDeviceId();

//   const payload = {
//     UserId: userId,
//     DeviceId: deviceId,
//     Platform: Platform.OS,
//     PushToken: pushToken,
//     AppVersion: APP_VERSION,
//     LastActiveAt: new Date().toISOString(),
//   };

//   await fetch(REGISTRATION_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
// }

// export async function deregisterDevice(userId) {
//   if (!userId) return;

//   const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
//   if (!deviceId) return;

//   await fetch(REGISTRATION_URL, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ UserId: userId, DeviceId: deviceId }),
//   });

//   await AsyncStorage.multiRemove([DEVICE_ID_KEY, LAST_PUSH_TOKEN_KEY]);
// }

// /* ==================== SYNC ==================== */

// async function syncToken(userId, providedToken = null) {
//   if (!userId) return;

//   const newToken = providedToken ?? (await getNativePushToken());
//   console.log("New Token:", newToken);
//   if (!newToken) return;

//   const oldToken = await AsyncStorage.getItem(LAST_PUSH_TOKEN_KEY);

//   if (oldToken !== newToken) {
//     await AsyncStorage.setItem(LAST_PUSH_TOKEN_KEY, newToken);
//     await registerDevice(userId, newToken);
//     console.log("✅ Device registered with backend");
//   }
// }

// /* ==================== HOOK ==================== */

// export function usePushNotifications(userId) {
//   const [notification, setNotification] = useState(null);
//   const [nativePushToken, setNativePushToken] = useState(null);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     let mounted = true;
//     const token =  getNativePushToken();
//     console.log("usePushNotifications effect - native token:", token);

//     (async () => {
//       const token = await getNativePushToken();
//       if (!mounted) return;
//       if (token) setNativePushToken(token);
//       if (userId) await syncToken(userId);
//     })();

//     const sub = AppState.addEventListener("change", (state) => {
//       if (state === "active") {
//         (async () => {
//           const token = await getNativePushToken();
//           if (!mounted) return;
//           if (token) setNativePushToken(token);
//           if (userId) await syncToken(userId);
//         })();
//       }
//     });

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener(setNotification);

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((r) =>
//         console.log("🔔 Notification tapped", r)
//       );

//     return () => {
//       mounted = false;
//       sub.remove();
//       notificationListener.current?.remove();
//       responseListener.current?.remove();
//     };
//   }, [userId]);

//   return { notification, nativePushToken };
// }

// /* ==================== LOCAL TEST ==================== */

// export async function triggerLocalTestNotification() {
//   await ensureAndroidChannel();
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Local Test",
//       body: "Local notifications are working",
//     },
//     trigger: null,
//   });
// }
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

/* ==================== NOTIFICATION HANDLER ==================== */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/* ==================== ANDROID CHANNEL ==================== */

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    enableVibrate: true,
  });
}

/* ==================== TOKEN ==================== */

async function getNativePushToken() {
  if (!Device.isDevice) {
    console.log("❌ Push token requires real device");
    return null;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    if (req.status !== "granted") {
      console.log("❌ Notification permission denied");
      return null;
    }
  }

  await ensureAndroidChannel();

  const tokenObj = await Notifications.getDevicePushTokenAsync();
  const token = tokenObj?.data ?? null;

  console.log("🎫 DEVICE PUSH TOKEN (FCM/APNs):", token);

  return token;
}

/* ==================== HOOK ==================== */

export function usePushNotifications() {
  const [notification, setNotification] = useState(null);
  const [devicePushToken, setDevicePushToken] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchToken = async () => {
      const token = await getNativePushToken();
      if (mountedRef.current && token) {
        setDevicePushToken(token);
      }
    };

    fetchToken();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        fetchToken();
      }
    });

    const notificationListener =
      Notifications.addNotificationReceivedListener(setNotification);

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((r) =>
        console.log("🔔 Notification tapped:", r)
      );

    return () => {
      mountedRef.current = false;
      sub.remove();
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    notification,
    devicePushToken,
  };
}

/* ==================== LOCAL TEST ==================== */

export async function triggerLocalTestNotification() {
  await ensureAndroidChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Local Test",
      body: "Local notifications are working",
    },
    trigger: null,
  });
}
