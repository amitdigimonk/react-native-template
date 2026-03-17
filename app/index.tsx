import CustomButton from '@/components/CustomButton';
import CustomText from '@/components/CustomText';
import CategoryCard from '@/components/CategoryCard';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { CATEGORIES } from '@/services/mockData';
import { Category } from '@/types';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { fetchHomeCategories, getCachedCategories } from '@/services/categoryService';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  console.log(categories);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);

        // 1. Load from cache first
        const cached = await getCachedCategories();
        if (cached && cached.length > 0) {
          setCategories(cached);
          setIsLoading(false); // Hide loader if we have cache
        }

        // 2. Fetch fresh data
        const data = await fetchHomeCategories(i18n.language || 'en');
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [i18n.language]);

  const handleCategoryPress = (category: Category) => {
    router.push({ 
      pathname: '/preview', 
      params: { 
        category: category.name || category.title,
        categoryId: category.id 
      } 
    });
  };

  return (
    <ScrollView
      style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <CustomText variant="caption">{t('home.caption')}</CustomText>
          <CustomText variant="heading">{t('home.heading')}</CustomText>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          categories.map((item) => (
            <CategoryCard
              key={item.id}
              category={item}
              onPress={handleCategoryPress}
            />
          ))
        )}
      </View>

      {/* 3. Bold Primary Action */}
      <View style={styles.actionContainer}>
        <CustomText variant="body" style={{ color: colors.textMuted, textAlign: 'center' }}>
          {t('home.subtext')}
        </CustomText>
        <CustomButton
          title={t('home.browseButton')}
          onPress={() => router.push({ pathname: '/preview', params: { category: 'All' } })}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 80,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  grid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },
});