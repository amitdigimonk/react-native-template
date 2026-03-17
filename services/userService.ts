import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

const LAST_SYNCED_DATA_KEY = 'last-synced-user-data';

export interface UserSyncData {
    lng?: string;
    themeMode?: string;
    country?: string;
    fcmToken?: string;
    events: boolean;
}

/**
 * Gets a unique identifier for the device.
 * Using installationId or a fallback.
 */
const getDeviceId = (): string => {
    // expo-constants installationId is consistent across installs on most platforms
    return Constants.installationId || Device.modelName || 'unknown-device';
};

/**
 * Synchronizes user data with the backend.
 * Uses local caching to avoid redundant API calls.
 */
export const syncUser = async (data: UserSyncData) => {
    try {
        const device_id = getDeviceId();
        const payload = {
            device_id,
            ...data
        };

        // Check if data has changed since last successful sync
        const lastSyncedStr = await AsyncStorage.getItem(LAST_SYNCED_DATA_KEY);
        if (lastSyncedStr === JSON.stringify(payload)) {
            console.log('[UserService] Data unchanged, skipping sync');
            return;
        }

        console.log('[UserService] Syncing user data with backend...');
        const result = await apiRequest('/users', {
            method: 'POST',
            body: payload,
        });

        if (result.success) {
            // Cache successful sync
            await AsyncStorage.setItem(LAST_SYNCED_DATA_KEY, JSON.stringify(payload));
            console.log('[UserService] User synchronized successfully');
        }
    } catch (error) {
        console.error('[UserService] Failed to sync user:', error);
    }
};
