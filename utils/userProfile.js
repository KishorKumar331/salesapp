import AsyncStorage from '@react-native-async-storage/async-storage';


export const getUserProfile = async () => {
  try {
    const profileData = await AsyncStorage.getItem("userProfile");
    if (profileData) {
      const parsedData = JSON.parse(profileData);
      // Handle array structure - take the first item if it's an array
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData[0];
      }
      // Handle direct object structure
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};


