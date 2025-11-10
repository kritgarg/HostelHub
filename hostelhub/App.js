import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator"; 
import DrawerNavigator from "./navigation/DrawerNavigator";

export default function App() {
  return (
    <NavigationContainer>
      {/* <DrawerNavigator /> */}
      <StackNavigator />
    </NavigationContainer>
  );
}
