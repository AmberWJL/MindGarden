import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { X, Sprout } from 'lucide-react-native';

interface PlantingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlant: (text: string) => void;
  isLoading: boolean;
}

export const PlantingModal: React.FC<PlantingModalProps> = ({ 
  isOpen, 
  onClose, 
  onPlant, 
  isLoading 
}) => {
  const [text, setText] = useState('');

  const handlePlant = () => {
    if (text.trim() && !isLoading) {
      onPlant(text);
      setText('');
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
            {/* Prevent closing when clicking content */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#a8a29e" />
                    </TouchableOpacity>

                    <Text style={styles.title}>What's on your mind?</Text>
                    <Text style={styles.subtitle}>
                        Plant an idea, a worry, a todo, or a feeling. Let it grow.
                    </Text>

                    <TextInput
                        value={text}
                        onChangeText={setText}
                        editable={!isLoading}
                        multiline
                        textAlignVertical="top"
                        autoFocus
                        style={styles.input}
                        placeholder="I'm feeling overwhelmed by..."
                        placeholderTextColor="#d6d3d1"
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} disabled={isLoading} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlePlant}
                            disabled={!text.trim() || isLoading}
                            style={[
                                styles.plantButton, 
                                (!text.trim() || isLoading) && styles.plantButtonDisabled
                            ]}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Sprout size={20} color="white" />
                            )}
                            <Text style={styles.plantText}>
                                {isLoading ? 'Analyzing...' : 'Plant Seed'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(41, 37, 36, 0.4)', // stone-900/40
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: '#292524',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    color: '#78716c',
    marginBottom: 24,
    fontSize: 14,
  },
  input: {
    width: '100%',
    height: 160,
    padding: 16,
    backgroundColor: '#fafaf9', // stone-50
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    color: '#292524',
    fontSize: 16,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f4', // hover effect in web is handled by native feedback
  },
  cancelText: {
    color: '#78716c',
    fontWeight: '500',
  },
  plantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0f766e', // teal-700
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  plantButtonDisabled: {
    backgroundColor: '#d6d3d1', // stone-300
    shadowOpacity: 0,
    elevation: 0,
  },
  plantText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
});
