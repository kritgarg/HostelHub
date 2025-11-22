import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Animated, Alert, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Animated Poll Card Component
const PollCard = React.memo(({ poll, onVote, formatDate, animatedValue }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleVote = async (optionIndex) => {
    if (poll.hasVoted || isVoting) return;
    
    setIsVoting(true);
    setSelectedOption(optionIndex);
    
    try {
      await onVote(poll.id, optionIndex, poll.options[optionIndex].text);
    } catch (e) {
      setSelectedOption(null);
      const msg = e.response?.data?.message || e.message || "Failed to submit vote";
      Alert.alert("Error", msg);
    } finally {
      setIsVoting(false);
    }
  };

  const getTotalVotes = () => {
    return poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  return (
    <Animated.View style={[styles.pollCard, { transform: [{ scale: animatedValue }] }]}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={() => setExpanded(!expanded)}
        style={styles.cardHeaderTouchable}
      >
        <View style={styles.pollHeader}>
          <View style={styles.pollEmojiContainer}>
             <Ionicons name="stats-chart" size={24} color="#8fb3ff" />
          </View>
          <View style={styles.pollTitleContainer}>
            <Text style={styles.pollTitle}>{poll.title}</Text>
            <View style={styles.statusRow}>
              {!poll.hasVoted ? (
                <View style={styles.statusBadgePending}>
                  <Text style={styles.statusTextPending}>Vote Now</Text>
                </View>
              ) : (
                <View style={styles.statusBadgeVoted}>
                  <Ionicons name="checkmark-circle" size={12} color="#fff" />
                  <Text style={styles.statusTextVoted}>Voted</Text>
                </View>
              )}
              <Text style={styles.pollDate}>{formatDate(poll.createdAt)}</Text>
            </View>
          </View>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#999" 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.pollOptions}>
          <Text style={styles.pollDescription}>{poll.description}</Text>
          {poll.options.map((option, index) => {
            const percentage = getPercentage(option.votes || 0);
            const isSelected = selectedOption === index || poll.hasVoted;
            const isLeading = percentage === Math.max(...poll.options.map(opt => getPercentage(opt.votes || 0))) && percentage > 0;
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionContainer,
                  isSelected && styles.selectedOption,
                  isLeading && !isSelected && styles.leadingOption
                ]}
                onPress={() => handleVote(index)}
                disabled={poll.hasVoted || isVoting}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                      {option.text}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    )}
                  </View>
                  
                  {(poll.hasVoted || isSelected) && (
                    <View style={styles.pollResults}>
                      <View style={styles.percentageBar}>
                        <View 
                          style={[
                            styles.percentageFill, 
                            { width: `${percentage}%` },
                            isLeading && styles.leadingFill
                          ]} 
                        />
                      </View>
                      <Text style={styles.percentageText}>{percentage}%</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          
          <View style={styles.pollFooter}>
            <View style={styles.pollStats}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.pollStatsText}>{getTotalVotes()} votes</Text>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
});

export default function PollsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerBg = "#8fb3ff";

  // Animation values for each poll
  const animatedValues = useMemo(() => [], []);

  // Memoize functions
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  const loadPolls = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const res = await API.get("/polls");
      const payload = res?.data;
      let list = [];
      if (Array.isArray(payload)) list = payload;
      else if (Array.isArray(payload?.items)) list = payload.items;
      else if (Array.isArray(payload?.data?.items)) list = payload.data.items;
      else if (Array.isArray(payload?.data)) list = payload.data;
      
      // Initialize animation values for new polls
      list.forEach((poll, index) => {
        if (!animatedValues[index]) {
          animatedValues[index] = new Animated.Value(0);
          Animated.spring(animatedValues[index], {
            toValue: 1,
            friction: 8,
            tension: 40,
            delay: index * 100,
            useNativeDriver: true,
          }).start();
        }
      });
      
      setPolls(list);
    } catch (e) {
      setPolls([]);
    } finally {
      setLoading(false);
    }
  }, [loading, animatedValues]);

  const handleVote = useCallback(async (pollId, optionIndex, optionText) => {
    try {
      await API.post(`/polls/${pollId}/vote`, { option: optionText });
      
      
      setPolls(prevPolls => 
        prevPolls.map(poll => {
          if (poll.id === pollId) {
            const updatedOptions = [...poll.options];
            updatedOptions[optionIndex] = {
              ...updatedOptions[optionIndex],
              votes: (updatedOptions[optionIndex].votes || 0) + 1
            };
            return { ...poll, options: updatedOptions, hasVoted: true };
          }
          return poll;
        })
      );
    } catch (e) {
      throw e;
    }
  }, []);

  // Memoized filtered polls
  const filteredPolls = useMemo(() => {
    if (!searchQuery.trim()) return polls;
    const query = searchQuery.trim().toLowerCase();
    return polls.filter(poll => 
      poll.title?.toLowerCase().includes(query) || 
      poll.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, polls]);

  useEffect(() => {
    loadPolls();
  }, []);

  const renderPoll = useCallback(({ item, index }) => (
    <PollCard 
      key={item.id}
      poll={item} 
      onVote={handleVote} 
      formatDate={formatDate}
      animatedValue={animatedValues[index] || new Animated.Value(1)}
    />
  ), [handleVote, formatDate, animatedValues]);

  const keyExtractor = useCallback((item) => item.id?.toString(), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: headerBg }]}> 
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </TouchableOpacity>
          <Text style={styles.kicker}>Polls</Text>
          <Text style={styles.heading}>Cast your vote and help improve hostel life! 🗳️</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#555" />
            <TextInput
              placeholder="Search polls..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#777"
            />
          </View>
        </View>

        <View style={styles.listWrap}>
          {loading && <Text style={styles.muted}>Loading polls...</Text>}
          {!loading && filteredPolls.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={60} color="#ccc" />
              <Text style={styles.emptyTitle}>No polls available</Text>
              <Text style={styles.emptyMessage}>
                {searchQuery ? "Try adjusting your search terms" : "Check back later for new polls!"}
              </Text>
            </View>
          )}
          {!loading && filteredPolls.length > 0 && (
            <FlatList
              data={filteredPolls}
              renderItem={renderPoll}
              keyExtractor={keyExtractor}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={50}
              initialNumToRender={5}
              windowSize={10}
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  pollCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8fb3ff",
  },
  pollHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pollEmojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pollEmoji: {
    fontSize: 24,
  },
  pollTitleContainer: {
    flex: 1,
  },
  pollTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  pollDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  pollOptions: {
    marginBottom: 16,
  },
  optionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  selectedOption: {
    backgroundColor: "#e8f5e8",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  leadingOption: {
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  optionContent: {
    padding: 12,
  },
  optionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    flex: 1,
  },
  selectedOptionText: {
    color: "#4CAF50",
    fontWeight: "700",
  },
  pollResults: {
    alignItems: "flex-end",
  },
  percentageBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#e9ecef",
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  percentageFill: {
    height: "100%",
    backgroundColor: "#8fb3ff",
    borderRadius: 3,
  },
  leadingFill: {
    backgroundColor: "#ffc107",
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  pollFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  pollStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  pollStatsText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  pollDate: {
    fontSize: 12,
    color: "#999",
  },
  votedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  votedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 4,
  },
  cardHeaderTouchable: {
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  statusBadgePending: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusTextPending: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusBadgeVoted: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusTextVoted: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
