import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FCD34D" stopOpacity="1" />
                <Stop offset="50%" stopColor="#FCA5A5" stopOpacity="1" />
                <Stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Path 
              d="M50 5 C50 5, 90 40, 90 65 C90 85, 70 95, 50 95 C30 95, 10 85, 10 65 C10 40, 50 5, 50 5 Z" 
              fill="url(#logoGradient)" 
              opacity="0.9"
            />
            <Circle cx="50" cy="65" r="15" fill="#fff" fillOpacity="0.4" />
          </Svg>
        </View>
        <Text style={styles.title}>MindGarden</Text>
      </View>
      <TouchableOpacity onPress={onSettingsClick} style={styles.settingsButton}>
        <Settings color="#78716c" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
    zIndex: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: '#44403c', // stone-700
    letterSpacing: -0.5, // tracking-tight
  },
  settingsButton: {
    padding: 8,
  },
});
