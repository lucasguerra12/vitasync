import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../../../services/supabase';
import { useActivityMetrics } from '../../../hooks/useActivityMetrics';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Importando MaterialIcons para o botão de histórico

export const FitTrackDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { steps, calories, distance, activeMinutes, progressPercentage, dailyGoal } = useActivityMetrics();
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        if (data) {
          setRecentWorkouts(data);
        }
      } catch (err) {
        console.error("Erro ao buscar treinos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'Running': return '🏃‍♂️';
      case 'Workout': return '🏋️‍♂️';
      case 'Yoga': return '🧘‍♂️';
      case 'Cycling': return '🚴‍♂️';
      default: return '⚡';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Ajustado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>FitTrack</Text>
            <Text style={styles.headerSubtitle}>Active Tracking Mode</Text>
          </View>
          
          {/* Grupo de botões à direita */}
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => navigation.navigate('ExerciseDiaryScreen')}
            >
              <MaterialIcons name="history" size={26} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.profileButton}>
              <Text style={{ color: '#fff' }}>👤</Text> 
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card - Daily Activity */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Daily Activity</Text>
          <Text style={styles.heroSteps}>
            {steps} <Text style={styles.heroStepsLabel}>steps</Text>
          </Text>
          
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>CALORIES</Text>
              <Text style={styles.heroStatValue}>{calories} kcal</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>DISTANCE</Text>
              <Text style={styles.heroStatValue}>{distance} km</Text>
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
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton}
              onPress={() => {
                if (action === 'RUN') navigation.navigate('ActiveRunScreen');
                if (action === 'PARKS') navigation.navigate('ParksScreen');
                if (action === 'WORKOUT') navigation.navigate('ExerciseMenuScreen');
              }}
            >
              <View style={styles.actionIconBox}>
                <Text style={{ color: '#f97316', fontSize: 20 }}>
                  {action === 'RUN' ? '🏃‍♂️' : action === 'WORKOUT' ? '🏋️‍♂️' : action === 'HEART' ? '❤️' : '🏞️'}
                </Text> 
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cta Start Workout */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('ExerciseMenuScreen')}>
          <Text style={styles.ctaButtonText}>▶ START WORKOUT</Text>
        </TouchableOpacity>

        {/* Recent Workouts Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="small" color="#f97316" style={{ marginTop: 20 }} />
          ) : recentWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum treino registrado.</Text>
            </View>
          ) : (
            recentWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutIconBg}>
                  <Text style={{ fontSize: 20 }}>{getWorkoutIcon(workout.type)}</Text>
                </View>
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutMeta}>
                    {workout.duration} min {workout.distance ? `· ${workout.distance} km` : ''}
                  </Text>
                </View>
                <Text style={styles.workoutDate}>
                  {new Date(Number(workout.created_at)).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#94a3b8', fontSize: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 }, // Container dos botões
  iconButton: { padding: 8 }, // Botão de histórico
  profileButton: { width: 40, height: 40, backgroundColor: '#334155', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: '#f97316', borderRadius: 16, padding: 20, marginBottom: 24 },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  heroSteps: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginBottom: 16 },
  heroStepsLabel: { fontSize: 18, fontWeight: 'normal', opacity: 0.8 },
  heroStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  heroStatBox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 8, flex: 1, marginHorizontal: 4 },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold' },
  heroStatValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  progressContainer: { marginTop: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: '#fff', fontSize: 12, fontWeight: '500' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionButton: { alignItems: 'center', flex: 1 },
  actionIconBox: { width: 60, height: 60, backgroundColor: '#1e293b', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  ctaButton: { backgroundColor: '#f97316', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
  ctaButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  recentSection: { marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyState: { padding: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginTop: 8 },
  emptyStateText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  workoutCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 12 },
  workoutIconBg: { width: 44, height: 44, backgroundColor: '#334155', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  workoutDetails: { flex: 1 },
  workoutTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  workoutMeta: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  workoutDate: { color: '#64748b', fontSize: 12 }
});