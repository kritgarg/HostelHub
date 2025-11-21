import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProvider from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import OnboardingScreen from "./src/screens/Auth/OnboardingScreen";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
      if (!hasSeen) {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (showOnboarding === null) return null;

  if (showOnboarding) {
    return <OnboardingScreen />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
