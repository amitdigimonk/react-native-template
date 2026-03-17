import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '@/context/SettingsContext';
import { syncUser } from '@/services/userService';

/**
 * Hook to synchronize user settings with the backend.
 * Triggers on initial load and whenever relevant settings change.
 */
export const useUserSync = () => {
    const { i18n } = useTranslation();
    const { themeMode, eventsEnabled } = useSettingsContext();
    
    // Use a ref to track if it's the first render to handle initial sync
    const isInitialMount = useRef(true);

    useEffect(() => {
        const performSync = async () => {
            const syncData = {
                lng: i18n.language?.split('-')[0] || 'en',
                themeMode,
                events: eventsEnabled,
                // Add country if available from a provider later
            };

            await syncUser(syncData);
        };

        // Perform sync
        performSync();
        
        isInitialMount.current = false;
    }, [i18n.language, themeMode, eventsEnabled]);
};
