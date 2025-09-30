// import 'react-native-gesture-handler';
// import React from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import Home from './screens/Home';
// import LostandFound from './screens/Landf';
// import Profile from './screens/Profile';
// import Services from './screens/Services';
// import Marketplace from './screens/Marketplace';
// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <Tab.Navigator
//             screenOptions={({ route }) => ({
//               headerShown: false,
//               tabBarShowLabel: true,
//               tabBarIcon: ({ focused, color, size }) => {
//                 let iconName;
//                 switch (route.name) {
//                   case 'HostelHub':
//                     iconName = focused ? 'home' : 'home-outline';
//                     break;
//                   case 'Lost and Found':
//                     iconName = focused ? 'search' : 'search-outline';
//                     break;
//                   case 'Marketplace':
//                     iconName = focused ? 'cart' : 'cart-outline';
//                     break;
//                   case 'Profile':
//                     iconName = focused ? 'person' : 'person-outline';
//                     break;
//                   case 'Services':
//                     iconName = focused ? 'construct' : 'construct-outline';
//                     break;

//                   default:
//                     iconName = 'ellipse';
//                 }
//                 return <Ionicons name={iconName} size={22} color={color} />;
//               },
//               tabBarActiveTintColor: '#0a84ff',
//               tabBarInactiveTintColor: '#8e8e93',
//               tabBarStyle: {
//                 height: 70,
//                 paddingVertical: 10,
//               },
              
//               tabBarItemStyle: {
//                 paddingVertical: 4,
//               },
//             })}
//           >
//             <Tab.Screen name="HostelHub" component={Home} />
//             <Tab.Screen name="Lost and Found" component={LostandFound} />
//             <Tab.Screen name="Marketplace" component={Marketplace} />
//             <Tab.Screen name="Profile" component={Profile} />
//             <Tab.Screen name="Services" component={Services} />
//           </Tab.Navigator>
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }


import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";  // ✅ FIX

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
