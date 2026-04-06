import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors , Typography } from '../../../constants';
import { useAppSelector } from '../../../store/hooks';
import DashboardHeader from '../components/DashboardHeader';
import ScoreCard from '../components/ScoreCard';
import MetricsBanner from '../components/MetricsBanner';
import QuickStatsGrid from '../components/QuickStatsGrid';
import TodayLogRow from '../components/TodayLogRow';
import InsightCard from '../components/InsightCard';
import MeditationBanner from '../components/MeditationBanner';

interface Props {
  onOpenIMC?:() => void
}

const MOCK_METRICS = [
  { label: 'Nutrição', value: 87, color: Colors.nutrilens },
  { label: 'Sono', value: 65, color: Colors.mindzen },
  { label: 'Movimento', value: 72, color: Colors.fittrack },
  { label: 'Hidratação', value: 60, color: Colors.info },
];

const MOCK_LOG = [
  { emoji: '🥗', label: 'Almoço', value: '487 kcal' },
  { emoji: '🏃', label: 'Corrida', value: '5,2 km' },
  { emoji: '💊', label: 'Vitamina D', value: 'Diário' },
  { emoji: '😊', label: 'Humor', value: '4/5' },
];

export default function DashboardScreen({ onOpenIMC }: Props) {
  const profile = useAppSelector(state => state.profile);
  const todaySteps = useAppSelector(state => state.steps.todaySteps);

  const calorieTarget = profile.dailyCalorieGoal
    ? profile.dailyCalorieGoal.toLocaleString('pt-BR')
    : '2.000';

  const waterTarget = (profile.dailyWaterGoalMl / 1000).toFixed(1).replace('.', ',');
  const stepTarget = profile.dailyStepGoal.toLocaleString('pt-BR');

  const MOCK_STATS = [
    { label: 'Calorias', value: '1.842', target: calorieTarget, unit: 'kcal', color: Colors.nutrilens, emoji: '🍽️' },
    { label: 'Passos', value: todaySteps.toLocaleString('pt-BR'), target: stepTarget, unit: '', color: Colors.fittrack, emoji: '👟' },
    { label: 'Água', value: '1,4', target: waterTarget, unit: 'L', color: Colors.info, emoji: '💧' },
    { label: 'Freq. Card.', value: '72', target: '—', unit: 'bpm', color: Colors.error, emoji: '❤️' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <DashboardHeader
          userName={profile.name ?? 'Você'}
          hasNotification={true}
          onNotificationPress={() => {}}
        />

        <ScoreCard
          score={78}
          streakDays={14}
          trend={4}
        />

        <MetricsBanner metrics={MOCK_METRICS} />

        <QuickStatsGrid stats={MOCK_STATS} />

        <TouchableOpacity style={styles.imcButton} onPress={onOpenIMC}>
          <Text style={styles.imcButtonText}>📊 Calcular meu IMC</Text>
        </TouchableOpacity>

        <TodayLogRow
          items={MOCK_LOG}
          onSeeAll={() => {}}
        />

        <InsightCard
          insight="Sua dor nas costas é 2,3x maior quando a ingestão de magnésio está abaixo de 40% da sua meta diária."
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
});