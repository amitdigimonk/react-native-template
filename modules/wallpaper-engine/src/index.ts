import { requireNativeModule } from 'expo-modules-core';

const WallpaperEngine = requireNativeModule('WallpaperEngine');

export type WallpaperLocation = 'HOME' | 'LOCK' | 'BOTH';

export async function setWallpaper(imageUrl: string, location: WallpaperLocation): Promise<boolean> {
  return await WallpaperEngine.setWallpaper(imageUrl, location);
}
