import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import { calcIMC, getIMCClassification, formatIMC } from '../../../utils';


interface Props {
    onBack: () => void;
}

export default function IMCScreen({onBack} : Props){
    const [weight, setWeight]= useState('');
    const [height , setHeight] = useState('');
    const [result , setResult] = useState<number | null>(null);

    const handleCalc = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        if (!w || !h || w <= 0 || h<= 0) {
            alert('Preencha peso e altura corretamente.');
            return;
        }
        setResult(calcIMC(w,h));
    };
    const classification = result ? getIMCClassification(result): null

    return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculadora de IMC</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Campos */}
        <View style={styles.section}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 75"
            placeholderTextColor={Colors.dark.textSecondary}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 175"
            placeholderTextColor={Colors.dark.textSecondary}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleCalc}>
            <Text style={styles.buttonText}>Calcular IMC</Text>
          </TouchableOpacity>
        </View>

        {/* Resultado */}
        {result && classification && (
          <View style={[styles.result, { borderColor: classification.color }]}>
            <Text style={styles.resultLabel}>Seu IMC</Text>
            <Text style={[styles.resultValue, { color: classification.color }]}>
              {formatIMC(result)}
            </Text>
            <Text style={[styles.resultClass, { color: classification.color }]}>
              {classification.label}
            </Text>
            <Text style={styles.resultAdvice}>{classification.advice}</Text>
          </View>
        )}

        {/* Tabela de referência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tabela de referência</Text>
          {[
            { range: 'Abaixo de 18,5', label: 'Abaixo do peso', color: '#3B82F6' },
            { range: '18,5 — 24,9', label: 'Peso normal', color: '#10B981' },
            { range: '25,0 — 29,9', label: 'Sobrepeso', color: '#F59E0B' },
            { range: '30,0 — 34,9', label: 'Obesidade grau I', color: '#F97316' },
            { range: '35,0 — 39,9', label: 'Obesidade grau II', color: '#EF4444' },
            { range: 'Acima de 40', label: 'Obesidade grau III', color: '#7C3AED' },
          ].map(item => (
            <View key={item.label} style={styles.tableRow}>
              <View style={[styles.tableColor, { backgroundColor: item.color }]} />
              <Text style={styles.tableRange}>{item.range}</Text>
              <Text style={styles.tableLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.dark.text,
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.dark.text,
    fontFamily: Typography.fonts.mono,
    fontSize: Typography.sizes.base,
  },
  button: {
    backgroundColor: Colors.home,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.bold,
  },
  result: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    backgroundColor: Colors.dark.surface,
  },
  resultLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: 56,
    fontFamily: Typography.fonts.mono,
    fontWeight: Typography.weights.bold,
    lineHeight: 64,
  },
  resultClass: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
  },
  resultAdvice: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tableColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  tableRange: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.mono,
    color: Colors.dark.textSecondary,
    width: 110,
  },
  tableLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.text,
    flex: 1,
  },
});
