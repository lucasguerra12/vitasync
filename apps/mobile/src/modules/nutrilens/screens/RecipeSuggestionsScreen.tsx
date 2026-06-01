import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, TextInput 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRecipeSuggestions } from '../hooks/useRecipeSuggestions';
import { Recipe } from '../../../types';

const CATEGORIES = ['Tudo', 'Proteico', 'Low Carb', 'Energético', 'Rápido', 'Vegano'];

export function RecipeSuggestionsScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState('Tudo');
  const { 
    recipes, 
    featured, 
    loading, 
    loadingMore, 
    loadMore, 
    refresh 
  } = useRecipeSuggestions(activeCategory);

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.7}>
      <View style={styles.cardImgPlaceholder}>
        <MaterialIcons name="restaurant" size={32} color="#334155" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardMacros}>
          {item.protein}g P • {item.carbs}g C • {item.fat}g G
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardKcal}>{item.calories} kcal</Text>
          <MaterialIcons name="bookmark-border" size={18} color="#64748B" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748B" />
          <TextInput placeholder="Buscar receitas..." placeholderTextColor="#64748B" style={styles.searchInput} />
        </View>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.catPill, activeCategory === item && styles.catPillActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {featured && activeCategory === 'Tudo' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destaque do Dia</Text>
          <TouchableOpacity style={styles.featuredCard}>
            <View style={styles.featuredBadge}><Text style={styles.badgeText}>EM ALTA</Text></View>
            <View style={styles.featuredImgPlaceholder}>
               <MaterialIcons name="stars" size={48} color="#10B981" />
            </View>
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <View style={styles.metaRow}>
                <MaterialIcons name="timer" size={14} color="#10B981" />
                <Text style={styles.metaText}>{featured.prep_time_minutes} min • {featured.calories} kcal</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'Tudo' ? 'Recomendações para você' : `Receitas: ${activeCategory}`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugestões Fit</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#10B981" /></View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ListHeaderComponent={ListHeader}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          onRefresh={refresh}
          refreshing={loading}
          ListFooterComponent={() => loadingMore ? (
            <ActivityIndicator style={{ margin: 20 }} color="#10B981" />
          ) : <View style={{ height: 40 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backBtn: { padding: 8, backgroundColor: '#1E293B', borderRadius: 12 },
  headerTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold' },
  searchSection: { paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10 },
  categoryScroll: { paddingLeft: 20, marginBottom: 24, height: 45 },
  catPill: { paddingHorizontal: 20, justifyContent: 'center', borderRadius: 20, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', marginRight: 10 },
  catPillActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  catText: { color: '#94A3B8', fontWeight: '600' },
  catTextActive: { color: '#FFF' },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold' },
  featuredCard: { borderRadius: 20, overflow: 'hidden', backgroundColor: '#1E293B', marginTop: 12 },
  featuredImgPlaceholder: { width: '100%', height: 160, backgroundColor: '#161e2e', alignItems: 'center', justifyContent: 'center' },
  featuredBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, zIndex: 10 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  featuredInfo: { padding: 16 },
  featuredTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#10B981', fontSize: 12, fontWeight: '600' },
  gridRow: { justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  recipeCard: { width: '47%', backgroundColor: '#1E293B', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#334155' },
  cardImgPlaceholder: { width: '100%', height: 100, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  cardContent: { padding: 12 },
  cardTitle: { color: '#F1F5F9', fontSize: 13, fontWeight: 'bold', marginBottom: 4, height: 36 },
  cardMacros: { color: '#94A3B8', fontSize: 9, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8 },
  cardKcal: { color: '#10B981', fontSize: 11, fontWeight: 'bold' }
});