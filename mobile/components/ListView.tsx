import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList, Image, Platform } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { ThoughtCard, ThoughtCategory } from '../types';

interface ListViewProps {
  thoughts: ThoughtCard[];
  onThoughtClick: (thought: ThoughtCard) => void;
}

const CATEGORIES: ThoughtCategory[] = ['idea', 'todo', 'feeling', 'goal'];

export const ListView: React.FC<ListViewProps> = ({ thoughts, onThoughtClick }) => {
  const [filter, setFilter] = useState<ThoughtCategory | 'all'>('all');

  const filteredThoughts = thoughts.filter(t => 
    filter === 'all' ? true : t.meta.category === filter
  );

  const renderFilterChip = (cat: ThoughtCategory | 'all', label: string) => (
    <Pressable
        onPress={() => setFilter(cat)}
        style={[
            styles.chip,
            filter === cat && styles.chipActive
        ]}
    >
        <Text style={[
            styles.chipText,
            filter === cat && styles.chipTextActive
        ]}>
            {label}
        </Text>
    </Pressable>
  );

  const renderCard = ({ item }: { item: ThoughtCard }) => (
    <Pressable 
        style={styles.card} 
        onPress={() => onThoughtClick(item)}
    >
        {/* Image Section */}
        <View style={styles.imageContainer}>
            {item.imageUrl ? (
                <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
            ) : (
                 // Fallback if no image (though there should be one)
                <View style={[styles.image, { backgroundColor: '#f5f5f4' }]} />
            )}
            <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.meta.category}</Text>
            </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.meta.topic}</Text>
            <Text style={styles.cardText} numberOfLines={2}>{item.originalText}</Text>
            
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Calendar size={12} color="#a8a29e" />
                    <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.intensityText}>{item.meta.intensity} intensity</Text>
            </View>
        </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterList}
        >
          {renderFilterChip('all', 'All Plants')}
          {CATEGORIES.map(cat => (
             <React.Fragment key={cat}>
                 {renderFilterChip(cat, cat.charAt(0).toUpperCase() + cat.slice(1))}
             </React.Fragment>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredThoughts}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <Text style={styles.emptyText}>No thoughts found in this section.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  filterList: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f4',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#292524',
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: '#57534e',
  },
  chipTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    // Shadow
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#f5f5f4',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#57534e',
    textTransform: 'uppercase',
  },
  contentContainer: {
    padding: 12,
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    color: '#292524',
    marginBottom: 4,
  },
  cardText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: '#78716c',
    marginBottom: 12,
    height: 36, // approximate 2 lines
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f4',
    paddingTop: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 10,
    color: '#a8a29e',
  },
  intensityText: {
    fontSize: 10,
    color: '#a8a29e',
    textTransform: 'capitalize',
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 40,
      color: '#a8a29e',
  }
});
