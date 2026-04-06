import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../../constants';

interface Props {
  message: string;
  onStart?: () => void;
}

export default function MeditationBanner({ message, onStart }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.emoji}>🧘</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>▶ Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.mindzen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  message: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.home,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
});