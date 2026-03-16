import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, SafeAreaView
} from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import { useAppDispatch } from '../../../store/hooks';
import { setProfile } from '../../../store/slices/profileSlice';

const SEX_OPTIONS = ['Masculino', 'Feminino', 'Outro'];

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
  { value: 'light', label: 'Leve', description: 'Exercício 1-3x por semana' },
  { value: 'moderate', label: 'Ativo', description: 'Exercício 3-5x por semana' },
  { value: 'very_active', label: 'Muito Ativo', description: 'Exercício 6-7x por semana' },
];

const GOAL_OPTIONS = [
  { value: 'lose_weight', label: 'Perder peso', emoji: '🏋️', color: Colors.fittrack },
  { value: 'gain_muscle', label: 'Ganhar músculo', emoji: '💪', color: Colors.info },
  { value: 'reduce_stress', label: 'Reduzir estresse', emoji: '🧘', color: Colors.mindzen },
];

const CONDITIONS = ['Fibromialgia', 'Enxaqueca', 'Endometriose', 'SII', 'SOP', 'Fadiga Crônica', 'Outro'];

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export default function ProfileSetupScreen({ onContinue, onBack }: Props) {
  const dispatch = useAppDispatch();

  // ── Credenciais ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ── Perfil ──
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [mainGoal, setMainGoal] = useState<string | null>(null);
  const [hasConditions, setHasConditions] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleContinue = () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    dispatch(setProfile({
      name,
      birthDate,
      weightKg: parseFloat(weight) || null,
      heightCm: parseFloat(height) || null,
      sex: sex as any,
      activityLevel: activityLevel as any,
      mainGoal: mainGoal as any,
    }));
    onContinue();
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Criar sua conta</Text>
          <Text style={styles.headerStep}>Passo 1 de 2</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
      <Text style={styles.progressText}>50% concluído</Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Credenciais de acesso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso à conta</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="nome@exemplo.com"
              placeholderTextColor={Colors.dark.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputFlex}
                placeholder="mínimo 8 caracteres"
                placeholderTextColor={Colors.dark.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirmar senha</Text>
            <TextInput
              style={[
                styles.input,
                confirmPassword.length > 0 && confirmPassword !== password && styles.inputError
              ]}
              placeholder="repita a senha"
              placeholderTextColor={Colors.dark.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <Text style={styles.errorText}>As senhas não coincidem</Text>
            )}
          </View>
        </View>

        {/* O básico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O básico</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor={Colors.dark.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Data de nascimento (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.input}
              placeholder="01/01/2000"
              placeholderTextColor={Colors.dark.textSecondary}
              value={birthDate}
              onChangeText={setBirthDate}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="72"
                placeholderTextColor={Colors.dark.textSecondary}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="178"
                placeholderTextColor={Colors.dark.textSecondary}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Sobre você */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre você</Text>

          <View style={styles.pills}>
            {SEX_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.pill, sex === option && styles.pillActive]}
                onPress={() => setSex(option)}
              >
                <Text style={[styles.pillText, sex === option && styles.pillTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.gap} />

          {ACTIVITY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[styles.radioRow, activityLevel === option.value && styles.radioRowActive]}
              onPress={() => setActivityLevel(option.value)}
            >
              <View>
                <Text style={styles.radioLabel}>{option.label}</Text>
                <Text style={styles.radioDescription}>{option.description}</Text>
              </View>
              <View style={[styles.radioCircle, activityLevel === option.value && styles.radioCircleActive]}>
                {activityLevel === option.value && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seu principal objetivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu principal objetivo</Text>
          {GOAL_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.goalCard,
                mainGoal === option.value && { borderColor: option.color, borderWidth: 2, backgroundColor: `${option.color}15` }
              ]}
              onPress={() => setMainGoal(option.value)}
            >
              <View style={[styles.goalIcon, { backgroundColor: `${option.color}30` }]}>
                <Text style={styles.goalEmoji}>{option.emoji}</Text>
              </View>
              <Text style={styles.goalLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Condições crônicas */}
        <View style={styles.section}>
          <View style={styles.conditionsHeader}>
            <Text style={styles.sectionTitle}>Você tem alguma condição crônica?</Text>
            <TouchableOpacity
              style={[styles.toggle, hasConditions && styles.toggleActive]}
              onPress={() => setHasConditions(!hasConditions)}
            >
              <View style={[styles.toggleKnob, hasConditions && styles.toggleKnobActive]} />
            </TouchableOpacity>
          </View>

          {hasConditions && (
            <View style={styles.conditionChips}>
              {CONDITIONS.map(condition => (
                <TouchableOpacity
                  key={condition}
                  style={[styles.chip, selectedConditions.includes(condition) && styles.chipActive]}
                  onPress={() => toggleCondition(condition)}
                >
                  <Text style={[styles.chipText, selectedConditions.includes(condition) && styles.chipTextActive]}>
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continuar →</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>Você pode atualizar isso depois</Text>
      </View>

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: Colors.dark.text,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  headerStep: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
    fontFamily: Typography.fonts.body,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 24,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    width: '50%',
    backgroundColor: Colors.home,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
    fontFamily: Typography.fonts.body,
    textAlign: 'right',
    marginRight: 24,
    marginTop: 4,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  inputWrapper: {
    gap: 6,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
    fontFamily: Typography.fonts.body,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.dark.text,
    fontFamily: Typography.fonts.body,
    fontSize: Typography.sizes.base,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 14,
    color: Colors.dark.text,
    fontFamily: Typography.fonts.body,
    fontSize: Typography.sizes.base,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    fontFamily: Typography.fonts.body,
    paddingLeft: 4,
  },
  eyeIcon: {
    fontSize: 18,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
    gap: 6,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  pillActive: {
    backgroundColor: Colors.home,
    borderColor: Colors.home,
  },
  pillText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.medium,
  },
  gap: {
    height: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 8,
  },
  radioRowActive: {
    borderColor: Colors.home,
    backgroundColor: `${Colors.home}15`,
  },
  radioLabel: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.medium,
    color: Colors.dark.text,
  },
  radioDescription: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.home,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.home,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 8,
  },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalEmoji: {
    fontSize: 22,
  },
  goalLabel: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.medium,
    color: Colors.dark.text,
  },
  conditionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.border,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: Colors.home,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  conditionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipActive: {
    backgroundColor: `${Colors.home}20`,
    borderColor: Colors.home,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
  },
  chipTextActive: {
    color: Colors.home,
    fontWeight: Typography.weights.semibold,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 8,
  },
  continueButton: {
    backgroundColor: Colors.home,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.semibold,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
    fontFamily: Typography.fonts.body,
  },
});