import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../constants/translations/en.json';
import hi from '../constants/translations/hi.json';
import ja from '../constants/translations/ja.json';
import fr from '../constants/translations/fr.json';

const LANGUAGE_KEY = 'user-language';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ja: { translation: ja },
  fr: { translation: fr },
};

i18n.use(initReactI18next);

const initI18n = async () => {
  let savedLanguage = 'en';
  try {
    const value = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (value) savedLanguage = value;
  } catch (error) {
    console.error('AsyncStorage failed:', error);
  }

  i18n.changeLanguage(savedLanguage);
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Initialize with default, then change if saved
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    initI18n();
  })
  .catch((err) => {
    console.error('i18n init error:', err);
  });

export default i18n;
