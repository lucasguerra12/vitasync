import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../modules/home/screens/DashboardScreen';
import { NutriLensScreen } from '../modules/nutrilens/screens/NutriLensScreen';
import { FitTrackDashboardScreen } from '../modules/fittrack/screens/FitTrackDashboardScreen';
import { Colors } from '../constants/colors';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316', 
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#0f172a', 
          borderTopColor: '#1e293b',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="FitTrack" 
        component={FitTrackDashboardScreen} 
        options={{
          tabBarLabel: 'FitTrack',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚡</Text>,
        }}
      />
      <Tab.Screen 
        name="NutriLens" 
        component={NutriLensScreen} 
        options={{
          tabBarLabel: 'NutriLens',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🍎</Text>,
        }}
      />
    </Tab.Navigator>
  );
};