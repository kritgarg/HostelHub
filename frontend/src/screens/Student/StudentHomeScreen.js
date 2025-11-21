import { View, Text, Button } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentHomeScreen() {
  const { logout } = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Student Home Screen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
}
