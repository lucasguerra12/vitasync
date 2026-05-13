import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { TacoService } from '../../../services/TacoService';
import { useDailyNutrition } from '../hooks/useDailyNutrition';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addWater } from '../../../store/slices/profileSlice';
import { NotificationService } from '../../../services/NotificationService';
import { supabase } from '../../../services/supabase';

export function NutriLensScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'Camera' | 'Manual'>('Camera');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [reminderInterval, setReminderInterval] = useState(0);
  
  const userId = useAppSelector((state) => state.auth.userId);
  const profile = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  // Hook que agora lê do Supabase
  const { groupedMeals, totals } = useDailyNutrition(userId || undefined);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text.length > 2) setSearchResults(TacoService.search(text));
    else setSearchResults([]);
  };

  const handleSetReminder = (min: number) => {
    setReminderInterval(min);
    NotificationService.scheduleWaterReminder(min);
  };

  const handleAddWater = async (amount: number) => {
    if (!userId) return;
    
    try {
      const now = new Date();
      const { error } = await supabase.from('water_logs').insert([{
        user_id: userId,
        amount_ml: amount,
        date: format(now, 'yyyy-MM-dd'),
        logged_at: now.getTime(),
        created_at: now.getTime(),
        updated_at: now.getTime(),
      }]);

      if (!error) {
         dispatch(addWater(amount)); // Atualiza o Redux local para feedback imediato
      }
    } catch (err) {
      console.error("Erro ao salvar água no Supabase:", err);
    }
  };

  const GOAL_KCAL = profile.dailyCalorieGoal || 2100;
  const percCarbs = Math.min(100, Math.round((totals.carbs / 250) * 100)) || 0;
  const percProt = Math.min(100, Math.round((totals.protein / 150) * 100)) || 0;
  const percFat = Math.min(100, Math.round((totals.fat / 70) * 100)) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>NutriLens</Text>
          <Text style={styles.subtitle}>Hoje · {totals.calories} de {GOAL_KCAL} kcal</Text>
        </View>
        <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('NutritionDiary')}>
          <MaterialIcons name="history" size={24} color="#F1F5F9" />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleTrack}>
          <TouchableOpacity style={[styles.toggleBtn, activeTab === 'Camera' && styles.toggleBtnActive]} onPress={() => setActiveTab('Camera')}>
            <Text style={[styles.toggleText, activeTab === 'Camera' && styles.toggleTextActive]}>Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, activeTab === 'Manual' && styles.toggleBtnActive]} onPress={() => setActiveTab('Manual')}>
            <Text style={[styles.toggleText, activeTab === 'Manual' && styles.toggleTextActive]}>Manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'Manual' && (
          <View style={styles.manualSection}>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={24} color="#64748B" />
              <TextInput style={styles.searchInput} placeholder="Pesquisar alimento..." placeholderTextColor="#64748B" value={searchTerm} onChangeText={handleSearch} />
            </View>
            {searchResults.map((item) => (
              <TouchableOpacity key={item.id} style={styles.foodResultItem} onPress={() => navigation.navigate('AddFood', { food: item })}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodResultName}>{item.name}</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12 }}>{item.calories} kcal • {item.protein}g P • {item.carbs}g C</Text>
                </View>
                <MaterialIcons name="add-circle" size={24} color="#10B981" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.macrosSection}>
          <View style={styles.macrosCard}>
            <View style={styles.macroCol}><View style={[styles.macroCircle, { borderColor: '#3B82F6' }]}><Text style={styles.macroPercent}>{percCarbs}%</Text></View><Text style={styles.macroLabel}>CARBO</Text></View>
            <View style={styles.macroCol}><View style={[styles.macroCircle, { borderColor: '#F97316' }]}><Text style={styles.macroPercent}>{percProt}%</Text></View><Text style={styles.macroLabel}>PROT</Text></View>
            <View style={styles.macroCol}><View style={[styles.macroCircle, { borderColor: '#EAB308' }]}><Text style={styles.macroPercent}>{percFat}%</Text></View><Text style={styles.macroLabel}>GORD</Text></View>
          </View>
        </View>

        <View style={styles.mealsSection}>
          <Text style={styles.mealsTitle}>Refeições de Hoje</Text>
          {groupedMeals.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma refeição registrada hoje.</Text>
          ) : (
            groupedMeals.map((group, idx) => (
              <View key={idx} style={styles.mealCard}>
                <View>
                  <Text style={styles.mealName}>{group.name}</Text>
                  <Text style={styles.mealDesc}>{group.description}</Text>
                </View>
                <Text style={styles.mealKcal}>{group.kcal} kcal</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.waterSection}>
          <View style={styles.waterCard}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons name="water-drop" size={24} color="#3B82F6" />
              <View style={{marginLeft: 12}}>
                <Text style={styles.waterTitle}>Hidratação</Text>
                <Text style={styles.waterDesc}>{(profile.currentWaterMl / 1000).toFixed(2)} L registrados</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.waterBtn} onPress={() => handleAddWater(500)}>
              <Text style={styles.waterBtnText}>+500ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94A3B8', fontSize: 13 },
  historyBtn: { width: 44, height: 44, backgroundColor: '#1E293B', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggleContainer: { paddingHorizontal: 24 },
  toggleTrack: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#10B981' },
  toggleText: { color: '#94A3B8', fontWeight: '600' },
  toggleTextActive: { color: '#FFF' },
  scrollArea: { flex: 1 },
  manualSection: { padding: 24 },
  searchBox: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10 },
  foodResultItem: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
  foodResultName: { color: '#FFF', fontWeight: 'bold' },
  macrosSection: { paddingHorizontal: 24, marginTop: 16 },
  macrosCard: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 20, borderRadius: 16, justifyContent: 'space-between' },
  macroCol: { alignItems: 'center' },
  macroCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  macroPercent: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  macroLabel: { color: '#94A3B8', fontSize: 10 },
  mealsSection: { padding: 24 },
  mealsTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { color: '#64748B', textAlign: 'center' },
  mealCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  mealName: { color: '#FFF', fontWeight: 'bold' },
  mealDesc: { color: '#94A3B8', fontSize: 12 },
  mealKcal: { color: '#10B981', fontWeight: 'bold' },
  waterSection: { paddingHorizontal: 24 },
  waterCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  waterTitle: { color: '#FFF', fontWeight: 'bold' },
  waterDesc: { color: '#3B82F6', fontSize: 12 },
  waterBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  waterBtnText: { color: '#FFF', fontWeight: 'bold' }
});