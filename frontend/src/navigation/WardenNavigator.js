import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WardenHomeScreen from "../screens/Warden/WardenHomeScreen";
import PendingLeavesScreen from "../screens/Warden/PendingLeavesScreen";
import ManageComplaintsScreen from "../screens/Warden/ManageComplaintsScreen";

const Tab = createBottomTabNavigator();

export default function WardenNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={WardenHomeScreen} />
      <Tab.Screen name="Pending Leaves" component={PendingLeavesScreen} />
      <Tab.Screen name="Complaints" component={ManageComplaintsScreen} />
    </Tab.Navigator>
  );
}
