import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import StudentNavigator from "./StudentNavigator";
import WardenNavigator from "./WardenNavigator";

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) return <AuthNavigator />;

  if (user.role === "WARDEN") return <WardenNavigator />;
  else return <StudentNavigator />;
}
