import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import { useAppDispatch } from '../../../store/hooks';
import { setProfile } from '../../../store/slices/profileSlice';
import { loginSuccess } from '../../../store/slices/authSlice';
import { calcAge, calcDailyCalories } from '../../../utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import { supabase } from '../../../services/supabase';

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
  weight: z.string().min(1, "O peso é obrigatório").refine((val: string) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Peso inválido"),
  height: z.string().min(1, "A altura é obrigatória").refine((val: string) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Altura inválida"),
  sex: z.string().min(1, "Selecione uma opção"),
  activityLevel: z.string().min(1, "Selecione uma opção"),
  mainGoal: z.string().min(1, "Selecione uma opção"),
}).refine((data: any) => data.password === data.confirmPassword, {
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
    defaultValues: { email: '', password: '', confirmPassword: '', name: '', birthDate: '', weight: '', height: '', sex: '', activityLevel: '', mainGoal: '' }
  });

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]);
  };

  const onSubmit = async (data: SetupFormData) => {
    try {
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Falha ao criar utilizador no sistema.");

      const userId = authData.user.id;
      const age = calcAge(data.birthDate) || 0; 
      const parsedWeight = parseFloat(data.weight);
      const parsedHeight = parseFloat(data.height);
      const dailyCalorieGoal = calcDailyCalories(data.sex as any, parsedWeight, parsedHeight, age, data.activityLevel as any);
      const dbGender = data.sex === 'Masculino' ? 'male' : data.sex === 'Feminino' ? 'female' : 'other';

      const { error: dbError } = await supabase.from('profiles').insert([{
        user_id: userId,
        name: data.name,
        email: data.email,
        age: age,
        gender: dbGender,
        weight: parsedWeight,
        height: parsedHeight,
        activity_level: data.activityLevel,
        goal: data.mainGoal,
        daily_calorie_goal: Math.round(dailyCalorieGoal),
        created_at: Date.now(),
        updated_at: Date.now(),
      }]);

      if (dbError) {
        await supabase.auth.signOut(); // Desloga imediatamente
        throw new Error("Erro ao salvar dados do perfil. A sua conexão pode ter caído. Tente novamente.");
      }

      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      onContinue();

    } catch (error: any) {
      if (error.message.includes('Network')) {
        Alert.alert('EI! PARECE QUE VOCÊ ESTÁ OFFLINE.', 'Verifique sua conexão e tente novamente.');
      } else {
        Alert.alert('Erro ao criar conta', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <View style={styles.headerCenter}><Text style={styles.headerTitle}>Criar sua conta</Text><Text style={styles.headerStep}>Passo 1 de 2</Text></View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressBar}><View style={styles.progressFill} /></View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso à conta</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="nome@exemplo.com" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} autoCapitalize="none" />
            )} />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <TextInput style={styles.inputFlex} placeholder="mínimo 8 caracteres" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text></TouchableOpacity>
              </View>
            )} />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirmar senha</Text>
            <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.confirmPassword && styles.inputError]} placeholder="repita a senha" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} secureTextEntry={!showPassword} />
            )} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Seu nome" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} />
            )} />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Data de nascimento (DD/MM/AAAA)</Text>
            <Controller control={control} name="birthDate" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.birthDate && styles.inputError]} placeholder="01/01/2000" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} keyboardType="numeric" maxLength={10} />
            )} />
          </View>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <Controller control={control} name="weight" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, errors.weight && styles.inputError]} placeholder="72" keyboardType="numeric" value={value} onChangeText={onChange} />
              )} />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Altura (cm)</Text>
              <Controller control={control} name="height" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, errors.height && styles.inputError]} placeholder="175" keyboardType="numeric" value={value} onChangeText={onChange} />
              )} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gênero</Text>
          <Controller control={control} name="sex" render={({ field: { onChange, value } }) => (
            <View style={styles.pills}>
              {SEX_OPTIONS.map(opt => (
                <TouchableOpacity key={opt} style={[styles.pill, value === opt && styles.pillActive]} onPress={() => onChange(opt)}>
                  <Text style={[styles.pillText, value === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivo</Text>
          <Controller control={control} name="mainGoal" render={({ field: { onChange, value } }) => (
            <View>
              {GOAL_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.value} style={[styles.goalCard, value === opt.value && {borderColor: opt.color, borderWidth: 2}]} onPress={() => onChange(opt.value)}>
                  <Text style={styles.goalEmoji}>{opt.emoji}</Text>
                  <Text style={styles.goalLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.continueText}>Finalizar Cadastro →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 24, color: Colors.dark.text },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.dark.text },
  headerStep: { fontSize: 12, color: Colors.dark.textSecondary },
  progressBar: { height: 4, backgroundColor: Colors.dark.border, marginHorizontal: 24, borderRadius: 2 },
  progressFill: { height: 4, width: '100%', backgroundColor: Colors.home, borderRadius: 2 },
  scroll: { flex: 1, paddingHorizontal: 24 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.dark.text, marginBottom: 16 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: Colors.dark.textSecondary, marginBottom: 8 },
  input: { backgroundColor: Colors.dark.surface, borderRadius: 12, padding: 14, color: Colors.dark.text, borderWidth: 1, borderColor: Colors.dark.border },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.border, paddingHorizontal: 12 },
  inputFlex: { flex: 1, paddingVertical: 14, color: Colors.dark.text },
  inputError: { borderColor: Colors.error },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4 },
  eyeIcon: { fontSize: 18 },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  pills: { flexDirection: 'row', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Colors.dark.surface, borderWidth: 1, borderColor: Colors.dark.border },
  pillActive: { backgroundColor: Colors.home, borderColor: Colors.home },
  pillText: { color: Colors.dark.textSecondary },
  pillTextActive: { color: '#FFF', fontWeight: 'bold' },
  goalCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: Colors.dark.surface, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.dark.border },
  goalEmoji: { fontSize: 24, marginRight: 12 },
  goalLabel: { color: Colors.dark.text, fontWeight: '600' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: Colors.dark.border },
  continueButton: { backgroundColor: Colors.home, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});