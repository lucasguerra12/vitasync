import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabs from './MainTabs';
import OnboardingStack from './OnboardingStack';
import { AddFoodScreen } from '../modules/nutrilens/screens/AddFoodScreen';
import CameraScreen from '../modules/nutrilens/screens/CameraScreen';
import { NutritionDiaryScreen } from '../modules/nutrilens/screens/NutritionDiaryScreen';
import { useAppSelector } from '../store/hooks';

const Stack = createStackNavigator();

export default function Navigation() {
  const profile = useAppSelector((state) => state.profile);
  const isFirstTime = !profile.name; 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstTime ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="AddFood" component={AddFoodScreen} />
            
            <Stack.Screen 
              name="NutritionDiary" 
              component={NutritionDiaryScreen} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}