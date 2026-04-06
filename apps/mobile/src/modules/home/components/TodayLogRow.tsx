import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../../constants';

interface LogItem {
  emoji: string;
  label: string;
  value: string;
}

interface Props {
  items: LogItem[];
  onSeeAll?: () => void;
}

export default function TodayLogRow({ items, onSeeAll }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro de hoje</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>Ver tudo →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  seeAll: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.home,
    fontWeight: Typography.weights.bold,
  },
  scroll: {
    paddingHorizontal: 24,
    gap: 10,
  },
  item: {
    width: 100,
    height: 100,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  itemValue: {
    fontSize: 10,
    fontFamily: Typography.fonts.mono,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});