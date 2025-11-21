import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }) {
  
  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Login"); // Navigate to Login screen
  };

  // Custom buttons
  const NextButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.nextButton}>
      <Text style={styles.nextButtonText}>NEXT</Text>
    </TouchableOpacity>
  );

  const SkipButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.skipButton}>
      <Text style={styles.skipButtonText}>SKIP</Text>
    </TouchableOpacity>
  );

  const DoneButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.doneButton}>
      <Text style={styles.doneButtonText}>DONE</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Onboarding
        bottomBarHighlight={false}
        onSkip={finishOnboarding}
        onDone={finishOnboarding}
        DoneButtonComponent={DoneButton}
        NextButtonComponent={NextButton}
        SkipButtonComponent={SkipButton}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        imageContainerStyles={styles.imageContainer}
        containerStyles={styles.onboardingContainer}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        bottomBarHeight={100}
        allowFontScalingButtons={false}
        transitionAnimationDuration={400}
        pages={[
          {
            backgroundColor: "#101010",
            image: (
              <Image
                source={require("../../../assets/pic1.png")}
                style={styles.image}
                resizeMode="contain"
              />
            ),
            title: "Welcome to HostelHub",
            subtitle: "Your all-in-one app for hostel life.",
          },
          {
            backgroundColor: "#C1DBAD",
            titleStyles: {
              color: "black",
            },
            subTitleStyles: {
              color: "black",
            },
            image: (
              <Image
                source={require("../../../assets/pic2.png")}
                style={styles.image}
                resizeMode="contain"
              />
            ),
            title: "Get Started",
            subtitle: "Marketplace & Services — all in one place!",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  onboardingContainer: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    paddingBottom: 0,
    marginBottom: 0,
    flex: 1,
    justifyContent: "center",
    paddingTop: 90,
  },
  image: {
    width: width * 0.8,
    height: height * 0.35,
    alignSelf: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 40,
    marginTop: 1,
    color: "#C1DBAD",
  },
  subtitle: {
    fontSize: 20,
    color: "#C1DBAD",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 200,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: "#C1DBAD",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginRight: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  doneButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginRight: 20,
    marginBottom: 20,
  },
  doneButtonText: {
    color: "#C1DBAD",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginLeft: 20,
    marginBottom: 20,
  },
  skipButtonText: {
    color: "#C1DBAD",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  dot: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#7FB069",
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
