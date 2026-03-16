import { Platform } from 'react-native';
import { androidWallpaperEngine, WallpaperLocation } from './androidWallpaperEngine';

export const wallpaperService = {
  applyWallpaper: async (imageUrl: string, location: WallpaperLocation = 'BOTH'): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        return await androidWallpaperEngine.setWallpaper(imageUrl, location);
      }

      // Fallback/Mock for other platforms
      console.log(`[WallpaperService] Setting wallpaper on ${Platform.OS} to: ${imageUrl}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      console.error('[WallpaperService] Error applying wallpaper:', error);
      return false;
    }
  },
};
