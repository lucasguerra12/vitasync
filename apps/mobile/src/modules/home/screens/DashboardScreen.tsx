import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors, Typography } from '../../../constants';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateSteps } from '../../../store/slices/stepsSlice';
import DashboardHeader from '../components/DashboardHeader';
import ScoreCard from '../components/ScoreCard';
import MetricsBanner from '../components/MetricsBanner';
import QuickStatsGrid from '../components/QuickStatsGrid';
import TodayLogRow from '../components/TodayLogRow';
import InsightCard from '../components/InsightCard';
import MeditationBanner from '../components/MeditationBanner';

interface Props {
  onOpenIMC?: () => void;
}

export default function DashboardScreen({ onOpenIMC }: Props) {
  const profile = useAppSelector(state => state.profile);
  const todaySteps = useAppSelector(state => state.steps.todaySteps);
  const dispatch = useAppDispatch();

  // Dados reais puxados do Redux (ou fallback padrão)
  const calorieTarget = profile.dailyCalorieGoal || 2000;
  const stepTarget = profile.dailyStepGoal || 10000;
  const waterTarget = profile.dailyWaterGoalMl ? (profile.dailyWaterGoalMl / 1000) : 2.0;

  // Cards mantidos, porém zerados aguardando os dados reais dos sensores (Sprint 2)
  const METRICS_ZEROED = [
    { label: 'Nutrição', value: 0, color: Colors.nutrilens },
    { label: 'Sono', value: 0, color: Colors.mindzen },
    { label: 'Movimento', value: 0, color: Colors.fittrack },
    { label: 'Hidratação', value: 0, color: Colors.info },
  ];

  const STATS_REAL = [
    { label: 'Calorias', value: '0', target: calorieTarget.toLocaleString('pt-BR'), unit: 'kcal', color: Colors.nutrilens, emoji: '🍽️' },
    { label: 'Passos', value: todaySteps.toLocaleString('pt-BR'), target: stepTarget.toLocaleString('pt-BR'), unit: '', color: Colors.fittrack, emoji: '👟' },
    { label: 'Água', value: '0', target: waterTarget.toLocaleString('pt-BR'), unit: 'L', color: Colors.info, emoji: '💧' },
    { label: 'Freq. Card.', value: '--', target: '--', unit: 'bpm', color: Colors.error, emoji: '❤️' },
  ];

  const handleSimulateSteps = () => {
    dispatch(updateSteps(todaySteps + 500));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <DashboardHeader
          userName={profile.name ?? 'Visitante'}
          hasNotification={false}
          onNotificationPress={() => {}}
        />

        {/* Score zerado no início */}
        <ScoreCard score={0} streakDays={0} trend={0} />

        <MetricsBanner metrics={METRICS_ZEROED} />

        <QuickStatsGrid stats={STATS_REAL} />

        {__DEV__ && (
          <TouchableOpacity style={styles.devButton} onPress={handleSimulateSteps}>
            <Text style={styles.devButtonText}>🐛 DEV: Simular +500 Passos</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.imcButton} onPress={onOpenIMC}>
          <Text style={styles.imcButtonText}>📊 Calcular meu IMC</Text>
        </TouchableOpacity>

        <TodayLogRow
          items={[]} // Lista vazia para mostrar que não há registros falsos
          onSeeAll={() => {}}
        />

        <InsightCard
          insight="Sem dados suficientes. Continue usando o app para gerarmos insights de saúde."
          onViewMore={() => {}}
        />

        <MeditationBanner
          message="3 minutos podem mudar sua tarde. Que tal uma pausa agora?"
          onStart={() => {}}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  imcButton: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 16,
    alignItems: 'center',
  },
  imcButtonText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.medium,
    color: Colors.dark.text,
  },
  devButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: Colors.error,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff0000',
    borderStyle: 'dashed',
  },
  devButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});