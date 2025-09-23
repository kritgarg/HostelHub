import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import LostandFound from './screens/Landf';
import Qraccess from './screens/Qr';
import Profile from './screens/Profile';
import Services from './screens/Services';
import Marketplace from './screens/Marketplace';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Lost and Found" component={LostandFound} />
            <Tab.Screen name="Marketplace" component={Marketplace} />
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Services" component={Services} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}