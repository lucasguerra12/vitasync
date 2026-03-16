import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import MainTabs from './MainTabs';
import OnboardingStack from './OnboardingStack';

const Stack = createStackNavigator();

export default function Navigation() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}