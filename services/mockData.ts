import { Category, ImageData } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: '1',
    title: 'Abstract Elements',
    image: require('../assets/images/categories/category-1.webp'),
    count: '120+',
    type: 'image'
  },
  {
    id: '2',
    title: 'Minimal Nature',
    image: require('../assets/images/categories/category-2.webp'),
    count: '85+',
    type: 'image'
  },
  {
    id: '3',
    title: 'Urban Geometry',
    image: require('../assets/images/categories/category-3.webp'),
    count: '98+',
    type: 'image'
  },
  {
    id: '4',
    title: 'Animated',
    image: require('../assets/gif/Animated_Category_comppressed.mp4'),
    count: '15+',
    type: 'video'
  },
];

export const MOCK_IMAGES: ImageData[] = [
  { id: '1', url: 'https://picsum.photos/seed/1/800/1200', author: 'Photographer A' },
  { id: '2', url: 'https://picsum.photos/seed/2/800/1200', author: 'Photographer B' },
  { id: '3', url: 'https://picsum.photos/seed/3/800/1200', author: 'Photographer C' },
];
