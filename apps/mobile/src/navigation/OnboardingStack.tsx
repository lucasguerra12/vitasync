import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../modules/home/screens/OnboardingScreen';

const Stack = createStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="OnboardingWelcome"
        component={() => (
          <OnboardingScreen onFinish={() => console.log('Onboarding finalizado!')} />
        )}
      />
    </Stack.Navigator>
  );
}