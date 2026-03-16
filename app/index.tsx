import CustomButton from '@/components/CustomButton';
import CustomText from '@/components/CustomText';
import CategoryCard from '@/components/CategoryCard';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { CATEGORIES } from '@/services/mockData';
import { Category } from '@/types';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleCategoryPress = (category: Category) => {
    router.push({ pathname: '/preview', params: { category: category.title } });
  };

  return (
    <ScrollView
      style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <CustomText variant="caption">VIBE WALLS</CustomText>
          <CustomText variant="heading">Your Daily Vibe</CustomText>
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
        {CATEGORIES.map((item) => (
          <CategoryCard 
            key={item.id} 
            category={item} 
            onPress={handleCategoryPress} 
          />
        ))}
      </View>

      {/* 3. Bold Primary Action */}
      <View style={styles.actionContainer}>
        <CustomText variant="body" style={{ color: colors.textMuted, textAlign: 'center' }}>
          Explore thousands of premium high-definition wallpapers, refreshed daily.
        </CustomText>
        <CustomButton
          title="Browse All Walls"
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
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },
});