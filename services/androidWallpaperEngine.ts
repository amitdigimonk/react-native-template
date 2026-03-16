import { Platform } from 'react-native';
import * as WallpaperEngine from '../modules/wallpaper-engine/src';

export type WallpaperLocation = WallpaperEngine.WallpaperLocation;

export const androidWallpaperEngine = {
  /**
   * Applies the wallpaper to the specified location on Android.
   * @param imageUrl The URL or local path of the image.
   * @param location Where to apply the wallpaper.
   */
  setWallpaper: async (imageUrl: string, location: WallpaperLocation): Promise<boolean> => {
    if (Platform.OS !== 'android') return false;

    try {
      console.log(`[AndroidWallpaperEngine] Setting wallpaper to: ${imageUrl} at location: ${location}`);
      
      await WallpaperEngine.setWallpaper(imageUrl, location);
      
      return true;
    } catch (error) {
      console.error('[AndroidWallpaperEngine] Failed to set wallpaper:', error);
      return false;
    }
  },
};
