import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold } from '@expo-google-fonts/outfit';
import { PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import { AppView, ThoughtCard, ThoughtCategory, Position } from './types';
import { GardenCanvas } from './components/GardenCanvas';
import { PlantingModal } from './components/PlantingModal';
import { ReflectionModal } from './components/ReflectionModal';
import { ListView } from './components/ListView';
import { SettingsModal } from './components/SettingsModal';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { generateMindGardenContent, waterMindGardenThought } from './services/geminiService';
import { saveThought, getThoughts, deleteThought } from './services/storageService';
import { initSupabase } from './services/supabaseClient';
import * as Crypto from 'expo-crypto';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
  });

  const [view, setView] = useState<AppView>(AppView.GARDEN);
  const [isPlanting, setIsPlanting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedThought, setSelectedThought] = useState<ThoughtCard | null>(null);
  const [gardenThoughts, setGardenThoughts] = useState<ThoughtCard[]>([]);

  useEffect(() => {
    const init = async () => {
        await initSupabase();
        refreshGarden();
    };
    init();
  }, []);

  const refreshGarden = async () => {
    try {
      const thoughts = await getThoughts();
      setGardenThoughts(thoughts);
    } catch (error) {
      console.error("Failed to load garden:", error);
    }
  };

  const getPositionForCategory = (category: ThoughtCategory): Position => {
    let xRange = [0, 100];
    let yRange = [0, 100];

    // Align with zone labels layout in GardenCanvas
    switch(category) {
      case 'todo': xRange = [10, 30]; yRange = [20, 40]; break; // Duties (Top Left)
      case 'idea': xRange = [70, 90]; yRange = [15, 35]; break; // Ideas (Top Right)
      case 'feeling': xRange = [15, 40]; yRange = [50, 80]; break; // Feelings (Left/Center) - merged with worry
      case 'goal': xRange = [40, 60]; yRange = [75, 90]; break; // Goals (Bottom Center)
      default: xRange = [10, 90]; yRange = [10, 90]; break;
    }

    const x = Math.floor(Math.random() * (xRange[1] - xRange[0]) + xRange[0]);
    const y = Math.floor(Math.random() * (yRange[1] - yRange[0]) + yRange[0]);
    return { x, y };
  };

  const handlePlant = async (text: string) => {
    setIsLoading(true);
    try {
      const content = await generateMindGardenContent(text);
      const position = getPositionForCategory(content.meta.category);
      
      const newCard: ThoughtCard = {
        ...content,
        id: Crypto.randomUUID(),
        originalText: text,
        createdAt: Date.now(),
        position,
        hasViewed: false,
        growthStage: 'seed',
        updates: []
      };

      await saveThought(newCard);
      await refreshGarden();
      setIsPlanting(false);
      setSelectedThought(newCard); // Open detail view
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Could not plant seed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWater = async (thought: ThoughtCard, updateText: string) => {
     try {
       const result = await waterMindGardenThought(thought, updateText);
       
       const updatedThought: ThoughtCard = {
         ...thought,
         growthStage: result.newStage,
         meta: {
           ...thought.meta,
           hasNextStep: result.hasNextStep,
           nextStep: result.nextStep
         },
         updates: [
           {
             id: Crypto.randomUUID(),
             timestamp: Date.now(),
             text: updateText,
             aiResponse: result.acknowledgment,
             previousStage: thought.growthStage,
             newStage: result.newStage,
             nextStep: result.nextStep
           },
           ...(thought.updates || [])
         ]
       };

       await saveThought(updatedThought);
       await refreshGarden();
       setSelectedThought(updatedThought);
     } catch (error) {
       console.error("Watering failed:", error);
       Alert.alert("Error", "Failed to water plant.");
     }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
        "Clear Thought",
        "Are you sure you want to remove this thought from your garden?",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Clear", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await deleteThought(id);
                        await refreshGarden();
                        setSelectedThought(null);
                    } catch (e) {
                         Alert.alert("Error", "Failed to clear thought.");
                    }
                }
            }
        ]
    );
  };

  // Wait for fonts to load
  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            
            <Header onSettingsClick={() => setIsSettingsOpen(true)} />

            <View style={styles.content}>
                {view === AppView.GARDEN ? (
                    <GardenCanvas 
                        thoughts={gardenThoughts}
                        onPlantClick={setSelectedThought}
                        onNewThoughtClick={() => setIsPlanting(true)}
                    />
                ) : (
                    <ListView 
                        thoughts={gardenThoughts}
                        onThoughtClick={setSelectedThought}
                    />
                )}
            </View>

            <BottomNavBar 
                currentView={view}
                onViewChange={setView}
                onPlantClick={() => setIsPlanting(true)}
            />

            <PlantingModal 
                isOpen={isPlanting}
                onClose={() => setIsPlanting(false)}
                onPlant={handlePlant}
                isLoading={isLoading}
            />

            {selectedThought && (
                <ReflectionModal 
                    thought={selectedThought}
                    onClose={() => setSelectedThought(null)}
                    onDelete={handleDelete} 
                    onWater={handleWater}
                />
            )}

            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Remove Toaster component if not used or stick with Alert for simplicity if native sonner issues persist */}
            {/* <Toaster /> */}
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Space for bottom bar
  }
});
