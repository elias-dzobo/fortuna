import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { UserData, AppState } from '../types';

interface Props {
  userData: UserData;
  onNavigate: (state: AppState) => void;
}

export const DebtScreen: React.FC<Props> = ({ userData, onNavigate }) => {
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Debt</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Debt Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryGlow} />
          <View style={styles.summaryContent}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Total Balance</Text>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeIcon}>📉</Text>
                <Text style={styles.summaryBadgeText}>$400 this month 🎉</Text>
              </View>
            </View>
            <Text style={styles.summaryAmount}>$12,800</Text>
            <View style={styles.summaryProgress}>
              <View style={styles.summaryProgressBar}>
                <View style={[styles.summaryProgressFill, { width: '35%' }]} />
              </View>
              <Text style={styles.summaryProgressText}>35% Paid Off</Text>
            </View>
          </View>
        </View>

        {/* Strategy Control */}
        <View style={styles.strategySection}>
          <View style={styles.strategyHeader}>
            <Text style={styles.strategyTitle}>Payoff Strategy</Text>
            <TouchableOpacity>
              <Text style={styles.editPlanText}>Edit Plan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.strategyToggle}>
            <TouchableOpacity 
              onPress={() => setStrategy('avalanche')}
              style={[
                styles.strategyButton,
                strategy === 'avalanche' && styles.strategyButtonActive
              ]}
            >
              <Text style={styles.strategyIcon}>⚡</Text>
              <Text style={[
                styles.strategyButtonText,
                strategy === 'avalanche' && styles.strategyButtonTextActive
              ]}>
                Avalanche
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setStrategy('snowball')}
              style={[
                styles.strategyButton,
                strategy === 'snowball' && styles.strategyButtonActive
              ]}
            >
              <Text style={styles.strategyIcon}>❄️</Text>
              <Text style={[
                styles.strategyButtonText,
                strategy === 'snowball' && styles.strategyButtonTextActive
              ]}>
                Snowball
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateCard}>
            <View style={styles.dateIcon}>
              <Text style={styles.dateIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.dateLabel}>Estimated Debt-Free Date</Text>
              <Text style={styles.dateValue}>March 2028</Text>
            </View>
          </View>
        </View>

        {/* Debt List */}
        <View style={styles.debtsSection}>
          <Text style={styles.debtsTitle}>Your Debts</Text>
          <View style={styles.debtsList}>
            {userData.debts.map(debt => (
              <View key={debt.id} style={styles.debtCard}>
                <View style={styles.debtHeader}>
                  <View style={styles.debtLeft}>
                    <View style={[
                      styles.debtIcon,
                      debt.type === 'credit_card' ? styles.debtIconRed : styles.debtIconBlue
                    ]}>
                      <Text style={styles.debtIconText}>
                        {debt.type === 'credit_card' ? '💳' : '🎓'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.debtName}>{debt.name}</Text>
                      <View style={[
                        styles.aprBadge,
                        debt.apr > 15 ? styles.aprBadgeRed : styles.aprBadgeBlue
                      ]}>
                        <Text style={[
                          styles.aprText,
                          debt.apr > 15 ? styles.aprTextRed : styles.aprTextBlue
                        ]}>
                          {debt.apr}% APR
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.debtRight}>
                    <Text style={styles.debtBalance}>${debt.balance.toLocaleString()}</Text>
                    <Text style={styles.debtLabel}>Remaining</Text>
                  </View>
                </View>
                <View style={styles.debtProgress}>
                  <View style={styles.debtProgressHeader}>
                    <Text style={styles.debtProgressLabel}>Progress</Text>
                    <Text style={styles.debtProgressValue}>
                      {debt.type === 'credit_card' ? '20%' : '45%'}
                    </Text>
                  </View>
                  <View style={styles.debtProgressBar}>
                    <View style={[
                      styles.debtProgressFill,
                      { width: debt.type === 'credit_card' ? '20%' : '45%' }
                    ]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Text style={styles.insightIconText}>✨</Text>
          </View>
          <View>
            <Text style={styles.insightTitle}>Fortuna AI Insight</Text>
            <Text style={styles.insightText}>
              Switching to the <Text style={styles.insightBold}>Avalanche</Text> method could save you{' '}
              <Text style={styles.insightHighlight}>$450</Text> in interest this year.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Navbar active={AppState.DEBT} onNavigate={onNavigate} />
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
    backgroundColor: '#221e10',
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
    backgroundColor: 'rgba(34, 30, 16, 0.8)',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#eab308',
    color: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    fontWeight: '700',
    fontSize: 14,
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 32,
    paddingBottom: 128,
  },
  summaryCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#2c2616',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: -40,
    marginTop: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: 80,
  },
  summaryContent: {
    position: 'relative',
    zIndex: 10,
    gap: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  summaryBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryBadgeIcon: {
    fontSize: 12,
    color: '#86efac',
  },
  summaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#86efac',
  },
  summaryAmount: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#ffffff',
  },
  summaryProgress: {
    gap: 8,
  },
  summaryProgressBar: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  summaryProgressFill: {
    height: '100%',
    backgroundColor: '#eab308',
  },
  summaryProgressText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#6b7280',
  },
  strategySection: {
    gap: 16,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strategyTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#ffffff',
  },
  editPlanText: {
    color: '#eab308',
    fontSize: 14,
    fontWeight: '700',
  },
  strategyToggle: {
    backgroundColor: '#2c2616',
    padding: 4,
    borderRadius: 9999,
    flexDirection: 'row',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  strategyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  strategyButtonActive: {
    backgroundColor: '#eab308',
  },
  strategyIcon: {
    fontSize: 18,
  },
  strategyButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#9ca3af',
  },
  strategyButtonTextActive: {
    color: '#000000',
  },
  dateCard: {
    backgroundColor: '#2c2616',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
  },
  dateIconText: {
    fontSize: 24,
    color: '#eab308',
  },
  dateLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  debtsSection: {
    gap: 16,
  },
  debtsTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#ffffff',
  },
  debtsList: {
    gap: 12,
  },
  debtCard: {
    backgroundColor: '#2c2616',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 16,
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  debtLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  debtIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  debtIconRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  debtIconBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  debtIconText: {
    fontSize: 14,
  },
  debtName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffff',
  },
  aprBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  aprBadgeRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  aprBadgeBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  aprText: {
    fontSize: 10,
    fontWeight: '700',
  },
  aprTextRed: {
    color: '#fca5a5',
  },
  aprTextBlue: {
    color: '#93c5fd',
  },
  debtRight: {
    alignItems: 'flex-end',
  },
  debtBalance: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  debtLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  debtProgress: {
    gap: 4,
  },
  debtProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#9ca3af',
  },
  debtProgressLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  debtProgressValue: {
    fontSize: 10,
    color: '#9ca3af',
  },
  debtProgressBar: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  debtProgressFill: {
    height: '100%',
    backgroundColor: '#eab308',
  },
  insightCard: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    flexDirection: 'row',
    gap: 16,
  },
  insightIcon: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightIconText: {
    fontSize: 20,
    color: '#c084fc',
  },
  insightTitle: {
    color: '#e9d5ff',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  insightText: {
    color: 'rgba(233, 213, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  insightBold: {
    color: '#ffffff',
    fontWeight: '700',
  },
  insightHighlight: {
    color: '#eab308',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(26, 23, 12, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#9ca3af',
  },
  navIconActive: {
    color: '#eab308',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
  },
  navLabelActive: {
    color: '#eab308',
  },
});
