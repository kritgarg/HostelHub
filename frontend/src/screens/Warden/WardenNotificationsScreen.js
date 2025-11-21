import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WardenNotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.sub}>This is a placeholder. I can wire it to the backend notifications API next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f6f6f8" },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
  sub: { marginTop: 6, color: "#666" },
});
