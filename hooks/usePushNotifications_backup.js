// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { useEffect, useRef, useState } from "react";
// import { Platform } from "react-native";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// const DEVICE_ID_STORAGE_KEY = "DEVICE_ID";

// const resolveAppVersion = () =>
//   Constants?.expoConfig?.version ?? "1.0.0";

// const resolveDeviceRegistrationUrl = () =>
//   "https://azlekhl3z9.execute-api.ap-south-1.amazonaws.com/registration/push-notification";

// async function ensureAndroidChannelAsync() {
//   if (Platform.OS !== "android") return;
//   await Notifications.setNotificationChannelAsync("default", {
//     name: "default",
//     importance: Notifications.AndroidImportance.HIGH,
//     sound: "default",
//     enableVibrate: true,
//   });
// }

// async function getOrCreateDeviceId() {
//   try {
//     const cached = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
//     if (cached) return cached;

//     const generated = `DEVICE-${Date.now()}-${Math.random()
//       .toString(36)
//       .slice(2)}`;
//     await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
//     return generated;
//   } catch (error) {
//     console.error("Failed to access AsyncStorage for device ID", error);
//     return `DEVICE-${Date.now()}`;
//   }
// }

// // 🔑 Only care about native FCM token for SNS
// export async function registerForPushNotificationsAsync() {
//   try {
//     if (!Device.isDevice) {
//       console.warn("Push notifications require a physical device");
//       return null;
//     }

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       console.warn("Notification permissions were not granted");
//       return null;
//     }

//     await ensureAndroidChannelAsync();

//     const devicePushToken = await Notifications.getDevicePushTokenAsync();
//     const tokenValue = devicePushToken?.data ?? null;
//     if (!tokenValue) {
//       console.warn("Could not obtain native push token");
//       return null;
//     }

//     console.log("🔥 Native FCM token:", tokenValue);

//     return {
//       expoPushToken: null,
//       nativePushToken: tokenValue,
//     };
//   } catch (err) {
//     console.error("Error while registering for push notifications:", err);
//     return null;
//   }
// }

// // expects the same shape you use in RootLayout
// export async function registerDeviceWithBackend({ userId, pushToken }) {
//   try {
//     if (!Device.isDevice) return;
//     if (!userId || !pushToken) {
//       console.warn("Missing userId or pushToken for device registration");
//       return;
//     }

//     const endpointUrl = resolveDeviceRegistrationUrl();
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

// export async function triggerLocalTestNotification({
//   title = "Local notification test",
//   body = "If you see this, local notifications are configured correctly.",
//   data = { source: "local-test" },
// } = {}) {
//   try {
//     await ensureAndroidChannelAsync();
//     await Notifications.scheduleNotificationAsync({
//       content: { title, body, data },
//       trigger: null,
//     });
//     console.log("✅ Local notification scheduled");
//   } catch (error) {
//     console.error("Failed to schedule local notification:", error);
//   }
// }

// Hook used in RootLayout
export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [nativePushToken, setNativePushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let isMounted = true;

    registerForPushNotificationsAsync().then((tokens) => {
      if (!tokens || !isMounted) return;
      setExpoPushToken(tokens.expoPushToken);
      setNativePushToken(tokens.nativePushToken);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((noti) => {
        console.log(
          "📥 Notification received:",
          JSON.stringify(noti, null, 2)
        );
        setNotification(noti);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "👆 Notification tapped response:",
          JSON.stringify(response, null, 2)
        );
      });

    return () => {
      isMounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken, nativePushToken, notification };
}


import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

/* -------------------- CONFIG -------------------- */
const resolveDeviceRegistrationUrl = () =>"https://azlekhl3z9.execute-api.ap-south-1.amazonaws.com/registration/push-notification";
const DEVICE_ID_KEY = "DEVICE_ID";
const LAST_PUSH_TOKEN_KEY = "LAST_PUSH_TOKEN";

const REGISTRATION_URL =
  "https://azlekhl3z9.execute-api.ap-south-1.amazonaws.com/registration/push-notification";

const APP_VERSION =
  Constants?.expoConfig?.version ?? "1.0.0";

/* -------------------- NOTIFICATION HANDLER -------------------- */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/* -------------------- ANDROID CHANNEL -------------------- */

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    enableVibrate: true,
  });
}

/* -------------------- DEVICE ID -------------------- */

async function getOrCreateDeviceId() {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const id = `DEVICE-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

/* -------------------- TOKEN FETCH -------------------- */

async function getNativePushToken() {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    if (req.status !== "granted") return null;
  }

  await ensureAndroidChannel();

  const token = await Notifications.getDevicePushTokenAsync();
  return token?.data ?? null;
}

/* -------------------- BACKEND CALLS -------------------- */

async function registerDevice(userId, pushToken) {
  if (!userId || !pushToken) return;

  const deviceId = await getOrCreateDeviceId();

  const payload = {
    UserId: userId,
    DeviceId: deviceId,
    Platform: Platform.OS,
    PushToken: pushToken,
    AppVersion: APP_VERSION,
    LastActiveAt: new Date().toISOString(),
  };

  await fetch(REGISTRATION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deregisterDevice(userId) {
  if (!userId) return;

  const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) return;

  await fetch(REGISTRATION_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserId: userId, DeviceId: deviceId }),
  });

  await AsyncStorage.multiRemove([DEVICE_ID_KEY, LAST_PUSH_TOKEN_KEY]);
}

/* -------------------- SYNC LOGIC -------------------- */

async function syncToken(userId) {
  if (!userId) return;

  const newToken = await getNativePushToken();
  if (!newToken) return;

  const oldToken = await AsyncStorage.getItem(LAST_PUSH_TOKEN_KEY);

  // 🔁 Register only if token changed
  if (oldToken !== newToken) {
    await AsyncStorage.setItem(LAST_PUSH_TOKEN_KEY, newToken);
    await registerDevice(userId, newToken);
  }
}

/* -------------------- HOOK -------------------- */

export function usePushNotifications(userId) {
  const [notification, setNotification] = useState(null);
  const [nativePushToken, setNativePushToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let isMounted = true;

    // Fetch token locally regardless of `userId` so callers can read it.
    (async () => {
      const t = await getNativePushToken();
      if (!isMounted) return;
      if (t) setNativePushToken(t);

      // If we have a userId, also sync with backend
      if (userId) await syncToken(userId);
    })();

    // App resume → refetch/resync
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        (async () => {
          const t = await getNativePushToken();
          if (!isMounted) return;
          if (t) setNativePushToken(t);
          if (userId) await syncToken(userId);
        })();
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((n) => {
        setNotification(n);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((r) => {
        console.log("🔔 Notification tapped:", r);
      });

    return () => {
      isMounted = false;
      sub.remove();
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [userId]);

  return { notification, nativePushToken };
}

/* -------------------- LOCAL TEST -------------------- */

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




export async function registerDeviceWithBackend({ userId, pushToken }) {
  try {
    if (!Device.isDevice) return;
    if (!userId || !pushToken) {
      console.warn("Missing userId or pushToken for device registration");
      return;
    }

    const endpointUrl = resolveDeviceRegistrationUrl();
    if (!endpointUrl) {
      console.warn("Device registration URL is not configured");
      return;
    }

    const deviceId = await getOrCreateDeviceId();

    const payload = {
      UserId: userId,
      DeviceId: '-dev-deviceid',
      Platform: Platform.OS,              // "android" / "ios"
      PushToken: pushToken,
      AppVersion: resolveAppVersion(),
      LastActiveAt: new Date().toISOString(), // extra field, backend just ignores it
    };

    console.log("📡 Register payload:", payload);

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("🌐 Backend response status:", response.status);
    if (!response.ok) {
      // Attempt to read JSON body for better debugging
      let errorText = null;
      try {
        const text = await response.text();
        // Try parse JSON
        try {
          errorText = JSON.parse(text);
        } catch (e) {
          errorText = text;
        }
      } catch (e) {
        errorText = `Unable to read response body: ${String(e)}`;
      }

      throw new Error(`Registration failed (${response.status}): ${JSON.stringify(errorText)}`);
    }

    console.log("✅ Device registered with backend");
  } catch (error) {
    console.error("Failed to register device with backend:", error);
  }
}