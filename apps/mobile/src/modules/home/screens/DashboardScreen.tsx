import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import { DashboardHeader } from '../components/DashboardHeader';
import { ScoreCard } from '../components/ScoreCard';
import { MetricsBanner } from '../components/MetricsBanner';
import { QuickStatsGrid } from '../components/QuickStatsGrid';
import { useAppSelector } from '../../../store/hooks';

// IMPORTAÇÃO DO CÉREBRO
import { useDailyNutrition } from '../../nutrilens/hooks/useDailyNutrition';

export function DashboardScreen() {
  const profile = useAppSelector((state) => state.profile);
  
  // PUXANDO AS CALORIAS REAIS DO BANCO
  const { totals } = useDailyNutrition();
  
  // Meta de calorias (pode vir do perfil)
  const GOAL_KCAL = 2100; 
  // Progresso em % travado em 100%
  const progressPercent = Math.min(100, (totals.calories / GOAL_KCAL) * 100) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name={profile.name || 'Usuário'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CARD REATIVO DE CALORIAS */}
        <View style={styles.calorieCard}>
          <Text style={styles.calorieTitle}>Diário Alimentar</Text>
          <Text style={styles.calorieCount}>{totals.calories} / {GOAL_KCAL} kcal</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* COMPONENTES ANTERIORES DO SEU DASHBOARD */}
        <ScoreCard score={85} trend="up" />
        <MetricsBanner />
        <QuickStatsGrid />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  
  // Estilos do Card de Calorias
  calorieCard: { 
    backgroundColor: '#1E293B', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155'
  },
  calorieTitle: { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  calorieCount: { 
    color: '#F1F5F9', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 12 
  },
  progressBarBg: { 
    height: 10, 
    backgroundColor: '#0F172A', 
    borderRadius: 5, 
    width: '100%',
    overflow: 'hidden'
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#10B981', 
    borderRadius: 5 
  },
});