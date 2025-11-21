import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function ManageComplaintsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | IN_PROGRESS | RESOLVED
  const headerBg = "#b9e1d0";

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = items.filter((c) =>
      [c.title, c.description, c?.user?.name].join(" ").toLowerCase().includes(s)
    );
    if (statusFilter === "ALL") return base;
    return base.filter((c) => c.status === statusFilter);
  }, [q, items, statusFilter]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints");
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

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      await API.put(`/complaints/update/${id}`, { status });
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/complaints/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete complaint");
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
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterOpen(true)}>
              <Ionicons name="filter" size={16} color="#111" />
              <Text style={styles.filterText}>{statusFilter === "ALL" ? "All" : statusFilter.replace("_", " ")}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.kicker}>Complaints</Text>
          <Text style={styles.heading}>Review, act, and close student complaints.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search complaints"
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
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No complaints found</Text>}
          {filtered.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={2}>{c.title}</Text>
                <View style={[styles.badge, c.status === "RESOLVED" ? styles.badgeGreen : c.status === "IN_PROGRESS" ? styles.badgeYellow : styles.badgeGray]}>
                  <Text style={styles.badgeText}>{c.status || "OPEN"}</Text>
                </View>
              </View>
              <Text style={styles.desc}>{c.description}</Text>
              {c.user?.name ? <Text style={styles.meta}>By {c.user.name}</Text> : null}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.smallBtn, styles.secondaryBtn]} onPress={() => updateStatus(c.id, "IN_PROGRESS")}>
                  <Text style={styles.secondaryText}>Mark In-Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallBtn, styles.primaryBtn]} onPress={() => updateStatus(c.id, "RESOLVED")}>
                  <Text style={styles.primaryText}>Resolve</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={[styles.smallBtn, styles.dangerBtn]} onPress={() => remove(c.id)}>
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.dangerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setInfoOpen(true)} activeOpacity={0.9}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={infoOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.resultsCard}>
            <Text style={styles.modalTitle}>Create Complaint</Text>
            <Text style={styles.muted}>Complaints are created by students. Wardens can act on and delete them here.</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={() => setInfoOpen(false)}>
                <Text style={styles.actionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={filterOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.resultsCard}>
            <Text style={styles.modalTitle}>Filter by status</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.chip, statusFilter === "ALL" && styles.chipActive]}
                onPress={() => { setStatusFilter("ALL"); setFilterOpen(false); }}
              >
                <Text style={[styles.chipText, statusFilter === "ALL" && styles.chipTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, statusFilter === "IN_PROGRESS" && styles.chipActive]}
                onPress={() => { setStatusFilter("IN_PROGRESS"); setFilterOpen(false); }}
              >
                <Text style={[styles.chipText, statusFilter === "IN_PROGRESS" && styles.chipTextActive]}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, statusFilter === "RESOLVED" && styles.chipActive]}
                onPress={() => { setStatusFilter("RESOLVED"); setFilterOpen(false); }}
              >
                <Text style={[styles.chipText, statusFilter === "RESOLVED" && styles.chipTextActive]}>Resolved</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={() => setFilterOpen(false)}>
                <Text style={styles.actionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f2f0e7ff" },
  hero: { margin: 16, padding: 20, borderRadius: 26, borderBottomLeftRadius: 6, borderBottomRightRadius: 46 },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.07)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.7)", marginBottom: 10 },
  filterText: { color: "#111", fontWeight: "700" },
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
  badgeYellow: { backgroundColor: "#fef9c3" },
  badgeGray: { backgroundColor: "#e5e7eb" },
  desc: { marginTop: 6, color: "#333" },
  meta: { marginTop: 4, color: "#666" },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  secondaryBtn: { backgroundColor: "#eef2ff" },
  primaryBtn: { backgroundColor: "#111" },
  dangerBtn: { backgroundColor: "#e11d48", flexDirection: "row", alignItems: "center", gap: 6 },
  secondaryText: { color: "#111", fontWeight: "700" },
  primaryText: { color: "#fff", fontWeight: "700" },
  dangerText: { color: "#fff", fontWeight: "700" },
  muted: { color: "#777", textAlign: "center", paddingVertical: 14 },
  fab: { position: "absolute", right: 24, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: "#111", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  resultsCard: { backgroundColor: "#fff", margin: 20, borderRadius: 18, padding: 16 },
  chip: { backgroundColor: "#f3f4f6", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8 },
  chipActive: { backgroundColor: "#111" },
  chipText: { color: "#111", fontWeight: "700" },
  chipTextActive: { color: "#fff" },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  primary: { backgroundColor: "#111" },
  actionText: { color: "#fff", fontWeight: "700" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 4 },
});
