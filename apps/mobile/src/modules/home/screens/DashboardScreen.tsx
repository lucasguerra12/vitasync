import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../../store/hooks';
import { useDailyNutrition } from '../../nutrilens/hooks/useDailyNutrition';

export function DashboardScreen() {
  const profile = useAppSelector((state) => state.profile);
  const { totals } = useDailyNutrition();

  // Dados calculados para reatividade
  const GOAL_KCAL = profile.dailyCalorieGoal || 2100;
  const progressPercent = Math.min(100, (totals.calories / GOAL_KCAL) * 100) || 0;
  const score = Math.round(progressPercent); // Simulação do "Daily Score"

  // Placeholder para passos (até o FitTrack ficar pronto)
  const GOAL_STEPS = 10000;
  const currentSteps = 7234;
  const stepsPercent = Math.min(100, (currentSteps / GOAL_STEPS) * 100);

  // Formatação da data atual
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            {/* Imagem de placeholder baseada no HTML */}
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
          </View>
          <Text style={styles.greeting}>Good morning, {profile.name || 'Ana'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialIcons name="notifications" size={24} color="#94A3B8" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEALTH SCORE HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroSubtitle}>DAILY SCORE</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreValue}>{score}</Text>
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

          {/* Bottom Strip */}
          <View style={styles.heroStrip}>
            <Text style={styles.heroStripText}>NUTRITION 87%</Text>
            <Text style={styles.heroStripSeparator}>|</Text>
            <Text style={styles.heroStripText}>SLEEP 65%</Text>
            <Text style={styles.heroStripSeparator}>|</Text>
            <Text style={styles.heroStripText}>MOVE 72%</Text>
          </View>
        </View>

        {/* DATE / STREAK ROW */}
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={18} color="#F59E0B" />
            <Text style={styles.streakText}>14-day streak</Text>
          </View>
        </View>

        {/* QUICK STATS GRID */}
        <View style={styles.grid}>
          {/* Card 1: Calories (REATIVO AO NUTRILENS) */}
          <View style={[styles.gridCard, { borderTopColor: '#10B981' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>CALORIES</Text>
              <MaterialIcons name="restaurant" size={20} color="#10B981" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>{totals.calories.toLocaleString()}</Text>
              <Text style={styles.cardSubValue}>/ {GOAL_KCAL} kcal</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: '#10B981' }]} />
            </View>
          </View>

          {/* Card 2: Steps */}
          <View style={[styles.gridCard, { borderTopColor: '#F97316' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>STEPS</Text>
              <MaterialIcons name="show-chart" size={20} color="#F97316" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>{currentSteps.toLocaleString()}</Text>
              <Text style={styles.cardSubValue}>/ {GOAL_STEPS.toLocaleString()}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${stepsPercent}%`, backgroundColor: '#F97316' }]} />
            </View>
          </View>

          {/* Card 3: Water */}
          <View style={[styles.gridCard, { borderTopColor: '#3B82F6' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>WATER</Text>
              <MaterialIcons name="water-drop" size={20} color="#3B82F6" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>1.4</Text>
              <Text style={styles.cardSubValue}>/ 2.0 L</Text>
            </View>
            {/* Simulando o progresso da água */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '70%', backgroundColor: '#3B82F6' }]} />
            </View>
          </View>

          {/* Card 4: Heart Rate */}
          <View style={[styles.gridCard, { borderTopColor: '#EF4444' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>HEART RATE</Text>
              <MaterialIcons name="monitor-heart" size={20} color="#EF4444" />
            </View>
            <View style={styles.cardValuesRow}>
              <Text style={styles.cardMainValue}>72</Text>
              <Text style={styles.cardSubValue}>bpm</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '40%', backgroundColor: '#EF4444' }]} />
            </View>
          </View>
        </View>

        {/* ACTIVITY TIMELINE (TODAY'S LOG) */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitle}>Today's log</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#14B8A6" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
             {/* Log Items baseados no protótipo */}
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>🥗</Text>
               <Text style={styles.logName}>Lunch</Text>
               <Text style={styles.logValue}>487 kcal</Text>
             </View>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>🏃</Text>
               <Text style={styles.logName}>Run</Text>
               <Text style={styles.logValue}>5.2km</Text>
             </View>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>💊</Text>
               <Text style={styles.logName}>Vitamin D</Text>
               <Text style={styles.logValue}>Daily</Text>
             </View>
             <View style={styles.logCard}>
               <Text style={styles.logEmoji}>😊</Text>
               <Text style={styles.logName}>Mood</Text>
               <Text style={styles.logValue}>4/5</Text>
             </View>
          </ScrollView>
        </View>

        {/* INSIGHTS PREVIEW */}
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

        {/* MEDITATION PROMPT */}
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
  
  // Hero Card
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

  // Date Row
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: '#94A3B8', fontSize: 14, fontWeight: '500' },
  streakContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { color: '#F59E0B', fontSize: 14, fontWeight: 'bold' },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  gridCard: { width: '47%', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderTopWidth: 4, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500', letterSpacing: -0.5 },
  cardValuesRow: { flexDirection: 'row', alignItems: 'baseline' },
  cardMainValue: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' },
  cardSubValue: { fontSize: 12, color: '#94A3B8', marginLeft: 4 },
  progressBarBg: { height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  // Timeline
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

  // Insights
  insightBorder: { padding: 1, borderRadius: 16, backgroundColor: '#14B8A6' }, // Simulating gradient border
  insightCard: { backgroundColor: '#1E293B', borderRadius: 15, padding: 20, gap: 12 },
  insightHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightTag: { color: '#FBBF24', fontSize: 14, fontWeight: 'bold' },
  insightText: { fontSize: 15, color: '#F1F5F9', lineHeight: 22 },
  insightHighlight: { color: '#2DD4BF', fontWeight: 'bold' },
  insightLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  insightLinkText: { color: '#14B8A6', fontSize: 14, fontWeight: 'bold' },

  // Meditation
  meditationCard: { backgroundColor: '#1E1B4B', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#14B8A6', padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  meditationText: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)', lineHeight: 22, marginBottom: 12, paddingRight: 40 },
  meditationBtn: { backgroundColor: '#0D9488', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  meditationBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});