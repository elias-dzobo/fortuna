import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { UserData, AppState } from '../types';

interface Props {
  userData: UserData;
  onNavigate: (state: AppState) => void;
}

export const Dashboard: React.FC<Props> = ({ userData, onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.greeting}>Good morning, {userData.name} ☀️</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/200' }} 
            style={styles.avatar}
          />
          <View style={styles.notificationDot} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Net Worth Hero */}
        <TouchableOpacity 
          onPress={() => onNavigate(AppState.CHAT)}
          style={styles.netWorthCard}
          activeOpacity={0.9}
        >
          <View style={styles.netWorthGlow} />
          <View style={styles.netWorthContent}>
            <View style={styles.netWorthHeader}>
              <View style={styles.netWorthLeft}>
                <Text style={styles.netWorthLabel}>Total Net Worth</Text>
                <View style={styles.netWorthAmountRow}>
                  <Text style={styles.netWorthAmount}>$23,400</Text>
                  <Text style={styles.visibilityIcon}>👁️</Text>
                </View>
              </View>
              <View style={styles.netWorthIcon}>
                <Text style={styles.sparkleIcon}>✨</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusIcon}>📈</Text>
              <Text style={styles.statusText}>Glow Up in Progress ✨</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            onPress={() => onNavigate(AppState.SAVINGS)} 
            style={styles.statCard}
            activeOpacity={0.8}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, styles.savingsIcon]}>
                <Text style={styles.statIconText}>💰</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>+12%</Text>
              </View>
            </View>
            <View>
              <Text style={styles.statLabel}>Savings</Text>
              <Text style={styles.statValue}>${userData.savings.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onNavigate(AppState.DEBT)} 
            style={styles.statCard}
            activeOpacity={0.8}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, styles.debtIcon]}>
                <Text style={styles.statIconText}>💳</Text>
              </View>
            </View>
            <View>
              <Text style={styles.statLabel}>Debt</Text>
              <Text style={styles.statValue}>$12,800</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Current Focus */}
        <View style={styles.focusSection}>
          <View style={styles.focusHeader}>
            <Text style={styles.focusTitle}>Current Focus</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.focusCard}>
            <View style={styles.focusCardHeader}>
              <View style={styles.focusCardLeft}>
                <View style={styles.focusIcon}>
                  <Text style={styles.focusIconText}>🛡️</Text>
                </View>
                <Text style={styles.focusCardTitle}>Emergency Fund</Text>
              </View>
              <Text style={styles.focusCardAmount}>$4,500 / $10k</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
          </View>
        </View>

        {/* AI Insight Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Text style={styles.aiIconText}>✨</Text>
          </View>
          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>Fortuna AI Tip</Text>
            <Text style={styles.aiText}>
              Moving <Text style={styles.aiBold}>$50</Text> to savings today keeps you on track for your trip!
            </Text>
          </View>
        </View>
      </ScrollView>

      <Navbar active={AppState.DASHBOARD} onNavigate={onNavigate} />
    </View>
  );
};

const Navbar = ({ active, onNavigate }: { active: AppState, onNavigate: (s: AppState) => void }) => (
  <View style={styles.navbar}>
    <TouchableOpacity 
      onPress={() => onNavigate(AppState.DASHBOARD)} 
      style={styles.navButton}
    >
      <Text style={[styles.navIcon, active === AppState.DASHBOARD && styles.navIconActive]}>🏠</Text>
      <Text style={[styles.navLabel, active === AppState.DASHBOARD && styles.navLabelActive]}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={() => onNavigate(AppState.SAVINGS)} 
      style={styles.navButton}
    >
      <Text style={[styles.navIcon, active === AppState.SAVINGS && styles.navIconActive]}>💰</Text>
      <Text style={[styles.navLabel, active === AppState.SAVINGS && styles.navLabelActive]}>Savings</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={() => onNavigate(AppState.DEBT)} 
      style={styles.navButton}
    >
      <Text style={[styles.navIcon, active === AppState.DEBT && styles.navIconActive]}>💳</Text>
      <Text style={[styles.navLabel, active === AppState.DEBT && styles.navLabelActive]}>Debt</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={() => onNavigate(AppState.CHAT)} 
      style={styles.navButton}
    >
      <Text style={[styles.navIcon, active === AppState.CHAT && styles.navIconActive]}>💬</Text>
      <Text style={[styles.navLabel, active === AppState.CHAT && styles.navLabelActive]}>Chat</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f6f8f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 40,
  },
  welcomeText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  greeting: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 24,
    paddingBottom: 96,
  },
  netWorthCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#13ec46',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  netWorthGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: -32,
    marginTop: -32,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  netWorthContent: {
    position: 'relative',
    zIndex: 10,
    gap: 24,
  },
  netWorthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  netWorthLeft: {
    gap: 4,
  },
  netWorthLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  netWorthAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  netWorthAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  visibilityIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  netWorthIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    height: 'fit-content',
  },
  sparkleIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusIcon: {
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: '#ffffff',
    color: '#16a34a',
    borderRadius: 9999,
    padding: 2,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsIcon: {
    backgroundColor: '#dbeafe',
  },
  debtIcon: {
    backgroundColor: '#fee2e2',
  },
  statIconText: {
    fontSize: 20,
  },
  statBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
  },
  focusSection: {
    gap: 12,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focusTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  viewAllText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 14,
  },
  focusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  focusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  focusCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusIcon: {
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 8,
  },
  focusIconText: {
    fontSize: 20,
  },
  focusCardTitle: {
    color: '#0f172a',
    fontWeight: '700',
  },
  focusCardAmount: {
    color: '#64748b',
    fontSize: 14,
  },
  progressBar: {
    height: 12,
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#13ec46',
    borderRadius: 9999,
  },
  aiCard: {
    backgroundColor: '#f3e8ff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  aiIcon: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 9999,
    height: 'fit-content',
  },
  aiIconText: {
    fontSize: 20,
    color: '#9333ea',
  },
  aiContent: {
    gap: 4,
    flex: 1,
  },
  aiTitle: {
    color: '#581c87',
    fontWeight: '700',
    fontSize: 14,
  },
  aiText: {
    color: '#6b21a8',
    fontSize: 14,
  },
  aiBold: {
    fontWeight: '700',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 32,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 24,
    color: '#94a3b8',
  },
  navIconActive: {
    color: '#16a34a',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  navLabelActive: {
    color: '#16a34a',
  },
});
