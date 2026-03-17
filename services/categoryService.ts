import { apiRequest } from './api';
import { Category } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES_CACHE_KEY = 'categories_cache';

export const getCachedCategories = async (): Promise<Category[] | null> => {
    try {
        const cachedData = await AsyncStorage.getItem(CATEGORIES_CACHE_KEY);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (e) {
        console.error('Failed to load cached categories:', e);
        return null;
    }
};

const saveCategoriesToCache = async (data: Category[]) => {
    try {
        await AsyncStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save categories to cache:', e);
    }
};

export const fetchHomeCategories = async (lng: string): Promise<Category[]> => {
    const result = await apiRequest(`/categories?type=home&lng=${lng}`);
    
    if (result.success) {
        const categories = result.data.map((cat: any) => ({
            id: cat._id,
            name: cat.name,
            image: cat.image,
            count: cat.count,
            type: cat.type,
        }));
        
        saveCategoriesToCache(categories);
        return categories;
    }
    
    throw new Error(result.message || 'Failed to fetch categories');
};
