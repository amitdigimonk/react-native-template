import { useSettingsContext } from '@/context/SettingsContext';

export const useTheme = () => {
    const { 
        isDark, 
        colors, 
        themeMode, 
        setThemeMode, 
        notificationsEnabled, 
        setNotificationsEnabled 
    } = useSettingsContext();

    return {
        isDark,
        colors,
        themeMode,
        setThemeMode,
        notificationsEnabled,
        setNotificationsEnabled,
    };
};