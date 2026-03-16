import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../../constants';

interface Props {
  score: number;
  streakDays: number;
  trend: number; // +4 ou -2 em relação a ontem
}

export default function ScoreCard({ score, streakDays, trend }: Props) {
  return (
    <View style={styles.container}>

      {/* Lado esquerdo — score e tendência */}
      <View style={styles.left}>
        <Text style={styles.label}>Score Diário</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.trendRow}>
          <Text style={styles.trendIcon}>{trend >= 0 ? '↑' : '↓'}</Text>
          <Text style={styles.trendText}>
            {trend >= 0 ? '+' : ''}{trend} em relação a ontem
          </Text>
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{streakDays} dias seguidos</Text>
        </View>
      </View>

      {/* Lado direito — círculo de progresso */}
      <View style={styles.right}>
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.circleScore}>{score}</Text>
            <Text style={styles.circleLabel}>pts</Text>
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.home,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    gap: 6,
    flex: 1,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  score: {
    fontSize: 48,
    fontFamily: Typography.fonts.mono,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    lineHeight: 52,
  },
  scoreMax: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.mono,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendIcon: {
    fontSize: Typography.sizes.sm,
    color: Colors.tealAccent,
  },
  trendText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: Colors.tealAccent,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  streakIcon: {
    fontSize: 14,
  },
  streakText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.medium,
    color: Colors.white,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    alignItems: 'center',
  },
  circleScore: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fonts.mono,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  circleLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.mono,
    color: 'rgba(255,255,255,0.7)',
  },
});