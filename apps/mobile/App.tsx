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
import { loginSuccess } from './src/store/slices/authSlice';
import { setProfile } from './src/store/slices/profileSlice';
import { supabase } from './src/services/supabase';
import { database } from './src/database';
import Profile from './src/database/models/Profile';

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
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profilesCollection = database.collections.get<Profile>('profiles');
          const profiles = await profilesCollection.query().fetch();

          if (profiles.length > 0) {
            const p = profiles[0];
            dispatch(setProfile({
              name: p.name,
              birthDate: '', 
              weightKg: p.weight,
              heightCm: p.height,
              sex: p.gender as any,
              activityLevel: p.activityLevel as any,
              mainGoal: p.goal as any,
              dailyCalorieGoal: 2100 
            }));
          }
          dispatch(loginSuccess({
            userId: session.user.id,
            email: session.user.email || ''
          }));
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
      } finally {
        setIsRestoringSession(false);
      }
    };

    restoreSession();
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