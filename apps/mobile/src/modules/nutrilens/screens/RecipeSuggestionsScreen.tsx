import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRecipeSuggestions } from '../hooks/useRecipeSuggestions';

const CATEGORIES = ['Tudo', 'Proteico', 'Low Carb', 'Energético', 'Rápido', 'Vegano'];

export function RecipeSuggestionsScreen({ navigation }: any) {
  const { featured, recommendations, recipes, loading } = useRecipeSuggestions();
  const [activeCategory, setActiveTab] = useState('Tudo');

  // Filtra a lista principal baseado na categoria selecionada
  const filteredRecipes = recipes.filter(r => 
    activeCategory === 'Tudo' || r.tags.includes(activeCategory)
  );

  if (loading) return (
    <View style={styles.loading}><ActivityIndicator size="large" color="#10B981" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugestões Fit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#64748B" />
            <TextInput placeholder="Buscar ingredientes..." placeholderTextColor="#64748B" style={styles.searchInput} />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
              onPress={() => setActiveTab(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Card */}
        {featured && activeCategory === 'Tudo' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destaque do Dia</Text>
            <TouchableOpacity style={styles.featuredCard}>
              <View style={styles.featuredBadge}><Text style={styles.badgeText}>FEATURED</Text></View>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800' }} style={styles.featuredImg} />
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

        {/* Recommendations Based on Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Para sua próxima refeição</Text>
          <Text style={styles.sectionSubtitle}>Baseado no que você comeu hoje</Text>
          <View style={styles.grid}>
            {(activeCategory === 'Tudo' ? recommendations : filteredRecipes).map(item => (
              <TouchableOpacity key={item.id} style={styles.recipeCard}>
                <View style={styles.cardImgPlaceholder}>
                   <MaterialIcons name="restaurant" size={32} color="#334155" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cardMacros}>{item.protein}g P • {item.carbs}g C • {item.fat}g G</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardKcal}>{item.calories} kcal</Text>
                    <MaterialIcons name="bookmark-border" size={18} color="#64748B" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backBtn: { padding: 8, backgroundColor: '#1E293B', borderRadius: 12 },
  headerTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold' },
  searchSection: { paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10 },
  categoryScroll: { paddingLeft: 20, gap: 12, marginBottom: 24 },
  catPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  catPillActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  catText: { color: '#94A3B8', fontWeight: '600' },
  catTextActive: { color: '#FFF' },
  section: { paddingHorizontal: 20, marginBottom: 30 },
  sectionTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  sectionSubtitle: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  featuredCard: { borderRadius: 20, overflow: 'hidden', backgroundColor: '#1E293B', elevation: 5 },
  featuredImg: { width: '100%', height: 200, opacity: 0.8 },
  featuredBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, zIndex: 10 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  featuredInfo: { padding: 20 },
  featuredTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#10B981', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  recipeCard: { width: '47%', backgroundColor: '#1E293B', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#334155' },
  cardImgPlaceholder: { width: '100%', height: 120, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  cardContent: { padding: 12 },
  cardTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: 'bold', marginBottom: 6, height: 40 },
  cardMacros: { color: '#94A3B8', fontSize: 10, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8 },
  cardKcal: { color: '#10B981', fontSize: 12, fontWeight: 'bold' }
});