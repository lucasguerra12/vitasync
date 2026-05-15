import { Provider } from 'react-redux';
import { store } from './src/store';
import Navigation from './src/navigation';
import { useFonts } from 'expo-font';
import { PublicSans_400Regular, PublicSans_500Medium, PublicSans_600SemiBold, PublicSans_700Bold } from '@expo-google-fonts/public-sans';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { View, ActivityIndicator } from 'react-native';
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

  useLightSensor();
  useStepCounter();

  useEffect(() => {
    // 1. Função para carregar o perfil completo do banco
    const loadUserProfile = async (session: any) => {
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
            dailyCalorieGoal: dailyKcal // Agora é dinâmico!
          }));

          dispatch(loginSuccess({
            userId: session.user.id,
            email: session.user.email || ''
          }));
        } else {
          // Se logou mas não tem perfil, desloga por segurança (Rollback prático)
          await supabase.auth.signOut();
          dispatch(logout());
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    // 2. Restaura a sessão ao abrir o App
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserProfile(session).finally(() => setIsRestoringSession(false));
      } else {
        setIsRestoringSession(false);
      }
    });

    // 3. Listener Global (Escuta logins e logouts em tempo real)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserProfile(session);
      } else {
        dispatch(logout());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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