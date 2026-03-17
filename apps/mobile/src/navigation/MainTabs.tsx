import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { Colors, Typography } from '../constants';
import DashboardScreen from '../modules/home/screens/DashboardScreen';
import IMCScreen from '../modules/home/screens/IMCScreen'
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function NutriLensScreen() { return null; }
function FitTrackScreen() { return null; }
function MindZenScreen() { return null; }
function HealthPactScreen() { return null; }

function DashboardWrapper() {
  const navigation = useNavigation<any>();
  return <DashboardScreen onOpenIMC={() => navigation.navigate('IMC')} />;
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={DashboardWrapper} />
      <HomeStack.Screen name="IMC" component={() => {
        const navigation = useNavigation<any>();
        return <IMCScreen onBack={() => navigation.goBack()} />;
      }} />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopColor: Colors.dark.border,
          height: 64,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: Colors.home,
        tabBarInactiveTintColor: Colors.dark.textSecondary,
        tabBarLabelStyle: {
          fontSize: Typography.sizes.xs,
          fontFamily: Typography.fonts.body,
          fontWeight: Typography.weights.medium,
        },
        tabBarIcon: ({ color }) => {
          const icons: Record<string, string> = {
            Home: '🏠',
            NutriLens: '🥗',
            FitTrack: '💪',
            MindZen: '🧘',
            HealthPact: '👥',
          };
          return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Início' }} />
      <Tab.Screen name="NutriLens" component={NutriLensScreen} options={{ title: 'NutriLens' }} />
      <Tab.Screen name="FitTrack" component={FitTrackScreen} options={{ title: 'FitTrack' }} />
      <Tab.Screen name="MindZen" component={MindZenScreen} options={{ title: 'MindZen' }} />
      <Tab.Screen name="HealthPact" component={HealthPactScreen} options={{ title: 'HealthPact' }} />
    </Tab.Navigator>
  );
}