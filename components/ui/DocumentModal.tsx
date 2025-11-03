import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'pdf' | 'jpg' | 'png' | 'doc';
}

interface DocumentCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
  documents: Document[];
}

interface DocumentModalProps {
  visible: boolean;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ visible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);

  const documentCategories: DocumentCategory[] = [
    {
      id: '1',
      name: 'Passport',
      count: 3,
      icon: 'document-text',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      documents: [
        { id: '1', name: 'passport_front.pdf', size: '2.3 MB', date: '2025-01-16', type: 'pdf' },
        { id: '2', name: 'passport_back.pdf', size: '1.8 MB', date: '2025-01-16', type: 'pdf' },
        { id: '3', name: 'passport_photo.jpg', size: '856 KB', date: '2025-01-15', type: 'jpg' },
      ]
    },
    {
      id: '2',
      name: 'Identity',
      count: 4,
      icon: 'person',
      color: '#10b981',
      bgColor: '#d1fae5',
      documents: [
        { id: '4', name: 'aadhar_front.pdf', size: '1.2 MB', date: '2025-01-14', type: 'pdf' },
        { id: '5', name: 'aadhar_back.pdf', size: '1.1 MB', date: '2025-01-14', type: 'pdf' },
        { id: '6', name: 'pan_card.jpg', size: '654 KB', date: '2025-01-13', type: 'jpg' },
        { id: '7', name: 'driving_license.pdf', size: '2.1 MB', date: '2025-01-12', type: 'pdf' },
      ]
    },
   
  ];

  const handleCategoryPress = (category: DocumentCategory) => {
    setSelectedCategory(category);
  };

  const handleBackPress = () => {
    setSelectedCategory(null);
  };

  const handleUploadDocument = () => {
    Alert.alert('Upload Document', 'Document upload functionality would be implemented here', [
      { text: 'OK' }
    ]);
  };

  const handleDocumentPress = (document: Document) => {
    Alert.alert('Document', `Opening ${document.name}`, [{ text: 'OK' }]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'jpg':
      case 'png':
        return 'image';
      case 'doc':
        return 'document';
      default:
        return 'document';
    }
  };

  const getFileIconColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return '#dc2626';
      case 'jpg':
      case 'png':
        return '#059669';
      case 'doc':
        return '#2563eb';
      default:
        return '#6b7280';
    }
  };

  const CategoryView = () => (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-purple-600 p-4 pt-12 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="bg-white/20 rounded-full p-2 mr-3">
              <Ionicons name="folder" size={20} color="white" />
            </View>
            <Text className="text-white text-xl font-bold">Journey Routers</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 text-sm">Document Management</Text>
      </View>

      {/* Document Categories */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">Document Categories</Text>
        
        <View className="space-y-3">
          {documentCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category)}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View 
                  className="rounded-full p-3 mr-4"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <Ionicons name={category.icon as any} size={24} color={category.color} />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-lg">{category.name}</Text>
                  <Text className="text-gray-500 text-sm">{category.count} documents stored</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="cloud-upload" size={12} color="#10b981" />
                    <Text className="text-green-600 text-xs ml-1">Secure</Text>
                    <Text className="text-gray-400 text-xs ml-2">Today</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Overview */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Quick Overview</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-purple-100 rounded-lg p-3 flex-1 mr-2 items-center">
              <Ionicons name="grid" size={20} color="#7c3aed" />
              <Text className="text-purple-600 text-xs mt-1">Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg p-3 flex-1 mx-1 items-center">
              <Ionicons name="flash" size={20} color="#6b7280" />
              <Text className="text-gray-600 text-xs mt-1">Rapid</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg p-3 flex-1 mx-1 items-center">
              <Ionicons name="create" size={20} color="#6b7280" />
              <Text className="text-gray-600 text-xs mt-1">Create</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg p-3 flex-1 ml-2 items-center">
              <Ionicons name="person" size={20} color="#6b7280" />
              <Text className="text-gray-600 text-xs mt-1">Follow-up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const DocumentDetailView = () => (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-purple-600 p-4 pt-12 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={handleBackPress}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <View className="bg-white/20 rounded-full p-2 mr-3">
              <Ionicons name={selectedCategory?.icon as any} size={20} color="white" />
            </View>
            <Text className="text-white text-xl font-bold">{selectedCategory?.name}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 text-sm">{selectedCategory?.count} documents • Updated today</Text>
      </View>

      {/* Upload Button */}
      <View className="p-4">
        <TouchableOpacity
          onPress={handleUploadDocument}
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
        >
          <Ionicons name="cloud-upload" size={20} color="white" />
          <Text className="text-white font-medium ml-2">Upload New Document</Text>
        </TouchableOpacity>

        {/* Documents List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {selectedCategory?.documents.map((document) => (
            <TouchableOpacity
              key={document.id}
              onPress={() => handleDocumentPress(document)}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-red-50 rounded-lg p-3 mr-4">
                  <Ionicons 
                    name={getFileIcon(document.type) as any} 
                    size={20} 
                    color={getFileIconColor(document.type)} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{document.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-500 text-sm">{document.size}</Text>
                    <Text className="text-gray-400 text-sm ml-4">{document.date}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity className="bg-green-100 rounded-full p-2 mr-2">
                  <Ionicons name="checkmark" size={16} color="#10b981" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-100 rounded-full p-2">
                  <Ionicons name="download" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {selectedCategory ? <DocumentDetailView /> : <CategoryView />}
      </View>
    </Modal>
  );
};

export default DocumentModal;
