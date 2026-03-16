import { ImageData } from '../types';
import { MOCK_IMAGES } from './mockData';

export const imageService = {
  fetchImages: async (): Promise<ImageData[]> => {
    // Simulating a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_IMAGES;
  },
};
