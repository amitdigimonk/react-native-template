import { Platform } from 'react-native';

// Use local IP to support both emulator and real device (Expo Go)
const BASE_URL = Platform.select({
    ios: 'http://localhost:8000/api/v1',
    android: 'http://192.168.211.218:8000/api/v1',
    default: 'http://192.168.211.218:8000/api/v1',
});

interface RequestConfig extends RequestInit {
    body?: any;
}

export const apiRequest = async (endpoint: string, config: RequestConfig = {}) => {
    const { body, ...customConfig } = config;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(customConfig.headers || {}),
    };

    const url = `${BASE_URL}${endpoint}`;
    console.log(`[API] Fetching: ${url}`);

    try {
        const response = await fetch(url, {
            ...customConfig,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[API] Error (${response.status}):`, errorData);
            throw new Error(errorData.message || 'API request failed');
        }

        const data = await response.json();
        console.log(`[API] Success:`, endpoint);
        return data;
    } catch (error) {
        console.error(`[API] Network/Request Error:`, error);
        throw error;
    }
};
