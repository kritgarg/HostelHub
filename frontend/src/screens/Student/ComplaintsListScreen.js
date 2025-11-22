import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { useFocusEffect } from "@react-navigation/native";

export default function ComplaintsListScreen() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints/my");
      setComplaints(res.data?.items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [])
  );

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Complaint",
      "Are you sure you want to delete this complaint?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await API.delete(`/complaints/${id}`);
              loadComplaints(); // Refresh list
            } catch (e) {
              Alert.alert("Error", "Failed to delete complaint");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED": return "#4CAF50";
      case "IN_PROGRESS": return "#2196F3";
      default: return "#FF9800";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={18} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.complaintTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadComplaints} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No complaints found</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e7ff",
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#b9e1d0", // Matching theme
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    color: "#999",
    fontSize: 12,
    fontWeight: "600",
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 16,
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
});
