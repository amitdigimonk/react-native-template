import { useTheme } from '@/hooks/useTheme';
import { wallpaperService } from '@/services/wallpaperService';
import { WallpaperLocation } from '@/services/androidWallpaperEngine';
import WallpaperBottomSheet from '@/components/WallpaperBottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import CustomText from '@/components/CustomText';

export default function ImageViewerScreen() {
    const { url } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();
    const [isApplying, setIsApplying] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(false);

    const applyToLocation = async (location: WallpaperLocation) => {
        if (!url) return;

        setIsApplying(true);
        const success = await wallpaperService.applyWallpaper(url as string, location);
        setIsApplying(false);

        if (success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', `Wallpaper applied to ${location.toLowerCase()} screen(s)!`);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Failed to apply wallpaper. Please try again.');
        }
    };

    const handleApplyWallpaper = () => {
        if (Platform.OS === 'android') {
            setIsSheetVisible(true);
        } else {
            applyToLocation('BOTH');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Image
                source={{ uri: url as string }}
                style={styles.image}
                contentFit="cover"
            />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={isApplying}
            >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                    onPress={handleApplyWallpaper}
                    disabled={isApplying}
                >
                    {isApplying ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <CustomText variant="body" color="#FFFFFF" style={{ fontWeight: 'bold' }}>
                            Apply Wallpaper
                        </CustomText>
                    )}
                </TouchableOpacity>
            </View>

            <WallpaperBottomSheet
                isVisible={isSheetVisible}
                onClose={() => setIsSheetVisible(false)}
                onSelect={(location) => {
                    setIsSheetVisible(false);
                    applyToLocation(location);
                }}
            />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 50,
        zIndex: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    applyButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
});