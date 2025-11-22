import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

export default function StudentNavigator() {
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
        component={StudentStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "StudentHome";
          const hide = routeName !== "StudentHome";
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
        component={StudentProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
