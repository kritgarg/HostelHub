import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "../screens/OnboardingScreen";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const [loading, setLoading] = useState(true);
  const [seenOnboarding, setSeenOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      if (value === "true") {
        setSeenOnboarding(true);
      }
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  if (loading) return null; // can show splash screen here

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!seenOnboarding && (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
}
