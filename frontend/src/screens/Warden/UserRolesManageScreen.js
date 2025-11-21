import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function UserRolesManageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage User Roles</Text>
      <Text style={styles.sub}>Placeholder screen. We can fetch users and allow updating roles (STUDENT, WARDEN, ADMIN).</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Coming soon</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f6f6f8" },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
  sub: { marginTop: 8, color: "#666", textAlign: "center" },
  button: { marginTop: 16, backgroundColor: "#111", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
