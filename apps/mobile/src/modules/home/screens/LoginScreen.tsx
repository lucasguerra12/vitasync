import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, SafeAreaView, ScrollView, Alert
} from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../../../store/slices/authSlice';

// Importações do WatermelonDB
import { database } from '../../../database';
import Profile from '../../../database/models/Profile';

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

  // MÁGICA 1: Testando o Banco Offline na hora do Login
  const createOfflineSession = async (userEmail: string) => {
    try {
      await database.write(async () => {
        const profilesCollection = database.collections.get<Profile>('profiles');

        // 1. Busca todas as sessões antigas que ficaram "presas" no celular
        const oldProfiles = await profilesCollection.query().fetch();
        
        // 2. Apaga todas permanentemente (Limpando o banco)
        for (const profile of oldProfiles) {
          await profile.destroyPermanently();
        }

        // 3. Salva a nova sessão limpinha
        await profilesCollection.create((profile: any) => {
          profile.name = 'Usuário Teste';
          profile.age = 25;
          profile.weight = 70;
          profile.height = 1.75;
          profile.gender = 'M';
          profile.activityLevel = 'Ativo';
          profile.goal = 'Saúde';
        });
      });

      // Lê o banco para confirmar
      const allProfiles = await database.collections.get<Profile>('profiles').query().fetch();
      
      // O Alerta agora vai mostrar sempre "1 perfil(is) salvo(s)"
      Alert.alert(
        "Sessão Offline Criada! 💾", 
        `Bem-vindo, ${userEmail}.\nTemos ${allProfiles.length} perfil(is) salvo(s) no WatermelonDB sem internet!`
      );
      
    } catch (error) {
      console.error('❌ Erro no WatermelonDB:', error);
      Alert.alert('Erro', 'Falha ao salvar sessão offline.');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha o email e a senha para entrar.');
      return;
    }
    
    // Grava no banco, muda o Redux e entra no app
    await createOfflineSession(email);
    dispatch(loginSuccess({ userId: '1', email }));
    onLogin();
  };

  // MÁGICA 2: O Leitor Biométrico
  const handleBiometrics = async () => {
    // 1. O celular tem o hardware? (Leitor de digital ou câmera FaceID)
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    // 2. O usuário cadastrou o dedo/rosto nas configurações do celular?
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert('Aviso', 'Biometria não disponível ou não configurada neste dispositivo.');
      return;
    }

    // 3. Sobe o Modal nativo do Android/iOS pedindo a digital
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Acesse o VitaSync com sua digital',
      fallbackLabel: 'Usar PIN/Senha',
      disableDeviceFallback: false, // Permite que o usuário use o PIN do celular se a digital falhar
    });

    if (result.success) {
      const bioEmail = 'biometria@vitasync.app';
      await createOfflineSession(bioEmail);
      dispatch(loginSuccess({ userId: '1', email: bioEmail }));
      onLogin();
    } else {
      console.log('Usuário cancelou a biometria.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>✓</Text>
          </View>
          <Text style={styles.logoText}>VitaSync</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'signin' && styles.tabActive]}
            onPress={() => setActiveTab('signin')}
          >
            <Text style={[styles.tabText, activeTab === 'signin' && styles.tabTextActive]}>
              Entrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'create' && styles.tabActive]}
            onPress={() => { setActiveTab('create'); onCreateAccount(); }}
          >
            <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <View style={styles.form}>

          {/* Email */}
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
              />
            </View>
          </View>

          {/* Senha */}
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
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Esqueci a senha */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueci minha senha?</Text>
          </TouchableOpacity>

          {/* Botão principal */}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInText}>Entrar</Text>
          </TouchableOpacity>

        </View>

        {/* Divisor */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU CONTINUE COM</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botões sociais */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>A</Text>
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Biometria */}
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometrics}>
          <View style={styles.biometricIcon}>
            <Text style={styles.biometricEmoji}>🫆</Text>
          </View>
          <Text style={styles.biometricText}>Usar biometria</Text>
        </TouchableOpacity>

        {/* Termos */}
        <Text style={styles.terms}>
          Ao entrar, você concorda com nossos{' '}
          <Text style={styles.termsLink}>Termos de Uso</Text>
          {' '}e{' '}
          <Text style={styles.termsLink}>Política de Privacidade</Text>
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundAlt,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoArea: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    gap: 12,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.home,
  },
  logoEmoji: {
    fontSize: 28,
    color: Colors.home,
  },
  logoText: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.home,
  },
  tabText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
  },
  tabTextActive: {
    color: Colors.home,
    fontWeight: Typography.weights.semibold,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    paddingLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    gap: 12,
  },
  inputIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: Colors.dark.text,
    fontFamily: Typography.fonts.body,
    fontSize: Typography.sizes.base,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.home,
  },
  signInButton: {
    backgroundColor: Colors.home,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signInText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.bold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingVertical: 14,
  },
  socialIcon: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    fontFamily: Typography.fonts.body,
  },
  socialText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.medium,
    color: Colors.dark.text,
  },
  biometricButton: {
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  biometricIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  biometricEmoji: {
    fontSize: 28,
  },
  biometricText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    color: Colors.home,
    fontWeight: Typography.weights.medium,
  },
  terms: {
    textAlign: 'center',
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    marginTop: 24,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.home,
  },
});