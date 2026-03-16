import { createStackNavigator } from "@react-navigation/stack";
import { View , Text } from "react-native";

const Stack = createStackNavigator();

function OnboardingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Onboarding Screen</Text>
    </View>
  );
}

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
