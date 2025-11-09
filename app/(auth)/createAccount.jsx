import { View, Text, TextInput, Pressable, ScrollView, Alert, Image, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

const CreateAccountPage = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    Email: '',
    Phone: '',
    FullName: '',
    Role: 'Salesperson',
    
    CompanyName: '',
    CompanyAddress: '',
    CompanyGSTNumber: '',
    CompanyWebsite: '',
    CompanyLogoUrl: null, 
    InvoiceNumber: '',
    
    BankName: '',
    BranchName: '',
    AccountNumber: '',
    IfscCode: '',
    UpiId: '',
    QrCode: null, 
    
    CompanyId: '',
    Balance: 0,
    Currency: 'INR',
    SubscriptionPlanId: '',
    SubscriptionType: '',
    SubscriptionStatus: 'InActive',
    Features_MaxQuotesPerMonth: 0,
    Features_QuoteCharge: 0,
    Features_PaymentProofUpload: false,
    Features_InAppNotifications: false,
    Features_WebNotifications: false,
    Features_AnalyticsDashboard: false,
    LoginDevices: {
      Web: {
        LoggedIn: false,
        LastLogin: null,
        DeviceInfo: null
      },
      Mobile: {
        LoggedIn: false,
        LastLogin: null,
        DeviceInfo: null
      }
    },
    Preferences: {
      Notifications: {
        InApp: true,
        Email: true,
        SMS: false,
        WebPush: true
      },
      Theme: 'light',
      Language: 'en'
    }
  });

  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveFormData();
    }
  }, [formData, currentStep, isLoading]);

  const loadSavedData = async () => {
    try {
      const savedFormData = await AsyncStorage.getItem('createAccountFormData');
      const savedStep = await AsyncStorage.getItem('createAccountCurrentStep');
      
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      }
      
      if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormData = async () => {
    try {
      await AsyncStorage.setItem('createAccountFormData', JSON.stringify(formData));
      await AsyncStorage.setItem('createAccountCurrentStep', currentStep.toString());
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };



  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Request permissions for image picker
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  };

  const handleLogoUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 5MB.');
          return;
        }

        const base64 = await convertToBase64(asset.uri);
        updateFormData('CompanyLogoUrl', `data:image/jpeg;base64,${base64}`);
        Alert.alert('Success', 'Logo uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload logo. Please try again.');
      console.error('Logo upload error:', error);
    }
  };
  

  const handleQRUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check file size (2MB limit for QR codes) using legacy API
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size > 2 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 2MB.');
          return;
        }

        const base64 = await convertToBase64(asset.uri);
        updateFormData('QrCode', `data:image/jpeg;base64,${base64}`);
        Alert.alert('Success', 'QR code uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload QR code. Please try again.');
      console.error('QR upload error:', error);
    }
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.FullName && formData.Email && formData.Phone && formData.Role;
      case 2:
        return formData.CompanyName && formData.CompanyAddress;
      case 3:
        return formData.BankName && formData.AccountNumber;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Missing Information', 'Please fill in all required fields before continuing.');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fillEmptyFields = (data) => {
    const currentDate = new Date().toISOString();
    
    const companyNamePart = data.CompanyName?.replace(/\s+/g, '').substring(0, 6).toUpperCase() || 'COMP';
    const usernamePart = data.Email?.split('@')[0]?.substring(0, 4).toUpperCase() || 'USER';
    const mobileLast4 = data.Phone?.slice(-4) || '0000';
    const companyId = `${companyNamePart}${usernamePart}${mobileLast4}`;
    
    const deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version,
    };
    
    return {
      ...data,
      CompanyId: data.CompanyId || companyId,
      CompanyAddress: data.CompanyAddress,
      CompanyWebsite: data.CompanyWebsite,
      CompanyGSTNumber: data.CompanyGSTNumber,
      CompanyLogoUrl: data.CompanyLogoUrl,
      SubscriptionStart: "",
      SubscriptionEnd: "",
      BankName: data.BankName || 'Default Bank',
      BranchName: data.BranchName,
      AccountNumber: data.AccountNumber,
      IfscCode: data.IfscCode,
      UpiId: data.UpiId,
      LoginDevices: {
        ...data.LoginDevices,
        Mobile: {
          LoggedIn: true,
          LastLogin: currentDate,
          DeviceInfo: deviceInfo
        }
      }
    };
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleSubmit = async () => {
    try {
      const completeFormData = fillEmptyFields(formData);
      
      const response = await fetch('https://sg76vqy4vi.execute-api.ap-south-1.amazonaws.com/salesapp/Auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeFormData),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Save account data locally for payment gateway
        
        await AsyncStorage.setItem('userProfile', JSON.stringify(completeFormData));
        await AsyncStorage.removeItem('createAccountFormData');
        await AsyncStorage.setItem('accountCreated', 'true');
        
        showToast('Account created successfully!');
        
        router.push('/(auth)/PaymentGateway/payment');
      } else {
        Alert.alert('Error', result.message || 'Failed to create account. Please try again.');
        console.error('API Error:', result);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      console.error('Submit error:', error);
    }
  };

  const renderProgressBar = () => (
    <View className="bg-purple-100 h-2">
      <View 
        className="bg-purple-500 h-full transition-all duration-300"
        style={{ width: `${(currentStep / 3) * 100}%` }}
      />
    </View>
  );

  const renderStepTitle = () => {
    const titles = {
      1: { title: 'Personal Info', subtitle: 'Tell us about yourself' },
      2: { title: 'Organization Info', subtitle: 'Your company details' },
      3: { title: 'Payment Info', subtitle: 'Banking & payment setup' }
    };
    
    return (
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">{titles[currentStep].title}</Text>
        <Text className="text-gray-600 mt-1">{titles[currentStep].subtitle}</Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={32} color="#7c3aed" />
          </View>
          <Text className="text-xl font-semibold text-gray-900">Welcome!</Text>
          <Text className="text-gray-600 text-center mt-1">Let's get to know you better</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Full Name *</Text>
            <TextInput
              value={formData.FullName}
              onChangeText={(value) => updateFormData('FullName', value)}
              placeholder="Enter your full name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Email Address *</Text>
            <TextInput
              value={formData.Email}
              onChangeText={(value) => updateFormData('Email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Phone Number *</Text>
            <TextInput
              value={formData.Phone}
              onChangeText={(value) => updateFormData('Phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="business" size={32} color="#7c3aed" />
          </View>
          <Text className="text-xl font-semibold text-gray-900">Organization Details</Text>
          <Text className="text-gray-600 text-center mt-1">Tell us about your business</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Company Name *</Text>
            <TextInput
              value={formData.CompanyName}
              onChangeText={(value) => updateFormData('CompanyName', value)}
              placeholder="Enter company name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Company Address *</Text>
            <TextInput
              value={formData.CompanyAddress}
              onChangeText={(value) => updateFormData('CompanyAddress', value)}
              placeholder="Enter company address"
              multiline={true}
              numberOfLines={3}
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Company Website</Text>
            <TextInput
              value={formData.CompanyWebsite}
              onChangeText={(value) => updateFormData('CompanyWebsite', value)}
              placeholder="https://www.example.com"
              keyboardType="url"
              autoCapitalize="none"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Upload Logo</Text>
            <Pressable 
              onPress={handleLogoUpload}
              className="bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-300 items-center"
            >
              {formData.CompanyLogoUrl ? (
                <View className="items-center">
                  <Image 
                    source={{ uri: formData.CompanyLogoUrl }} 
                    className="w-16 h-16 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text className="text-green-600 font-medium">Logo uploaded!</Text>
                  <Text className="text-gray-400 text-sm">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="cloud-upload" size={32} color="#9ca3af" />
                  <Text className="text-gray-600 mt-2">Tap to upload company logo</Text>
                  <Text className="text-gray-400 text-sm">PNG, JPG up to 5MB</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">GST Number</Text>
            <TextInput
              value={formData.CompanyGSTNumber}
              onChangeText={(value) => updateFormData('CompanyGSTNumber', value)}
              placeholder="Enter GST number"
              autoCapitalize="characters"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Invoice Number Format</Text>
            <TextInput
              value={formData.InvoiceNumber}
              onChangeText={(value) => updateFormData('InvoiceNumber', value)}
              placeholder="e.g., INV-2024-001"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="card" size={32} color="#7c3aed" />
          </View>
          <Text className="text-xl font-semibold text-gray-900">Payment Setup</Text>
          <Text className="text-gray-600 text-center mt-1">Configure your payment methods</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Bank Name *</Text>
            <TextInput
              value={formData.BankName}
              onChangeText={(value) => updateFormData('BankName', value)}
              placeholder="Enter bank name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Branch Name *</Text>
            <TextInput
              value={formData.BranchName}
              onChangeText={(value) => updateFormData('BranchName', value)}
              placeholder="Enter branch name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Account Number *</Text>
            <TextInput
              value={formData.AccountNumber}
              onChangeText={(value) => updateFormData('AccountNumber', value)}
              placeholder="Enter account number"
              keyboardType="numeric"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">IFSC Code *</Text>
            <TextInput
              value={formData.IfscCode}
              onChangeText={(value) => updateFormData('IfscCode', value)}
              placeholder="Enter IFSC code"
              autoCapitalize="characters"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">UPI ID</Text>
            <TextInput
              value={formData.UpiId}
              onChangeText={(value) => updateFormData('UpiId', value)}
              placeholder="yourname@paytm"
              autoCapitalize="none"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">QR Code Scanner</Text>
            <Pressable 
              onPress={handleQRUpload}
              className="bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-300 items-center"
            >
              {formData.QrCode ? (
                <View className="items-center">
                  <Image 
                    source={{ uri: formData.QrCode }} 
                    className="w-20 h-20 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text className="text-green-600 font-medium">QR code uploaded!</Text>
                  <Text className="text-gray-400 text-sm">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="qr-code" size={32} color="#9ca3af" />
                  <Text className="text-gray-600 mt-2">Upload QR code for payments</Text>
                  <Text className="text-gray-400 text-sm">PNG, JPG up to 2MB</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  const renderButtons = () => (
    <View className="px-6 py-4 flex-row gap-4">
      {currentStep > 1 && (
        <Pressable
          onPress={prevStep}
          className="flex-1 bg-gray-200 rounded-full py-4 items-center"
        >
          <Text className="text-gray-700 font-semibold">Previous</Text>
        </Pressable>
      )}
      
      <Pressable
        onPress={currentStep === 3 ? handleSubmit : nextStep}
        className="flex-1 overflow-hidden rounded-full"
      >
        <LinearGradient
          colors={['#7c3aed', '#5b21b6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 16 }}
        >
          <Text className="text-center text-white font-semibold text-base">
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center">
          <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="hourglass" size={24} color="#7c3aed" />
          </View>
          <Text className="text-gray-600">Loading your progress...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)')}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-900">Create Account</Text>
          <View className="w-6" />
        </View>
      </View>

      {renderProgressBar()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {renderStepTitle()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        {renderButtons()}
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateAccountPage;