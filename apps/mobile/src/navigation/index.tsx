import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import OnboardingStack from './OnboardingStack';
import { AddFoodScreen } from '../modules/nutrilens/screens/AddFoodScreen';
import CameraScreen from '../modules/nutrilens/screens/CameraScreen';
import { NutritionDiaryScreen } from '../modules/nutrilens/screens/NutritionDiaryScreen';
import { useAppSelector } from '../store/hooks';
import { RecipeSuggestionsScreen } from '../modules/nutrilens/screens/RecipeSuggestionsScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="AddFood" component={AddFoodScreen} />
            <Stack.Screen name="RecipeSuggestions" component={RecipeSuggestionsScreen} />
            <Stack.Screen name="NutritionDiary" component={NutritionDiaryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}