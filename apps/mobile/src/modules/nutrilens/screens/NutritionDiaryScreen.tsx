import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import Svg, { Circle } from 'react-native-svg';
import { useNutritionHistory } from '../hooks/useNutritionHistory';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';

const MicroCircle = ({ label, percent, color, val }: { label: string, percent: number, color: string, val: string }) => (
  <View style={styles.microCard}>
    <View style={styles.microSvgWrapper}>
      <Svg viewBox="0 0 36 36" width={40} height={40}>
        <Circle cx="18" cy="18" r="16" fill="none" stroke="#1a110c" strokeWidth="3" />
        <Circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray="100" strokeDashoffset={100 - percent}
          transform="rotate(-90 18 18)" strokeLinecap="round" />
      </Svg>
      <View style={styles.microTextCenter}>
        <Text style={styles.microVal}>{val}</Text>
      </View>
    </View>
    <Text style={styles.microLabel}>{label}</Text>
  </View>
);

export function NutritionDiaryScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openMeal, setOpenMeal] = useState<string | null>('breakfast');

  const auth = useAppSelector((state) => state.auth);
  const profile = useAppSelector((state) => state.profile);
  
  // 🚨 CORREÇÃO DO TYPESCRIPT AQUI TAMBÉM: auth.userId || undefined
  const { groupedMeals, totals, isLoading } = useNutritionHistory(auth.userId || undefined, selectedDate);
  
  const GOAL_KCAL = profile.dailyCalorieGoal || 2100;
  
  const currentCalories = totals?.calories || 0;
  const kcalLeft = Math.max(0, GOAL_KCAL - currentCalories);
  const circ = 282.7;

  let bKcal = 0, lKcal = 0, dKcal = 0, sKcal = 0;
  if (groupedMeals) {
    groupedMeals.forEach((g: any) => {
      if (g.id === 'breakfast') bKcal = g.kcal;
      if (g.id === 'lunch') lKcal = g.kcal;
      if (g.id === 'dinner') dKcal = g.kcal;
      if (g.id === 'snack') sKcal = g.kcal;
    });
  }

  const bPercent = (bKcal / GOAL_KCAL) * circ;
  const lPercent = (lKcal / GOAL_KCAL) * circ;
  const dPercent = (dKcal / GOAL_KCAL) * circ;
  const sPercent = (sKcal / GOAL_KCAL) * circ;

  const lAngle = (bKcal / GOAL_KCAL) * 360 - 90;
  const dAngle = lAngle + (lKcal / GOAL_KCAL) * 360;
  const sAngle = dAngle + (dKcal / GOAL_KCAL) * 360;

  const handleAddWater = () => {
    console.log("💧 Adicionando 250ml de água...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#f8f6f6" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Daily Diary</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setSelectedDate(subDays(selectedDate, 1))}>
          <MaterialIcons name="chevron-left" size={28} color="#ec5b13" />
        </TouchableOpacity>
        
        <View style={styles.headerDateCenter}>
          <Text style={styles.headerDay}>{format(selectedDate, 'EEEE, MMM d')}</Text>
          <Text style={styles.headerYear}>{format(selectedDate, 'yyyy')}</Text>
        </View>

        <TouchableOpacity style={styles.navBtn} onPress={() => setSelectedDate(addDays(selectedDate, 1))}>
          <MaterialIcons name="chevron-right" size={28} color="#ec5b13" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerScoreArea}>
        <Text style={styles.scoreBig}>{currentCalories.toLocaleString()} <Text style={styles.scoreSmall}>/ {GOAL_KCAL.toLocaleString()} kcal</Text></Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ec5b13" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.donutCard}>
            <View style={styles.donutWrapper}>
              <Svg viewBox="0 0 100 100" width={160} height={160}>
                <Circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(236, 91, 19, 0.1)" strokeWidth="8" />
                {bKcal > 0 ? <Circle cx="50" cy="50" r="45" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ - bPercent} transform="rotate(-90 50 50)" strokeLinecap="round" /> : null}
                {lKcal > 0 ? <Circle cx="50" cy="50" r="45" fill="transparent" stroke="#22c55e" strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ - lPercent} transform={`rotate(${lAngle} 50 50)`} strokeLinecap="round" /> : null}
                {dKcal > 0 ? <Circle cx="50" cy="50" r="45" fill="transparent" stroke="#14b8a6" strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ - dPercent} transform={`rotate(${dAngle} 50 50)`} strokeLinecap="round" /> : null}
                {sKcal > 0 ? <Circle cx="50" cy="50" r="45" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ - sPercent} transform={`rotate(${sAngle} 50 50)`} strokeLinecap="round" /> : null}
              </Svg>
              <View style={styles.donutCenterText}>
                <Text style={styles.donutNumber}>{Math.round(kcalLeft)}</Text>
                <Text style={styles.donutLabel}>KCAL LEFT</Text>
              </View>
            </View>

            <View style={styles.donutLegend}>
              <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#3b82f6'}]} /><Text style={styles.legendText}>Brkfast</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#22c55e'}]} /><Text style={styles.legendText}>Lunch</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#14b8a6'}]} /><Text style={styles.legendText}>Dinner</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#f59e0b'}]} /><Text style={styles.legendText}>Snacks</Text></View>
            </View>
          </View>

          <View style={styles.macrosCard}>
            <View style={styles.macroHeaderRow}>
              <MaterialIcons name="analytics" size={16} color="#ec5b13" />
              <Text style={styles.macroCardTitle}>Macronutrients</Text>
            </View>
            <View style={styles.macroRow}><View style={styles.macroTextRow}><Text style={styles.macroName}>Carbs</Text><Text style={[styles.macroValText, {color: '#3b82f6'}]}>{totals?.carbs || 0}g / 250g</Text></View><View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: `${Math.min(100, ((totals?.carbs || 0)/250)*100)}%`, backgroundColor: '#3b82f6' }]} /></View></View>
            <View style={styles.macroRow}><View style={styles.macroTextRow}><Text style={styles.macroName}>Protein</Text><Text style={[styles.macroValText, {color: '#ec5b13'}]}>{totals?.protein || 0}g / 160g</Text></View><View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: `${Math.min(100, ((totals?.protein || 0)/160)*100)}%`, backgroundColor: '#ec5b13' }]} /></View></View>
            <View style={styles.macroRow}><View style={styles.macroTextRow}><Text style={styles.macroName}>Fat</Text><Text style={[styles.macroValText, {color: '#f59e0b'}]}>{totals?.fat || 0}g / 70g</Text></View><View style={styles.macroBarBg}><View style={[styles.macroBarFill, { width: `${Math.min(100, ((totals?.fat || 0)/70)*100)}%`, backgroundColor: '#f59e0b' }]} /></View></View>
          </View>

          <View style={styles.mealsSection}>
            {!groupedMeals || groupedMeals.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="restaurant-menu" size={48} color="#4a3b32" />
                <Text style={styles.emptyStateText}>Nenhuma refeição registrada neste dia.</Text>
              </View>
            ) : (
              groupedMeals.map((group: any, index: number) => {
                const isOpen = openMeal === group.id;
                let groupColor = '#ec5b13';
                if(group.id === 'breakfast') groupColor = '#3b82f6';
                if(group.id === 'lunch') groupColor = '#22c55e';
                if(group.id === 'dinner') groupColor = '#14b8a6';
                if(group.id === 'snack') groupColor = '#f59e0b';

                return (
                  <TouchableOpacity key={index} style={[styles.mealAccordion, !isOpen ? styles.mealAccordionClosed : null]} activeOpacity={0.8} onPress={() => setOpenMeal(isOpen ? null : group.id)}>
                    <View style={[styles.mealAccordionHeader, isOpen ? { backgroundColor: `${groupColor}15` } : null]}>
                      <View style={styles.mealTitleArea}><MaterialIcons name={group.icon} size={20} color={groupColor} /><Text style={styles.mealTitleText}>{group.name}</Text></View>
                      <View style={styles.mealScoreArea}><Text style={styles.mealKcalText}>{group.kcal} kcal</Text>{!isOpen ? <MaterialIcons name="expand-more" size={20} color="#64748b" /> : null}</View>
                    </View>
                    {isOpen ? (
                      <View style={styles.mealAccordionContent}>
                        {group.items.map((itemStr: string, idx: number) => (
                          <View key={idx} style={styles.mealItemRow}><View style={styles.mealItemLeft}><MaterialIcons name="restaurant" size={16} color="#64748b" /><Text style={styles.mealItemName}>{itemStr}</Text></View></View>
                        ))}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                )
              })
            )}
          </View>

          <View style={styles.waterSection}>
            <View style={styles.waterHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><MaterialIcons name="water-drop" size={20} color="#3b82f6" /><Text style={styles.sectionTitle}>Water Log</Text></View>
              <Text style={styles.waterTotalText}>{isSameDay(selectedDate, new Date()) ? (profile.currentWaterMl / 1000).toFixed(2) : "0.00"} / 2.0 L</Text>
            </View>
            <View style={styles.waterDropsGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((drop, i) => {
                const isFilled = isSameDay(selectedDate, new Date()) && profile.currentWaterMl >= drop * 250;
                return (
                  <TouchableOpacity key={i} onPress={handleAddWater}>
                    <MaterialIcons name="water-drop" size={28} color={isFilled ? "#3b82f6" : "#3e2a1e"} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#221610' },
  appBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12 },
  appBarTitle: { color: '#f8f6f6', fontSize: 16, fontWeight: 'bold' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  navBtn: { padding: 8, backgroundColor: 'rgba(236, 91, 19, 0.1)', borderRadius: 20 },
  headerDateCenter: { alignItems: 'center' },
  headerDay: { color: '#f8f6f6', fontSize: 18, fontWeight: 'bold' },
  headerYear: { color: 'rgba(236, 91, 19, 0.8)', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  headerScoreArea: { alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(236, 91, 19, 0.1)' },
  scoreBig: { color: '#ec5b13', fontSize: 32, fontWeight: 'bold' },
  scoreSmall: { color: '#94a3b8', fontSize: 18, fontWeight: 'normal' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 24 },
  donutCard: { backgroundColor: 'rgba(45, 30, 22, 0.4)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(236, 91, 19, 0.05)', paddingVertical: 24, alignItems: 'center' },
  donutWrapper: { position: 'relative', width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  donutCenterText: { position: 'absolute', alignItems: 'center' },
  donutNumber: { color: '#f8f6f6', fontSize: 24, fontWeight: 'bold' },
  donutLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  donutLegend: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 24, marginTop: 24 },
  legendItem: { alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  legendText: { color: '#94a3b8', fontSize: 10 },
  macrosCard: { backgroundColor: '#2d1e16', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(236, 91, 19, 0.1)' },
  macroHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  macroCardTitle: { color: '#f8f6f6', fontSize: 14, fontWeight: 'bold' },
  macroRow: { marginBottom: 16 },
  macroTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroName: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  macroValText: { fontSize: 12, fontWeight: 'bold' },
  macroBarBg: { height: 8, backgroundColor: 'rgba(236, 91, 19, 0.1)', borderRadius: 4, overflow: 'hidden' },
  macroBarFill: { height: '100%', borderRadius: 4 },
  mealsSection: { gap: 16 },
  mealAccordion: { backgroundColor: '#2d1e16', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(236, 91, 19, 0.05)', overflow: 'hidden' },
  mealAccordionClosed: { opacity: 0.8 },
  mealAccordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  mealTitleArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealTitleText: { color: '#f8f6f6', fontSize: 16, fontWeight: 'bold' },
  mealScoreArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealKcalText: { color: '#f8f6f6', fontSize: 14, fontWeight: 'bold' },
  mealAccordionContent: { padding: 16, paddingTop: 0, gap: 12 },
  mealItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealItemName: { color: '#f8f6f6', fontSize: 14, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#2d1e16', borderRadius: 16 },
  emptyStateText: { color: '#94a3b8', marginTop: 8 },
  alertCard: { flexDirection: 'row', backgroundColor: 'rgba(127, 29, 29, 0.2)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.5)', borderRadius: 16, padding: 16, gap: 16 },
  alertIconBg: { backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: 8, borderRadius: 8, alignSelf: 'flex-start' },
  alertTitle: { color: '#fee2e2', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  alertDesc: { color: 'rgba(254, 226, 226, 0.8)', fontSize: 14, lineHeight: 20 },
  microSection: {},
  microHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: '#f8f6f6', fontSize: 14, fontWeight: 'bold' },
  linkText: { color: '#ec5b13', fontSize: 12, fontWeight: 'bold' },
  microGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  microCard: { width: '22%', backgroundColor: '#2d1e16', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(236, 91, 19, 0.05)', alignItems: 'center' },
  microSvgWrapper: { width: 40, height: 40, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  microTextCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  microVal: { color: '#f8f6f6', fontSize: 10, fontWeight: 'bold' },
  microLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '500' },
  waterSection: { backgroundColor: '#2d1e16', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(236, 91, 19, 0.05)' },
  waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  waterTotalText: { color: '#3b82f6', fontSize: 14, fontWeight: 'bold' },
  waterDropsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 16 },
  waterAddBtn: { backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  waterAddText: { color: '#3b82f6', fontSize: 14, fontWeight: 'bold' }
});