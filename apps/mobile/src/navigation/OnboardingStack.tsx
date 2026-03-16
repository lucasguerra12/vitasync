import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import OnboardingScreen from '../modules/home/screens/OnboardingScreen';
import ProfileSetupScreen from '../modules/home/screens/ProfileSetupScreen';
import LoginScreen from '../modules/home/screens/LoginScreen';

const Stack = createStackNavigator();

function OnboardingWrapper() {
  const navigation = useNavigation<any>();
  return (
    <OnboardingScreen onFinish={() => navigation.navigate('Login')} />
  );
}

function LoginWrapper() {
  const navigation = useNavigation<any>();
  return (
    <LoginScreen
      onLogin={() => {}}
      onCreateAccount={() => navigation.navigate('ProfileSetup')}
    />
  );
}

function ProfileSetupWrapper() {
  const navigation = useNavigation<any>();
  return (
    <ProfileSetupScreen
      onContinue={() => {}}
      onBack={() => navigation.goBack()}
    />
  );
}

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWrapper} />
      <Stack.Screen name="Login" component={LoginWrapper} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupWrapper} />
    </Stack.Navigator>
  );
}