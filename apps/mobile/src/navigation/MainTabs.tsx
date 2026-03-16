import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// telas temporarias ate criarmos as telas reais
function HomeScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Home</Text></View>;
}
function NutriLensScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>NutriLens</Text></View>;
}
function FitTrackScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>FitTrack</Text></View>;
}
function MindZenScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>MindZen</Text></View>;
}
function HealthPactScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>HealthPact</Text></View>;
}

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="NutriLens" component={NutriLensScreen} />
      <Tab.Screen name="FitTrack" component={FitTrackScreen} />
      <Tab.Screen name="MindZen" component={MindZenScreen} />
      <Tab.Screen name="HealthPact" component={HealthPactScreen} />
    </Tab.Navigator>
  );
}