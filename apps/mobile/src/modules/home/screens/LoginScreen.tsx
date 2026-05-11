import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import { setProfile } from '../../../store/slices/profileSlice';
import { supabase } from '../../../services/supabase';

interface Props {
  onLogin: () => void;
  onCreateAccount: () => void;
}

export default function LoginScreen({ onLogin, onCreateAccount }: Props) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha o email e a senha para entrar.');
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Falha ao recuperar dados do utilizador.");

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Erro ao buscar perfil:", profileError);
      }

      if (profileData) {
        dispatch(setProfile({
          name: profileData.name || '',
          birthDate: profileData.birth_date || '',
          weightKg: profileData.weight_kg || 0,
          heightCm: profileData.height_cm || 0,
          sex: profileData.sex as any,
          activityLevel: profileData.activity_level as any,
          mainGoal: profileData.main_goal as any,
          dailyCalorieGoal: profileData.daily_calorie_goal || 2100,
        }));
      }

      // 4. Marcar o usuário como logado
      dispatch(loginSuccess({ 
        userId: data.user.id, 
        email: data.user.email || email 
      }));
      
      onLogin();

    } catch (error: any) {
      Alert.alert('Erro de Acesso', error.message || 'Credenciais inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert('Aviso', 'Biometria não disponível ou não configurada neste dispositivo.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Acesse o VitaSync com sua digital',
      fallbackLabel: 'Usar PIN/Senha',
      disableDeviceFallback: false,
    });

    if (result.success) {
      Alert.alert('Sucesso', 'Biometria aceite! Para dados reais, use E-mail e Senha primeiro.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={styles.logoArea}>
          <View style={styles.logoIcon}><Text style={styles.logoEmoji}>✓</Text></View>
          <Text style={styles.logoText}>VitaSync</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, activeTab === 'signin' && styles.tabActive]} onPress={() => setActiveTab('signin')}>
            <Text style={[styles.tabText, activeTab === 'signin' && styles.tabTextActive]}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'create' && styles.tabActive]} onPress={() => { setActiveTab('create'); onCreateAccount(); }}>
            <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>Criar conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Endereço de e-mail</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput style={styles.input} placeholder="nome@exemplo.com" placeholderTextColor={Colors.dark.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.dark.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} editable={!isLoading} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotButton}><Text style={styles.forgotText}>Esqueci minha senha?</Text></TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signInText}>Entrar</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} /><Text style={styles.dividerText}>OU CONTINUE COM</Text><View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}><Text style={styles.socialIcon}>G</Text><Text style={styles.socialText}>Google</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}><Text style={styles.socialIcon}>A</Text><Text style={styles.socialText}>Apple</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometrics} disabled={isLoading}>
          <View style={styles.biometricIcon}><Text style={styles.biometricEmoji}>🫆</Text></View>
          <Text style={styles.biometricText}>Usar biometria</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>Ao entrar, você concorda com nossos <Text style={styles.termsLink}>Termos de Uso</Text> e <Text style={styles.termsLink}>Política de Privacidade</Text></Text>

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
  inputIcon: { fontSize: 18 },
  input: { flex: 1, paddingVertical: 16, color: Colors.dark.text, fontFamily: Typography.fonts.body, fontSize: Typography.sizes.base },
  forgotButton: { alignSelf: 'flex-end' },
  forgotText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.body, color: Colors.home },
  signInButton: { backgroundColor: Colors.home, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  signInText: { color: Colors.white, fontSize: Typography.sizes.base, fontFamily: Typography.fonts.body, fontWeight: Typography.weights.bold },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.dark.border },
  dividerText: { fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.body, color: Colors.dark.textSecondary, letterSpacing: 1 },
  socialButtons: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.dark.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.border, paddingVertical: 14 },
  socialIcon: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.dark.text, fontFamily: Typography.fonts.body },
  socialText: { fontSize: Typography.sizes.base, fontFamily: Typography.fonts.body, fontWeight: Typography.weights.medium, color: Colors.dark.text },
  biometricButton: { alignItems: 'center', gap: 8, marginTop: 24 },
  biometricIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.dark.border },
  biometricEmoji: { fontSize: 28 },
  biometricText: { fontSize: Typography.sizes.sm, fontFamily: Typography.fonts.body, color: Colors.home, fontWeight: Typography.weights.medium },
  terms: { textAlign: 'center', fontSize: Typography.sizes.xs, fontFamily: Typography.fonts.body, color: Colors.dark.textSecondary, marginTop: 24, lineHeight: 20 },
  termsLink: { color: Colors.home }
});