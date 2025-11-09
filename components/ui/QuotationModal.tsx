import React from 'react';
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QuotationForm from '../form/QuotationForm';

interface QuotationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const QuotationModal: React.FC<QuotationModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose(); // Close modal after successful submission
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-white">
          <QuotationForm
            onClose={onClose}
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuotationModal;
