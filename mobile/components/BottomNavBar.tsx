import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Map, Grid, Plus } from 'lucide-react-native';
import { AppView } from '../types';

interface BottomNavBarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onPlantClick: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  currentView, 
  onViewChange, 
  onPlantClick 
}) => {
  return (
    <View style={styles.container}>
      {/* Left Tab - Garden */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onViewChange(AppView.GARDEN)}
      >
        <Map 
            size={24} 
            color={currentView === AppView.GARDEN ? "#0d9488" : "#a8a29e"} 
            strokeWidth={currentView === AppView.GARDEN ? 2.5 : 2}
        />
        <Text style={[
            styles.label, 
            { color: currentView === AppView.GARDEN ? "#0d9488" : "#a8a29e" }
        ]}>
            Garden
        </Text>
      </TouchableOpacity>

      {/* Center - Plant Button */}
      {/* Container to handle the absolute positioning relative to the bar */}
      <View style={styles.centerButtonContainer}>
        <TouchableOpacity 
            style={styles.plantButton}
            onPress={onPlantClick}
            activeOpacity={0.8}
        >
            <Plus color="#fff" size={32} />
        </TouchableOpacity>
      </View>

      {/* Right Tab - Collection */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onViewChange(AppView.LIST)}
      >
        <Grid 
            size={24} 
            color={currentView === AppView.LIST ? "#0d9488" : "#a8a29e"} 
            strokeWidth={currentView === AppView.LIST ? 2.5 : 2}
        />
        <Text style={[
            styles.label, 
            { color: currentView === AppView.LIST ? "#0d9488" : "#a8a29e" }
        ]}>
            Collection
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f4',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Safe area padding
    justifyContent: 'center', // Center content
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    gap: 140, // Increased spacing between tabs
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 50,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Outfit_500Medium',
  },
  centerButtonContainer: {
    position: 'absolute',
    top: -24, // Pull it up
    left: '50%',
    transform: [{ translateX: -32 }], // Center using transform instead of marginLeft
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff', // White border effect
    padding: 4, // create gap/border
    
    // Shadow for the floating effect
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0,
  },
  plantButton: {
    flex: 1,
    backgroundColor: '#292524',
    borderRadius: 30, // Inner radius
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }
});
