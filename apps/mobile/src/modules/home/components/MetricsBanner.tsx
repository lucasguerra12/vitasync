import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../../constants';

interface Metric {
  label: string;
  value: number; // 0-100
  color: string;
}

interface Props {
  metrics: Metric[];
}

export default function MetricsBanner({ metrics }: Props) {
  return (
    <View style={styles.container}>
      {metrics.map((metric, index) => (
        <View key={metric.label} style={styles.metric}>
          <Text style={styles.label}>{metric.label}</Text>
          <View style={styles.bar}>
            <View style={[styles.fill, { width: `${metric.value}%`, backgroundColor: metric.color }]} />
          </View>
          <Text style={[styles.value, { color: metric.color }]}>{metric.value}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bar: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
  },
  fill: {
    height: 3,
    borderRadius: 2,
  },
  value: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.mono,
    fontWeight: Typography.weights.bold,
  },
});