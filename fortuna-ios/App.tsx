import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingSteps } from './screens/OnboardingSteps';
import { Dashboard } from './screens/Dashboard';
import { ChatScreen } from './screens/ChatScreen';
import { SavingsScreen } from './screens/SavingsScreen';
import { DebtScreen } from './screens/DebtScreen';
import { UserData, AppState } from './types';

import { ExecuTorchTestScreen } from './screens/ExecuTorchTestScreen'; // Added import

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.EXECUTORCH_TEST); // Set initial state to EXECUTORCH_TEST
  const [userData, setUserData] = useState<UserData>({
    name: "Sarah",
    age: 24,
    workSituation: "Employed full-time",
    monthlyIncome: 4500,
    debts: [
      { id: '1', name: 'Credit Card', balance: 2400, apr: 19.9, type: 'credit_card' },
      { id: '2', name: 'Student Loan', balance: 10400, apr: 5.2, type: 'student_loan' }
    ],
    savings: 8200,
    vibe: "Main Character Energy"
  });

  const navigateTo = (state: AppState) => {
    setAppState(state);
  };

  const handleOnboardingComplete = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
    navigateTo(AppState.DASHBOARD);
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onStart={() => navigateTo(AppState.ONBOARDING)} />;
      case AppState.ONBOARDING:
        return <OnboardingSteps onComplete={handleOnboardingComplete} />;
      case AppState.DASHBOARD:
        return <Dashboard userData={userData} onNavigate={navigateTo} />;
      case AppState.CHAT:
        return <ChatScreen userData={userData} onNavigate={navigateTo} />;
      case AppState.SAVINGS:
        return <SavingsScreen userData={userData} onNavigate={navigateTo} />;
      case AppState.DEBT:
        return <DebtScreen userData={userData} onNavigate={navigateTo} />;
      case AppState.EXECUTORCH_TEST:
        return <ExecuTorchTestScreen onNavigate={navigateTo} />;
      default:
        return <WelcomeScreen onStart={() => navigateTo(AppState.ONBOARDING)} />;
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#102217" translucent={false} />
      <SafeAreaView style={styles.container}>
        {renderScreen()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102217',
  },
});
