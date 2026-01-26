import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LS_URL_KEY = 'mindgarden_sb_url';
const LS_KEY_KEY = 'mindgarden_sb_key';

let supabaseInstance: SupabaseClient | null = null;

// Initialize function to be called on App start
export const initSupabase = async () => {
  try {
    const lsUrl = await AsyncStorage.getItem(LS_URL_KEY);
    const lsKey = await AsyncStorage.getItem(LS_KEY_KEY);
    
    // Prioritize storage, then fallback to env
    const url = lsUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = lsKey || process.env.EXPO_PUBLIC_SUPABASE_KEY;

    if (url && key) {
        supabaseInstance = createClient(url, key);
    }
  } catch (e) {
    console.error("Failed to init Supabase", e);
  }
};

export const getSupabase = (): SupabaseClient | null => {
  return supabaseInstance;
};

export const updateSupabaseConfig = async (url: string, key: string) => {
  if (!url || !key) {
    await AsyncStorage.removeItem(LS_URL_KEY);
    await AsyncStorage.removeItem(LS_KEY_KEY);
    supabaseInstance = null;
  } else {
    await AsyncStorage.setItem(LS_URL_KEY, url);
    await AsyncStorage.setItem(LS_KEY_KEY, key);
    supabaseInstance = createClient(url, key);
  }
};

export const getStoredConfig = async () => ({
  url: (await AsyncStorage.getItem(LS_URL_KEY)) || process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  key: (await AsyncStorage.getItem(LS_KEY_KEY)) || process.env.EXPO_PUBLIC_SUPABASE_KEY || ''
});
