import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TacoService } from '../../../services/TacoService';
import { useDailyNutrition } from '../hooks/useDailyNutrition';

// IMPORTAÇÕES DO REDUX
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addWater } from '../../../store/slices/profileSlice';

export function NutriLensScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'Camera' | 'Manual'>('Camera');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const { meals, groupedMeals, totals } = useDailyNutrition();
  
  // DADOS DO REDUX PARA A ÁGUA
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text.length > 2) setSearchResults(TacoService.search(text));
    else setSearchResults([]);
  };

  const GOAL_KCAL = profile.dailyCalorieGoal || 2100;
  const GOAL_CARBS = 250, GOAL_PROT = 150, GOAL_FAT = 70;
  const percCarbs = Math.min(100, Math.round((totals.carbs / GOAL_CARBS) * 100)) || 0;
  const percProt = Math.min(100, Math.round((totals.protein / GOAL_PROT) * 100)) || 0;
  const percFat = Math.min(100, Math.round((totals.fat / GOAL_FAT) * 100)) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>NutriLens</Text>
          <Text style={styles.subtitle}>Hoje · {totals.calories} de {GOAL_KCAL} kcal</Text>
        </View>
        <TouchableOpacity style={styles.historyBtn}><MaterialIcons name="history" size={24} color="#F1F5F9" /></TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleTrack}>
          <TouchableOpacity style={[styles.toggleBtn, activeTab === 'Camera' && styles.toggleBtnActive]} onPress={() => setActiveTab('Camera')}>
            {activeTab === 'Camera' && <MaterialIcons name="photo-camera" size={16} color="#FFF" style={{ marginRight: 6 }} />}
            <Text style={[styles.toggleText, activeTab === 'Camera' && styles.toggleTextActive]}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeTab === 'Manual' && styles.toggleBtnActive]} onPress={() => setActiveTab('Manual')}>
            <Text style={[styles.toggleText, activeTab === 'Manual' && styles.toggleTextActive]}>Manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'Camera' && (
          <View>
            <View style={styles.cameraSection}>
              <View style={styles.cameraViewport}>
                <View style={[styles.corner, { top: 16, left: 16, borderTopWidth: 2, borderLeftWidth: 2 }]} />
                <View style={[styles.corner, { top: 16, right: 16, borderTopWidth: 2, borderRightWidth: 2 }]} />
                <View style={[styles.corner, { bottom: 16, left: 16, borderBottomWidth: 2, borderLeftWidth: 2 }]} />
                <View style={[styles.corner, { bottom: 16, right: 16, borderBottomWidth: 2, borderRightWidth: 2 }]} />
                <Text style={styles.viewportTitle}>Point at your meal</Text>
                <Text style={styles.viewportSubtitle}>Align food within the frame</Text>
              </View>
              <TouchableOpacity style={styles.identifyBtn} onPress={() => navigation.navigate('Camera')}>
                <MaterialIcons name="center-focus-strong" size={20} color="#FFF" />
                <Text style={styles.identifyBtnText}>Identify Food</Text>
              </TouchableOpacity>
            </View>

            {meals.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionLabel}>RECENT SCANS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                  {meals.slice(0, 5).map((meal, idx) => (
                    <View key={idx} style={styles.recentPill}><View style={styles.pillDot} /><Text style={styles.pillText}>{meal.name}</Text></View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Manual' && (
          <View style={styles.manualSection}>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={24} color="#64748B" />
              <TextInput style={styles.searchInput} placeholder="Search food in TACO..." placeholderTextColor="#64748B" value={searchTerm} onChangeText={handleSearch} />
            </View>
            {searchResults.map((item) => (
              <TouchableOpacity key={item.id} style={styles.foodResultItem} onPress={() => navigation.navigate('AddFood', { food: item })}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodResultName}>{item.name}</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>{item.calories} kcal • {item.protein}g Prot • {item.carbs}g Carb</Text>
                </View>
                <MaterialIcons name="add-circle" size={24} color="#10B981" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.macrosSection}>
          <View style={styles.macrosCard}>
            <View style={styles.macroCol}><View style={[styles.macroCircle, { borderColor: '#3B82F6' }]}><Text style={styles.macroPercent}>{percCarbs}%</Text></View><Text style={styles.macroLabel}>CARBS</Text><Text style={styles.macroGrams}>{totals.carbs}g</Text></View>
            <View style={styles.macroCol}><View style={[styles.macroCircle, { borderColor: '#F97316' }]}><Text style={styles.macroPercent}>{percProt}%</Text></View><Text style={styles.macroLabel}>PROTEIN</Text><Text style={styles.macroGrams}>{totals.protein}g</Text></View>
            <View style={styles.macroCol}><View style={[styles.macroCircle, { borderColor: '#EAB308' }]}><Text style={styles.macroPercent}>{percFat}%</Text></View><Text style={styles.macroLabel}>FAT</Text><Text style={styles.macroGrams}>{totals.fat}g</Text></View>
          </View>
        </View>

        <View style={styles.mealsSection}>
          <View style={styles.mealsHeader}>
            <Text style={styles.mealsTitle}>Today's meals</Text>
            <View style={styles.totalKcalBadge}><Text style={styles.totalKcalText}>{totals.calories} kcal</Text></View>
          </View>
          {groupedMeals.length === 0 ? (
            <Text style={{ color: '#64748B', textAlign: 'center', marginVertical: 20 }}>No meals logged today.</Text>
          ) : (
            groupedMeals.map((group, index) => (
              <View key={index} style={styles.mealCard}>
                <View style={styles.mealCardLeft}>
                  <View style={styles.mealImgPlaceholder}><MaterialIcons name={group.icon} size={24} color="#94A3B8" /></View>
                  <View style={{ width: 200 }}><Text style={styles.mealName} numberOfLines={1}>{group.name}</Text><Text style={styles.mealDesc} numberOfLines={2}>{group.description}</Text></View>
                </View>
                <View style={{ alignItems: 'flex-end' }}><Text style={styles.mealKcalValue}>{group.kcal}</Text><Text style={styles.mealKcalLabel}>KCAL</Text></View>
              </View>
            ))
          )}
        </View>

        <View style={styles.microSection}>
          <Text style={styles.sectionLabel}>MICRONUTRIENTS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={styles.microCard}><Text style={styles.microTitle}>MAGNESIUM</Text><View style={styles.microRow}><Text style={[styles.microValue, { color: '#F59E0B' }]}>47%</Text><View style={styles.microBarBg}><View style={[styles.microBarFill, { width: '47%', backgroundColor: '#F59E0B' }]} /></View></View></View>
            <View style={styles.microCard}><Text style={styles.microTitle}>VITAMIN D</Text><View style={styles.microRow}><Text style={[styles.microValue, { color: '#EF4444' }]}>8%</Text><View style={styles.microBarBg}><View style={[styles.microBarFill, { width: '8%', backgroundColor: '#EF4444' }]} /></View></View></View>
            <View style={styles.microCard}><Text style={styles.microTitle}>IRON</Text><View style={styles.microRow}><Text style={[styles.microValue, { color: '#F59E0B' }]}>62%</Text><View style={styles.microBarBg}><View style={[styles.microBarFill, { width: '62%', backgroundColor: '#F59E0B' }]} /></View></View></View>
          </ScrollView>
        </View>

        {/* SECÇÃO DA ÁGUA REATIVA */}
        <View style={styles.waterSection}>
          <View style={styles.waterCard}>
            <View style={styles.waterLeft}>
              <View style={styles.waterIconBg}><MaterialIcons name="water-drop" size={20} color="#FFF" /></View>
              <View>
                <Text style={styles.waterTitle}>Hydration</Text>
                {/* Mostra em Litros (ex: 1.50 L) */}
                <Text style={styles.waterDesc}>{(profile.currentWaterMl / 1000).toFixed(2)} L logged</Text>
              </View>
            </View>
            {/* O BOTÃO DISPARA O REDUX COM +500ML */}
            <TouchableOpacity style={styles.waterBtn} onPress={() => dispatch(addWater(500))}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>+500ml</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingVertical: 20 },
  title: { color: '#F1F5F9', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  historyBtn: { width: 40, height: 40, backgroundColor: '#263347', borderRadius: 12, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  toggleContainer: { paddingHorizontal: 24, paddingBottom: 16 },
  toggleTrack: { flexDirection: 'row', height: 52, backgroundColor: '#263347', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#334155' },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#10B981', elevation: 5 },
  toggleText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: '#FFF', fontWeight: 'bold' },
  scrollArea: { flex: 1 },
  cameraSection: { paddingHorizontal: 24, paddingTop: 8 },
  cameraViewport: { height: 240, backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 2, borderColor: 'rgba(16, 185, 129, 0.4)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#10B981' },
  viewportTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  viewportSubtitle: { color: '#94A3B8', fontSize: 12 },
  identifyBtn: { marginTop: 16, backgroundColor: '#10B981', height: 56, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  identifyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  recentSection: { marginTop: 24 },
  sectionLabel: { paddingHorizontal: 24, fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 1, marginBottom: 12 },
  horizontalScroll: { paddingHorizontal: 24, gap: 12 },
  recentPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#263347', borderWidth: 1, borderColor: '#334155', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 12 },
  pillDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8 },
  pillText: { color: '#F1F5F9', fontSize: 12, fontWeight: '500' },
  manualSection: { paddingHorizontal: 24, paddingTop: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 15, borderRadius: 12, marginBottom: 20 },
  searchInput: { flex: 1, color: '#fff', marginLeft: 10, fontSize: 16 },
  foodResultItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1E293B', borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#3B82F6' },
  foodResultName: { color: '#F1F5F9', fontSize: 16, fontWeight: 'bold' },
  macrosSection: { paddingHorizontal: 24, marginTop: 32 },
  macrosCard: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  macroCol: { alignItems: 'center', flex: 1 },
  macroCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  macroPercent: { color: '#F1F5F9', fontSize: 10, fontWeight: 'bold' },
  macroLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  macroGrams: { color: '#F1F5F9', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  mealsSection: { paddingHorizontal: 24, marginTop: 32 },
  mealsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mealsTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: 'bold' },
  totalKcalBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  totalKcalText: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },
  mealCard: { backgroundColor: '#1E293B', borderLeftWidth: 4, borderLeftColor: '#10B981', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mealCardLeft: { flexDirection: 'row', alignItems: 'center' },
  mealImgPlaceholder: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#263347', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  mealName: { color: '#F1F5F9', fontSize: 14, fontWeight: 'bold' },
  mealDesc: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  mealKcalValue: { color: '#F1F5F9', fontSize: 14, fontWeight: 'bold' },
  mealKcalLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  microSection: { marginTop: 32 },
  microCard: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 12, minWidth: 120, marginRight: 12 },
  microTitle: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
  microRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  microValue: { fontSize: 14, fontWeight: 'bold' },
  microBarBg: { width: 48, height: 4, backgroundColor: '#334155', borderRadius: 2, marginBottom: 4 },
  microBarFill: { height: '100%', borderRadius: 2 },
  waterSection: { paddingHorizontal: 24, marginTop: 32 },
  waterCard: { backgroundColor: 'rgba(37, 99, 235, 0.1)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterLeft: { flexDirection: 'row', alignItems: 'center' },
  waterIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  waterTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: 'bold' },
  waterDesc: { color: '#60A5FA', fontSize: 12, marginTop: 2 },
  waterBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});