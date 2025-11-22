import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import API, { getAvatarUrl } from "../../api/api";

export default function StudentProfileScreen() {
  const { user: ctxUser, logout } = useContext(AuthContext);
  const [me, setMe] = useState(ctxUser || null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [secOpen, setSecOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const headerBg = "#e6f3ff";

  const avatarSrc = useMemo(() => {
    const [firstName = "", lastName = ""] = (me?.name || "").split(" ");
    return me?.avatar || getAvatarUrl(firstName, lastName);
  }, [me]);

  const memberSince = useMemo(() => {
    if (!me?.createdAt) return null;
    try { return new Date(me.createdAt).toLocaleDateString(); } catch { return null; }
  }, [me?.createdAt]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/me");
      setMe(res?.data || ctxUser || null);
    } catch (_) {
      setMe(ctxUser || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = () => {
    setName(me?.name || "");
    setEditOpen(true);
  };

  const saveName = async () => {
    if (!name.trim()) return Alert.alert("Validation", "Name cannot be empty");
    try {
      setLoading(true);
      await API.patch("/users/me", { name: name.trim() });
      setEditOpen(false);
      await load();
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to update profile");
    } finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return Alert.alert("Validation", "Fill all password fields");
    if (newPassword !== confirmPassword) return Alert.alert("Validation", "New password and confirm password do not match");
    try {
      setLoading(true);
      await API.patch("/users/me", { oldPassword, newPassword });
      setSecOpen(false);
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      Alert.alert("Success", "Password updated");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to change password");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <View style={styles.heroTop}>
            <Image source={{ uri: avatarSrc }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{me?.name || "Your Name"}</Text>
              {memberSince && (
                <Text style={styles.sub}>Member since {memberSince}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
              <Ionicons name="create-outline" size={18} color="#111" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.rowItem}>
            <Ionicons name="person-circle-outline" size={20} color="#555" />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{me?.name || "-"}</Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Ionicons name="mail-outline" size={20} color="#555" />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{me?.email || "-"}</Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#555" />
            <View style={styles.rowBody}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{me?.role || "-"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.actionRow} onPress={() => setSecOpen(true)}>
            <Ionicons name="key-outline" size={20} color="#111" />
            <Text style={styles.actionText}>Change password</Text>
            <Ionicons name="chevron-forward" size={18} color="#111" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#111" }]} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit name modal */}
      <Modal visible={editOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setEditOpen(false)}>
                <Text style={styles.actionTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={saveName} disabled={loading}>
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Security modal */}
      <Modal visible={secOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              placeholder="Old password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#888"
            />
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancel]} onPress={() => setSecOpen(false)}>
                <Text style={styles.actionTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={changePassword} disabled={loading}>
                <Text style={styles.actionText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f2ebe7ff" },
  hero: { margin: 16, padding: 16, borderRadius: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 47},
  heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#eee" },
  name: { fontSize: 20, fontWeight: "800", color: "#111" },
  sub: { marginTop: 4, color: "#555" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.7)", paddingHorizontal: 10, height: 34, borderRadius: 16 },
  editText: { color: "#111", fontWeight: "700" },
  section: { backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 16, marginTop: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 10 },
  rowItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  rowBody: { flex: 1 },
  label: { color: "#777", fontWeight: "700" },
  value: { color: "#111", fontWeight: "700", marginTop: 2 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  button: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 10 },
  input: { backgroundColor: "#f3f4f6", borderRadius: 12, paddingHorizontal: 12, height: 44, color: "#111", marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  cancel: { backgroundColor: "#f3f4f6", marginRight: 8 },
  primary: { backgroundColor: "#111" },
  actionText: { color: "#fff", fontWeight: "700" },
  actionTextCancel: { color: "#111", fontWeight: "700" },
});
