import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import CustomText from './CustomText';
import { commonStyles } from '@/constants/commonStyles';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.categoryCard, commonStyles.cardShadow]}
      onPress={() => onPress(category)}
    >
      <Image
        source={category.image}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay} />
      <View style={styles.cardContent}>
        <CustomText variant="body" color="#FFFFFF">{category.count}</CustomText>
        <CustomText variant="subheading" color="#FFFFFF">{category.title}</CustomText>
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
