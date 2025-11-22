import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Memoized notice card component to prevent unnecessary re-renders
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
  const [searchQuery, setSearchQuery] = useState("");
  const headerBg = "#ffd6a5";

  // Memoize functions to prevent recreation
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      // Optimistic update - update UI immediately
      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice.id === id ? { ...notice, read: true } : notice
        )
      );
      
      // Then call API
      await API.put(`/notifications/${id}/read`);
    } catch (e) {
      // Revert on error
      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice.id === id ? { ...notice, read: false } : notice
        )
      );
    }
  }, []);

  // Memoize filtered notices to prevent recalculation on every render
  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const query = searchQuery.trim().toLowerCase();
    return notices.filter(notice => 
      notice.title?.toLowerCase().includes(query) || 
      notice.message?.toLowerCase().includes(query)
    );
  }, [searchQuery, notices]);

  // Debounced search to prevent excessive filtering
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load notices only once on mount
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = useCallback(async () => {
    if (loading) return; // Prevent duplicate requests
    
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      const payload = res?.data;
      let list = [];
      if (Array.isArray(payload)) list = payload;
      else if (Array.isArray(payload?.items)) list = payload.items;
      else if (Array.isArray(payload?.data?.items)) list = payload.data.items;
      else if (Array.isArray(payload?.data)) list = payload.data;
      setNotices(list);
    } catch (e) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Memoized render function for FlatList
  const renderNotice = useCallback(({ item }) => (
    <NoticeCard 
      item={item} 
      onMarkAsRead={markAsRead} 
      formatDate={formatDate} 
    />
  ), [markAsRead, formatDate]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id?.toString(), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </TouchableOpacity>
          <Text style={styles.kicker}>Notices</Text>
          <Text style={styles.heading}>Stay updated with latest announcements from hostel management.</Text>
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

        <View style={styles.listWrap}>
          {loading && <Text style={styles.muted}>Loading...</Text>}
          {!loading && filteredNotices.length === 0 && <Text style={styles.muted}>No notices</Text>}
          {!loading && filteredNotices.length > 0 && (
            <FlatList
              data={filteredNotices}
              renderItem={renderNotice}
              keyExtractor={keyExtractor}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={10}
              getItemLayout={(data, index) => ({
                length: 120, // Approximate height of each card
                offset: 120 * index,
                index,
              })}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e7ff",
  },
  hero: { 
    margin: 16, 
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
    opacity: 0.7 
  },
  heading: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#111", 
    marginTop: 6, 
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
    color: "#111" 
  },
  listWrap: { 
    paddingHorizontal: 16, 
    marginTop: 8 
  },
  muted: { 
    color: "#777", 
    textAlign: "center", 
    paddingVertical: 14 
  },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 18, 
    padding: 14, 
    marginBottom: 12, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 10, 
    elevation: 3 
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  cardTitle: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: "800", 
    color: "#111" 
  },
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  badgeText: { 
    fontWeight: "800", 
    color: "#111" 
  },
  badgeYellow: { 
    backgroundColor: "#fef9c3" 
  },
  badgeGray: { 
    backgroundColor: "#e5e7eb" 
  },
  desc: { 
    marginTop: 6, 
    color: "#333" 
  },
  actionsRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginTop: 12 
  },
  date: {
    color: "#666",
    fontSize: 12,
  },
  smallBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 10 
  },
  primaryBtn: { 
    backgroundColor: "#111" 
  },
  primaryText: { 
    color: "#fff", 
    fontWeight: "700" 
  },
});
