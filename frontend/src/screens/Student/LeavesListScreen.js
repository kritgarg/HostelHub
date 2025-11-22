import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { useFocusEffect } from "@react-navigation/native";

export default function LeavesListScreen() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leave/my-leaves");
      setLeaves(res.data?.items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLeaves();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "#4CAF50";
      case "REJECTED": return "#F44336";
      default: return "#FF9800";
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Leave",
      "Are you sure you want to delete this leave application?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await API.delete(`/leave/${id}`);
              loadLeaves(); // Refresh list
            } catch (e) {
              Alert.alert("Error", "Failed to delete leave");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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
            <Ionicons name="trash-outline" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.dateBox}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.dateValue}>{new Date(item.fromDate).toLocaleDateString()}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#999" />
        <View style={styles.dateBox}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.dateValue}>{new Date(item.toDate).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={styles.reasonLabel}>Reason:</Text>
      <Text style={styles.reason}>{item.reason}</Text>
      
      {item.status === 'APPROVED' && (
         <View style={styles.qrHint}>
             <Ionicons name="qr-code-outline" size={16} color="#4CAF50" />
             <Text style={styles.qrText}>QR Code Generated</Text>
         </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leaves}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadLeaves} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No leave history found</Text>
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
    borderLeftColor: "#e6d0c6", // Matching theme
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  dateBox: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: "#888",
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#444",
    marginBottom: 6,
  },
  reason: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  qrHint: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      backgroundColor: "#e8f5e9",
      padding: 10,
      borderRadius: 12,
      alignSelf: "flex-start",
  },
  qrText: {
      fontSize: 13,
      color: "#2e7d32",
      fontWeight: "700",
      marginLeft: 8,
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
