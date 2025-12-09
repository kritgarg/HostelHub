import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/api";
import Tile from "../../components/Tile";
import { Ionicons } from "@expo/vector-icons";

export default function StudentHomeScreen({ navigation }) {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats] = useState({ pendingLeaves: 0, activeComplaints: 0, activePolls: 0 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/users/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (refreshUser) await refreshUser();
      await fetchStats();
    } catch (error) {
      console.log("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUser]);

  const tilesData = [
    {
      id: '1',
      color: "#8fb3ff",
      label: "Polls",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("Polls"),
      image: require("../../../assets/polls.png"),
      imageStyle: "tileImageLeave"
    },
    {
      id: '2',
      color: "#e6d0c6",
      label: "My Leaves",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("My Leaves"),
      image: require("../../../assets/leaves.png"),
      imageStyle: "tileImageMyLeaves"
    },
    {
      id: '3',
      color: "#b9e1d0",
      label: "Complaints",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("Complaints"),
      image: require("../../../assets/complaints.png"),
      imageStyle: "complaints"
    },
    {
      id: '4',
      color: "#f5cf6a",
      label: "Mess Menu",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("MessMenu"),
      image: require("../../../assets/mess.png"),
      imageStyle: "tileImageMess"
    },
    {
      id: '5',
      color: "#ffd6a5",
      label: "Notices",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("Notices"),
      image: require("../../../assets/notifications.png"),
      imageStyle: "notifications"
    },
    {
      id: '6',
      color: "#cde6ff",
      label: "Marketplace",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("Marketplace"),
      image: require("../../../assets/marketplace.png"),
      imageStyle: "marketplace"
    },
    {
      id: '7',
      color: "#e9d7ff",
      label: "Lost & Found",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("LostFound"),
      image: require("../../../assets/lostfound.png"),
      imageStyle: "lostfound"
    },
    {
      id: '8',
      color: "#d1f7c4",
      label: "Coming Soon",
      icon: "arrow-forward",
      onPress: () => navigation.navigate("ComingSoon"),
      image: require("../../../assets/roles.png"),
      imageStyle: "tileImageComingSoon"
    }
  ];

  const renderTile = ({ item }) => (
    <Tile
      color={item.color}
      label={item.label}
      icon={item.icon}
      onPress={item.onPress}
      image={item.image}
      imageStyle={styles[item.imageStyle]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4285F4"]} />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>Student portal</Text>
          <Text style={styles.heroTitle}>
            Hello, {user?.name?.split(" ")[0] || "Student"}{"\n"}
            Ready to manage your <Text style={styles.heroTitleBold}>hostel life?</Text>
          </Text>
          <View style={styles.heroInput}>
            <Text style={styles.heroInputText}>Leave status, complaints...</Text>
          </View>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Here's what's happening today</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Leaves")}>
            <View style={styles.statRow}>
              <View style={[styles.iconContainer, { backgroundColor: "#E8F0FE" }]}>
                <Ionicons name="calendar-outline" size={24} color="#4285F4" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Pending Leaves</Text>
                <Text style={[styles.statNumber, { color: "#4285F4" }]}>{stats.pendingLeaves}</Text>
              </View>
              <View style={[styles.trendPill, { backgroundColor: "#E8F0FE" }]}>
                <Ionicons name="trending-up" size={14} color="#4285F4" />
                <Text style={[styles.trendText, { color: "#4285F4" }]}>Active</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Complaints")}>
            <View style={styles.statRow}>
              <View style={[styles.iconContainer, { backgroundColor: "#FCE8E6" }]}>
                <Ionicons name="alert-circle-outline" size={24} color="#EA4335" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Active Complaints</Text>
                <Text style={[styles.statNumber, { color: "#EA4335" }]}>{stats.activeComplaints}</Text>
              </View>
              <View style={[styles.trendPill, { backgroundColor: "#FCE8E6" }]}>
                <Ionicons name="alert-circle" size={14} color="#EA4335" />
                <Text style={[styles.trendText, { color: "#EA4335" }]}>Open</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Polls")}>
            <View style={styles.statRow}>
              <View style={[styles.iconContainer, { backgroundColor: "#E6F4EA" }]}>
                <Ionicons name="bar-chart-outline" size={24} color="#34A853" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Polls Available</Text>
                <Text style={[styles.statNumber, { color: "#34A853" }]}>{stats.activePolls}</Text>
              </View>
              <View style={[styles.trendPill, { backgroundColor: "#E6F4EA" }]}>
                <Ionicons name="bar-chart" size={14} color="#34A853" />
                <Text style={[styles.trendText, { color: "#34A853" }]}>Vote</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Quick actions for students</Text>

        <FlatList
          data={tilesData}
          renderItem={renderTile}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: "space-between"
  },
  gridContainer: {
    paddingBottom: 20
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 15,
    marginLeft: 4,
  },
  statsContainer: {
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  lostfound: {
    top: 14,
    width: 165,
    height: 165,
    opacity: 0.95,
  },
});
