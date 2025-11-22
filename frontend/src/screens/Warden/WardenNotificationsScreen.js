import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function WardenNotificationsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("GLOBAL"); // GLOBAL | SPECIFIC
  const [role, setRole] = useState("STUDENT"); // ALL | STUDENT | WARDEN | ADMIN
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
      // Optimistic update
      setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await API.put(`/notifications/${id}/read`);
    } catch (e) {
      load(); // Revert on error
    }
  };

  const send = async () => {
    if (!title.trim() || !message.trim()) return Alert.alert("Error", "Title and message are required");
    
    const recipients = {};
    
    if (targetType === "GLOBAL") {
      recipients.role = role;
    } else {
      const parsedIds = userIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));
      
      if (parsedIds.length === 0) return Alert.alert("Error", "Please enter valid User IDs");
      recipients.userIds = parsedIds;
    }

    try {
      setLoading(true);
      await API.post("/notifications/send", { recipients, title: title.trim(), message: message.trim() });
      setOpen(false);
      setTitle("");
      setMessage("");
      setRole("STUDENT");
      setUserIds("");
      setTargetType("GLOBAL");
      Alert.alert("Success", "Notification sent successfully! 🚀");
      await load();
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to send notification");
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
          <Text style={styles.heading}>Announcements & Alerts 📢</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search history..."
              value={q}
              onChangeText={setQ}
              style={styles.searchInput}
              placeholderTextColor="#777"
            />
          </View>
        </View>

        <View style={styles.listWrap}>
          {loading && <ActivityIndicator size="small" color="#111" style={{ marginVertical: 20 }} />}
          {!loading && filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
              <Text style={styles.muted}>No notifications sent yet.</Text>
            </View>
          )}
          
          {filtered.map((n) => (
            <View key={n.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons name="megaphone-outline" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.date}>{new Date(n.createdAt).toLocaleDateString()}</Text>
                </View>
                {n.read && (
                  <Ionicons name="checkmark-done" size={16} color="#4CAF50" />
                )}
              </View>
              <Text style={styles.desc}>{n.message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.9}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Announcement</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Target Audience</Text>
              <View style={styles.targetTabs}>
                <TouchableOpacity 
                  style={[styles.targetTab, targetType === "GLOBAL" && styles.targetTabActive]} 
                  onPress={() => setTargetType("GLOBAL")}
                >
                  <Ionicons name="people" size={18} color={targetType === "GLOBAL" ? "#fff" : "#666"} />
                  <Text style={[styles.targetTabText, targetType === "GLOBAL" && styles.targetTabTextActive]}>Global / Role</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.targetTab, targetType === "SPECIFIC" && styles.targetTabActive]} 
                  onPress={() => setTargetType("SPECIFIC")}
                >
                  <Ionicons name="person" size={18} color={targetType === "SPECIFIC" ? "#fff" : "#666"} />
                  <Text style={[styles.targetTabText, targetType === "SPECIFIC" && styles.targetTabTextActive]}>Specific Users</Text>
                </TouchableOpacity>
              </View>

              {targetType === "GLOBAL" ? (
                <View style={styles.section}>
                  <Text style={styles.subLabel}>Select Role</Text>
                  <View style={styles.roleRow}>
                    {(["STUDENT", "WARDEN", "ALL"]).map((r) => (
                      <TouchableOpacity 
                        key={r} 
                        style={[styles.chip, role === r && styles.chipActive]} 
                        onPress={() => setRole(r)}
                      >
                        <Text style={[styles.chipText, role === r && styles.chipTextActive]}>{r}</Text>
                        {role === r && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.section}>
                  <Text style={styles.subLabel}>User IDs</Text>
                  <TextInput 
                    placeholder="e.g. 12, 45, 89 (Comma separated)" 
                    value={userIds} 
                    onChangeText={setUserIds} 
                    style={styles.input} 
                    placeholderTextColor="#999" 
                    keyboardType="numeric"
                  />
                </View>
              )}

              <Text style={styles.label}>Content</Text>
              <TextInput 
                placeholder="Title (e.g. Water Supply Maintenance)" 
                value={title} 
                onChangeText={setTitle} 
                style={styles.input} 
                placeholderTextColor="#999" 
              />
              <TextInput 
                placeholder="Message details..." 
                value={message} 
                onChangeText={setMessage} 
                style={[styles.input, styles.textArea]} 
                multiline 
                placeholderTextColor="#999" 
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.sendBtn} onPress={send}>
                <Text style={styles.sendBtnText}>Send Announcement</Text>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
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
  kicker: { color: "#1a1a1a", opacity: 0.7, fontWeight: "600", fontSize: 13 },
  heading: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 4, marginBottom: 14 },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 16, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, paddingHorizontal: 8, color: "#111", fontWeight: "500" },
  listWrap: { paddingHorizontal: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#111", justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  date: { fontSize: 12, color: "#888", marginTop: 2 },
  desc: { color: "#444", lineHeight: 20, fontSize: 14 },
  muted: { color: "#888", textAlign: "center", marginTop: 12, fontSize: 15 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  fab: { position: "absolute", right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: "#111", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  label: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 10, marginTop: 6 },
  subLabel: { fontSize: 13, fontWeight: "600", color: "#666", marginBottom: 8 },
  targetTabs: { flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 14, padding: 4, marginBottom: 16 },
  targetTab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 12, gap: 6 },
  targetTabActive: { backgroundColor: "#111" },
  targetTabText: { fontSize: 14, fontWeight: "600", color: "#666" },
  targetTabTextActive: { color: "#fff" },
  section: { marginBottom: 16, padding: 16, backgroundColor: "#f8f9fa", borderRadius: 16, borderWidth: 1, borderColor: "#eee" },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "#ddd", gap: 6 },
  chipActive: { backgroundColor: "#111", borderColor: "#111" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#444" },
  chipTextActive: { color: "#fff" },
  input: { backgroundColor: "#f8f9fa", borderRadius: 16, paddingHorizontal: 16, height: 50, color: "#111", marginBottom: 12, borderWidth: 1, borderColor: "#eee", fontSize: 15 },
  textArea: { height: 100, paddingTop: 14 },
  sendBtn: { backgroundColor: "#111", borderRadius: 18, height: 56, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10, gap: 8, shadowColor: "#111", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
