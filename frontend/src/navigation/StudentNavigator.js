import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import StudentHomeScreen from "../screens/Student/StudentHomeScreen";
import ApplyLeaveScreen from "../screens/Student/ApplyLeaveScreen";
import MyLeavesScreen from "../screens/Student/MyLeavesScreen";
import ComplaintsScreen from "../screens/Student/ComplaintsScreen";
import StudentProfileScreen from "../screens/Student/StudentProfileScreen";
import PollsScreen from "../screens/Student/PollsScreen";
import MessMenuScreen from "../screens/Student/MessMenuScreen";
import MarketplaceScreen from "../screens/Student/MarketplaceScreen";
import LostFoundScreen from "../screens/Student/LostFoundScreen";
import NoticesScreen from "../screens/Student/NoticesScreen";
import ComingSoonScreen from "../screens/Student/ComingSoonScreen";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StudentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
      <Stack.Screen name="Apply Leave" component={ApplyLeaveScreen} />
      <Stack.Screen name="My Leaves" component={MyLeavesScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="Polls" component={PollsScreen} />
      <Stack.Screen name="MessMenu" component={MessMenuScreen} />
      <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
      <Stack.Screen name="LostFound" component={LostFoundScreen} />
      <Stack.Screen name="Notices" component={NoticesScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 24,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: "80%",
    alignSelf: "center",
    marginHorizontal: "10%",
    paddingBottom: 0,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    backgroundColor: "#8fb3ff", 
    shadowColor: "#8fb3ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default function StudentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={StudentStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "StudentHome";
          const hide = routeName !== "StudentHome";
          return {
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? "#fff" : "#aaa"} />
              </View>
            ),
            tabBarStyle: [styles.tabBar, hide ? { display: "none" } : null],
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StudentProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={focused ? "#fff" : "#aaa"} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
