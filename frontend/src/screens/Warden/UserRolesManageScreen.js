import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

const ROLES = ["STUDENT", "WARDEN", "ADMIN"];

export default function UserRolesManageScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL | STUDENT | WARDEN | ADMIN
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState("STUDENT");
  const [me, setMe] = useState(null);
  const headerBg = "#d1f7c4";

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = items;
    if (s) list = list.filter((u) => [u.name, u.email, u.role].join(" ").toLowerCase().includes(s));
    return list;
  }, [items, q]);

  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (q.trim()) params.set("search", q.trim());
      const res = await API.get(`/users?${params.toString()}`);
      const payload = res?.data;
      let list = [];
      let metaTotal = 0;
      if (Array.isArray(payload)) {
        list = payload;
      } else if (Array.isArray(payload?.items)) {
        list = payload.items; metaTotal = payload.total ?? list.length;
      } else if (Array.isArray(payload?.data?.items)) {
        list = payload.data.items; metaTotal = payload.data.total ?? list.length;
      } else if (Array.isArray(payload?.data)) {
        list = payload.data;
      }
      setItems(list);
      setTotal(metaTotal || list.length);
    } catch (e) {
      setItems([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, roleFilter]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/auth/me");
        setMe(res?.data || null);
      } catch (_) {}
    })();
  }, []);

  const openEdit = (user) => {
    setEditUser(user);
    setEditRole(user.role);
    setEditOpen(true);
  };

  const saveRole = async () => {
    if (!editUser) return;
    try {
      setLoading(true);
      await API.post("/auth/assign-role", { userId: editUser.id, role: editRole });
      setEditOpen(false);
      await load();
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

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
              <Text style={styles.filterText}>{roleFilter === "ALL" ? "All" : roleFilter}</Text>
              <Ionicons name="chevron-down" size={14} color="#111" />
            </TouchableOpacity>
          </View>
          <Text style={styles.kicker}>User Roles</Text>
          <Text style={styles.heading}>View users and update roles.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search by name or email"
              value={q}
              onChangeText={setQ}
              style={styles.searchInput}
              placeholderTextColor="#777"
              onSubmitEditing={() => { setPage(1); load(); }}
              returnKeyType="search"
            />
            <Ionicons name="arrow-forward" size={18} color="#555" />
          </View>
        </View>

        <View style={styles.listWrap}>
          {loading && <Text style={styles.muted}>Loading...</Text>}
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No users</Text>}
          {filtered.map((u) => {
            const isSelf = me && Number(u.id) === Number(me.id);
            return (
            <View key={u.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{u.name || "(No name)"}</Text>
                <View style={[styles.badge, styles.badgeGray]}>
                  <Text style={styles.badgeText}>{u.role}</Text>
                </View>
              </View>
              <Text style={styles.desc}>{u.email}</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  disabled={isSelf}
                  style={[styles.smallBtn, styles.primaryBtn, isSelf && { opacity: 0.5 }]}
                  onPress={() => {
                    if (isSelf) return Alert.alert("Not allowed", "You cannot change your own role");
                    openEdit(u);
                  }}
                >
                  <Ionicons name="create-outline" size={16} color="#fff" />
                  <Text style={styles.btnText}>Edit Role</Text>
                </TouchableOpacity>
              </View>
            </View>
          );})}
        </View>

        <View style={styles.pagination}>
          <TouchableOpacity disabled={page<=1} onPress={() => setPage((p)=>Math.max(1,p-1))} style={[styles.pageBtn, page<=1 && styles.pageBtnDisabled]}>
            <Ionicons name="chevron-back" size={18} color={page<=1?"#999":"#111"} />
            <Text style={[styles.pageText, page<=1 && styles.pageTextDisabled]}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>Page {page} / {totalPages}</Text>
          <TouchableOpacity disabled={page>=totalPages} onPress={() => setPage((p)=>Math.min(totalPages,p+1))} style={[styles.pageBtn, page>=totalPages && styles.pageBtnDisabled]}>
            <Text style={[styles.pageText, page>=totalPages && styles.pageTextDisabled]}>Next</Text>
            <Ionicons name="chevron-forward" size={18} color={page>=totalPages?"#999":"#111"} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Role filter modal */}
      <Modal visible={filterOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filter by role</Text>
            {(["ALL", ...ROLES]).map((opt) => (
              <TouchableOpacity key={opt} style={styles.optionRow} onPress={() => { setRoleFilter(opt); setPage(1); setFilterOpen(false); }}>
                <Text style={[styles.optionText, roleFilter===opt && styles.optionTextActive]}>{opt}</Text>
                {roleFilter===opt && <Ionicons name="checkmark" size={18} color="#111" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setFilterOpen(false)}>
              <Text style={styles.actionTextCancel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit role modal */}
      <Modal visible={editOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Role</Text>
            <Text style={{ color: "#555", marginBottom: 8 }}>{editUser?.name} ({editUser?.email})</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {ROLES.map((r) => (
                <TouchableOpacity key={r} style={[styles.chip, editRole===r && styles.chipActive]} onPress={() => setEditRole(r)}>
                  <Text style={[styles.chipText, editRole===r && styles.chipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setEditOpen(false)}>
                <Text style={styles.actionTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={saveRole}>
                <Text style={styles.actionText}>Save</Text>
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
  hero: { margin: 16, padding: 20, borderRadius: 26, borderBottomLeftRadius: 6, borderBottomRightRadius: 46, backgroundColor: "#fdecc8" },
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
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontWeight: "800", color: "#111" },
  badgeGray: { backgroundColor: "#e5e7eb" },
  actionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  smallBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  primaryBtn: { backgroundColor: "#111" },
  btnText: { color: "#fff", fontWeight: "700" },
  muted: { color: "#777", textAlign: "center", paddingVertical: 14 },
  pagination: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 4, marginBottom: 20 },
  pageBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#fff" },
  pageBtnDisabled: { backgroundColor: "#f3f4f6" },
  pageText: { color: "#111", fontWeight: "700" },
  pageTextDisabled: { color: "#999" },
  pageInfo: { color: "#111", fontWeight: "700" },
  // modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 10 },
  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  optionText: { color: "#111" },
  optionTextActive: { fontWeight: "800" },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignSelf: "flex-end", marginTop: 8 },
  cancel: { backgroundColor: "#f3f4f6" },
  actionTextCancel: { color: "#111", fontWeight: "700" },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  primary: { backgroundColor: "#111" },
  actionText: { color: "#fff", fontWeight: "700" },
  chip: { backgroundColor: "#f3f4f6", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8 },
  chipActive: { backgroundColor: "#111" },
  chipText: { color: "#111", fontWeight: "700" },
  chipTextActive: { color: "#fff" },
});
