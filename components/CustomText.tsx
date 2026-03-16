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
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    subheading: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    caption: {
        fontSize: 13,
        letterSpacing: 2,
        fontWeight: '700',
        textTransform: 'uppercase',
        opacity: 0.6,
    },
});