import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { Colors, Typography } from "../constants";

const Stack = createStackNavigator();

function OnboardingWelcome() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: Colors.dark.background 
    }}>
      <Text style={{ 
        color: Colors.dark.text,
        fontSize: Typography.sizes.lg,
        fontFamily: Typography.fonts.display,
      }}>
        Onboarding Welcome Screen
      </Text>
    </View>
  );
}

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
    </Stack.Navigator>
  );
}