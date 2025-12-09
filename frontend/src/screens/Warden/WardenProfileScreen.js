import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Alert, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/api";

export default function WardenProfileScreen() {
  const { user: ctxUser, logout, refreshUser } = useContext(AuthContext);
  const [me, setMe] = useState(ctxUser || null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [secOpen, setSecOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Playful Theme Colors (Warden - Warm Orange/Yellow)
  const heroBg = "#f5cf6a"; 
  const cardBg = "#ffffff";

  const initials = useMemo(() => {
    const name = (me?.name || "Warden").trim();
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || "W").toUpperCase();
  }, [me?.name]);

  const memberSince = useMemo(() => {
    if (!me?.createdAt) return null;
    try { return new Date(me.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); } catch { return null; }
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
      if (refreshUser) refreshUser();
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
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: heroBg }]}> 
          <View style={styles.heroContent}>
            <View style={styles.avatarContainer}>
              {me?.avatar ? (
                <>
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <ActivityIndicator color="#fff" />
                  </View>
                  <Image source={{ uri: me.avatar }} style={styles.avatar} />
                </>
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#010101ff', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 32, fontWeight: '800', color: '#fff' }}>{initials}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarBtn} onPress={openEdit}>
                <Ionicons name="pencil" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{me?.name || "Warden"}</Text>
            <Text style={styles.roleBadge}>WARDEN</Text>
            
            <View style={styles.statsRow}>
              {memberSince && (
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={16} color="#111" style={{ opacity: 0.7 }} />
                  <Text style={styles.statText}>Joined {memberSince}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.rowItem}>
              <View style={[styles.iconBox, { backgroundColor: "#fff8e1" }]}>
                <Ionicons name="person" size={20} color="#e0b76fff" />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{me?.name || "-"}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <View style={[styles.iconBox, { backgroundColor: "#e8f5e9" }]}>
                <Ionicons name="mail" size={20} color="#4CAF50" />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{me?.email || "-"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={() => setSecOpen(true)}>
            <View style={[styles.iconBox, { backgroundColor: "#f3e5f5" }]}>
              <Ionicons name="lock-closed" size={20} color="#9C27B0" />
            </View>
            <Text style={styles.actionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { marginTop: 12 }]} onPress={logout}>
            <View style={[styles.iconBox, { backgroundColor: "#ffebee" }]}>
              <Ionicons name="log-out" size={20} color="#F44336" />
            </View>
            <Text style={[styles.actionText, { color: "#F44336" }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Edit Name Modal */}
      <Modal visible={editOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.modalSub}>Update your display name</Text>
            
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#999"
              autoFocus
            />
            
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setEditOpen(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={saveName} disabled={loading}>
                <Text style={styles.btnTextPrimary}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={secOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Security</Text>
            <Text style={styles.modalSub}>Update your password</Text>

            <TextInput
              placeholder="Current Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setSecOpen(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={changePassword} disabled={loading}>
                <Text style={styles.btnTextPrimary}>Update Password</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderColor: "#fff" 
  },
  avatarPlaceholder: {
    position: 'absolute',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: "#111",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#111", 
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: "#111",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBody: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
    marginLeft: 60,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)", 
    justifyContent: "center",
    padding: 20,
  },
  modalCard: { 
    backgroundColor: "#fff", 
    borderRadius: 28, 
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: "#111", 
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
    marginBottom: 24,
  },
  input: { 
    backgroundColor: "#f8f9fa", 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 52, 
    color: "#111", 
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  actions: { 
    flexDirection: "row", 
    gap: 12,
    marginTop: 12,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: "#f3f4f6",
  },
  btnPrimary: {
    backgroundColor: "#111",
  },
  btnTextCancel: {
    color: "#111",
    fontWeight: "700",
    fontSize: 15,
  },
  btnTextPrimary: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
