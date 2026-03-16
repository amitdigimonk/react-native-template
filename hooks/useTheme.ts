import { useSettingsContext } from '@/context/SettingsContext';

export const useTheme = () => {
    const { 
        isDark, 
        colors, 
        themeMode, 
        setThemeMode, 
        notificationsEnabled, 
        setNotificationsEnabled,
        lockScreenCategories,
        toggleLockScreenCategory,
        eventsEnabled,
        setEventsEnabled,
    } = useSettingsContext();

    return {
        isDark,
        colors,
        themeMode,
        setThemeMode,
        notificationsEnabled,
        setNotificationsEnabled,
        lockScreenCategories,
        toggleLockScreenCategory,
        eventsEnabled,
        setEventsEnabled,
    };
};