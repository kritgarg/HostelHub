import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import AuthProvider from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import OnboardingScreen from "./src/screens/Auth/OnboardingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const check = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setShowOnboarding(seen !== "true");
      setLoading(false);
    };
    check();
  }, []);

  const finish = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      console.log("Onboarding completed and saved to AsyncStorage");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={finish} />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
