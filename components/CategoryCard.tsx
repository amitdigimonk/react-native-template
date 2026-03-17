import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import CustomText from './CustomText';
import { commonStyles } from '@/constants/commonStyles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

const CategoryVideo = ({ source }: { source: string }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  return (
    <VideoView
      player={player}
      style={styles.cardImage}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category, onPress }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isVideo = category.type === 'video';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.categoryCard, commonStyles.cardShadow]}
      onPress={() => onPress(category)}
    >
      {isVideo ? (
        <CategoryVideo source={category.image} />
      ) : (
        <Image
          source={category.image || 'https://via.placeholder.com/300'}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
        />
      )}
      <View style={styles.overlay} />
      <View style={styles.cardContent}>
        <CustomText variant="body" color="#FFFFFF">{category.count}</CustomText>
        <CustomText variant="subheading" color="#FFFFFF">
          {category.name || t(`categories.${category.title}`)}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  categoryCard: {
    width: '48%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    ...commonStyles.cardShadow,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 20,
    width: '100%',
  },
});


export default CategoryCard;
