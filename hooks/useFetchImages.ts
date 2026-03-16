import { useEffect, useState } from 'react';
import { imageService } from '../services/imageService';
import { ImageData } from '../types';

export const useFetchImages = () => {
    const [data, setData] = useState<ImageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const imageData = await imageService.fetchImages();
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