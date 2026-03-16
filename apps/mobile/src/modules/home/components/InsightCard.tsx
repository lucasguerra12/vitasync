import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../../constants';

interface Props {
  insight: string;
  onViewMore?: () => void;
}

export default function InsightCard({ insight, onViewMore }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>💡</Text>
        </View>
        <Text style={styles.title}>Padrão detectado</Text>
      </View>

      <Text style={styles.insight}>{insight}</Text>

      <TouchableOpacity style={styles.button} onPress={onViewMore}>
        <Text style={styles.buttonText}>Ver insights completos →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.home,
    backgroundColor: `${Colors.home}10`,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.home}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.home,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  insight: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  button: {
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.home,
  },
});