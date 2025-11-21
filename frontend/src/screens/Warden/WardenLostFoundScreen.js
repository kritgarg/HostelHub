import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function WardenLostFoundScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | LOST | FOUND
  const [filterOpen, setFilterOpen] = useState(false);
  const headerBg = "#e9d7ff";

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = items;
    if (typeFilter === "LOST") list = list.filter((x) => x.type === "LOST");
    if (typeFilter === "FOUND") list = list.filter((x) => x.type === "FOUND");
    if (!s) return list;
    return list.filter((x) => [x.type, x.title, x.description, x.location, x.user?.name].join(" ").toLowerCase().includes(s));
  }, [q, items, typeFilter]);

  const load = async () => {
    try {
      setLoading(true);
      const qs = typeFilter !== "ALL" ? `?type=${encodeURIComponent(typeFilter)}` : "";
      const res = await API.get(`/lostfound${qs}`);
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

  useEffect(() => { load(); }, [typeFilter]);

  const confirmDelete = (id) => {
    Alert.alert("Delete record", "Student owner and wardens can delete. Continue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(id) },
    ]);
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/lostfound/${id}`);
      await load();
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  const typeBadge = (type) => (
    <View style={[styles.badge, type === "FOUND" ? styles.badgeGreen : styles.badgeBlue]}>
      <Text style={styles.badgeText}>{type}</Text>
    </View>
  );

  const resolvedBadge = (resolved) => (
    <View style={[styles.badgeSmall, resolved ? styles.badgeGray : styles.badgeYellow]}>
      <Text style={styles.badgeSmallText}>{resolved ? "Resolved" : "Open"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
              <Ionicons name="chevron-back" size={18} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterOpen(true)}>
              <Ionicons name="filter" size={16} color="#111" />
              <Text style={styles.filterText}>{typeFilter === "ALL" ? "All" : typeFilter === "LOST" ? "Lost" : "Found"}</Text>
              <Ionicons name="chevron-down" size={14} color="#111" />
            </TouchableOpacity>
          </View>
          <Text style={styles.kicker}>Lost & Found</Text>
          <Text style={styles.heading}>Review reports and moderate if needed.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search by title, location, reporter"
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
          {filtered.map((it) => (
            <View key={it.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={2}>{it.title}</Text>
                {typeBadge(it.type)}
              </View>
              <Text style={styles.desc}>{it.description}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.meta}>{it.location}</Text>
                <Text style={styles.metaSep}>•</Text>
                {it.user?.name && <Text style={styles.meta}>By {it.user.name}</Text>}
                <View style={{ marginLeft: "auto" }}>{resolvedBadge(it.resolved)}</View>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.smallBtn, styles.dangerBtn]} onPress={() => confirmDelete(it.id)}>
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal visible={filterOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filter by type</Text>
            {(["ALL","LOST","FOUND"]).map((opt) => (
              <TouchableOpacity key={opt} style={styles.optionRow} onPress={() => { setTypeFilter(opt); setFilterOpen(false); }}>
                <Text style={[styles.optionText, typeFilter===opt && styles.optionTextActive]}>
                  {opt === "ALL" ? "All" : opt === "LOST" ? "Lost" : "Found"}
                </Text>
                {typeFilter===opt && <Ionicons name="checkmark" size={18} color="#111" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setFilterOpen(false)}>
              <Text style={styles.actionTextCancel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f2f0e7ff" },
  hero: { margin: 16, padding: 20, borderRadius: 26, borderBottomLeftRadius: 6, borderBottomRightRadius: 46 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.7)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 6, height: 34, paddingHorizontal: 10, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.7)" },
  filterText: { color: "#111", fontWeight: "700" },
  kicker: { color: "#1a1a1a", opacity: 0.7 },
  heading: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 6, marginBottom: 14 },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 16, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, paddingHorizontal: 8, color: "#111" },
  listWrap: { paddingHorizontal: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "800", color: "#111" },
  desc: { marginTop: 6, color: "#333" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  meta: { color: "#555" },
  metaSep: { color: "#bbb" },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginLeft: 8 },
  badgeText: { fontWeight: "800", color: "#111" },
  badgeGreen: { backgroundColor: "#dcfce7" },
  badgeBlue: { backgroundColor: "#dbeafe" },
  badgeSmall: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeYellow: { backgroundColor: "#fef9c3" },
  badgeGray: { backgroundColor: "#e5e7eb" },
  badgeSmallText: { fontWeight: "700", color: "#111" },
  actionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  smallBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  dangerBtn: { backgroundColor: "#b91c1c" },
  btnText: { color: "#fff", fontWeight: "700" },
  muted: { color: "#777", textAlign: "center", paddingVertical: 14 },
  // modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 10 },
  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  optionText: { color: "#111" },
  optionTextActive: { fontWeight: "800" },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignSelf: "flex-end", marginTop: 8 },
  cancel: { backgroundColor: "#f3f4f6" },
  actionTextCancel: { color: "#111", fontWeight: "700" },
});
