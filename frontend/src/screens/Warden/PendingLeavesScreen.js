import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function PendingLeavesScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const headerBg = "#e6d0c6";

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((l) =>
      [l?.user?.name, l?.user?.roomNumber, l?.reason].join(" ").toLowerCase().includes(s)
    );
  }, [q, items]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leave/pending");
      const payload = res?.data;
      let list = [];
      if (Array.isArray(payload)) list = payload;
      else if (Array.isArray(payload?.items)) list = payload.items;
      else if (Array.isArray(payload?.data?.items)) list = payload.data.items;
      else if (Array.isArray(payload?.data)) list = payload.data;
      setItems(list);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      setLoading(true);
      await API.put(`/leave/approve/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to approve");
    } finally {
      setLoading(false);
    }
  };

  const reject = async (id) => {
    try {
      setLoading(true);
      await API.put(`/leave/reject/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to reject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <View style={styles.heroRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
              <Ionicons name="chevron-back" size={18} color="#111" />
            </TouchableOpacity>
          </View>
          <Text style={styles.kicker}>Leaves</Text>
          <Text style={styles.heading}>Review pending requests and take action.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search leaves"
              value={q}
              onChangeText={setQ}
              style={styles.searchInput}
              placeholderTextColor="#777"
            />
            <Ionicons name="arrow-forward" size={18} color="#555" />
          </View>
        </View>

        <View style={styles.listWrap}>
          {loading && <Text style={styles.muted}>Loading...</Text>}
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No records</Text>}
          {filtered.map((l) => (
            <View key={l.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{l?.user?.name || `Student #${l.userId}`}{l?.user?.roomNumber ? ` • Room ${l.user.roomNumber}` : ""}</Text>
                <View style={[styles.badge, (l.status || "PENDING") === "APPROVED" ? styles.badgeGreen : (l.status || "PENDING") === "REJECTED" ? styles.badgeRed : styles.badgeYellow]}>
                  <Text style={styles.badgeText}>{l.status || "PENDING"}</Text>
                </View>
              </View>
              <Text style={styles.meta}>{l.fromDate ? new Date(l.fromDate).toDateString() : ""} {l.toDate ? `- ${new Date(l.toDate).toDateString()}` : ""}</Text>
              {l.reason ? <Text style={styles.desc}>{l.reason}</Text> : null}
              {(l.status || "PENDING") === "PENDING" ? (
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={[styles.smallBtn, styles.secondaryBtn]} onPress={() => approve(l.id)}>
                    <Text style={styles.secondaryText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, styles.dangerBtn]} onPress={() => reject(l.id)}>
                    <Text style={styles.dangerText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f2f0e7ff" },
  hero: { margin: 16, padding: 20, borderRadius: 26, borderBottomLeftRadius: 6, borderBottomRightRadius: 46 },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.07)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  kicker: { color: "#1a1a1a", opacity: 0.7 },
  heading: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 6, marginBottom: 14 },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 16, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, paddingHorizontal: 8, color: "#111" },
  listWrap: { paddingHorizontal: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "800", color: "#111" },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontWeight: "800", color: "#111" },
  badgeGreen: { backgroundColor: "#dcfce7" },
  badgeRed: { backgroundColor: "#fee2e2" },
  badgeYellow: { backgroundColor: "#fef9c3" },
  desc: { marginTop: 6, color: "#333" },
  meta: { marginTop: 4, color: "#666" },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  secondaryBtn: { backgroundColor: "#111", },
  dangerBtn: { backgroundColor: "#e11d48" },
  secondaryText: { color: "#fff", fontWeight: "700" },
  dangerText: { color: "#fff", fontWeight: "700" },
  muted: { color: "#777", textAlign: "center", paddingVertical: 14 },

});
