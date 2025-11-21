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
import MarketplaceScreen from "../screens/Student/MarketplaceScreen";
import LostFoundScreen from "../screens/Student/LostFoundScreen";
import UserRolesManageScreen from "../screens/Warden/UserRolesManageScreen";
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
      <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
      <Stack.Screen name="LostFound" component={LostFoundScreen} />
      <Stack.Screen name="UserRoles" component={UserRolesManageScreen} />
    </Stack.Navigator>
  );
}

export default function WardenNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          height: 63,
          borderRadius: 28,
          backgroundColor: "#ede7c4ff",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          paddingBottom: 8,
          paddingTop: 8,
          width: "80%",
          alignSelf: "center",
          marginHorizontal: 40,
          paddingHorizontal: 0,
          
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "WardenHome";
          const hide = routeName !== "WardenHome";
          return {
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
            ),
            tabBarStyle: [
              {
                position: "absolute",
                bottom: 30,
                height: 63,
                borderRadius: 28,
                backgroundColor: "#ede7c4ff",
                borderTopWidth: 0,
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                paddingBottom: 8,
                paddingTop: 8,
                width: "80%",
                alignSelf: "center",
                marginHorizontal: 40,
                paddingHorizontal: 0,
              },
              hide ? { display: "none" } : null,
            ],
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={WardenProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
