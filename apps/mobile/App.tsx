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

function AppContent() {
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

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
        <ActivityIndicator color={Colors.home} />
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