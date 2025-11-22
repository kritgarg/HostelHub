import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "notices_cache";


const NoticeCard = React.memo(({ item, onMarkAsRead, formatDate }) => {
  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(item.id);
  }, [item.id, onMarkAsRead]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={[styles.badge, item.read ? styles.badgeGray : styles.badgeYellow]}>
          <Text style={styles.badgeText}>{item.read ? "Read" : "New"}</Text>
        </View>
      </View>
      <Text style={styles.desc}>{item.message}</Text>
      <View style={styles.actionsRow}>
        <Text style={styles.date}>{formatDate(item.createdAt || item.date)}</Text>
        {!item.read && (
          <TouchableOpacity 
            style={[styles.smallBtn, styles.primaryBtn]} 
            onPress={handleMarkAsRead}
          >
            <Text style={styles.primaryText}>Mark as read</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default function NoticesScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const headerBg = "#ffd6a5";

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await API.put(`/notifications/${id}/read`);
      // Update cache
      const currentCache = await AsyncStorage.getItem(CACHE_KEY);
      if (currentCache) {
        const parsed = JSON.parse(currentCache);
        const updated = parsed.map(n => n.id === id ? { ...n, read: true } : n);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      setNotices(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    }
  }, []);

  const loadNotices = useCallback(async (pageNum = 1, shouldRefresh = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const res = await API.get(`/notifications?page=${pageNum}&limit=15`);
      const payload = res?.data;
      let newItems = [];
      
      if (Array.isArray(payload)) newItems = payload;
      else if (Array.isArray(payload?.items)) newItems = payload.items;
      else if (Array.isArray(payload?.data?.items)) newItems = payload.data.items;
      
      if (shouldRefresh) {
        setNotices(newItems);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newItems)); // Cache first page
      } else {
        setNotices(prev => [...prev, ...newItems]);
      }

      setHasMore(newItems.length === 15);
      setPage(pageNum);
    } catch (e) {
      console.log("Failed to load notices", e);
      setHasMore(false); // Stop pagination on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  // Load from cache initially
  useEffect(() => {
    const loadCache = async () => {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setNotices(JSON.parse(cached));
      }
      loadNotices(1, true);
    };
    loadCache();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotices(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !searchQuery) {
      loadNotices(page + 1);
    }
  };

  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const query = searchQuery.trim().toLowerCase();
    return notices.filter(n => 
      n.title?.toLowerCase().includes(query) || 
      n.message?.toLowerCase().includes(query)
    );
  }, [searchQuery, notices]);

  const renderHeader = () => (
    <View style={[styles.hero, { backgroundColor: headerBg }]}> 
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
        <Ionicons name="chevron-back" size={18} color="#111" />
      </TouchableOpacity>
      <Text style={styles.kicker}>Notices</Text>
      <Text style={styles.heading}>Stay updated with latest announcements. 📢</Text>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#555" />
        <TextInput
          placeholder="Search notices..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#777"
        />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return <View style={{ height: 100 }} />;
    return <ActivityIndicator size="small" color="#111" style={{ marginVertical: 20 }} />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredNotices}
        renderItem={({ item }) => <NoticeCard item={item} onMarkAsRead={markAsRead} formatDate={formatDate} />}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!loading && <Text style={styles.muted}>No notices found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e7ff",
  },
  listContent: {
    paddingBottom: 20,
  },
  hero: { 
    margin: 16, 
    marginBottom: 24,
    padding: 20, 
    borderRadius: 26, 
    borderBottomLeftRadius: 6, 
    borderBottomRightRadius: 46 
  },
  backBtn: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: "rgba(255,255,255,0.7)", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 10 
  },
  kicker: { 
    color: "#1a1a1a", 
    opacity: 0.7,
    fontWeight: "600",
    fontSize: 13
  },
  heading: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#111", 
    marginTop: 4, 
    marginBottom: 14 
  },
  searchWrap: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(255,255,255,0.6)", 
    borderRadius: 16, 
    paddingHorizontal: 12, 
    height: 44 
  },
  searchInput: { 
    flex: 1, 
    paddingHorizontal: 8, 
    color: "#111",
    fontWeight: "500"
  },
  muted: { 
    color: "#777", 
    textAlign: "center", 
    paddingVertical: 40,
    fontSize: 16
  },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 22, 
    padding: 18, 
    marginHorizontal: 16,
    marginBottom: 14, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 12, 
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#ffd6a5"
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8
  },
  cardTitle: { 
    flex: 1, 
    fontSize: 17, 
    fontWeight: "700", 
    color: "#111",
    marginRight: 10
  },
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  badgeText: { 
    fontWeight: "700", 
    color: "#111",
    fontSize: 11,
    textTransform: "uppercase"
  },
  badgeYellow: { 
    backgroundColor: "#fff9c4" 
  },
  badgeGray: { 
    backgroundColor: "#f3f4f6" 
  },
  desc: { 
    color: "#444", 
    lineHeight: 22,
    fontSize: 15
  },
  actionsRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0"
  },
  date: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500"
  },
  smallBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 10 
  },
  primaryBtn: { 
    backgroundColor: "#111" 
  },
  primaryText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 13
  },
});
