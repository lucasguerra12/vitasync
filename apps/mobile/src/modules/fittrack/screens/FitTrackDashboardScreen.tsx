import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useStepCounter } from '../../../sensors/useStepCounter';

export const FitTrackDashboardScreen = () => {
  // Puxando os passos diretamente do seu hook atual
  const { steps } = useStepCounter();

  const currentSteps = steps || 0;
  const dailyGoal = 10000; // Deixando fixo até adicionarmos ao Redux

  // Cálculos dinâmicos aproximados (Req 3 e Req 4)
  const caloriesBurned = Math.round(currentSteps * 0.04);
  const distanceCovered = ((currentSteps * 0.75) / 1000).toFixed(2);
  const activeMinutes = Math.round(currentSteps / 100);

  // Progresso do objetivo diário
  const progressPercentage = Math.min(Math.round((currentSteps / dailyGoal) * 100), 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>FitTrack</Text>
            <Text style={styles.headerSubtitle}>Tracking Active</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={{ color: '#fff' }}>👤</Text> 
          </TouchableOpacity>
        </View>

        {/* Hero Card - Daily Activity */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Daily Activity</Text>
          <Text style={styles.heroSteps}>
            {currentSteps} <Text style={styles.heroStepsLabel}>steps</Text>
          </Text>
          
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>CALORIES</Text>
              <Text style={styles.heroStatValue}>{caloriesBurned} kcal</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>DISTANCE</Text>
              <Text style={styles.heroStatValue}>{distanceCovered} km</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>TIME</Text>
              <Text style={styles.heroStatValue}>{activeMinutes} min</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Step Goal ({dailyGoal})</Text>
              <Text style={styles.progressLabel}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        </View>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          {['RUN', 'WORKOUT', 'HEART', 'PARKS'].map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionButton}>
              <View style={styles.actionIconBox}>
                <Text style={{ color: '#f97316', fontSize: 18 }}>
                  {action === 'RUN' ? '🏃‍♂️' : action === 'WORKOUT' ? '🏋️‍♂️' : action === 'HEART' ? '❤️' : '🏞️'}
                </Text> 
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cta Start Workout */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>▶ START WORKOUT</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: '#334155',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: '#f97316',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroSteps: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heroStepsLabel: {
    fontSize: 18,
    fontWeight: 'normal',
    opacity: 0.8,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroStatBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ctaButton: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});