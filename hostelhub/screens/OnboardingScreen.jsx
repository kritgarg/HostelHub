import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
export default function OnboardingScreen({ navigation }) {
  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("MainApp"); 
  };

  return (
    <Onboarding
      onSkip={finishOnboarding}
      onDone={finishOnboarding}
      pages={[
        {
          backgroundColor: "#ffffff",
          image: <Image source={require('../assets/pic1.png')} style={{width:300,height:400 ,marginBottom:-70}} />,
          title: "Welcome to HostelHub",
          subtitle: "Your all-in-one app for hostel life.",
        },
        {
          backgroundColor: "#ffffff",
          image: <Image source={require('../assets/pic2.png')} style={{width:300,height:400 ,marginBottom:-100}} />,
          title: "Get Started",
          subtitle: " Marketplace & Services — all in one place!",
        },
      ]}
    />
  );
}
