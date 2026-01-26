import React, { useState } from 'react';
import { Modal, View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { X, Trash2, Calendar, Send, Footprints, Lightbulb, Heart, Sprout, History } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Needed for image overlay
import { ThoughtCard, NextStepType, GrowthStage, ThoughtUpdate } from '../types';

interface ReflectionModalProps {
  thought: ThoughtCard | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onWater: (thought: ThoughtCard, update: string) => void;
}

const NextStepIcon = ({ type }: { type: NextStepType }) => {
    switch (type) {
      case 'do': return <Footprints size={16} color="#0d9488" />; // teal-600
      case 'clarify': return <Lightbulb size={16} color="#d97706" />; // amber-600
      case 'reflect': return <Heart size={16} color="#e11d48" />; // rose-600
      default: return <Sprout size={16} color="#57534e" />;
    }
  };

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ 
  thought, 
  onClose, 
  onDelete,
  onWater
}) => {
  const [waterInput, setWaterInput] = useState('');
  const [isWatering, setIsWatering] = useState(false);

  if (!thought) return null;

  const handleWaterSubmit = async () => {
    if (!waterInput.trim() || isWatering) return;
    
    setIsWatering(true);
    // Simulate slight delay for UX
    await onWater(thought, waterInput);
    setIsWatering(false);
    setWaterInput('');
  };

  const colors = {
    seed: { bg: '#f5f5f4', text: '#57534e' },
    sprout: { bg: '#d1fae5', text: '#047857' },
    bloom: { bg: '#ffe4e6', text: '#be123c' },
    fruit: { bg: '#fef3c7', text: '#b45309' }
  };

  const GrowthBadge = ({ stage }: { stage: GrowthStage }) => (
    <View style={[styles.badge, { backgroundColor: colors[stage].bg }]}>
        <Text style={[styles.badgeText, { color: colors[stage].text }]}>{stage} Phase</Text>
    </View>
  );

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.container}>
            {/* Header / Image Area */}
            <View style={styles.imageHeader}>
                 <Image 
                    source={{ uri: thought.imageUrl }} 
                    style={styles.headerImage} 
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradientOverlay}
                />
                
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X color="#fff" size={24} />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <Text style={styles.thoughtTopic}>{thought.meta.topic}</Text>
                    <View style={styles.headerMetaRow}>
                        <Text style={styles.headerMetaText}>{thought.meta.category}</Text>
                        <Text style={styles.headerMetaDot}>•</Text>
                        <Text style={styles.headerMetaText}>{thought.meta.emotion}</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.contentBody}>
                    <View style={styles.centerStage}>
                        <GrowthBadge stage={thought.growthStage} />
                        <Text style={styles.reflectionMain}>"{thought.reflection}"</Text>
                    </View>

                    {/* Next Step Card */}
                    {thought.meta.hasNextStep && thought.meta.nextStep && (
                        <View style={[
                            styles.nextStepCard, 
                            thought.meta.nextStep.type === 'do' && styles.nsDo,
                            thought.meta.nextStep.type === 'clarify' && styles.nsClarify,
                            thought.meta.nextStep.type === 'reflect' && styles.nsReflect,
                        ]}>
                            <View style={styles.nsHeader}>
                                <NextStepIcon type={thought.meta.nextStep.type} />
                                <Text style={styles.nsLabel}>{thought.meta.nextStep.type.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.nsText}>{thought.meta.nextStep.text}</Text>
                        </View>
                    )}

                    {/* Growth Log */}
                    <View style={styles.sectionHeader}>
                        <History size={16} color="#a8a29e" />
                        <Text style={styles.sectionTitle}>GROWTH LOG</Text>
                    </View>

                    <View style={styles.timeline}>
                        {/* Original Seed */}
                        <View style={styles.timelineItem}>
                            <View style={styles.timelineLine} />
                            <Text style={styles.timelineLabel}>Original Seed</Text>
                            <Text style={styles.timelineText}>"{thought.originalText}"</Text>
                        </View>

                        {/* Updates */}
                        {thought.updates?.map((update: ThoughtUpdate) => (
                            <View key={update.id} style={styles.timelineItem}>
                                <View style={[styles.timelineLine, { borderColor: '#fde68a' }]} />
                                <View style={styles.timelineDot} />
                                <Text style={styles.timelineText}>You: "{update.text}"</Text>
                                <View style={styles.aiResponseBox}>
                                    <Text style={styles.aiResponseText}>{update.aiResponse}</Text>
                                </View>
                                <Text style={styles.timelineDate}>
                                    {new Date(update.timestamp).toLocaleDateString()}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Water Input - Only if not fruit */}
                    {thought.growthStage !== 'fruit' ? (
                        <View style={styles.inputContainer}>
                             <TextInput
                                style={styles.input}
                                placeholder="Add an update to water this thought..."
                                value={waterInput}
                                onChangeText={setWaterInput}
                                multiline
                             />
                             <TouchableOpacity 
                                onPress={handleWaterSubmit}
                                disabled={!waterInput.trim() || isWatering}
                                style={[styles.sendButton, (!waterInput.trim() || isWatering) && styles.sendButtonDisabled]}
                             >
                                 {isWatering ? <ActivityIndicator size="small" color="#fff" /> : <Send size={16} color="#fff" />}
                             </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.fruitMessage}>
                            <Text style={styles.fruitText}>This thought has borne fruit. It is safe to rest now.</Text>
                        </View>
                    )}

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <View style={styles.dateRow}>
                            <Calendar size={14} color="#a8a29e" />
                            <Text style={styles.dateText}>{new Date(thought.createdAt).toLocaleDateString()}</Text>
                        </View>
                        
                        <TouchableOpacity onPress={() => onDelete(thought.id)} style={styles.deleteButton}>
                            <Trash2 size={16} color="#f87171" />
                            <Text style={styles.deleteText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageHeader: { height: 300, position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 },
  closeButton: { position: 'absolute', top: 50, right: 20, padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  headerContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  thoughtTopic: { color: '#fff', fontSize: 28, fontFamily: 'PlayfairDisplay_600SemiBold' },
  headerMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  headerMetaText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  headerMetaDot: { color: 'rgba(255,255,255,0.6)', marginHorizontal: 8 },
  
  contentScroll: { flex: 1 },
  contentBody: { padding: 24 },
  centerStage: { alignItems: 'center', marginBottom: 32 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 16 },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', tracking: 1 },
  reflectionMain: { fontSize: 20, fontFamily: 'PlayfairDisplay_400Regular_Italic', textAlign: 'center', color: '#292524', lineHeight: 28 },
  
  // Next Step Card
  nextStepCard: { padding: 20, borderRadius: 16, backgroundColor: '#f5f5f4', marginBottom: 32, borderWidth: 1, borderColor: '#e7e5e4' },
  nsDo: { backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' },
  nsClarify: { backgroundColor: '#fffbeb', borderColor: '#fef3c7' },
  nsReflect: { backgroundColor: '#fff1f2', borderColor: '#ffe4e6' },
  nsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nsLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: '#57534e' },
  nsText: { fontSize: 16, color: '#44403c' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, borderTopWidth: 1, borderTopColor: '#f5f5f4', paddingTop: 24 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: '#a8a29e', letterSpacing: 1 },

  timeline: { paddingLeft: 8 },
  timelineItem: { paddingLeft: 16, borderLeftWidth: 2, borderColor: '#e7e5e4', paddingBottom: 24, position: 'relative' },
  timelineLine: { position: 'absolute', left: -2, top: 0, bottom: 0, width: 2, backgroundColor: '#e7e5e4' },
  timelineDot: { position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#fcd34d' },
  timelineLabel: { fontSize: 12, color: '#78716c', marginBottom: 4 },
  timelineText: { fontSize: 14, color: '#44403c', marginBottom: 8 },
  timelineDate: { fontSize: 10, color: '#a8a29e', marginTop: 4 },
  aiResponseBox: { backgroundColor: '#fafaf9', padding: 12, borderRadius: 8, marginVertical: 8, borderLeftWidth: 2, borderLeftColor: '#d6d3d1' },
  aiResponseText: { fontSize: 13, fontFamily: 'PlayfairDisplay_400Regular_Italic', color: '#57534e' },

  inputContainer: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, backgroundColor: '#fafaf9', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#e7e5e4', maxHeight: 80 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0d9488', alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { backgroundColor: '#d6d3d1' },

  fruitMessage: { padding: 16, backgroundColor: '#fffbeb', borderRadius: 12, borderWidth: 1, borderColor: '#fef3c7', marginTop: 16 },
  fruitText: { textAlign: 'center', color: '#b45309', fontFamily: 'PlayfairDisplay_400Regular_Italic' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, borderTopWidth: 1, borderTopColor: '#f5f5f4', paddingTop: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 12, color: '#a8a29e' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  deleteText: { color: '#f87171', fontSize: 14, fontWeight: '500' }
});
