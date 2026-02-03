import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const DEVICE_ID_STORAGE_KEY = "DEVICE_ID";

const resolveAppVersion = () =>
  Constants?.expoConfig?.version ?? "1.0.0";

const resolveDeviceRegistrationUrl = () =>
  "https://azlekhl3z9.execute-api.ap-south-1.amazonaws.com/registration/push-notification";

async function ensureAndroidChannelAsync() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    enableVibrate: true,
  });
}

async function getOrCreateDeviceId() {
  try {
    const cached = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (cached) return cached;

    const generated = `DEVICE-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
    return generated;
  } catch (error) {
    console.error("Failed to access AsyncStorage for device ID", error);
    return `DEVICE-${Date.now()}`;
  }
}

// 🔑 Only care about native FCM token for SNS
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Notification permissions were not granted");
    return null;
  }

  await ensureAndroidChannelAsync();

  const devicePushToken = await Notifications.getDevicePushTokenAsync();
  console.log("🔥 Native FCM token:", devicePushToken.data);

  return {
    expoPushToken: null,                 // we don’t use this for SNS
    nativePushToken: devicePushToken.data,
  };
}

// expects the same shape you use in RootLayout
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
      DeviceId: deviceId,
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

    console.log("🌐 Backend response:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Registration failed (${response.status}): ${errorText}`
      );
    }

    console.log("✅ Device registered with backend");
  } catch (error) {
    console.error("Failed to register device with backend:", error);
  }
}

export async function triggerLocalTestNotification({
  title = "Local notification test",
  body = "If you see this, local notifications are configured correctly.",
  data = { source: "local-test" },
} = {}) {
  try {
    await ensureAndroidChannelAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null,
    });
    console.log("✅ Local notification scheduled");
  } catch (error) {
    console.error("Failed to schedule local notification:", error);
  }
}

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
