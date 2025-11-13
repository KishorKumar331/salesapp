import { Text, View } from "react-native"
import Navbar from "@/components/Navbar";
import { useUserProfile } from "@/hooks/useUserProfile";

const ConvertedPage = () => {
      const { user, loading } = useUserProfile();
    
  return (
   <View className="flex-1 bg-gray-50">
       <Navbar
         title="Follow Ups"
         subtitle={`Welcome ${user?.FullName || ""}`}
         showSearch
         showNotifications
         onNotificationPress={() => console.log("Notifications pressed")}
       />
 
   
     </View>
  )
}

export default ConvertedPage