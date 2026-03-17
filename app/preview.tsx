import CustomText from '@/components/CustomText';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { ImageData } from '@/types';
import { Ionicons } from '@expo/vector-icons';

import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { fetchHomeCategories, getCachedCategories } from '@/services/categoryService';
import { fetchWallpapersByCategory, getCachedWallpapers, Wallpaper } from '@/services/wallpaperService';
import { Category } from '@/types';

// Dynamic filters replace static ones

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backBtn: {
        position: 'absolute',
        left: 20,
        bottom: 12,
        zIndex: 1,
        padding: 5,
    },
    filterScroll: {
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    listContainer: {
        padding: 10,
        paddingBottom: 40,
    },
    imageCard: {
        flex: 1,
        borderRadius: 16,
        margin: 6,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
});

const ImageListItem = React.memo(({ item, index, colors, onPress }: {
    item: ImageData;
    index: number;
    colors: any;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.imageCard, { backgroundColor: colors.card }]}
            onPress={onPress}
        >
            <Image
                source={{ uri: item.url }}
                style={[styles.image, { height: 260, backgroundColor: colors.border }]}
                contentFit="cover"
                transition={300}
                cachePolicy="disk"
                placeholder="L6PZf-ayfRyE00ayj[fQ~qj[fQj[" 
            />
        </TouchableOpacity>
    );
});

export default function PreviewScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { category, categoryId } = useLocalSearchParams();

    const initialCategory = (category as string) || 'All';
    const isBrowseAll = initialCategory === 'All';

    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { colors } = useTheme();
    const { i18n } = useTranslation();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(categoryId as string);

    // Fetch categories for the filter bar if in "Browse All" mode
    useEffect(() => {
        if (isBrowseAll) {
            const loadCategories = async () => {
                try {
                    // Try cache first
                    const cached = await getCachedCategories();
                    if (cached && cached.length > 0) {
                        setCategories(cached);
                    }

                    // Fetch fresh
                    const data = await fetchHomeCategories(i18n.language || 'en');
                    setCategories(data);
                } catch (e) {
                    console.error('[Preview] Failed to load categories:', e);
                }
            };
            loadCategories();
        }
    }, [isBrowseAll, i18n.language]);

    useEffect(() => {
        const loadWallpapers = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 1. Try to load from cache first for instant feedback
                const cached = await getCachedWallpapers(selectedCategoryId);
                if (cached && cached.length > 0) {
                    setWallpapers(cached);
                    setIsLoading(false); // Hide loader early if we have cache
                }

                // 2. Fetch fresh data from network
                const data = await fetchWallpapersByCategory(
                    selectedCategoryId, 
                    1, 
                    20,
                    (freshData: Wallpaper[]) => {
                        // Background update
                        setWallpapers(freshData);
                    }
                );
                setWallpapers(data);
            } catch (err) {
                console.error('[Preview] Load wallpapers error:', err);
                // Only show error if we don't have cached data to show
                if (wallpapers.length === 0) {
                    setError(err instanceof Error ? err.message : 'Failed to load wallpapers');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadWallpapers();
    }, [selectedCategoryId]);

    const handleImagePress = useCallback((index: number) => {
        router.push({ 
            pathname: '/image-viewer', 
            params: { 
                initialIndex: index.toString(),
                categoryId: selectedCategoryId || 'All'
            } 
        });
    }, [router, selectedCategoryId]);

    const renderItem = useCallback(({ item, index }: { item: Wallpaper; index: number }) => (
        <ImageListItem
            item={{ id: item._id, url: item.url, author: item.author }}
            index={index}
            colors={colors}
            onPress={() => handleImagePress(index)}
        />
    ), [colors, handleImagePress]);

    return (
        <View style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <CustomText variant="heading" style={{ fontSize: 24, letterSpacing: -0.5 }}>
                    {isBrowseAll ? t('preview.discover') : initialCategory}
                </CustomText>
            </View>

            {isBrowseAll && (
                <View style={{ height: 60 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {/* "All" Filter */}
                        <TouchableOpacity
                            style={[
                                styles.filterPill,
                                { backgroundColor: !selectedCategoryId || selectedCategoryId === 'All' ? colors.text : 'transparent' }
                            ]}
                            onPress={() => setSelectedCategoryId(undefined)}
                        >
                            <CustomText
                                variant="body"
                                color={!selectedCategoryId || selectedCategoryId === 'All' ? colors.background : colors.textMuted}
                                style={{ fontWeight: !selectedCategoryId || selectedCategoryId === 'All' ? 'bold' : 'normal' }}
                            >
                                {t('preview.filters.All')}
                            </CustomText>
                        </TouchableOpacity>

                        {/* Dynamic Categories */}
                        {categories.map((cat) => {
                            const isActive = selectedCategoryId === cat.id;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.filterPill,
                                        { backgroundColor: isActive ? colors.text : 'transparent' }
                                    ]}
                                    onPress={() => setSelectedCategoryId(cat.id)}
                                >
                                    <CustomText
                                        variant="body"
                                        color={isActive ? colors.background : colors.textMuted}
                                        style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                                    >
                                        {cat.name || t(`categories.${cat.title}`)}
                                    </CustomText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {isLoading ? (
                <View style={[commonStyles.screenContainer, commonStyles.centerAlign]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <CustomText style={{ marginTop: 10, textAlign: 'center' }}>{error}</CustomText>
                    <TouchableOpacity
                        style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
                        onPress={() => {
                            setError(null);
                            setIsLoading(true);
                            fetchWallpapersByCategory(selectedCategoryId).then(setWallpapers).catch((e: Error) => setError(e.message)).finally(() => setIsLoading(false));
                        }}
                    >
                        <CustomText color="#FFF">Try Again</CustomText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={wallpapers}
                        numColumns={2}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={Platform.OS === 'android'}
                        initialNumToRender={6}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        ListEmptyComponent={() => (
                            <View style={[commonStyles.centerAlign, { marginTop: 100 }]}>
                                <CustomText color={colors.textMuted}>No wallpapers found</CustomText>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}