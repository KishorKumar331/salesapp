import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/auth/AuthManager";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from "expo-router";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user: userProfile } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut();
              await AsyncStorage.removeItem('userProfile');
              router.replace("/(auth)");
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout properly.');
            }
          }
        }
      ]
    );
  };

  const orgDetails = userProfile?.organization?.details || {};
  const financials = userProfile?.organization?.financials || {};
  const compliance = userProfile?.organization?.compliance || {};
  const contact = userProfile?.organization?.contact || {};
  const identity = userProfile?.user || {};

  const InfoRow = ({ label, value, icon }) => (
    <View className="flex-row items-center py-3 border-b border-gray-50">
      <View className="w-8">
        <Ionicons name={icon} size={18} color="#7c3aed" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 text-xs uppercase font-semibold">{label}</Text>
        <Text className="text-gray-900 font-medium text-sm mt-0.5">{value || "Not provided"}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar with Profile Info */}
      <Navbar
        title="Journey Readdy"
        subtitle="Explore beautiful destinations"
        showSearch
        showNotifications
        onNotificationPress={() => console.log("Notifications pressed")}
      />


      <ScrollView className="flex-1 px-4 pt-6">
        {/* Company Header Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-purple-50">
          <View className="flex-row items-center mb-6">
            <View className="h-20 w-20 bg-purple-50 rounded-2xl items-center justify-center overflow-hidden border border-purple-100">
              {orgDetails.logourl ? (
                <Image
                  source={{ uri: orgDetails.logourl }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name="business" size={40} color="#7c3aed" />
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-900 leading-tight">
                {orgDetails.companyname || "Your Company"}
              </Text>
              <Text className="text-purple-600 text-sm font-medium mt-1">
                {identity.fullname || "User Name"}
              </Text>
              <Text className="text-gray-500 text-xs mt-0.5">
                {identity.role || "Administrator"}
              </Text>
            </View>
          </View>

          <View className="space-y-3 border-t border-gray-50 pt-4">
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-2">{identity.Email || "No email"}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-2">{identity.Phone || contact.officephone || "No phone"}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="globe-outline" size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-2">{orgDetails.website || "No website"}</Text>
            </View>
          </View>
        </View>

        {/* Financial Details Section */}
        <Text className="text-gray-900 font-bold text-lg px-2 mb-3">Compliance & Info</Text>
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-50">
          <InfoRow label="GST Number" value={compliance.gstnumber} icon="receipt-outline" />
          <InfoRow label="PAN Number" value={compliance.pan} icon="card-outline" />
          <InfoRow label="Registration" value={compliance.registrationnumber} icon="folder-outline" />
          <InfoRow label="Office Address" value={contact.address} icon="location-outline" />
        </View>

        {/* Bank Details Section */}
        <Text className="text-gray-900 font-bold text-lg px-2 mb-3">Bank Information</Text>
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-50">
          <InfoRow label="Bank Name" value={financials.bankname} icon="business-outline" />
          <InfoRow label="Account Number" value={financials.accountnumber} icon="key-outline" />
          <InfoRow label="IFSC Code" value={financials.ifsc} icon="qr-code-outline" />
          <InfoRow label="Branch" value={financials.branch} icon="compass-outline" />
        </View>

        {/* Account Actions */}
        <Text className="text-gray-900 font-bold text-lg px-2 mb-3">Account Actions</Text>
        <View className="bg-white rounded-2xl p-4 mb-10 shadow-sm border border-gray-50">
          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={handleLogout}
          >
            <View className="h-10 w-10 bg-red-50 rounded-xl items-center justify-center">
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            </View>
            <Text className="text-red-500 font-bold ml-3 flex-1">Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

    </View>
  );
}
