import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const mock = {
  user: { name: 'Krit' },
  stats: {
    leaveBalanceDays: 8,
    leaveTrend: +2,
    activeComplaints: 1,
    complaintsTrend: -2,
    pollsAvailable: 3,
    pollsTrend: +1,
  },
};

function StatCard({ value, unit, title, trend }) {
  const positive = trend > 0;
  return (
    <View style={styles.card}>
      <Text style={styles.statValue}>
        {value}
        {unit ? ` ${unit}` : ''}
      </Text>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={[styles.trendPill, positive ? styles.trendUp : styles.trendDown]}> 
        <Ionicons
          name={positive ? 'trending-up' : 'trending-down'}
          size={14}
          color="#fff"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.trendText}>
          {positive ? '+' : ''}
          {trend}
        </Text>
      </View>
    </View>
  );
}

export default function Home() {
  const { user, stats } = mock;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const actions = [
    {
      key: 'apply-leave',
      title: 'Apply Leave',
      subtitle: 'Submit a new leave request',
      icon: 'document-text-outline',
      color: '#3b82f6',
      to: 'Services',
    },
    {
      key: 'report-issue',
      title: 'Report Issue',
      subtitle: 'File a complaint or issue',
      icon: 'chatbubble-ellipses-outline',
      color: '#ef4444',
      to: 'Services',
    },
    {
      key: 'check-meals',
      title: 'Check Meals',
      subtitle: "View today's menu",
      icon: 'restaurant-outline',
      color: '#22c55e',
      to: 'Services',
    },
    {
      key: 'qr-access',
      title: 'QR Access',
      subtitle: 'Scan or generate QR codes',
      icon: 'qr-code-outline',
      color: '#64748b',
      to: 'QR Access',
    },
  ];
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 24 + insets.bottom }]}
        contentInsetAdjustmentBehavior="automatic"
      >
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <View style={styles.brandWrap}>
          <View style={styles.brandIconWrap}>
            <Text style={styles.brandIconText}>H</Text>
          </View>
          <Text style={styles.brandText}>HostelHub</Text>
        </View>
        <View style={styles.appBarRight}>
          <Ionicons name="notifications-outline" size={22} color="#1c1c1e" style={{ marginRight: 16 }} />
          <Ionicons name="person-outline" size={22} color="#1c1c1e" />
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBlock}>
        <Text style={styles.greetingTitle}>Welcome back, {user.name}!</Text>
        <Text style={styles.greetingSubtitle}>Here's what's happening in your hostel today</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsList}>
        <StatCard value={stats.leaveBalanceDays} unit="days" title="Leave Balance" trend={stats.leaveTrend} />
        <StatCard value={stats.activeComplaints} title="Active Complaints" trend={stats.complaintsTrend} />
        <StatCard value={stats.pollsAvailable} title="Polls Available" trend={stats.pollsTrend} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map(a => (
          <TouchableOpacity
            key={a.key}
            style={styles.actionCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(a.to)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: a.color + '22' }]}> 
              <View style={[styles.actionIconInner, { backgroundColor: a.color }]}>
                <Ionicons name={a.icon} size={18} color="#fff" />
              </View>
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>{a.title}</Text>
              <Text style={styles.actionSubtitle}>{a.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  container: {
    paddingBottom: 24,
    backgroundColor: '#f7f7f9',
  },
  appBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e9e9ed',
  },
  menuButton: {
    padding: 6,
    borderRadius: 8,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandIconText: {
    color: '#fff',
    fontWeight: '700',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingBlock: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsList: {
    paddingHorizontal: 12,
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e9e9ed',
  },
  statValue: {
    color: '#0a84ff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  statTitle: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 10,
  },
  trendPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64748b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  trendUp: {
    backgroundColor: '#22c55e',
  },
  trendDown: {
    backgroundColor: '#ef4444',
  },
  trendText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e9e9ed',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionIconInner: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {},
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  quickItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 12,
    color: '#1c1c1e',
    textAlign: 'center',
  },
});
