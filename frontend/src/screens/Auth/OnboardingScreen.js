import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ onComplete }) {

  const finishOnboarding = () => {
    if (onComplete) onComplete();
  };

  const NextButton = ({ ...props }) => (
    <TouchableOpacity
      style={styles.button}
      {...props}
      activeOpacity={0.8}
    >
      <Ionicons name="arrow-forward" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const SkipButton = ({ ...props }) => (
    <TouchableOpacity
      style={styles.skipButton}
      {...props}
      activeOpacity={0.8}
    >
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  );

  const DoneButton = ({ ...props }) => (
    <TouchableOpacity
      style={styles.doneButton}
      {...props}
      activeOpacity={0.8}
    >
      <Text style={styles.doneText}>Get Started</Text>
      <Ionicons name="rocket-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
    </TouchableOpacity>
  );

  const Square = ({ isLight, selected }) => {
    let backgroundColor;
    if (isLight) {
      backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";
    } else {
      backgroundColor = selected ? "#fff" : "rgba(255, 255, 255, 0.5)";
    }
    return (
      <View
        style={{
          width: selected ? 20 : 8,
          height: 8,
          marginHorizontal: 3,
          backgroundColor,
          borderRadius: 4,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onSkip={finishOnboarding}
        onDone={finishOnboarding}
        DotComponent={Square}
        NextButtonComponent={NextButton}
        SkipButtonComponent={SkipButton}
        DoneButtonComponent={DoneButton}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        imageContainerStyles={styles.imageContainer}
        containerStyles={styles.onboardingContainer}
        bottomBarHeight={80}
        bottomBarHighlight={false}
        transitionAnimationDuration={200}
        pages={[
          {
            backgroundColor: "#d1f7c4", // Greenish tone (Playful Mint)
            image: (
              <View style={[styles.imageWrapper, { backgroundColor: "#e8fadd" }]}>
                <Image
                  source={require("../../../assets/pic1.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            ),
            title: "Welcome to HostelHub",
            subtitle: "Your ultimate companion for a seamless hostel life.",
          },
          {
            backgroundColor: "#ffcc80", // Orange tone (Playful Peach/Orange)
            image: (
              <View style={[styles.imageWrapper, { backgroundColor: "#ffe0b2" }]}>
                <Image
                  source={require("../../../assets/on1.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            ),
            title: "Stay Connected",
            subtitle: "Notices, Polls, and Complaints - all in one place.",
          },
          {
            backgroundColor: "#fff59d", // Yellow tone (Playful Lemon)
            image: (
              <View style={[styles.imageWrapper, { backgroundColor: "#fff9c4" }]}>
                <Image
                  source={require("../../../assets/pic3.png")} 
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            ),
            title: "Easy Living",
            subtitle: "Apply for leaves, check mess menu, and more!",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  onboardingContainer: { paddingBottom: 40 },
  imageContainer: {
    paddingBottom: 20,
  },
  imageWrapper: {
    width: width * 0.85,
    height: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (width * 0.85) / 2,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 26,
  },
  button: {
    marginRight: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    marginLeft: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  doneButton: {
    marginRight: 20,
    flexDirection: "row",
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
  },
  doneText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
