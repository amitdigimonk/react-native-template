import { useEffect, useState } from 'react';

// Strictly type the data we expect to receive
export interface ImageData {
    id: string;
    url: string;
    author: string;
}

export const useFetchImages = () => {
    const [data, setData] = useState<ImageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Simulating a network request to a backend API
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mock data: Perfect for testing a gallery or wallpaper feed
                const mockData: ImageData[] = [
                    { id: '1', url: 'https://picsum.photos/seed/1/800/1200', author: 'Photographer A' },
                    { id: '2', url: 'https://picsum.photos/seed/2/800/1200', author: 'Photographer B' },
                    { id: '3', url: 'https://picsum.photos/seed/3/800/1200', author: 'Photographer C' },
                ];

                setData(mockData);
            } catch (err) {
                setError('Failed to fetch images. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once when the component mounts

    return { data, isLoading, error };
};