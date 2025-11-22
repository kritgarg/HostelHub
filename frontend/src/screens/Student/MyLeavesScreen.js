import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ApplyLeaveScreen from "./ApplyLeaveScreen";
import LeavesListScreen from "./LeavesListScreen";

const Tab = createMaterialTopTabNavigator();

export default function MyLeavesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.kicker}>Leaves</Text>
        <Text style={styles.heading}>Track your leave history and apply for new passes</Text>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
            marginHorizontal: 16,
            marginBottom: 8,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#111",
            height: 3,
            borderRadius: 3,
          },
          tabBarLabelStyle: {
            textTransform: "none",
            fontSize: 16,
            fontWeight: "700",
          },
          tabBarActiveTintColor: "#111",
          tabBarInactiveTintColor: "#999",
          tabBarPressColor: "transparent",
        }}
      >
        <Tab.Screen 
          name="Apply" 
          component={ApplyLeaveScreen} 
          options={{ title: "Apply Leave" }}
        />
        <Tab.Screen 
          name="History" 
          component={LeavesListScreen} 
          options={{ title: "Applied Leaves" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const windowWidth = 300; // Approximate for indicator calculation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e7ff",
  },
  hero: {
    backgroundColor: "#e6d0c6",
    margin: 16,
    padding: 20,
    borderRadius: 26,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 46,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  kicker: {
    color: "#111",
    opacity: 0.6,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    lineHeight: 30,
  },
});
