import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StudentHomeScreen from "../screens/Student/StudentHomeScreen";
import ApplyLeaveScreen from "../screens/Student/ApplyLeaveScreen";
import MyLeavesScreen from "../screens/Student/MyLeavesScreen";
import ComplaintsScreen from "../screens/Student/ComplaintsScreen";
import StudentProfileScreen from "../screens/Student/StudentProfileScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

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
        component={StudentHomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
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
