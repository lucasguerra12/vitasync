import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import  DashboardScreen  from '../modules/home/screens/DashboardScreen';
import { NutriLensScreen } from '../modules/nutrilens/screens/NutriLensScreen';

// Ecrãs "Temporários" (Placeholders para as próximas etapas)
const FitTrackScreen = () => (
  <View style={styles.placeholder}><Text style={styles.placeholderText}>💪 FitTrack (Em Breve)</Text></View>
);
const MindZenScreen = () => (
  <View style={styles.placeholder}><Text style={styles.placeholderText}>🧘 MindZen (Em Breve)</Text></View>
);
const HealthPactScreen = () => (
  <View style={styles.placeholder}><Text style={styles.placeholderText}>🤝 HealthPact (Sprint 3)</Text></View>
);

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopWidth: 1,
          borderTopColor: '#334155',
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' }
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="grid-view" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="NutriLens"
        component={NutriLensScreen}
        options={{
          tabBarLabel: 'NutriLens',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="eco" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FitTrack"
        component={FitTrackScreen}
        options={{
          tabBarLabel: 'FitTrack',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="fitness-center" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MindZen"
        component={MindZenScreen}
        options={{
          tabBarLabel: 'MindZen',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="self-improvement" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="HealthPact"
        component={HealthPactScreen}
        options={{
          tabBarLabel: 'HealthPact',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="groups" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#94A3B8', fontSize: 20, fontWeight: 'bold' }
});