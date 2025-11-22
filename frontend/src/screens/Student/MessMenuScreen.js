import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MessMenuScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const res = await API.get("/mess/menu");
      setMenus(res.data?.items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const currentMenu = menus.find(m => m.day === selectedDay);

  const handleFeedback = async (rating) => {
    if (!currentMenu) return;
    if (voting) return;

    try {
      setVoting(true);
      await API.post("/mess/feedback", {
        menuId: currentMenu.id,
        rating
      });
      Alert.alert("Thank You!", "Your feedback has been recorded. 🍽️");
    } catch (e) {
      Alert.alert("Error", "Failed to submit feedback");
    } finally {
      setVoting(false);
    }
  };

  const renderMealCard = (title, items, icon, color) => (
    <View style={[styles.mealCard, { borderLeftColor: color }]}>
      <View style={styles.mealHeader}>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <Text style={styles.mealTitle}>{title}</Text>
      </View>
      <Text style={styles.mealItems}>
        {items || "No menu updated"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.kicker}>Mess Menu</Text>
        <Text style={styles.heading}>What's cooking today? 🍳</Text>
      </View>

      <View style={styles.daySelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, selectedDay === day && styles.activeDayChip]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.activeDayText]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMenus} />}
      >
        {currentMenu ? (
          <>
            {renderMealCard("Breakfast", currentMenu.breakfast, "sunny-outline", "#FFB74D")}
            {renderMealCard("Lunch", currentMenu.lunch, "restaurant-outline", "#FF7043")}
            {renderMealCard("Dinner", currentMenu.dinner, "moon-outline", "#5C6BC0")}

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Rate today's menu</Text>
              <View style={styles.feedbackButtons}>
                <TouchableOpacity 
                  style={[styles.feedbackBtn, styles.likeBtn]} 
                  onPress={() => handleFeedback(1)}
                  disabled={voting}
                >
                  <Ionicons name="thumbs-up" size={24} color="#4CAF50" />
                  <Text style={styles.feedbackText}>Good</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.feedbackBtn, styles.dislikeBtn]} 
                  onPress={() => handleFeedback(-1)}
                  disabled={voting}
                >
                  <Ionicons name="thumbs-down" size={24} color="#FF5252" />
                  <Text style={styles.feedbackText}>Bad</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="fast-food-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No menu available for {selectedDay}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e7ff",
  },
  hero: {
    backgroundColor: "#f5cf6a",
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
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  kicker: {
    color: "#111",
    opacity: 0.6,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    lineHeight: 30,
  },
  daySelectorContainer: {
    marginBottom: 16,
  },
  daySelector: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dayChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  activeDayChip: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeDayText: {
    color: "#fff",
  },
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 40,
  },
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  mealItems: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginTop: 8,
    alignItems: "center",
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  feedbackButtons: {
    flexDirection: "row",
    gap: 20,
  },
  feedbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  likeBtn: {
    backgroundColor: "#e8f5e9",
    borderColor: "#c8e6c9",
  },
  dislikeBtn: {
    backgroundColor: "#ffebee",
    borderColor: "#ffcdd2",
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
});
