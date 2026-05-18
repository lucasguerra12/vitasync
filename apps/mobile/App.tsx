import { Provider } from 'react-redux';
import { store } from './src/store';
import Navigation from './src/navigation';
import { useFonts } from 'expo-font';
import { PublicSans_400Regular, PublicSans_500Medium, PublicSans_600SemiBold, PublicSans_700Bold } from '@expo-google-fonts/public-sans';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { View, ActivityIndicator, AppState } from 'react-native';
import { Colors } from './src/constants';
import { useLightSensor } from './src/sensors/useLightSensor';
import { useStepCounter } from './src/sensors/useStepCounter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InAppNotification } from './src/components/ui/InAppNotification';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './src/store/hooks';
import { loginSuccess, logout } from './src/store/slices/authSlice';
import { setProfile } from './src/store/slices/profileSlice';
import { supabase } from './src/services/supabase';
import { calcDailyCalories } from './src/utils'; 

function AppContent() {
  const dispatch = useAppDispatch();
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const [fontsLoaded] = useFonts({
    PublicSans: PublicSans_400Regular,
    PublicSans_Medium: PublicSans_500Medium,
    PublicSans_SemiBold: PublicSans_600SemiBold,
    PublicSans_Bold: PublicSans_700Bold,
    DMSans: DMSans_400Regular,
    DMSans_Medium: DMSans_500Medium,
    DMSans_Bold: DMSans_700Bold,
    DMMono: DMMono_400Regular,
    DMMono_Medium: DMMono_500Medium,
  });

  // Ativação dos sensores de hardware nativos
  useLightSensor();
  useStepCounter();

  useEffect(() => {
    /**
     * 🛡️ BLINDAGEM DO DESPERTADOR (AppState)
     * Controla o refresh automático dos tokens quando o ecrã acende ou apaga.
     */
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh();
        console.log("☀️ [APP STATE] -> Aplicativo em foco. Tokens acordados.");
      } else {
        supabase.auth.stopAutoRefresh();
        console.log("🌙 [APP STATE] -> Aplicativo em background. Tokens pausados.");
      }
    });

    /**
     * Busca os dados remotos do utilizador logado para restaurar a sessão do Redux
     */
    const loadUserProfile = async (session: any, isBoot: boolean = false) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          const dailyKcal = calcDailyCalories(
            profile.gender, profile.weight, profile.height, profile.age, profile.activity_level
          );

          dispatch(setProfile({
            name: profile.name || '',
            birthDate: '', 
            weightKg: profile.weight || 0,
            heightCm: profile.height || 0,
            sex: profile.gender as any,
            activityLevel: profile.activity_level as any,
            mainGoal: profile.goal as any,
            dailyCalorieGoal: dailyKcal
          }));

          dispatch(loginSuccess({
            userId: session.user.id,
            email: session.user.email || ''
          }));
        } else if (isBoot) {
          // Só desloga se for um utilizador fantasma na inicialização do app
          await supabase.auth.signOut();
          dispatch(logout());
        }
      } catch (error) {
        console.error("Erro ao carregar perfil persistido:", error);
      }
    };

    // Recupera a sessão guardada no AsyncStorage assim que o app abre
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserProfile(session, true).finally(() => setIsRestoringSession(false));
      } else {
        setIsRestoringSession(false);
      }
    });

    // Escuta global de login/logout em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserProfile(session, false);
      } else {
        dispatch(logout());
      }
    });

    return () => {
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, [dispatch]);

  if (!fontsLoaded || isRestoringSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
        <ActivityIndicator size="large" color={Colors.home} />
      </View>
    );
  }

  return <Navigation />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
      <InAppNotification />
    </SafeAreaProvider>
  );
}