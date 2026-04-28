import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';

import MainTabs from './MainTabs';
import OnboardingStack from './OnboardingStack';
import { AddFoodScreen } from '../modules/nutrilens/screens/AddFoodScreen';
import CameraScreen from '../modules/nutrilens/screens/CameraScreen'; // <-- 1. Importe aqui

const Stack = createStackNavigator();

export default function Navigation() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AddFood" component={AddFoodScreen} options={{ presentation: 'modal' }} />
            {/* 2. Adicione a Câmera de volta aqui! */}
            <Stack.Screen name="Camera" component={CameraScreen} options={{ presentation: 'modal' }} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}