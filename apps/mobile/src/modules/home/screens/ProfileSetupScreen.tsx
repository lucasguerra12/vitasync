import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import { useAppDispatch } from '../../../store/hooks';
import { setProfile } from '../../../store/slices/profileSlice';
import { calcAge, calcDailyCalories } from '../../../utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { database } from '../../../database';
import Profile from '../../../database/models/Profile'; 

const SEX_OPTIONS = ['Masculino', 'Feminino', 'Outro'] as const;

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
  { value: 'light', label: 'Leve', description: 'Exercício 1-3x por semana' },
  { value: 'moderate', label: 'Ativo', description: 'Exercício 3-5x por semana' },
  { value: 'very_active', label: 'Muito Ativo', description: 'Exercício 6-7x por semana' },
] as const;

const GOAL_OPTIONS = [
  { value: 'lose_weight', label: 'Perder peso', emoji: '🏋️', color: Colors.fittrack },
  { value: 'gain_muscle', label: 'Ganhar músculo', emoji: '💪', color: Colors.info },
  { value: 'reduce_stress', label: 'Reduzir estresse', emoji: '🧘', color: Colors.mindzen },
] as const;

const CONDITIONS = ['Fibromialgia', 'Enxaqueca', 'Endometriose', 'SII', 'SOP', 'Fadiga Crônica', 'Outro'];

const setupFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string(),
  name: z.string().min(2, "O nome é obrigatório"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA"),
  weight: z.string()
    .min(1, "O peso é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Peso inválido"),
  height: z.string()
    .min(1, "A altura é obrigatória")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Altura inválida"),
  sex: z.string().min(1, "Selecione uma opção"),
  activityLevel: z.string().min(1, "Selecione uma opção"),
  mainGoal: z.string().min(1, "Selecione uma opção"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SetupFormData = z.infer<typeof setupFormSchema>;

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export default function ProfileSetupScreen({ onContinue, onBack }: Props) {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [hasConditions, setHasConditions] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
const { control, handleSubmit, formState: { errors } } = useForm<SetupFormData>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      email: '', 
      password: '', 
      confirmPassword: '', 
      name: '', 
      birthDate: '', 
      weight: '', 
      height: '',
      sex: '',
      activityLevel: '',
      mainGoal: ''
    }
  });

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  // Função disparada APENAS se o Zod aprovar todos os dados
// Transformamos em async para o banco de dados poder processar
  const onSubmit = async (data: SetupFormData) => {
    const age = calcAge(data.birthDate) || 0; 
    const parsedWeight = parseFloat(data.weight);
    const parsedHeight = parseFloat(data.height);
    
    const dailyCalorieGoal = calcDailyCalories(
      data.sex as any,
      parsedWeight,
      parsedHeight,
      age,
      data.activityLevel as any
    );
    
    // 1. Salva na memória rápida do app (Redux)
    dispatch(setProfile({
      name: data.name,
      birthDate: data.birthDate,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      sex: data.sex as any,
      activityLevel: data.activityLevel as any,
      mainGoal: data.mainGoal as any,
      dailyCalorieGoal
    }));

    // 2. Salva fisicamente no aparelho (WatermelonDB) com os dados REAIS
    try {
      await database.write(async () => {
        const profilesCollection = database.collections.get<Profile>('profiles');

        // Limpa qualquer sessão antiga que tenha ficado no banco
        const oldProfiles = await profilesCollection.query().fetch();
        for (const p of oldProfiles) {
          await p.destroyPermanently();
        }

        // Grava o perfil exato que você digitou no formulário
        await profilesCollection.create((profile: any) => {
          profile.name = data.name;
          profile.age = age;
          profile.weight = parsedWeight;
          profile.height = parsedHeight / 100; // Transformando cm em metros (ex: 175 para 1.75)
          profile.gender = data.sex === 'Masculino' ? 'M' : data.sex === 'Feminino' ? 'F' : 'O';
          profile.activityLevel = data.activityLevel;
          profile.goal = data.mainGoal;
        });
      });
      console.log("✅ Perfil REAL salvo no SQLite com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar no banco:", error);
    }

    onContinue();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header e Progress Bar mantidos */}
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

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
      <Text style={styles.progressText}>50% concluído</Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Acesso à conta ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso à conta</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="nome@exemplo.com"
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.inputRow, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.inputFlex}
                    placeholder="mínimo 8 caracteres"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirmar senha</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder="repita a senha"
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                />
              )}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>
        </View>

        {/* ── O Básico ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O básico</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Seu nome"
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Data de nascimento (DD/MM/AAAA)</Text>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.birthDate && styles.inputError]}
                  placeholder="01/01/2000"
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              )}
            />
            {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate.message}</Text>}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    placeholder="72"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={value?.toString()}
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Altura (cm)</Text>
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.height && styles.inputError]}
                    placeholder="178"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={value?.toString()}
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}
            </View>
          </View>
        </View>

        {/* ── Sobre você ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre você</Text>
          
          <Controller
            control={control}
            name="sex"
            render={({ field: { onChange, value } }) => (
              <View>
                <View style={styles.pills}>
                  {SEX_OPTIONS.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.pill, value === option && styles.pillActive]}
                      onPress={() => onChange(option)}
                    >
                      <Text style={[styles.pillText, value === option && styles.pillTextActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.sex && <Text style={styles.errorText}>{errors.sex.message}</Text>}
              </View>
            )}
          />

          <View style={styles.gap} />

          <Controller
            control={control}
            name="activityLevel"
            render={({ field: { onChange, value } }) => (
              <View>
                {ACTIVITY_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.radioRow, value === option.value && styles.radioRowActive]}
                    onPress={() => onChange(option.value)}
                  >
                    <View>
                      <Text style={styles.radioLabel}>{option.label}</Text>
                      <Text style={styles.radioDescription}>{option.description}</Text>
                    </View>
                    <View style={[styles.radioCircle, value === option.value && styles.radioCircleActive]}>
                      {value === option.value && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
                {errors.activityLevel && <Text style={styles.errorText}>{errors.activityLevel.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* ── Seu principal objetivo ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu principal objetivo</Text>
          <Controller
            control={control}
            name="mainGoal"
            render={({ field: { onChange, value } }) => (
              <View>
                {GOAL_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.goalCard,
                      value === option.value && { borderColor: option.color, borderWidth: 2, backgroundColor: `${option.color}15` }
                    ]}
                    onPress={() => onChange(option.value)}
                  >
                    <View style={[styles.goalIcon, { backgroundColor: `${option.color}30` }]}>
                      <Text style={styles.goalEmoji}>{option.emoji}</Text>
                    </View>
                    <Text style={styles.goalLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                {errors.mainGoal && <Text style={styles.errorText}>{errors.mainGoal.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* ── Condições crônicas (Mantido original) ── */}
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
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.continueText}>Continuar →</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>Você pode atualizar isso depois</Text>
      </View>

    </SafeAreaView>
  );
}

// Estilos originais mantidos intactos abaixo...
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