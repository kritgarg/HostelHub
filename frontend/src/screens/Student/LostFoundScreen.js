import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/api";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LostFoundScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  
  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("LOST"); // "LOST" | "FOUND"
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [reportType, setReportType] = useState("LOST"); // Default to current tab
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      // If tab is MINE, fetch all and filter. Else fetch by type.
      const url = activeTab === "MINE" ? "/lostfound" : `/lostfound?type=${activeTab}`;
      const res = await API.get(url);
      let data = res.data.items || res.data || [];
      
      if (activeTab === "MINE") {
        data = data.filter(item => item.userId === user.id);
      }
      
      setItems(data);
    } catch (err) {
      console.log("Error fetching lost/found items:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, user.id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };

  const handleReport = async () => {
    if (!title || !description || !location) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    
    try {
      setSubmitting(true);
      // If we are in MINE tab, default to LOST or let user choose? 
      // The modal has a type selector, so reportType state handles it.
      await API.post("/lostfound/report", {
        type: reportType,
        title,
        description,
        location
      });
      setModalVisible(false);
      setTitle("");
      setDescription("");
      setLocation("");
      
      // Refresh list
      fetchItems();
      
      Alert.alert("Success", "Report submitted successfully! 📝");
    } catch (err) {
      console.log("Report Error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  // ... (handleResolve, handleDelete remain same)

  const handleResolve = async (id) => {
    Alert.alert("Confirm Resolve", "Mark this item as resolved (Found/Returned)?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Resolve",
        onPress: async () => {
          try {
            await API.put(`/lostfound/${id}/resolve`);
            // Optimistic update
            setItems(prev => prev.map(i => i.id === id ? { ...i, resolved: true } : i));
          } catch (err) {
            Alert.alert("Error", "Failed to resolve item.");
          }
        }
      }
    ]);
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this report?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/lostfound/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
          } catch (err) {
            Alert.alert("Error", "Failed to delete item.");
          }
        }
      }
    ]);
  };

  const openModal = () => {
    // If in MINE tab, default to LOST?
    setReportType(activeTab === "MINE" ? "LOST" : activeTab); 
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const isMine = item.userId === user.id;
    const isResolved = item.resolved;
    
    // Theme colors based on type
    const themeColor = item.type === "LOST" ? "#ef5350" : "#66bb6a";
    const bgColor = item.type === "LOST" ? "#ffebee" : "#e8f5e9";

    return (
      <View style={[styles.card, { borderLeftColor: themeColor }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, { backgroundColor: bgColor }]}>
            <Text style={[styles.typeText, { color: themeColor }]}>{item.type}</Text>
          </View>
          {isResolved && (
            <View style={styles.resolvedBadge}>
              <Text style={styles.resolvedText}>RESOLVED</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.reporterInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.reporterName}>
              {isMine ? "You" : item.user?.name || "Student"}
            </Text>
          </View>
          
          {isMine && (
            <View style={styles.actionRow}>
              {!isResolved && (
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.resolveBtn]} 
                  onPress={() => handleResolve(item.id)}
                >
                  <Text style={styles.resolveBtnText}>
                    {item.type === "LOST" ? "Found It!" : "Returned"}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionBtn, styles.deleteBtn]} 
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lost & Found</Text>
        </View>
        <Text style={styles.headerSubtitle}>Report lost items or help others find theirs! 🔍</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "LOST" && styles.activeTabLost]} 
            onPress={() => setActiveTab("LOST")}
          >
            <Text style={[styles.tabText, activeTab === "LOST" && styles.activeTabText]}>Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "FOUND" && styles.activeTabFound]} 
            onPress={() => setActiveTab("FOUND")}
          >
            <Text style={[styles.tabText, activeTab === "FOUND" && styles.activeTabText]}>Found</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "MINE" && styles.activeTabMine]} 
            onPress={() => setActiveTab("MINE")}
          >
            <Text style={[styles.tabText, activeTab === "MINE" && styles.activeTabText]}>My Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Ionicons 
                name={activeTab === "LOST" ? "search-outline" : activeTab === "FOUND" ? "gift-outline" : "folder-open-outline"} 
                size={60} 
                color="#ccc" 
              />
              <Text style={styles.emptyText}>
                {activeTab === "LOST" ? "No lost items reported." : activeTab === "FOUND" ? "No found items reported." : "You haven't reported anything yet."}
              </Text>
            </View>
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: activeTab === "LOST" ? "#ef5350" : activeTab === "FOUND" ? "#66bb6a" : "#42a5f5" }]} 
        onPress={openModal}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Report Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.formScroll}>
              {/* Type Selector */}
              <View style={styles.typeSelector}>
                <TouchableOpacity 
                  style={[styles.typeOption, reportType === "LOST" && styles.typeOptionLost]}
                  onPress={() => setReportType("LOST")}
                >
                  <Text style={[styles.typeOptionText, reportType === "LOST" && styles.typeOptionTextActive]}>Lost Something</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.typeOption, reportType === "FOUND" && styles.typeOptionFound]}
                  onPress={() => setReportType("FOUND")}
                >
                  <Text style={[styles.typeOptionText, reportType === "FOUND" && styles.typeOptionTextActive]}>Found Something</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>What is it?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Blue Water Bottle"
                value={title}
                onChangeText={setTitle}
              />
              
              <Text style={styles.label}>Where?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Common Room, 2nd Floor"
                value={location}
                onChangeText={setLocation}
              />
              
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any specific details..."
                value={description}
                onChangeText={setDescription}
                multiline
              />
              
              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: reportType === "LOST" ? "#ef5350" : "#66bb6a" }]} 
                onPress={handleReport}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f2f5",
    borderRadius: 15,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTabLost: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#ef5350",
  },
  activeTabFound: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#66bb6a",
  },
  activeTabMine: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#42a5f5",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#888",
  },
  activeTabText: {
    color: "#111",
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontWeight: "700",
    fontSize: 12,
  },
  resolvedBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resolvedText: {
    color: "#888",
    fontWeight: "700",
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  reporterInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reporterName: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  resolveBtn: {
    backgroundColor: "#f0f2f5",
  },
  resolveBtnText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: "#ffcdd2",
    paddingHorizontal: 10,
  },
  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },
  formScroll: {
    paddingBottom: 40,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f0f2f5",
    borderRadius: 15,
    padding: 5,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  typeOptionLost: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#ef5350",
  },
  typeOptionFound: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#66bb6a",
  },
  typeOptionText: {
    fontWeight: "600",
    color: "#888",
  },
  typeOptionTextActive: {
    color: "#111",
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#111",
    borderWidth: 1,
    borderColor: "#eee",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
    marginTop: 30,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LostFoundScreen;
