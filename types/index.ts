export interface ImageData {
  id: string;
  url: string;
  author: string;
}

export interface Category {
  id: string;
  title?: string; // Legacy field for mock data
  name?: string;  // Field from backend
  image: any; // Can be require() or string URL
  count: string;
  type?: 'image' | 'video' | 'main' | 'sub';
}

export type ThemeVariant = 'light' | 'dark';
