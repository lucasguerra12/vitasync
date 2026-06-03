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
import { ActiveRunScreen } from '../modules/fittrack/screens/ActiveRunScreen';
import { ParksScreen } from '../modules/fittrack/screens/ParksScreen';
import { ExerciseMenuScreen } from '../modules/fittrack/screens/ExerciseMenuScreen';
import { ExerciseDetailScreen } from '../modules/fittrack/screens/ExerciseDetailScreen';
import { ExerciseDiaryScreen } from '../modules/fittrack/screens/ExerciseDiaryScreen';

// Definir a tipagem básica das rotas principais para ajudar a evitar erros no futuro
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Camera: undefined;
  AddFood: undefined;
  RecipeSuggestions: undefined;
  NutritionDiary: undefined;
  ActiveRunScreen: undefined; // Nome exato da nossa nova tela
  ParksScreen: undefined; // Nome exato da nossa nova tela
  ExerciseMenuScreen: undefined; // Nome exato da nossa nova tela
  ExerciseDetailScreen: undefined; // Nome exato da nossa nova tela
  ExerciseDiaryScreen: undefined; // Nome exato da nossa nova tela
};

const Stack = createStackNavigator<RootStackParamList>();

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
            <Stack.Screen name="ActiveRunScreen" component={ActiveRunScreen} />
            <Stack.Screen name="ParksScreen" component={ParksScreen} />
            <Stack.Screen name="ExerciseMenuScreen" component={ExerciseMenuScreen} />
            <Stack.Screen name="ExerciseDetailScreen" component={ExerciseDetailScreen} />
            <Stack.Screen name="ExerciseDiaryScreen" component={ExerciseDiaryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}