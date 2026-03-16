import React, { useEffect } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';
import { useTheme } from '@/hooks/useTheme';
import { WallpaperLocation } from '@/services/androidWallpaperEngine';

interface WallpaperBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (location: WallpaperLocation) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 400;

export default function WallpaperBottomSheet({ isVisible, onClose, onSelect }: WallpaperBottomSheetProps) {
    const { colors } = useTheme();
    const translateY = useSharedValue(SCREEN_HEIGHT);

    const show = () => {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { 
            damping: 50, 
            stiffness: 100,
            mass: 0.5
        });
    };

    const hide = () => {
        translateY.value = withTiming(SCREEN_HEIGHT, {}, () => {
            runOnJS(onClose)();
        });
    };

    useEffect(() => {
        if (isVisible) {
            show();
        } else {
            hide();
        }
    }, [isVisible]);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = SCREEN_HEIGHT - SHEET_HEIGHT + event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 50 || event.velocityY > 500) {
                runOnJS(hide)();
            } else {
                translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 20 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const Option = ({ 
        icon, 
        label, 
        location 
    }: { 
        icon: keyof typeof Ionicons.glyphMap; 
        label: string; 
        location: WallpaperLocation 
    }) => (
        <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.card }]}
            onPress={() => {
                onSelect(location);
                hide();
            }}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={icon} size={24} color={colors.primary} />
            </View>
            <CustomText variant="body" style={styles.optionLabel}>{label}</CustomText>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
    );

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={hide}
        >
            <Pressable style={styles.backdrop} onPress={hide}>
                <Animated.View style={[styles.backdropBackground, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
            </Pressable>

            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.sheet,
                        { backgroundColor: colors.background, paddingBottom: 40 },
                        animatedStyle
                    ]}
                >
                    <View style={styles.dragHandleContainer}>
                        <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
                    </View>

                    <View style={styles.content}>
                        <CustomText variant="heading" style={styles.title}>Apply Wallpaper</CustomText>
                        <CustomText variant="body" style={[styles.subtitle, { color: colors.textMuted }]}>
                            Choose where you want to apply this wallpaper
                        </CustomText>

                        <View style={styles.optionsContainer}>
                            <Option icon="home-outline" label="Home Screen" location="HOME" />
                            <Option icon="lock-closed-outline" label="Lock Screen" location="LOCK" />
                            <Option icon="phone-portrait-outline" label="Both Screens" location="BOTH" />
                        </View>

                        <TouchableOpacity style={styles.cancelButton} onPress={hide}>
                            <CustomText variant="body" color="#EF4444" style={{ fontWeight: '600' }}>Cancel</CustomText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </GestureDetector>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    backdropBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 20,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    dragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        opacity: 0.3,
    },
    content: {
        paddingHorizontal: 28,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 28,
    },
    optionsContainer: {
        gap: 14,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionLabel: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
    },
    cancelButton: {
        marginTop: 24,
        alignItems: 'center',
        padding: 12,
    },
});

