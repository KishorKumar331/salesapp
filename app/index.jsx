import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("userProfile");
        if (userProfile !== null && userProfile !== undefined) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.replace("/(auth)");
      }
    };

    checkAuthAndRedirect();
  }, []);

  return null; 
}
