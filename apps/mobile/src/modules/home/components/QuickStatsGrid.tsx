import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../../constants';

interface Stat {
  label: string;
  value: string;
  target: string;
  unit: string;
  color: string;
  emoji: string;
}

interface Props {
  stats: Stat[];
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <View style={[styles.card, { borderTopColor: stat.color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{stat.emoji}</Text>
        <Text style={[styles.cardLabel, { color: stat.color }]}>{stat.label}</Text>
      </View>
      <View style={styles.cardValue}>
        <Text style={styles.value}>{stat.value}</Text>
        <Text style={styles.target}> / {stat.target} {stat.unit}</Text>
      </View>
    </View>
  );
}

export default function QuickStatsGrid({ stats }: Props) {
  return (
    <View style={styles.grid}>
      {stats.map(stat => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginHorizontal: 24,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '47.5%',
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderTopWidth: 3,
    padding: 14,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardEmoji: {
    fontSize: 14,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.mono,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  target: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.mono,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
});