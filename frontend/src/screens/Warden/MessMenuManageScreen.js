import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function MessMenuManageScreen({ navigation }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  
  // Form State
  const [day, setDay] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");

  const headerBg = "#f5cf6a";

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/mess/menu");
      const payload = res?.data;
      let items = [];
      if (Array.isArray(payload)) items = payload;
      else if (Array.isArray(payload?.items)) items = payload.items;
      else if (Array.isArray(payload?.data?.items)) items = payload.data.items;
      else if (Array.isArray(payload?.data)) items = payload.data;
      setMenus(items);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/mess/analytics");
      setAnalyticsData(res.data || []);
      setAnalyticsOpen(true);
    } catch (e) {
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/mess/menu/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete menu");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!day.trim()) return alert("Day is required");
    try {
      setLoading(true);
      await API.post("/mess/menu", { day: day.trim(), breakfast, lunch, dinner });
      setOpen(false);
      setDay(""); setBreakfast(""); setLunch(""); setDinner("");
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create menu");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return menus;
    return menus.filter((m) =>
      [m?.day, m?.breakfast, m?.lunch, m?.dinner].join(" ").toLowerCase().includes(s)
    );
  }, [q, menus]);

  const getMenuStats = (menuId) => {
    return analyticsData.find(a => a.menuId === menuId) || { likes: 0, dislikes: 0 };
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <View style={styles.heroRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
              <Ionicons name="chevron-back" size={18} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyticsBtn} onPress={loadAnalytics}>
              <Ionicons name="stats-chart" size={16} color="#111" />
              <Text style={styles.analyticsText}>Analytics</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.kicker}>Mess Management</Text>
          <Text style={styles.heading}>Plan meals & track feedback. 🍳</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search menu..."
              value={q}
              onChangeText={setQ}
              style={styles.searchInput}
              placeholderTextColor="#777"
            />
          </View>
        </View>

        <View style={styles.listWrap}>
          {loading && !analyticsOpen && <ActivityIndicator size="large" color="#111" style={{ marginTop: 20 }} />}
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No menus found.</Text>}
          
          {filtered.map((m, idx) => (
            <View key={m.id || idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayText}>{m.day || "Unknown"}</Text>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(m.id)}>
                  <Ionicons name="trash-outline" size={16} color="#D32F2F" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.mealRow}>
                <View style={[styles.dot, { backgroundColor: "#FFB74D" }]} />
                <Text style={styles.mealLabel}>Breakfast:</Text>
                <Text style={styles.mealValue} numberOfLines={1}>{m.breakfast || "-"}</Text>
              </View>
              <View style={styles.mealRow}>
                <View style={[styles.dot, { backgroundColor: "#FF7043" }]} />
                <Text style={styles.mealLabel}>Lunch:</Text>
                <Text style={styles.mealValue} numberOfLines={1}>{m.lunch || "-"}</Text>
              </View>
              <View style={styles.mealRow}>
                <View style={[styles.dot, { backgroundColor: "#5C6BC0" }]} />
                <Text style={styles.mealLabel}>Dinner:</Text>
                <Text style={styles.mealValue} numberOfLines={1}>{m.dinner || "-"}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.9}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* New Menu Modal */}
      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Menu</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Day</Text>
              <TouchableOpacity 
                style={[styles.input, styles.dropdownBtn]} 
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Text style={[styles.inputText, !day && styles.placeholder]}>
                  {day || "Select Day"}
                </Text>
                <Ionicons name={dropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
              </TouchableOpacity>
              
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                    <TouchableOpacity 
                      key={d} 
                      style={styles.dropdownItem} 
                      onPress={() => {
                        setDay(d);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownText, day === d && styles.dropdownTextActive]}>{d}</Text>
                      {day === d && <Ionicons name="checkmark" size={16} color="#111" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              <Text style={styles.label}>Breakfast</Text>
              <TextInput placeholder="e.g. Aloo Paratha, Curd" value={breakfast} onChangeText={setBreakfast} style={styles.input} placeholderTextColor="#999" />
              
              <Text style={styles.label}>Lunch</Text>
              <TextInput placeholder="e.g. Rice, Dal, Sabzi" value={lunch} onChangeText={setLunch} style={styles.input} placeholderTextColor="#999" />
              
              <Text style={styles.label}>Dinner</Text>
              <TextInput placeholder="e.g. Roti, Paneer" value={dinner} onChangeText={setDinner} style={styles.input} placeholderTextColor="#999" />
              
              <TouchableOpacity style={styles.saveBtn} onPress={submit}>
                <Text style={styles.saveBtnText}>Save Menu</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Analytics Modal */}
      <Modal visible={analyticsOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feedback Analytics</Text>
              <TouchableOpacity onPress={() => setAnalyticsOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ maxHeight: 400 }}>
              {analyticsData.length === 0 ? (
                <Text style={styles.muted}>No feedback data available yet.</Text>
              ) : (
                analyticsData.map((stat, idx) => {
                  const menu = menus.find(m => m.id === stat.menuId);
                  return (
                    <View key={idx} style={styles.statRow}>
                      <Text style={styles.statDay}>{menu?.day || `Menu #${stat.menuId}`}</Text>
                      <View style={styles.statBars}>
                        <View style={styles.statItem}>
                          <Ionicons name="thumbs-up" size={16} color="#4CAF50" />
                          <Text style={styles.statVal}>{stat.likes}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="thumbs-down" size={16} color="#FF5252" />
                          <Text style={styles.statVal}>{stat.dislikes}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f2f0e7ff" },
  hero: {
    margin: 16,
    padding: 20,
    borderRadius: 26,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 46,
  },
  heroRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyticsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  analyticsText: { fontWeight: "700", color: "#111", fontSize: 13 },
  kicker: { color: "#1a1a1a", opacity: 0.7, fontSize: 13, fontWeight: "600" },
  heading: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 4, marginBottom: 14 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, paddingHorizontal: 8, color: "#111", fontWeight: "500" },
  listWrap: { paddingHorizontal: 16, marginTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dayBadge: { backgroundColor: "#f5cf6a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  dayText: { fontWeight: "800", color: "#111", fontSize: 14 },
  deleteBtn: { backgroundColor: "#FFEBEE", padding: 8, borderRadius: 10 },
  mealRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  mealLabel: { fontWeight: "700", color: "#555", width: 80, fontSize: 14 },
  mealValue: { flex: 1, color: "#111", fontSize: 14, fontWeight: "500" },
  muted: { color: "#888", textAlign: "center", marginTop: 20, fontSize: 15 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  label: { fontSize: 14, fontWeight: "700", color: "#444", marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    color: "#111",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#111",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#111",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statDay: { fontSize: 16, fontWeight: "700", color: "#111" },
  statBars: { flexDirection: "row", gap: 16 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statVal: { fontSize: 15, fontWeight: "600", color: "#333" },
  dropdownBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { fontSize: 15, color: "#111" },
  placeholder: { color: "#999" },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: -10,
    marginBottom: 16,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: { fontSize: 15, color: "#444" },
  dropdownTextActive: { color: "#111", fontWeight: "700" },
});
