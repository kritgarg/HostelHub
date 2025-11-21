import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function MessMenuManageScreen({ navigation }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState("");
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const headerBg = "#f5cf6a";
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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return menus;
    return menus.filter((m) =>
      [m?.day, m?.breakfast, m?.lunch, m?.dinner].join(" ").toLowerCase().includes(s)
    );
  }, [q, menus]);

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
      // silent for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </TouchableOpacity>
          <Text style={styles.kicker}>Mess</Text>
          <Text style={styles.heading}>Plan and review daily meals for your hostel.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search menu"
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
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No menus yet</Text>}
          {filtered.map((m, idx) => (
            <View key={m.id || idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{m.day || m.date || `Menu #${idx+1}`}</Text>
                {m.id ? (
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(m.id)}>
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                  </TouchableOpacity>
                ) : null}
              </View>
              {m.breakfast ? <Text style={styles.meal}><Text style={styles.mealLabel}>Breakfast: </Text>{m.breakfast}</Text> : null}
              {m.lunch ? <Text style={styles.meal}><Text style={styles.mealLabel}>Lunch: </Text>{m.lunch}</Text> : null}
              {m.dinner ? <Text style={styles.meal}><Text style={styles.mealLabel}>Dinner: </Text>{m.dinner}</Text> : null}
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
            <Text style={styles.modalTitle}>New Menu</Text>
            <TextInput placeholder="Day (e.g., Monday)" value={day} onChangeText={setDay} style={styles.input} placeholderTextColor="#888" />
            <TextInput placeholder="Breakfast" value={breakfast} onChangeText={setBreakfast} style={styles.input} placeholderTextColor="#888" />
            <TextInput placeholder="Lunch" value={lunch} onChangeText={setLunch} style={styles.input} placeholderTextColor="#888" />
            <TextInput placeholder="Dinner" value={dinner} onChangeText={setDinner} style={styles.input} placeholderTextColor="#888" />
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setOpen(false)}>
                <Text style={styles.actionTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={submit}>
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
  hero: {
    margin: 16,
    padding: 20,
    borderRadius: 26,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 46,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.07)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  kicker: { color: "#1a1a1a", opacity: 0.7 },
  heading: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 6, marginBottom: 14 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, paddingHorizontal: 8, color: "#111" },
  listWrap: { paddingHorizontal: 16, marginTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#111" },
  deleteBtn: { backgroundColor: "#e11d48", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  meal: { marginTop: 8, color: "#333" },
  mealLabel: { fontWeight: "800", color: "#111" },
  muted: { color: "#777", textAlign: "center", paddingVertical: 14 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 8 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    color: "#111",
    marginBottom: 10,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  cancel: { backgroundColor: "#f3f4f6", marginRight: 8 },
  primary: { backgroundColor: "#111" },
  actionText: { color: "#fff", fontWeight: "700" },
  actionTextCancel: { color: "#111", fontWeight: "700" },
});
