import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

export default function PollsManageScreen({ navigation }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const headerBg = "#8fb3ff";
  const [expandedId, setExpandedId] = useState(null);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsData, setResultsData] = useState([]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return polls;
    return polls.filter((p) => p.title?.toLowerCase().includes(s));
  }, [q, polls]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/polls");
      const payload = res?.data;
      let items = [];
      if (Array.isArray(payload)) items = payload;
      else if (Array.isArray(payload?.items)) items = payload.items;
      else if (Array.isArray(payload?.data?.items)) items = payload.data.items;
      else if (Array.isArray(payload?.data)) items = payload.data;
      setPolls(items);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  const remove = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/polls/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete poll");
    } finally {
      setLoading(false);
    }
  };

  const viewResults = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`/polls/results/${id}`);
      const data = res?.data?.data || res?.data || [];
      setResultsData(Array.isArray(data) ? data : []);
      setResultsOpen(true);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeOption = (idx, val) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const addOption = () => setOptions((o) => [...o, ""]);
  const removeOption = (idx) => setOptions((o) => o.filter((_, i) => i !== idx));

  const submit = async () => {
    const cleanOptions = options.map((o) => String(o || "").trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 2) return alert("Question and at least two options required");
    try {
      setLoading(true);
      await API.post("/polls", { question: question.trim(), options: cleanOptions });
      setOpen(false);
      setQuestion("");
      setOptions(["", ""]);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create poll");
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
          <Text style={styles.kicker}>Polls</Text>
          <Text style={styles.heading}>Set up, launch, and track polls to gather insights from students.</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search polls"
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
          {!loading && filtered.length === 0 && <Text style={styles.muted}>No polls yet</Text>}
          {filtered.map((p) => {
            const expanded = expandedId === p.id;
            const created = p.createdAt ? new Date(p.createdAt) : null;
            return (
              <TouchableOpacity key={p.id} style={styles.card} activeOpacity={0.9} onPress={() => toggleExpand(p.id)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{p.title}</Text>
                  {created ? <Text style={styles.cardDate}>{created.toLocaleDateString()}</Text> : null}
                </View>
                <Text style={styles.cardSub}>{Array.isArray(p.options) ? p.options.length : 0} options</Text>
                {expanded && Array.isArray(p.options) && (
                  <View style={styles.optWrap}>
                    {p.options.map((opt, i) => (
                      <View key={i} style={styles.optChip}><Text style={styles.optText}>{opt.text || opt}</Text></View>
                    ))}
                  </View>
                )}
                {expanded && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.smallBtn, styles.secondaryBtn]} onPress={() => viewResults(p.id)}>
                      <Ionicons name="bar-chart-outline" size={16} color="#111" />
                      <Text style={styles.secondaryText}>Results</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={[styles.smallBtn, styles.dangerBtn]} onPress={() => remove(p.id)}>
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                      <Text style={styles.dangerText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.9}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Poll</Text>
            <TextInput
              placeholder="Question"
              placeholderTextColor="#888"
              value={question}
              onChangeText={setQuestion}
              style={styles.input}
            />
            <FlatList
              data={options}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item, index }) => (
                <View style={styles.row}>
                  <TextInput
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor="#888"
                    value={item}
                    onChangeText={(t) => changeOption(index, t)}
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                  />
                  {options.length > 2 ? (
                    <TouchableOpacity style={styles.iconBtn} onPress={() => removeOption(index)}>
                      <Ionicons name="remove" size={18} color="#111" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
              ListFooterComponent={
                <TouchableOpacity style={[styles.addOpt]} onPress={addOption}>
                  <Ionicons name="add" size={18} color="#111" />
                  <Text style={styles.addOptText}>Add option</Text>
                </TouchableOpacity>
              }
            />

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setOpen(false)}>
                <Text style={styles.actionTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={submit}>
                <Text style={styles.actionText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={resultsOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.resultsCard}>
            <Text style={styles.modalTitle}>Results</Text>
            {resultsData.length === 0 ? (
              <Text style={styles.muted}>No votes yet</Text>
            ) : (
              resultsData.map((r, idx) => (
                <View key={idx} style={styles.resultRow}>
                  <Text style={styles.resultOpt}>{r.option}</Text>
                  <Text style={styles.resultCount}>{r.votes}</Text>
                </View>
              ))
            )}
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={() => setResultsOpen(false)}>
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
    backgroundColor: "rgba(255,255,255,0.7)",
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
  cardHeader: { flexDirection: "row", alignItems: "flex-start" },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "800", color: "#111" },
  cardDate: { color: "#777", marginLeft: 8, fontSize: 12, marginTop: 2 },
  cardSub: { color: "#666", marginTop: 6 },
  optWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  optChip: { backgroundColor: "#f2f4f7", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  optText: { color: "#111" },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  smallBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  secondaryBtn: { backgroundColor: "#eef2ff" },
  dangerBtn: { backgroundColor: "#e11d48" },
  secondaryText: { color: "#111", fontWeight: "700" },
  dangerText: { color: "#fff", fontWeight: "700" },
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
    maxHeight: "80%",
  },
  resultsCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 18,
    padding: 16,
  },
  resultRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  resultOpt: { color: "#111", fontWeight: "700" },
  resultCount: { color: "#111" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 8 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    color: "#111",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  addOpt: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#eef2ff",
    marginTop: 4,
  },
  addOptText: { marginLeft: 6, color: "#111", fontWeight: "700" },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  cancel: { backgroundColor: "#f3f4f6", marginRight: 8 },
  primary: { backgroundColor: "#111" },
  actionText: { color: "#fff", fontWeight: "700" },
  actionTextCancel: { color: "#111", fontWeight: "700" },
});
