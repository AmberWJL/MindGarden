import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThoughtCard, ThoughtCategory } from '../types';
import { Sparkles, Sprout, Flower2, TreeDeciduous, Moon, Circle } from 'lucide-react-native';

interface PlantSpriteProps {
  thought: ThoughtCard;
  onClick: (thought: ThoughtCard) => void;
}

const getCategoryIcon = (category: ThoughtCategory) => {
  switch (category) {
    case 'idea': return <Sparkles size={20} color="#d97706" />;
    case 'todo': return <Sprout size={20} color="#059669" />;
    case 'worry': return <Moon size={20} color="#64748b" />;
    case 'feeling': return <Flower2 size={20} color="#e11d48" />;
    case 'goal': return <TreeDeciduous size={20} color="#0d9488" />;
    case 'memory': return <Flower2 size={20} color="#6366f1" />;
    default: return <Circle size={20} color="#a8a29e" />;
  }
};

const getBubbleColor = (category: ThoughtCategory) => {
  switch (category) {
    case 'idea': return styles.ideaBubble;
    case 'todo': return styles.todoBubble;
    case 'worry': return styles.worryBubble;
    case 'feeling': return styles.feelingBubble;
    case 'goal': return styles.goalBubble;
    case 'memory': return styles.memoryBubble;
    default: return styles.defaultBubble;
  }
};

export const PlantSprite: React.FC<PlantSpriteProps> = ({ thought, onClick }) => {
  return (
    <View
      style={[
        styles.container,
        {
          left: `${thought.position.x}%`,
          top: `${thought.position.y}%`,
        }
      ]}
    >
      <Pressable onPress={() => onClick(thought)}>
        <View style={[styles.bubble, getBubbleColor(thought.meta.category)]}>
          <View style={styles.shine} />
          <View style={styles.icon}>
            {getCategoryIcon(thought.meta.category)}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  bubble: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ideaBubble: { backgroundColor: '#fef3c7cc', borderColor: '#fde68a' },
  todoBubble: { backgroundColor: '#d1fae5cc', borderColor: '#a7f3d0' },
  worryBubble: { backgroundColor: '#f1f5f9cc', borderColor: '#e2e8f0' },
  feelingBubble: { backgroundColor: '#ffe4e6cc', borderColor: '#fecdd3' },
  goalBubble: { backgroundColor: '#ccfbf1cc', borderColor: '#99f6e4' },
  memoryBubble: { backgroundColor: '#e0e7ffcc', borderColor: '#c7d2fe' },
  defaultBubble: { backgroundColor: '#f5f5f4cc', borderColor: '#e7e5e4' },
  shine: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 12,
    height: 8,
    backgroundColor: '#ffffff99',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  icon: {
    opacity: 0.8,
  },
});
