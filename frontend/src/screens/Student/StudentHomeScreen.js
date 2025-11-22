import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import Tile from "../../components/Tile";

export default function StudentHomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

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
  lostfound: {
    top: 14,
    width: 165,
    height: 165,
    opacity: 0.95,
  },
});
