import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../../constants';
import { useAppSelector } from '../../../store/hooks';
import DashboardHeader from '../components/DashboardHeader';
import ScoreCard from '../components/ScoreCard';
import MetricsBanner from '../components/MetricsBanner';
import QuickStatsGrid from '../components/QuickStatsGrid';
import TodayLogRow from '../components/TodayLogRow';
import InsightCard from '../components/InsightCard';
import MeditationBanner from '../components/MeditationBanner';

// dados temporarios ate conectar com WatermelonDB e Redux
const MOCK_METRICS = [
  { label: 'Nutrição', value: 87, color: Colors.nutrilens },
  { label: 'Sono', value: 65, color: Colors.mindzen },
  { label: 'Movimento', value: 72, color: Colors.fittrack },
  { label: 'Hidratação', value: 60, color: Colors.info },
];

const MOCK_STATS = [
  { label: 'Calorias', value: '1.842', target: '2.100', unit: 'kcal', color: Colors.nutrilens, emoji: '🍽️' },
  { label: 'Passos', value: '7.234', target: '10.000', unit: '', color: Colors.fittrack, emoji: '👟' },
  { label: 'Água', value: '1,4', target: '2,0', unit: 'L', color: Colors.info, emoji: '💧' },
  { label: 'Freq. Card.', value: '72', target: '—', unit: 'bpm', color: Colors.error, emoji: '❤️' },
];

const MOCK_LOG = [
  { emoji: '🥗', label: 'Almoço', value: '487 kcal' },
  { emoji: '🏃', label: 'Corrida', value: '5,2 km' },
  { emoji: '💊', label: 'Vitamina D', value: 'Diário' },
  { emoji: '😊', label: 'Humor', value: '4/5' },
];

export default function DashboardScreen() {
  const profile = useAppSelector(state => state.profile);

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
});