import CustomButton from '@/components/CustomButton';
import CustomText from '@/components/CustomText';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { Image } from 'expo-image'; // High performance images
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Simulated category data (In real app, fetch from backend)
const CATEGORIES = [
  { id: '1', title: 'Abstract Elements', image: require('../assets/images/categories/category-1.jpg'), count: '120+' },
  { id: '2', title: 'Minimal Nature', image: require('../assets/images/categories/category-2.jpg'), count: '85+' },
  { id: '3', title: 'Urban Geometry', image: require('../assets/images/categories/category-3.jpg'), count: '98+' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <ScrollView
      style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Welcoming Header */}
      <View style={styles.header}>
        <CustomText variant="caption">CURIOSITY GALLERY</CustomText>
        <CustomText variant="heading">Curated Spaces</CustomText>
      </View>

      {/* 2. Stunning Category Grid */}
      <View style={styles.grid}>
        {CATEGORIES.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={[styles.categoryCard, commonStyles.cardShadow]}
            onPress={() => router.push('/preview')} // Navigate to preview for now
          >
            {/* The Image is the background */}
            <Image
              source={item.image}
              style={styles.cardImage}
              contentFit="cover"
              transition={300}
            />
            {/* Dark gradient overlay for text readability */}
            <View style={styles.overlay} />

            {/* Content positioned on top */}
            <View style={styles.cardContent}>
              <CustomText variant="body" color="#FFFFFF">{item.count}</CustomText>
              <CustomText variant="subheading" color="#FFFFFF">{item.title}</CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. Bold Primary Action */}
      <View style={styles.actionContainer}>
        <CustomText variant="body" style={{ color: colors.textMuted, textAlign: 'center' }}>
          Explore thousands of premium high-definition wallpapers, refreshed daily.
        </CustomText>
        <CustomButton
          title="Browse All Walls"
          onPress={() => router.push('/preview')}
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
    paddingTop: 80, // Space below status bar
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%', // Almost half the width (leaving room for gap)
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject, // Fills the card
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Soft gradient shadow from bottom
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 16,
    width: '100%',
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },
});