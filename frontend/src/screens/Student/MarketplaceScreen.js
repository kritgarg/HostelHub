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

const MarketplaceScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  
  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse"); // "browse" | "mine"
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/marketplace/items");
      // Handle different response structures if necessary
      const data = res.data.items || res.data || [];
      setItems(data);
    } catch (err) {
      console.log("Error fetching items:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };

  const handleAddItem = async () => {
    if (!newItemTitle || !newItemDesc || !newItemPrice) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    
    try {
      setSubmitting(true);
      await API.post("/marketplace/item", {
        title: newItemTitle,
        description: newItemDesc,
        price: parseFloat(newItemPrice)
      });
      setModalVisible(false);
      setNewItemTitle("");
      setNewItemDesc("");
      setNewItemPrice("");
      fetchItems(); // Refresh list
      Alert.alert("Success", "Item listed successfully! 🎉");
    } catch (err) {
      console.log("Create Item Error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Failed to list item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/marketplace/item/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
          } catch (err) {
            Alert.alert("Error", "Failed to delete item.");
          }
        }
      }
    ]);
  };

  const handleMarkSold = async (id) => {
    try {
      await API.put(`/marketplace/item/${id}/mark-sold`);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "SOLD" } : i));
    } catch (err) {
      Alert.alert("Error", "Failed to update status.");
    }
  };

  const handleBuy = (item) => {
    const seller = item.user || {};
    Alert.alert(
      "Contact Seller",
      `Interested in ${item.title}?\n\nSeller: ${seller.name || "Unknown"}\nRoom: ${seller.roomNumber || "N/A"}\nEmail: ${seller.email || "N/A"}`,
      [{ text: "Got it" }]
    );
  };

  // Filter items based on tab and search
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "mine") {
      return item.userId === user.id && matchesSearch;
    } else {
      // Browse tab: show only available items (unless it's my own item, but usually browse is for buying)
      // Let's show all available items not owned by me, or just all available items.
      // Usually "Browse" implies buying from others.
      return item.status === "AVAILABLE" && matchesSearch;
    }
  });

  const renderItem = ({ item }) => {
    const isMine = item.userId === user.id;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
          {item.status === "SOLD" && (
            <View style={styles.soldBadge}>
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.sellerInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.sellerName}>
              {isMine ? "You" : item.user?.name || "Student"}
            </Text>
          </View>
          
          {activeTab === "mine" ? (
            <View style={styles.actionRow}>
              {item.status === "AVAILABLE" && (
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.soldBtn]} 
                  onPress={() => handleMarkSold(item.id)}
                >
                  <Text style={styles.actionBtnText}>Mark Sold</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionBtn, styles.deleteBtn]} 
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.buyBtn} 
              onPress={() => handleBuy(item)}
            >
              <Text style={styles.buyBtnText}>Buy Now</Text>
            </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Marketplace</Text>
        </View>
        <Text style={styles.headerSubtitle}>Buy & sell with your hostel mates! 🛍️</Text>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for books, gadgets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "browse" && styles.activeTab]} 
            onPress={() => setActiveTab("browse")}
          >
            <Text style={[styles.tabText, activeTab === "browse" && styles.activeTabText]}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "mine" && styles.activeTab]} 
            onPress={() => setActiveTab("mine")}
          >
            <Text style={[styles.tabText, activeTab === "mine" && styles.activeTabText]}>My Listings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="basket-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No items found.</Text>
            </View>
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add Item Modal */}
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
              <Text style={styles.modalTitle}>Sell an Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.formScroll}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Engineering Physics Book"
                value={newItemTitle}
                onChangeText={setNewItemTitle}
              />
              
              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 500"
                value={newItemPrice}
                onChangeText={setNewItemPrice}
                keyboardType="numeric"
              />
              
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe condition, reason for selling..."
                value={newItemDesc}
                onChangeText={setNewItemDesc}
                multiline
              />
              
              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handleAddItem}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Post Listing</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111",
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
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#888",
  },
  activeTabText: {
    color: "#111",
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceTag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: "#1976d2",
    fontWeight: "800",
    fontSize: 16,
  },
  soldBadge: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  soldText: {
    color: "#c62828",
    fontWeight: "700",
    fontSize: 12,
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
    marginBottom: 15,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerName: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  buyBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
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
  soldBtn: {
    backgroundColor: "#f0f2f5",
  },
  actionBtnText: {
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
    bottom: 110, // Above tab bar
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111",
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
    backgroundColor: "#111",
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

export default MarketplaceScreen;
