import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function WardenNotificationsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("ALL"); // ALL | STUDENT | WARDEN | ADMIN
  const [userIds, setUserIds] = useState(""); // comma-separated
  const headerBg = "#ffd6a5";

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((n) => [n.title, n.message].join(" ").toLowerCase().includes(s));
  }, [q, items]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
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

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      await load();
    } catch (e) {}
  };

  const send = async () => {
    if (!title.trim() || !message.trim()) return alert("Title and message required");
    const recipients = {};
    if (role) recipients.role = role;
    const parsedIds = userIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => !Number.isNaN(n));
    if (parsedIds.length) recipients.userIds = parsedIds;
    try {
      setLoading(true);
      await API.post("/notifications/send", { recipients, title: title.trim(), message: message.trim() });
      setOpen(false);
      setTitle("");
      setMessage("");
      setRole("ALL");
      setUserIds("");
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to send notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </TouchableOpacity>
          <Text style={styles.kicker}>Notifications</Text>
          <Text style={styles.heading}>Create and send announcements to students and staff.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search notifications"
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
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No notifications</Text>}
          {filtered.map((n) => (
            <View key={n.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={2}>{n.title}</Text>
                <View style={[styles.badge, n.read ? styles.badgeGray : styles.badgeYellow]}>
                  <Text style={styles.badgeText}>{n.read ? "Read" : "Unread"}</Text>
                </View>
              </View>
              <Text style={styles.desc}>{n.message}</Text>
              <View style={styles.actionsRow}>
                {!n.read && (
                  <TouchableOpacity style={[styles.smallBtn, styles.primaryBtn]} onPress={() => markRead(n.id)}>
                    <Text style={styles.primaryText}>Mark Read</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.9}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Notification</Text>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} placeholderTextColor="#888" />
            <TextInput placeholder="Message" value={message} onChangeText={setMessage} style={[styles.input, { height: 80 }]} multiline placeholderTextColor="#888" />
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleRow}>
                {(["ALL","STUDENT","WARDEN","ADMIN"]).map((r) => (
                  <TouchableOpacity key={r} style={[styles.chip, role===r && styles.chipActive]} onPress={() => setRole(r)}>
                    <Text style={[styles.chipText, role===r && styles.chipTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput placeholder="Specific user IDs (comma-separated, optional)" value={userIds} onChangeText={setUserIds} style={styles.input} placeholderTextColor="#888" />
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setOpen(false)}>
                <Text style={styles.actionTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={send}>
                <Text style={styles.actionText}>Send</Text>
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
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.7)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
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
  badgeYellow: { backgroundColor: "#fef9c3" },
  badgeGray: { backgroundColor: "#e5e7eb" },
  desc: { marginTop: 6, color: "#333" },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  primaryBtn: { backgroundColor: "#111" },
  primaryText: { color: "#fff", fontWeight: "700" },
  muted: { color: "#777", textAlign: "center", paddingVertical: 14 },
  fab: { position: "absolute", right: 24, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: "#111", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 8 },
  input: { backgroundColor: "#f3f4f6", borderRadius: 12, paddingHorizontal: 12, height: 44, color: "#111", marginBottom: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  label: { color: "#111", fontWeight: "700" },
  roleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#f3f4f6", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8 },
  chipActive: { backgroundColor: "#111" },
  chipText: { color: "#111", fontWeight: "700" },
  chipTextActive: { color: "#fff" },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  cancel: { backgroundColor: "#f3f4f6", marginRight: 8 },
  primary: { backgroundColor: "#111" },
  actionText: { color: "#fff", fontWeight: "700" },
  actionTextCancel: { color: "#111", fontWeight: "700" },
});
