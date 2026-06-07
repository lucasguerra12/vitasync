import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { addSteps } from '../../../store/slices/profileSlice';
import { useDailyNutrition } from '../../nutrilens/hooks/useDailyNutrition';
import { NotificationService } from '../../../services/NotificationService';
import { useActivityMetrics } from '../../../hooks/useActivityMetrics';
import { useWater } from '../../../hooks/useWater'; // <-- Nosso hook de água

export function DashboardScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const profile = useAppSelector((state) => state.profile);
  
  const { totals, lastMeal, topNutrient } = useDailyNutrition(auth.userId || undefined);
  const { steps, progressPercentage: stepsPercent, dailyGoal: GOAL_STEPS } = useActivityMetrics();

  const GOAL_KCAL = profile.dailyCalorieGoal || 2100;
  const progressPercent = Math.min(100, (totals.calories / GOAL_KCAL) * 100) || 0;
  const healthScore = Math.round(progressPercent) > 0 ? Math.round(progressPercent) : 78;

  // 👇 LIGAMOS A ÁGUA GLOBAL AQUI 👇
  const { water, waterGoal } = useWater();
  const waterSquaresFilled = Math.min(5, Math.floor((water / waterGoal) * 5));

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const userImc = profile.weightKg && profile.heightCm 
    ? (profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1) 
    : '--';

  const handleTestNotification = async () => {
    await NotificationService.requestPermissions();
    await NotificationService.scheduleLocalNotification(
      "O seu corpo está a falar! 🗣️",
      "Novo insight detectado: a sua dor nas costas diminuiu com a hidratação de hoje.",
      1
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
          </View>
          <Text style={styles.greeting}>Good morning, {profile.name || 'Ana'}</Text>
        </View>
        
        <TouchableOpacity style={styles.notificationBtn} onPress={handleTestNotification}>
          <MaterialIcons name="notifications" size={24} color="#94A3B8" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ... (Hero Card e Date Row continuam iguais) ... */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroSubtitle}>DAILY SCORE</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreValue}>{healthScore}</Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
            </View>
            <View style={styles.trendContainer}>
              <MaterialIcons name="trending-up" size={14} color="#a5f3eb" />
              <Text style={styles.trendText}>+4 from yesterday</Text>
            </View>
          </View>
          
          <View style={styles.heroIconContainer}>
             <MaterialIcons name="health-and-safety" size={48} color="rgba(255,255,255,0.9)" />
          </View>

          <View style={styles.heroStrip}>
            <Text style={styles.heroStripText}>NUTRITION {Math.round(progressPercent)}%</Text>
            <Text style={styles.heroStripSeparator}>|</Text>
            <Text style={styles.heroStripText}>SLEEP 65%</Text>
            <Text style={styles.heroStripSeparator}>|</Text>
            <Text style={styles.heroStripText}>MOVE {Math.round(stepsPercent)}%</Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={18} color="#F59E0B" />
            <Text style={styles.streakText}>14-day streak</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {/* Card 1: Calories */}
          <View style={[styles.gridCard, { borderTopColor: '#10B981' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>CALORIES</Text>
              <MaterialIcons name="restaurant" size={20} color="#10B981" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>{totals.calories.toLocaleString()}</Text>
              <Text style={styles.cardSubValue}>/ {GOAL_KCAL}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: '#10B981' }]} />
            </View>
          </View>

          {/* Card 2: Steps */}
          <View style={[styles.gridCard, { borderTopColor: '#F97316' }]}>
            <TouchableOpacity 
              style={{ position: 'absolute', top: 5, right: 5, zIndex: 10, padding: 10, opacity: 0.2 }}
              onPress={() => dispatch(addSteps(1000))}
            >
              <MaterialIcons name="add-circle" size={16} color="#F97316" />
            </TouchableOpacity>

            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>STEPS</Text>
              <MaterialIcons name="show-chart" size={20} color="#F97316" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>{steps.toLocaleString()}</Text>
              <Text style={styles.cardSubValue}>/ {GOAL_STEPS.toLocaleString()}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${stepsPercent}%`, backgroundColor: '#F97316' }]} />
            </View>
          </View>

          {/* 👇 Card 3: Water (AGORA LIGADO AO useWater) 👇 */}
          <View style={[styles.gridCard, { borderTopColor: '#3B82F6' }]}>
            <View style={styles.cardHeader}>
              <Text style={{color: '#94A3B8', fontSize: 12}}>{water} ml</Text>
              <MaterialIcons name="water-drop" size={20} color="#3B82F6" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>{(water / 1000).toFixed(2)}</Text>
              <Text style={styles.cardSubValue}>/ {(waterGoal / 1000).toFixed(1)} L</Text>
            </View>
            <View style={styles.waterSquaresContainer}>
              {[1, 2, 3, 4, 5].map((square) => (
                <View 
                  key={square} 
                  style={[styles.waterSquare, { backgroundColor: square <= waterSquaresFilled ? '#3B82F6' : 'rgba(59, 130, 246, 0.2)' }]} 
                />
              ))}
            </View>
          </View>

          {/* Card 4: IMC */}
          <View style={[styles.gridCard, { borderTopColor: '#8B5CF6' }]}>
            <TouchableOpacity 
              style={{ position: 'absolute', top: -5, right: -5, zIndex: 10, padding: 15, opacity: 0.8 }}
              onPress={() => navigation.navigate('IMCScreen')}
            >
              <MaterialIcons name="arrow-outward" size={18} color="#8B5CF6" />
            </TouchableOpacity>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>SEU IMC</Text>
              <MaterialIcons name="monitor-weight" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>{userImc}</Text>
              <Text style={styles.cardSubValue}>kg/m²</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '100%', backgroundColor: '#8B5CF6' }]} />
            </View>
          </View>
        </View>

        {/* ... (O restante da tela continua igual) ... */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitle}>Today's log</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('NutritionDiary')}>
              <Text style={styles.seeAllText}>See all</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#14B8A6" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>🥗</Text>
               <Text style={styles.logName} numberOfLines={1}>{lastMeal.name}</Text>
               <Text style={styles.logValue}>{lastMeal.kcal} kcal</Text>
             </View>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>🏃</Text>
               <Text style={styles.logName}>Run</Text>
               <Text style={styles.logValue}>5.2km</Text>
             </View>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>{topNutrient.icon}</Text>
               <Text style={styles.logName}>{topNutrient.name}</Text>
               <Text style={styles.logValue}>Top Hit</Text>
             </View>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>😊</Text>
               <Text style={styles.logName}>Mood</Text>
               <Text style={styles.logValue}>4/5</Text>
             </View>
          </ScrollView>
        </View>

        <View style={styles.insightBorder}>
           <View style={styles.insightCard}>
              <View style={styles.insightHeaderRow}>
                 <MaterialIcons name="lightbulb" size={18} color="#FBBF24" />
                 <Text style={styles.insightTag}>Pattern detected</Text>
              </View>
              <Text style={styles.insightText}>
                 Your back pain is <Text style={styles.insightHighlight}>2.3x higher</Text> when magnesium intake is below 40% of your daily DRI target.
              </Text>
              <TouchableOpacity style={styles.insightLink}>
                 <Text style={styles.insightLinkText}>View full insights</Text>
                 <MaterialIcons name="chevron-right" size={14} color="#14B8A6" />
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.meditationCard}>
           <View style={{ flex: 1 }}>
              <Text style={styles.meditationText}>3 minutes could change your afternoon.</Text>
              <TouchableOpacity style={styles.meditationBtn}>
                 <Text style={styles.meditationBtnText}>Start session</Text>
                 <MaterialIcons name="play-arrow" size={14} color="#FFF" />
              </TouchableOpacity>
           </View>
           <MaterialIcons name="self-improvement" size={64} color="rgba(94, 234, 212, 0.3)" style={{ position: 'absolute', right: -10, top: 10 }} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' },
  notificationBtn: { position: 'relative', padding: 8 },
  notificationDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 2, borderColor: '#0F172A' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 24 },
  heroCard: { height: 180, borderRadius: 16, backgroundColor: '#0D9488', padding: 20, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden', elevation: 5 },
  heroContent: { justifyContent: 'space-between', zIndex: 10, flex: 1 },
  heroSubtitle: { fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: -4 },
  scoreValue: { fontSize: 72, fontWeight: 'bold', color: '#FFF', lineHeight: 72 },
  scoreMax: { fontSize: 20, fontWeight: '500', color: 'rgba(255,255,255,0.5)', marginLeft: 4 },
  trendContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { color: '#a5f3eb', fontSize: 12, fontWeight: '500' },
  heroIconContainer: { justifyContent: 'center', alignItems: 'center', zIndex: 10, paddingRight: 10 },
  heroStrip: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.2)', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 20 },
  heroStripText: { fontSize: 10, color: 'rgba(255,255,255,0.9)', fontWeight: '500', letterSpacing: 0.5 },
  heroStripSeparator: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: '#94A3B8', fontSize: 14, fontWeight: '500' },
  streakContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { color: '#F59E0B', fontSize: 14, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  gridCard: { width: '47%', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderTopWidth: 4, gap: 12, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500', letterSpacing: -0.5 },
  cardValuesRow: { flexDirection: 'row', alignItems: 'baseline' },
  cardMainValue: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' },
  cardSubValue: { fontSize: 12, color: '#94A3B8', marginLeft: 4 },
  progressBarBg: { height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  waterSquaresContainer: { flexDirection: 'row', gap: 4, height: 16, alignItems: 'center' },
  waterSquare: { width: 16, height: 16, borderRadius: 4 },
  timelineSection: { gap: 12 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { color: '#14B8A6', fontSize: 14, fontWeight: 'bold' },
  timelineScroll: { gap: 16, paddingRight: 16 },
  logCard: { width: 100, height: 100, backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 12, alignItems: 'center', justifyContent: 'center', gap: 4 },
  logEmoji: { fontSize: 24 },
  logName: { fontSize: 12, fontWeight: 'bold', color: '#F1F5F9' },
  logValue: { fontSize: 10, color: '#94A3B8' },
  insightBorder: { padding: 1, borderRadius: 16, backgroundColor: '#14B8A6' },
  insightCard: { backgroundColor: '#1E293B', borderRadius: 15, padding: 20, gap: 12 },
  insightHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightTag: { color: '#FBBF24', fontSize: 14, fontWeight: 'bold' },
  insightText: { fontSize: 15, color: '#F1F5F9', lineHeight: 22 },
  insightHighlight: { color: '#2DD4BF', fontWeight: 'bold' },
  insightLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  insightLinkText: { color: '#14B8A6', fontSize: 14, fontWeight: 'bold' },
  meditationCard: { backgroundColor: '#1E1B4B', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#14B8A6', padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  meditationText: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)', lineHeight: 22, marginBottom: 12, paddingRight: 40 },
  meditationBtn: { backgroundColor: '#0D9488', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  meditationBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});