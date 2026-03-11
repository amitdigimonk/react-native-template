import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export const useTheme = () => {
    const theme = useColorScheme() ?? 'light';

    return {
        isDark: theme === 'dark',
        colors: Colors[theme],
    };
};