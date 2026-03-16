import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
    lockScreenCategories: string[];
    toggleLockScreenCategory: (id: string) => void;
    eventsEnabled: boolean;
    setEventsEnabled: (enabled: boolean) => void;
    isDark: boolean;
    colors: typeof Colors.light;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [lockScreenCategories, setLockScreenCategories] = useState<string[]>([]);
    const [eventsEnabled, setEventsEnabled] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme-mode');
                const savedNotifications = await AsyncStorage.getItem('notifications-enabled');
                const savedCategories = await AsyncStorage.getItem('lock-screen-categories');
                const savedEvents = await AsyncStorage.getItem('events-enabled');

                if (savedTheme) setThemeMode(savedTheme as ThemeMode);
                if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
                if (savedCategories) setLockScreenCategories(JSON.parse(savedCategories));
                if (savedEvents) setEventsEnabled(savedEvents === 'true');
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('theme-mode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        AsyncStorage.setItem('notifications-enabled', String(notificationsEnabled));
    }, [notificationsEnabled]);

    useEffect(() => {
        AsyncStorage.setItem('lock-screen-categories', JSON.stringify(lockScreenCategories));
    }, [lockScreenCategories]);

    useEffect(() => {
        AsyncStorage.setItem('events-enabled', String(eventsEnabled));
    }, [eventsEnabled]);

    const toggleLockScreenCategory = (id: string) => {
        setLockScreenCategories(prev => {
            if (prev.includes(id)) {
                return prev.filter(catId => catId !== id);
            }
            if (prev.length >= 5) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const isDark = themeMode === 'system' 
        ? systemColorScheme === 'dark' 
        : themeMode === 'dark';

    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <SettingsContext.Provider 
            value={{ 
                themeMode, 
                setThemeMode, 
                notificationsEnabled, 
                setNotificationsEnabled,
                lockScreenCategories,
                toggleLockScreenCategory,
                eventsEnabled,
                setEventsEnabled,
                isDark, 
                colors 
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
}
