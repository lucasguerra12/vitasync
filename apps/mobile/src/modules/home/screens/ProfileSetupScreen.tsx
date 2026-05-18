import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, SafeAreaView, Alert, ActivityIndicator 
} from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import { useAppDispatch } from '../../../store/hooks';
import { setProfile } from '../../../store/slices/profileSlice';
import { loginSuccess } from '../../../store/slices/authSlice';
import { calcAge, calcDailyCalories } from '../../../utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 

// 🚨 IMPORTAMOS O NOSSO MOTOR DE AUTENTICAÇÃO LIMPO
import { AuthService } from '../../../services/authService';

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

// Esquema de validação rígido com Zod
const setupFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string(),
  name: z.string().min(2, "O nome é obrigatório"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA"),
  weight: z.string().min(1, "O peso é obrigatório").refine((val: string) => !isNaN(parseFloat(val.replace(',', '.'))) && parseFloat(val.replace(',', '.')) > 0, "Peso inválido"),
  height: z.string().min(1, "A altura é obrigatória").refine((val: string) => !isNaN(parseFloat(val.replace(',', '.'))) && parseFloat(val.replace(',', '.')) > 0, "Altura inválida"),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<SetupFormData>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', name: '', birthDate: '', weight: '', height: '', sex: '', activityLevel: '', mainGoal: '' }
  });

  /**
   * Executa o fluxo de envio dos dados para o AuthService
   */
  const onSubmit = async (data: SetupFormData) => {
    setIsSubmitting(true);
    console.log("📱 [REGISTRO UI] -> Formulário validado. Tratando dados...");

    try {
      // 1. Cálculos matemáticos locais de saúde
      const age = calcAge(data.birthDate) || 0; 
      const parsedWeight = parseFloat(data.weight.replace(',', '.')); 
      const parsedHeight = parseFloat(data.height.replace(',', '.'));
      const dailyCalorieGoal = calcDailyCalories(data.sex as any, parsedWeight, parsedHeight, age, data.activityLevel as any);
      const dbGender = data.sex === 'Masculino' ? 'male' : data.sex === 'Feminino' ? 'female' : 'other';

      // 2. Monta o payload padronizado que o banco espera
      const profilePayload = {
        email: data.email.trim(),
        password: data.password,
        name: data.name,
        age,
        gender: dbGender,
        weight: parsedWeight,
        height: parsedHeight,
        activityLevel: data.activityLevel,
        mainGoal: data.mainGoal,
        dailyCalorieGoal: Math.round(dailyCalorieGoal)
      };

      // 3. Dispara o motor de registro único
      const result = await AuthService.register(profilePayload);

      console.log("📱 [REGISTRO UI] -> Resposta de sucesso do AuthService recebida. Sincronizando Redux...");

      // 4. Se a gravação no banco deu certo, atualizamos o Redux local do telemóvel
      dispatch(setProfile({
        name: profilePayload.name,
        birthDate: data.birthDate,
        weightKg: profilePayload.weight,
        heightCm: profilePayload.height,
        sex: profilePayload.gender as any,
        activityLevel: profilePayload.activityLevel as any,
        mainGoal: profilePayload.mainGoal as any,
        dailyCalorieGoal: profilePayload.dailyCalorieGoal
      }));

      // 5. Autentica localmente no Redux para o app saber que estamos logados
      dispatch(loginSuccess({ userId: result.user.id, email: profilePayload.email }));
      
      Alert.alert("Sucesso!", "A sua conta foi criada com sucesso!");
      onContinue();

    } catch (error: any) {
      console.log("📱 [REGISTRO UI] -> Capturado erro no fluxo: " + error.message);
      Alert.alert('Erro no Cadastro', error.message || 'Ocorreu um erro ao criar a sua conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFormError = () => {
    Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios corretamente.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={isSubmitting}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Criar sua conta</Text>
          <Text style={styles.headerStep}>Passo 1 de 2</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressBar}><View style={styles.progressFill} /></View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* SECÇÃO: ACESSO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso à conta</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="nome@exemplo.com" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} autoCapitalize="none" editable={!isSubmitting} />
            )} />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <TextInput style={styles.inputFlex} placeholder="mínimo 8 caracteres" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} secureTextEntry={!showPassword} editable={!isSubmitting} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text></TouchableOpacity>
              </View>
            )} />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirmar senha</Text>
            <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.confirmPassword && styles.inputError]} placeholder="repita a senha" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} secureTextEntry={!showPassword} editable={!isSubmitting} />
            )} />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>
        </View>

        {/* SECÇÃO: DADOS PESSOAIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Seu nome" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} editable={!isSubmitting} />
            )} />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Data de nascimento (DD/MM/AAAA)</Text>
            <Controller control={control} name="birthDate" render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, errors.birthDate && styles.inputError]} placeholder="01/01/2000" placeholderTextColor={Colors.dark.textSecondary} value={value} onChangeText={onChange} keyboardType="numeric" maxLength={10} editable={!isSubmitting} />
            )} />
            {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate.message}</Text>}
          </View>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <Controller control={control} name="weight" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, errors.weight && styles.inputError]} placeholder="72" keyboardType="numeric" value={value} onChangeText={onChange} editable={!isSubmitting} />
              )} />
              {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Altura (cm)</Text>
              <Controller control={control} name="height" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, errors.height && styles.inputError]} placeholder="175" keyboardType="numeric" value={value} onChangeText={onChange} editable={!isSubmitting} />
              )} />
              {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}
            </View>
          </View>
        </View>

        {/* SECÇÃO: GÊNERO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gênero</Text>
          <Controller control={control} name="sex" render={({ field: { onChange, value } }) => (
            <View style={styles.pills}>
              {SEX_OPTIONS.map(opt => (
                <TouchableOpacity key={opt} style={[styles.pill, value === opt && styles.pillActive]} onPress={() => onChange(opt)} disabled={isSubmitting}>
                  <Text style={[styles.pillText, value === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )} />
          {errors.sex && <Text style={styles.errorText}>{errors.sex.message}</Text>}
        </View>

        {/* SECÇÃO: NÍVEL DE ATIVIDADE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nível de Atividade</Text>
          <Controller control={control} name="activityLevel" render={({ field: { onChange, value } }) => (
            <View style={{ gap: 8 }}>
              {ACTIVITY_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.value} style={[styles.goalCard, value === opt.value && {borderColor: Colors.home, borderWidth: 2}]} onPress={() => onChange(opt.value)} disabled={isSubmitting}>
                  <View>
                    <Text style={[styles.goalLabel, value === opt.value && { color: Colors.home }]}>{opt.label}</Text>
                    <Text style={{ fontSize: 12, color: Colors.dark.textSecondary, marginTop: 4 }}>{opt.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )} />
          {errors.activityLevel && <Text style={styles.errorText}>{errors.activityLevel.message}</Text>}
        </View>

        {/* SECÇÃO: OBJETIVO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivo</Text>
          <Controller control={control} name="mainGoal" render={({ field: { onChange, value } }) => (
            <View>
              {GOAL_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.value} style={[styles.goalCard, value === opt.value && {borderColor: opt.color, borderWidth: 2}]} onPress={() => onChange(opt.value)} disabled={isSubmitting}>
                  <Text style={styles.goalEmoji}>{opt.emoji}</Text>
                  <Text style={styles.goalLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )} />
          {errors.mainGoal && <Text style={styles.errorText}>{errors.mainGoal.message}</Text>}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit(onSubmit, onFormError)} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.continueText}>Finalizar Cadastro →</Text>}
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