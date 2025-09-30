import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import LostandFound from "../screens/Landf";
import Marketplace from "../screens/Marketplace";
import Profile from "../screens/Profile";
import Services from "../screens/Services";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case "HostelHub":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Lost and Found":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Marketplace":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Services":
              iconName = focused ? "construct" : "construct-outline";
              break;
            default:
              iconName = "ellipse";
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: "#0a84ff",
        tabBarInactiveTintColor: "#8e8e93",
      })}
    >
      <Tab.Screen name="HostelHub" component={Home} />
      <Tab.Screen name="Lost and Found" component={LostandFound} />
      <Tab.Screen name="Marketplace" component={Marketplace} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Services" component={Services} />
    </Tab.Navigator>
  );
}
