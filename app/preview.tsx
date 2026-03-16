import CustomText from '@/components/CustomText';
import { commonStyles } from '@/constants/commonStyles';
import { useFetchImages } from '@/hooks/useFetchImages';
import { useTheme } from '@/hooks/useTheme';
import { ImageData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import React, { useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const FILTERS = ['All', 'Minimal', 'Abstract', 'Nature', 'Urban', 'Dark'];

const ImageListItem = React.memo(({ item, index, colors, onPress }: { 
    item: ImageData; 
    index: number; 
    colors: any;
    onPress: (url: string) => void;
}) => {
    const staggeredHeight = index % 2 === 0 ? 220 : 300;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(item.url)}
        >
            <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
                <Image
                    source={{ uri: item.url }}
                    style={[styles.image, { height: staggeredHeight, backgroundColor: colors.border }]}
                    contentFit="cover"
                    transition={300}
                    cachePolicy="disk"
                    placeholder="L6PZf-ayfRyE00ayj[fQ~qj[fQj[" // Simple blurhash placeholder
                />
            </View>
        </TouchableOpacity>
    );
});

export default function PreviewScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { category } = useLocalSearchParams();

    const initialCategory = (category as string) || 'All';
    const isBrowseAll = initialCategory === 'All';

    const { data, isLoading, error } = useFetchImages();
    const { colors } = useTheme();
    const [activeFilter, setActiveFilter] = useState('All');

    const handleImagePress = useCallback((url: string) => {
        router.push({ pathname: '/image-viewer', params: { url } });
    }, [router]);

    const renderItem = useCallback(({ item, index }: { item: ImageData; index: number }) => (
        <ImageListItem 
            item={item} 
            index={index} 
            colors={colors} 
            onPress={handleImagePress} 
        />
    ), [colors, handleImagePress]);

    return (
        <View style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <CustomText variant="heading" style={{ fontSize: 24, letterSpacing: -0.5 }}>
                    {isBrowseAll ? t('preview.discover') : t(`categories.${category}`)}
                </CustomText>

            </View>


            {isBrowseAll && (
                <View style={{ height: 60 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {FILTERS.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    style={[
                                        styles.filterPill,
                                        { backgroundColor: isActive ? colors.text : 'transparent' }
                                    ]}
                                    onPress={() => setActiveFilter(filter)}
                                >
                                    <CustomText
                                        variant="body"
                                        color={isActive ? colors.background : colors.textMuted}
                                        style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                                    >
                                        {t(`preview.filters.${filter}`)}
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
                <View style={[commonStyles.screenContainer, commonStyles.centerAlign]}>
                    <CustomText color="#EF4444">{error}</CustomText>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlashList
                        data={data}
                        masonry
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        estimatedItemSize={260}
                        overrideItemLayout={(layout, item, index) => {
                            layout.size = index % 2 === 0 ? 220 : 300;
                        }}
                    />
                </View>
            )}
        </View>
    );
}

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
        borderRadius: 16,
        margin: 6,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
    },
});