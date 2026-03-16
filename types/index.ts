export interface ImageData {
  id: string;
  url: string;
  author: string;
}

export interface Category {
  id: string;
  title: string;
  image: any; // Using any for require() images, could be ImageSourcePropType from react-native
  count: string;
  type?: 'image' | 'video';
}

export type ThemeVariant = 'light' | 'dark';
