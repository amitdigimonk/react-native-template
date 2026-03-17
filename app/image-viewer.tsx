import { useTheme } from '@/hooks/useTheme';
import { getCachedWallpapers, Wallpaper } from '@/services/wallpaperService';
import { androidWallpaperEngine, WallpaperLocation } from '@/services/androidWallpaperEngine';
import WallpaperBottomSheet from '@/components/WallpaperBottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View, Platform, Dimensions, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '@/components/CustomText';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate, Extrapolate } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const METADATA_HEIGHT = 280;

interface GalleryItemProps {
    item: Wallpaper;
    colors: any;
    t: any;
    onApply: (url: string) => void;
}

const GalleryItem = React.memo(({ item, colors, t, onApply }: GalleryItemProps) => {
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const newY = event.translationY + context.value.y;
            translateY.value = Math.max(-METADATA_HEIGHT, Math.min(0, newY));
        })
        .onEnd((event) => {
            if (event.translationY < -100 || event.velocityY < -500) {
                translateY.value = withTiming(-METADATA_HEIGHT, { 
                    duration: 400, 
                    easing: Easing.out(Easing.back(0))
                });
            } else {
                translateY.value = withTiming(0, { 
                    duration: 400, 
                    easing: Easing.out(Easing.quad)
                });
            }
        });

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value * 1.2 }],
        borderRadius: interpolate(translateY.value, [0, -METADATA_HEIGHT], [0, 32], Extrapolate.CLAMP)
    }));

    const animatedMetaStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: interpolate(translateY.value, [0, -METADATA_HEIGHT / 2], [0, 1], Extrapolate.CLAMP)
    }));

    const animatedFooterStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateY.value, [0, -100], [1, 0])
    }));

    return (
        <View style={styles.galleryItemContainer}>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
                    <Image
                        source={{ uri: item.url }}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                        priority="high"
                        cachePolicy="disk"
                    />
                    <View style={StyleSheet.absoluteFill} />
                </Animated.View>
            </GestureDetector>

            {/* Metadata Sheet */}
            <Animated.View style={[styles.metaSheet, animatedMetaStyle, { backgroundColor: colors.card }]}>
                <View style={styles.metaHandle} />
                <View style={styles.metaContent}>
                    <View style={styles.metaHeader}>
                        <View>
                            <CustomText variant="heading" style={{ fontSize: 24 }}>{item.author || 'Creative Artist'}</CustomText>
                            <CustomText variant="caption">{t('imageViewer.metaAuthor')}</CustomText>
                        </View>
                        <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: colors.border }]}>
                            <Ionicons name="download-outline" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <CustomText variant="caption">{t('imageViewer.metaCategory')}</CustomText>
                            <CustomText variant="body" style={{ fontWeight: '600' }}>
                                {item.category?.name?.en || 'Abstract'}
                            </CustomText>
                        </View>
                        <View style={styles.infoItem}>
                            <CustomText variant="caption">{t('imageViewer.metaDimensions')}</CustomText>
                            <CustomText variant="body" style={{ fontWeight: '600' }}>1080 x 2400</CustomText>
                        </View>
                        <View style={styles.infoItem}>
                            <CustomText variant="caption">{t('imageViewer.metaType')}</CustomText>
                            <CustomText variant="body" style={{ fontWeight: '600' }}>{item.type?.toUpperCase() || 'IMAGE'}</CustomText>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.applyButton, { backgroundColor: colors.primary, marginTop: 20 }]}
                        onPress={() => onApply(item.url)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name="color-palette-outline" size={20} color="#FFFFFF" />
                            <CustomText variant="body" color="#FFFFFF" style={{ fontWeight: 'bold' }}>
                                {t('imageViewer.applyButton')}
                            </CustomText>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Floating Apply Button (Visible only when sheet is collapsed) */}
            <Animated.View style={[styles.footer, animatedFooterStyle]}>
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                    onPress={() => onApply(item.url)}
                >
                    <CustomText variant="body" color="#FFFFFF" style={{ fontWeight: 'bold' }}>
                        {t('imageViewer.applyButton')}
                    </CustomText>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
});

export default function ImageViewerScreen() {
    const { initialIndex, categoryId } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [isApplying, setIsApplying] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadList = async () => {
            const cached = await getCachedWallpapers(categoryId as string);
            if (cached) {
                setWallpapers(cached);
            }
        };
        loadList();
    }, [categoryId]);

    const applyToLocation = async (location: WallpaperLocation) => {
        if (!pendingUrl) return;
        setIsApplying(true);
        const success = await androidWallpaperEngine.setWallpaper(pendingUrl, location);
        setIsApplying(false);

        if (success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t('imageViewer.success'), t('imageViewer.appliedTo', { location: location.toLowerCase() }));
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(t('imageViewer.error'), t('imageViewer.failed'));
        }
    };

    const handleApplyPress = useCallback((url: string) => {
        setPendingUrl(url);
        if (Platform.OS === 'android') {
            setIsSheetVisible(true);
        } else {
            applyToLocation('BOTH');
        }
    }, [t]);

    const renderItem = useCallback(({ item }: { item: Wallpaper }) => (
        <GalleryItem 
            item={item} 
            colors={colors} 
            t={t} 
            onApply={handleApplyPress}
        />
    ), [colors, t, handleApplyPress]);

    if (wallpapers.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const currentIndex = viewableItems[0].index;
            // Pre-fetch next 2 images
            [1, 2].forEach(offset => {
                const nextItem = wallpapers[currentIndex + offset];
                if (nextItem) Image.prefetch(nextItem.url);
            });
            // Pre-fetch previous image
            const prevItem = wallpapers[currentIndex - 1];
            if (prevItem) Image.prefetch(prevItem.url);
        }
    }).current;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <FlatList
                    data={wallpapers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={initialIndex ? parseInt(initialIndex as string) : 0}
                    getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    removeClippedSubviews={Platform.OS === 'android'}
                    maxToRenderPerBatch={2}
                    windowSize={3}
                    initialNumToRender={1}
                />

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    disabled={isApplying}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <WallpaperBottomSheet
                    isVisible={isSheetVisible}
                    onClose={() => setIsSheetVisible(false)}
                    onSelect={(location) => {
                        setIsSheetVisible(false);
                        applyToLocation(location);
                    }}
                />

                {isApplying && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    galleryItemContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 50,
        zIndex: 100,
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    metaSheet: {
        position: 'absolute',
        bottom: -METADATA_HEIGHT,
        width: '100%',
        height: METADATA_HEIGHT + 100,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        zIndex: 50,
    },
    metaHandle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    metaContent: {
        flex: 1,
    },
    metaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    downloadBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoItem: {
        gap: 4,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200,
    }
});