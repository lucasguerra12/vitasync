import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import { setProfile } from '../../../store/slices/profileSlice';
import { AuthService } from '../../../services/authService';
import { calcDailyCalories } from '../../../utils';

interface Props {
  onLogin: () => void;
  onCreateAccount: () => void;
}

export default function LoginScreen({ onLogin, onCreateAccount }: Props) {
  const dispatch = useAppDispatch();
  
  // Estados para gerir os campos e o carregamento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Executa a regra de negócio do Login
   */
  const handleLogin = async () => {
    // Regra de Validação Local Rápida
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    console.log(`✉️ [LOGIN UI] -> Tentando logar com o e-mail: ${email.trim()}`);

    try {
      // 1. Chama o motor de autenticação que criamos no Passo 2
      const response = await AuthService.login(email, password);
      
      const { user, profile } = response;

      // 2. Calcula as calorias diárias dinamicamente com base no perfil real do banco
      const dailyKcal = calcDailyCalories(
        profile.gender,
        profile.weight,
        profile.height,
        profile.age,
        profile.activity_level
      );

      // 3. Atualiza o estado global do Redux com os dados REAIS do banco
      dispatch(setProfile({
        name: profile.name || '',
        birthDate: '', // Pode ser preenchido se necessário posterior
        weightKg: profile.weight || 0,
        heightCm: profile.height || 0,
        sex: profile.gender as any,
        activityLevel: profile.activity_level as any,
        mainGoal: profile.goal as any,
        dailyCalorieGoal: dailyKcal
      }));

      // 4. Despacha o sucesso do login (Isso fará o Navigation mudar de ecrã sozinho!)
      dispatch(loginSuccess({
        userId: user.id,
        email: user.email || ''
      }));

      console.log('✅ [LOGIN UI] -> Redux atualizado. Redirecionando...');
      onLogin();

    } catch (error: any) {
      console.log(`❌ [LOGIN UI] -> Erro capturado: ${error.message}`);
      // Exibe o erro exato retornado pelo serviço (Credenciais falsas param aqui!)
      Alert.alert('Erro de Acesso', error.message || 'Não foi possível efetuar o login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometrics = () => {
    Alert.alert('Biometria', 'Funcionalidade de biometria será mapeada na próxima etapa.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll} 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
      >
        {/* Área do Logótipo baseada no Protótipo */}
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}><Text style={styles.logoEmoji}>✓</Text></View>
          <Text style={styles.logoText}>VitaSync</Text>
        </View>

        {/* Abas de Navegação interna (Entrar / Criar Conta) */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={onCreateAccount}>
            <Text style={styles.tabText}>Criar conta</Text>
          </TouchableOpacity>
        </View>

        {/* Formulário de Inputs */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Endereço de e-mail</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput 
                style={styles.input} 
                placeholder="nome@exemplo.com" 
                placeholderTextColor={Colors.dark.textSecondary} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                editable={!isLoading} 
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput 
                style={styles.input} 
                placeholder="••••••••" 
                placeholderTextColor={Colors.dark.textSecondary} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
                editable={!isLoading} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueceu a sua senha?</Text>
          </TouchableOpacity>

          {/* Botão de Submissão Dinâmico */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleLogin} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.signInText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divisor Visual */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU CONTINUE COM</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botões Sociais do Protótipo */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Biometria do Protótipo */}
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometrics} disabled={isLoading}>
          <View style={styles.biometricIcon}><Text style={styles.biometricEmoji}>🫆</Text></View>
          <Text style={styles.biometricText}>Usar biometria para entrar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundAlt },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  logoArea: { alignItems: 'center', paddingTop: 48, paddingBottom: 32, gap: 12 },
  logoIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.home },
  logoEmoji: { fontSize: 28, color: Colors.home },
  logoText: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.fonts.display, fontWeight: Typography.weights.bold, color: Colors.dark.text },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.dark.border, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.home },
  tabText: { fontSize: Typography.sizes.base, fontFamily: Typography.fonts.body, color: Colors.dark.textSecondary },
  tabTextActive: { color: Colors.home, fontWeight: Typography.weights.semibold },
  form: { gap: 16 },
  inputWrapper: { gap: 6 },
  inputLabel: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.body, color: Colors.dark.textSecondary, paddingLeft: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.border, paddingHorizontal: 16, gap: 12 },
  inputIcon: { fontSize: 18, color: Colors.dark.textSecondary },
  input: { flex: 1, paddingVertical: 16, color: Colors.dark.text, fontFamily: Typography.fonts.body, fontSize: Typography.sizes.base },
  forgotButton: { alignSelf: 'flex-end' },
  forgotText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.body, color: Colors.home },
  signInButton: { backgroundColor: Colors.home, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  signInText: { color: Colors.white, fontSize: Typography.sizes.base, fontFamily: Typography.fonts.body, fontWeight: Typography.weights.bold },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.dark.border },
  dividerText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.body, color: Colors.dark.textSecondary, letterSpacing: 1 },
  socialButtons: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.dark.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.border, paddingVertical: 14 },
  socialText: { fontSize: Typography.sizes.base, fontFamily: Typography.fonts.body, fontWeight: Typography.weights.medium, color: Colors.dark.text },
  biometricButton: { alignItems: 'center', gap: 8, marginTop: 24 },
  biometricIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.dark.border },
  biometricEmoji: { fontSize: 24 },
  biometricText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.body, color: Colors.home, fontWeight: Typography.weights.medium }
});