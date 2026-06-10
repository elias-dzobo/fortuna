import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { UserData, AppState } from '../types';

interface Props {
  userData: UserData;
  onNavigate: (state: AppState) => void;
}

export const SavingsScreen: React.FC<Props> = ({ userData, onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroLabel}>Total Balance</Text>
                <View style={styles.heroAmountRow}>
                  <Text style={styles.heroAmount}>${userData.savings.toLocaleString()}</Text>
                  <Text style={styles.visibilityIcon}>👁️</Text>
                </View>
              </View>
              <View style={styles.heroIcon}>
                <Text style={styles.savingsIcon}>💰</Text>
              </View>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>↑ $150 this month</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>🏠</Text>
              </View>
              <View>
                <Text style={styles.sectionTitle}>Emergency Fund</Text>
                <Text style={styles.sectionSubtitle}>Goal: 4 months</Text>
              </View>
            </View>
            <View style={styles.sectionRight}>
              <Text style={styles.sectionPercentage}>62%</Text>
              <Text style={styles.sectionSubtext}>2.5 months saved</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '62%' }]} />
          </View>
        </View>

        <View style={styles.accountsSection}>
          <Text style={styles.accountsTitle}>Your Accounts</Text>
          <View style={styles.accountsList}>
            {[
              { name: "High Yield Savings", provider: "Marcus", balance: 5000, icon: "🏦" },
              { name: "Vacation Fund", provider: "Ally", balance: 2000, icon: "✈️" },
              { name: "Regular Checking", provider: "Chase", balance: 1200, icon: "💳" }
            ].map((acc, i) => (
              <View key={i} style={styles.accountCard}>
                <View style={styles.accountLeft}>
                  <View style={styles.accountIcon}>
                    <Text style={styles.accountIconText}>{acc.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.accountName}>{acc.name}</Text>
                    <Text style={styles.accountProvider}>
                      {acc.provider} • ${acc.balance.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Navbar active={AppState.SAVINGS} onNavigate={onNavigate} />
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
    backgroundColor: '#f8f8f5',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(248, 248, 245, 0.8)',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1c180d',
  },
  addButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addIcon: {
    fontSize: 14,
    color: '#eab308',
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 32,
    paddingBottom: 128,
  },
  heroCard: {
    position: 'relative',
    height: 192,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: '#1c180d',
    padding: 24,
  },
  heroGradient: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  visibilityIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  heroIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  savingsIcon: {
    fontSize: 20,
    color: '#eab308',
  },
  heroBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#86efac',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    backgroundColor: '#fee2e2',
    padding: 6,
    borderRadius: 8,
    fontSize: 14,
  },
  sectionIconText: {
    fontSize: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1c180d',
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginLeft: 32,
  },
  sectionRight: {
    alignItems: 'flex-end',
  },
  sectionPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#eab308',
  },
  sectionSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  progressBar: {
    height: 16,
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#eab308',
    borderRadius: 9999,
  },
  accountsSection: {
    gap: 16,
  },
  accountsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c180d',
  },
  accountsList: {
    gap: 12,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountIconText: {
    fontSize: 24,
    color: '#475569',
  },
  accountName: {
    fontWeight: '700',
    color: '#1c180d',
  },
  accountProvider: {
    fontSize: 14,
    color: '#64748b',
  },
  chevron: {
    fontSize: 24,
    color: '#cbd5e1',
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
    zIndex: 20,
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
