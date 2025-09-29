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
  
  // Mock notifications
  const notifications = [
    {
      id: 'n1',
      title: 'Leave Request Approved',
      message: 'Your leave request for March 15-17 has been approved.',
      time: '2 hours ago',
      status: 'success', 
    },
    {
      id: 'n2',
      title: 'Mess Menu Updated',
      message: 'Vote for next week menu',
      time: '4 hours ago',
      status: 'success', 
    },
    {
      id: 'n3',
      title: 'Hostel Rules',
      message: 'Hostel rules updated',
      time: '1 hour ago',
      status: 'success', 
    },
  ];
  
  // Mock upcoming events
  const events = [
    {
      id: 'e1',
      title: 'Hostel Meeting',
      subtitle: 'Monthly residents meeting',
      meta: 'Tomorrow 6 PM',
    },
    {
      id: 'e2',
      title: 'Mess Menu Poll',
      subtitle: "Vote for next week's menu",
      meta: 'Ends in 2 days',
    },
    {
      id: 'e3',
      title: 'Cultural Night',
      subtitle: 'Annual cultural celebration',
      meta: 'March 25',
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

      
      {/* Recent Notifications */}
      <View style={styles.sectionCardWrap}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="notifications-outline" size={18} color="#1c1c1e" style={{ marginRight: 8 }} />
          <Text style={styles.sectionHeaderTitle}>Recent Notifications</Text>
        </View>
        <Text style={styles.sectionHeaderSubtitle}>
          Stay updated with the latest announcements and updates
        </Text>

        {/* Notification List (show 1-3 recent) */}
        <View style={styles.notificationList}>
          {notifications.slice(0, 3).map((n) => (
            <View key={n.id} style={styles.notificationItem}>
              <View style={styles.notificationTitleRow}>
                <View
                  style={[
                    styles.statusDot,
                    n.status === 'success' && { backgroundColor: '#22c55e' },
                    n.status === 'warning' && { backgroundColor: '#f59e0b' },
                    n.status === 'info' && { backgroundColor: '#3b82f6' },
                  ]}
                />
                <Text style={styles.notificationTitle}>{n.title}</Text>
              </View>
              <Text style={styles.notificationMessage}>{n.message}</Text>
              <Text style={styles.notificationTime}>{n.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.sectionCardWrap}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="calendar-outline" size={18} color="#1c1c1e" style={{ marginRight: 8 }} />
          <Text style={styles.sectionHeaderTitle}>Upcoming Events</Text>
        </View>
        <Text style={styles.sectionHeaderSubtitle}>
          Don't miss these important hostel events and announcements
        </Text>

        <View style={styles.eventList}>
          {events.map((e) => (
            <View key={e.id} style={styles.eventItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{e.title}</Text>
                <Text style={styles.eventSubtitle}>{e.subtitle}</Text>
              </View>
              <View style={styles.eventMetaPill}>
                <Text style={styles.eventMetaText}>{e.meta}</Text>
              </View>
            </View>
          ))}
        </View>
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
  sectionCardWrap: {
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e9e9ed',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
  },
  sectionHeaderSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 10,
  },
  notificationList: {
    gap: 10,
  },
  notificationItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#374151',
  },
  notificationTime: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  eventList: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 2,
  },
  eventSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  eventMetaPill: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  eventMetaText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
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
