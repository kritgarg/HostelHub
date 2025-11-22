import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";

export default function StudentHomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  
  const handleComingSoon = () => {
    Alert.alert("Coming Soon", "This feature will be available soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Student portal</Text>
          <Text style={styles.heroTitle}>
            Hello, {user?.name?.split(" ")[0] || "Student"}{"\n"}
            Ready to manage your <Text style={styles.heroTitleBold}>hostel life?</Text>
          </Text>
          <View style={styles.heroInput}>
            <Text style={styles.heroInputText}>Search leave status, complaints...</Text>
          </View>
        </View>
        <Text style={styles.title}>Quick actions for students</Text>

        <View style={styles.grid}>
          <Tile
            color="#8fb3ff"
            label="Apply Leave"
            icon="arrow-forward"
            onPress={() => navigation.navigate("Apply Leave")}
            image={require("../../../assets/leaves.png")}
            imageStyle={styles.tileImageLeave}
          />
          <Tile
            color="#f5cf6a"
            label="My Leaves"
            icon="arrow-forward"
            onPress={() => navigation.navigate("My Leaves")}
            image={require("../../../assets/leaves.png")}
            imageStyle={styles.tileImageMyLeaves}
          />
          <Tile
            color="#b9e1d0"
            label="Complaints"
            icon="arrow-forward"
            onPress={() => navigation.navigate("Complaints")}
            image={require("../../../assets/complaints.png")}
            imageStyle={styles.complaints}
          />
          <Tile
            color="#e6d0c6"
            label="Mess Menu"
            icon="arrow-forward"
            onPress={handleComingSoon}
            image={require("../../../assets/mess.png")}
            imageStyle={styles.tileImageMess}
          />
          <Tile
            color="#ffd6a5"
            label="Notices"
            icon="arrow-forward"
            onPress={handleComingSoon}
            image={require("../../../assets/notifications.png")}
            imageStyle={styles.notifications}
          />
          <Tile
            color="#cde6ff"
            label="Marketplace"
            icon="arrow-forward"
            onPress={handleComingSoon}
            image={require("../../../assets/marketplace.png")}
            imageStyle={styles.marketplace}
          />
          <Tile
            color="#e9d7ff"
            label="Lost & Found"
            icon="arrow-forward"
            onPress={handleComingSoon}
            image={require("../../../assets/lostfound.png")}
            imageStyle={styles.lostfound}
          />
          <Tile
            color="#d1f7c4"
            label="Coming Soon"
            icon="arrow-forward"
            onPress={handleComingSoon}
            image={require("../../../assets/roles.png")}
            imageStyle={styles.tileImageComingSoon}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Tile({ color, label, onPress, icon, image, imageStyle }) {
  return (
    <TouchableOpacity style={[styles.tile, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.tileText}>{label}</Text>
      {image ? (
        <Image source={image} style={[styles.tileImage, imageStyle]} resizeMode="contain" />
      ) : null}
      <View style={styles.tileIcon}>
        <Ionicons name={icon} size={18} color="#111" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f0e7ff" },
  
  content:{
    padding: 20, 
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: "#ecd6c9",
    marginHorizontal: 4,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 26,
    borderBottomLeftRadius: 46,
    borderBottomRightRadius: 6,
  },
  heroTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  heroLogo: { width: 18, height: 18, borderRadius: 6, backgroundColor: "#111" },
  heroSettings: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(17,17,17,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  kicker: { color: "#111", opacity: 0.6, marginBottom: 2 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#111", lineHeight: 32, marginBottom: 10 },
  heroTitleBold: { fontWeight: "900" },
  heroInput: {
    marginTop: 4,
    backgroundColor: "rgba(17,17,17,0.06)",
    borderRadius: 18,
    height: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroInputText: { color: "#6b6b6b" },
  welcomeText: {
    fontSize: 24, 
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  title: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#111", 
    marginBottom: 16 
  },
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 14 
  },
  tile: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 22,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  tileText: { 
    color: "#111", 
    fontSize: 16, 
    fontWeight: "700" 
  },
  tileImageComingSoon: {
    left: 15,
    top: 25,
    width: 150,
    height: 150,
    opacity: 0.8,
  },
  tileImageLeave: {
    left: 15,
    top: 20,
    width: 140,
    height: 150,
    opacity: 0.9,
  },
  tileImageMyLeaves: {
    left: 10,
    top: 15,
    width: 150,
    height: 160,
    opacity: 0.9,
  },
  tileIcon: {
    alignSelf: "flex-end",
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileImage: {
    position: "absolute",
    top: 6,
    left: 5,
    width: 170,
    height: 170,
    opacity: 0.9,
  },
  tileImageMess: {
    left:15,
    top:22,
    width: 140,
    height: 150,
    opacity: 1,
  },
  complaints: {
    position: "absolute",
    top:20,
    left: 14,
    width: 165,
    height: 165,
    opacity: 0.95,
  },
  notifications: {
    position: "absolute",
    top: 14,
    width: 160,
    height: 170,
    opacity: 0.95,
  },
  marketplace: {
    position: "absolute",
    top: 27,
    left: 10,
    width: 160,
    height: 160,
    opacity: 0.95,
  },
  lostfound: {
    top: 14,
    width: 165,
    height: 165,
    opacity: 0.95,
  },
});
