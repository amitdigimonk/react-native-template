import { apiRequest } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Wallpaper {
    _id: string;
    url: string;
    thumbnail: string;
    author: string;
    type: 'image' | 'video';
    category: any;
}

const CACHE_KEY_PREFIX = 'wallpapers_cache_';

export const getCachedWallpapers = async (categoryId?: string): Promise<Wallpaper[] | null> => {
    try {
        const cacheKey = `${CACHE_KEY_PREFIX}${categoryId || 'all'}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (e) {
        console.error('Failed to load cached wallpapers:', e);
        return null;
    }
};

const saveWallpapersToCache = async (categoryId: string | undefined, data: Wallpaper[]) => {
    try {
        const cacheKey = `${CACHE_KEY_PREFIX}${categoryId || 'all'}`;
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save wallpapers to cache:', e);
    }
};

export const fetchWallpapersByCategory = async (
    categoryId?: string, 
    page = 1, 
    limit = 20,
    onBackgroundUpdate?: (data: Wallpaper[]) => void
): Promise<Wallpaper[]> => {
    let endpoint = `/wallpapers?page=${page}&limit=${limit}`;
    if (categoryId && categoryId !== 'All') {
        endpoint += `&categoryId=${categoryId}`;
    }

    // Attempt to fetch from network
    const result = await apiRequest(endpoint);
    
    if (result.success) {
        // Save to cache on success
        if (page === 1) {
            saveWallpapersToCache(categoryId, result.data);
        }

        if (onBackgroundUpdate) {
            onBackgroundUpdate(result.data);
        }
        return result.data;
    }
    
    throw new Error(result.message || 'Failed to fetch wallpapers');
};
