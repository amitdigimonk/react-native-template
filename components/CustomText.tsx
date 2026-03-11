import { useTheme } from '@/hooks/useTheme'; // 1. Import your new hook
import { StyleSheet, Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
    variant?: 'heading' | 'subheading' | 'body' | 'caption';
    color?: string;
}

export default function CustomText({
    style,
    variant = 'body',
    color,
    children,
    ...rest
}: CustomTextProps) {

    const { colors } = useTheme();

    return (
        <Text
            style={[
                styles.baseText,
                styles[variant],
                { color: color || colors.text },
                style
            ]}
            {...rest}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'NeoSans',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    subheading: {
        fontSize: 18,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});