import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import CustomText from './CustomText';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
}

export default function CustomButton({ title, variant = 'primary', style, ...rest }: CustomButtonProps) {
    const { colors } = useTheme();
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.baseButton,
                {
                    backgroundColor: isPrimary ? colors.primary : colors.border,
                },
                style,
            ]}
            activeOpacity={0.8}
            {...rest}
        >
            <CustomText
                style={[
                    styles.baseText,
                    { color: isPrimary ? '#FFFFFF' : colors.text }
                ]}
            >
                {title}
            </CustomText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    baseButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    baseText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});