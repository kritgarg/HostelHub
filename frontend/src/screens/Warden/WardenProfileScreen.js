import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { getAvatarUrl } from "../../api/api";

export default function WardenProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [firstName = "", lastName = ""] = (user?.name || "").split(" ");
  const avatarSrc = user?.avatar || getAvatarUrl(firstName, lastName);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: avatarSrc }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || "Warden"}</Text>
        <Text style={styles.email}>{user?.email || "warden@example.com"}</Text>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f6f6f8" },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: "700", color: "#111" },
  email: { fontSize: 14, color: "#666", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#eee", width: "100%", marginVertical: 20 },
  button: { backgroundColor: "#111", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, width: "100%" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
