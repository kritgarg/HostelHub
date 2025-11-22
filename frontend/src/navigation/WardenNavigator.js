import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WardenHomeScreen from "../screens/Warden/WardenHomeScreen";
import WardenProfileScreen from "../screens/Warden/WardenProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import PendingLeavesScreen from "../screens/Warden/PendingLeavesScreen";
import ManageComplaintsScreen from "../screens/Warden/ManageComplaintsScreen";
import MessMenuManageScreen from "../screens/Warden/MessMenuManageScreen";
import PollsManageScreen from "../screens/Warden/PollsManageScreen";
import WardenNotificationsScreen from "../screens/Warden/WardenNotificationsScreen";
import WardenMarketplaceScreen from "../screens/Warden/WardenMarketplaceScreen";
import WardenLostFoundScreen from "../screens/Warden/WardenLostFoundScreen";
import UserRolesManageScreen from "../screens/Warden/UserRolesManageScreen";
import { View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WardenHome" component={WardenHomeScreen} />
      <Stack.Screen name="PendingLeaves" component={PendingLeavesScreen} />
      <Stack.Screen name="Complaints" component={ManageComplaintsScreen} />
      <Stack.Screen name="MessMenu" component={MessMenuManageScreen} />
      <Stack.Screen name="Polls" component={PollsManageScreen} />
      <Stack.Screen name="Notifications" component={WardenNotificationsScreen} />
      <Stack.Screen name="Marketplace" component={WardenMarketplaceScreen} />
      <Stack.Screen name="LostFound" component={WardenLostFoundScreen} />
      <Stack.Screen name="UserRoles" component={UserRolesManageScreen} />
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
    backgroundColor: "#f5cf6a", 
    shadowColor: "#f5cf6a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default function WardenNavigator() {
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
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "WardenHome";
          const hide = routeName !== "WardenHome";
          return {
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? "#111" : "#aaa"} />
              </View>
            ),
            tabBarStyle: [styles.tabBar, hide ? { display: "none" } : null],
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={WardenProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={focused ? "#111" : "#aaa"} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
