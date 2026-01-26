import React from 'react';
import { View, Dimensions, ScrollView, Pressable, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Rect, G, Ellipse, Path, Circle as SvgCircle } from 'react-native-svg';
import { ThoughtCard } from '../types';
import { PlantSprite } from './PlantSprite';
import { Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CANVAS_SIZE = 1500; // Large canvas for scrolling

interface GardenCanvasProps {
  thoughts: ThoughtCard[];
  onPlantClick: (thought: ThoughtCard) => void;
  onNewThoughtClick: () => void;
}

const BackgroundMap = () => (
  <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <Rect width="100" height="100" fill="#FDFCF8" />
    <G opacity="0.4">
      <Ellipse cx="20" cy="30" rx="25" ry="20" fill="#A7F3D0" /> 
      <Ellipse cx="80" cy="25" rx="30" ry="25" fill="#FDE68A" />
      <Ellipse cx="50" cy="20" rx="20" ry="15" fill="#C7D2FE" />
      <Ellipse cx="25" cy="65" rx="25" ry="25" fill="#FECDD3" />
      <Ellipse cx="85" cy="60" rx="20" ry="25" fill="#E2E8F0" />
      <Ellipse cx="50" cy="80" rx="30" ry="15" fill="#99F6E4" />
    </G>
    <G fill="none" stroke="#78716C" strokeWidth="0.15" opacity="0.15">
      <Path d="M0 40 Q 30 20 60 40 T 100 30" />
      <Path d="M0 60 Q 40 80 80 60 T 100 70" />
      <Path d="M30 100 Q 50 60 70 100" />
      <SvgCircle cx="50" cy="50" r="40" strokeDasharray="10 20" opacity="0.5" />
    </G>
  </Svg>
);

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ 
  thoughts, 
  onPlantClick,
  onNewThoughtClick 
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fafaf9' }}>
        <ScrollView
            horizontal
            contentContainerStyle={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <ScrollView
                contentContainerStyle={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, position: 'relative' }}>
                    <BackgroundMap />
                     
                    {/* Zone Labels directly on canvas */}
                    <Text style={[styles.zoneLabel, { left: '20%', top: '30%', transform: [{ rotate: '-5deg'}] }]}>Duties</Text>
                    <Text style={[styles.zoneLabel, { left: '80%', top: '25%', transform: [{ rotate: '5deg'}] }]}>Ideas</Text>
                    <Text style={[styles.zoneLabel, { left: '25%', top: '65%', transform: [{ rotate: '3deg'}] }]}>Feelings</Text>
                    <Text style={[styles.zoneLabel, { left: '50%', top: '85%' }]}>Goals</Text>

                    {thoughts.map((thought) => (
                        <PlantSprite 
                            key={thought.id} 
                            thought={thought} 
                            onClick={onPlantClick} 
                        />
                    ))}
                </View>
            </ScrollView>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    zoneLabel: {
        position: 'absolute',
        fontFamily: 'PlayfairDisplay_400Regular_Italic',
        fontSize: 18, 
        color: '#a8a29e', // stone-400
        opacity: 0.6,
        letterSpacing: 1,
    }
});
