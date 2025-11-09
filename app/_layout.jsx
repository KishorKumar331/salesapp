import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Still loading → render nothing or splash screen
  if (!isReady) return null;
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
