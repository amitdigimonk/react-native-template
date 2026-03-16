import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
    isDark: boolean;
    colors: typeof Colors.light;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
