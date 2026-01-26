import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { X, Save, Database, CheckCircle } from 'lucide-react-native';
import { getStoredConfig, updateSupabaseConfig } from '../services/supabaseClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  // Load config on open
  React.useEffect(() => {
    if (isOpen) {
        const config = getStoredConfig();
        setUrl(config.url);
        setKey(config.key);
    }
  }, [isOpen]);

  const handleSave = () => {
    updateSupabaseConfig(url.trim(), key.trim());
    Alert.alert("Saved", "Storage settings updated.");
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.backdrop}>
            <View style={styles.container}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={24} color="#a8a29e" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconBox}>
                        <Database size={20} color="#059669" />
                    </View>
                    <Text style={styles.title}>Garden Storage</Text>
                </View>

                <Text style={styles.description}>
                    Connect to Supabase to save your garden to the cloud. If left empty, your garden will live only on this device.
                </Text>

                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Supabase Project URL</Text>
                        <TextInput 
                            value={url}
                            onChangeText={setUrl}
                            placeholder="https://xyz.supabase.co"
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Supabase Anon Key</Text>
                        <TextInput 
                            value={key}
                            onChangeText={setKey}
                            placeholder="eyJh..."
                            style={styles.input}
                            autoCapitalize="none"
                            secureTextEntry // Usually keys are long, maybe not hide? Web doesn't hide. But 'password' in web html.
                        />
                    </View>

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Save size={18} color="#fff" />
                        <Text style={styles.saveText}>Save Connections</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.25, elevation: 10 },
    closeButton: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 24, fontFamily: 'PlayfairDisplay_600SemiBold', color: '#292524' },
    description: { color: '#78716c', marginBottom: 24, fontSize: 14, lineHeight: 20 },
    form: { gap: 16 },
    field: {},
    label: { fontSize: 10, fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
    input: { backgroundColor: '#fafaf9', borderWidth: 1, borderColor: '#e7e5e4', borderRadius: 12, padding: 12, fontSize: 14 },
    saveButton: { backgroundColor: '#292524', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8, marginTop: 8 },
    saveText: { color: '#fff', fontWeight: '600' }
});
