import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StudentHomeScreen from "../screens/Student/StudentHomeScreen";
import ApplyLeaveScreen from "../screens/Student/ApplyLeaveScreen";
import MyLeavesScreen from "../screens/Student/MyLeavesScreen";
import ComplaintsScreen from "../screens/Student/ComplaintsScreen";

const Tab = createBottomTabNavigator();

export default function StudentNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Apply Leave" component={ApplyLeaveScreen} />
      <Tab.Screen name="My Leaves" component={MyLeavesScreen} />
      <Tab.Screen name="Complaints" component={ComplaintsScreen} />
    </Tab.Navigator>
  );
}
