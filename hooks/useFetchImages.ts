import { useEffect, useState } from 'react';
import { imageService } from '../services/imageService';
import { ImageData } from '../types';

// Simple memory cache to store fetched images
let imageCache: ImageData[] | null = null;

export const useFetchImages = () => {
    const [data, setData] = useState<ImageData[]>(imageCache || []);
    const [isLoading, setIsLoading] = useState(!imageCache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (imageCache) return; // Skip fetch if we have cached data

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const imageData = await imageService.fetchImages();
                imageCache = imageData;
                setData(imageData);
            } catch (err) {
                setError('Failed to fetch images. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
};