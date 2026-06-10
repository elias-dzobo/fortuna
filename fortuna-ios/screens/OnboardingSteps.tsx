import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { UserData } from '../types';

interface Props {
  onComplete: (data: Partial<UserData>) => void;
}

export const OnboardingSteps: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: 24,
    workSituation: "Employed full-time",
    income: 4500
  });
  const incomeInputRef = useRef<TextInput>(null);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ ...formData, vibe: "Main Character Energy", name: "Sarah", monthlyIncome: formData.income });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.stepTitle}>Let's get to know your money situation</Text>
            <Text style={styles.stepSubtitle}>No judgment, just vibes.</Text>
            <View style={styles.privacyBox}>
              <Text style={styles.privacyIcon}>🔒</Text>
              <Text style={styles.privacyText}>Everything stays on your device</Text>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.emoji}>🎂</Text>
            <Text style={styles.stepTitle}>How old are you?</Text>
            <View style={styles.ageControls}>
              <TouchableOpacity 
                onPress={() => setFormData(f => ({...f, age: Math.max(18, f.age-1)}))} 
                style={styles.ageButton}
              >
                <Text style={styles.ageButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.ageDisplay}>{formData.age}</Text>
              <TouchableOpacity 
                onPress={() => setFormData(f => ({...f, age: f.age+1}))} 
                style={styles.ageButton}
              >
                <Text style={styles.ageButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.emoji}>💼</Text>
            <Text style={styles.stepTitle}>What's your work situation?</Text>
            <View style={styles.optionsContainer}>
              {["Employed full-time", "Freelance / Self-employed", "Student", "Retired"].map(opt => (
                <TouchableOpacity 
                  key={opt}
                  onPress={() => setFormData(f => ({...f, workSituation: opt}))}
                  style={[
                    styles.optionButton,
                    formData.workSituation === opt && styles.optionButtonSelected
                  ]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                  {formData.workSituation === opt && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.emoji}>💵</Text>
            <Text style={styles.stepTitle}>What's your monthly income?</Text>
            <Text style={styles.incomeSubtitle}>After taxes, take-home pay</Text>
            <View style={styles.incomeContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput 
                ref={incomeInputRef}
                value={formData.income.toString()}
                onChangeText={(text) => setFormData(f => ({...f, income: Number(text) || 0}))}
                style={styles.incomeInput}
                keyboardType="numeric"
                textAlign="center"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  incomeInputRef.current?.blur();
                }}
              />
            </View>
            <View style={styles.quickSelectContainer}>
              {[3000, 5000, 8000].map(v => (
                <TouchableOpacity 
                  key={v}
                  onPress={() => {
                    setFormData(f => ({...f, income: v}));
                    Keyboard.dismiss();
                    incomeInputRef.current?.blur();
                  }}
                  style={styles.quickSelectButton}
                >
                  <Text style={styles.quickSelectText}>${v/1000}k</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.progressContainer}>
            {[0, 1, 2, 3].map(i => (
              <View 
                key={i} 
                style={[
                  styles.progressDot,
                  i === step && styles.progressDotActive
                ]} 
              />
            ))}
          </View>
          
          {renderStep()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => {
                Keyboard.dismiss();
                nextStep();
              }}
              style={styles.continueButton}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                {step === 0 ? "Let's Do This" : "Continue"}
              </Text>
              <Text style={styles.continueButtonIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#102217',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 24,
  },
  progressDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressDotActive: {
    width: 32,
    backgroundColor: '#2cc350',
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 120,
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepSubtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
  },
  privacyBox: {
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyIcon: {
    fontSize: 20,
    color: '#a78bfa',
  },
  privacyText: {
    color: '#e9d5ff',
    fontWeight: '600',
  },
  ageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  ageButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageButtonText: {
    fontSize: 30,
    color: '#ffffff',
  },
  ageDisplay: {
    fontSize: 72,
    fontWeight: '700',
    color: '#ffffff',
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    borderColor: '#2cc350',
    backgroundColor: 'rgba(44, 195, 80, 0.1)',
  },
  optionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  checkIcon: {
    color: '#2cc350',
    fontSize: 20,
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: '800',
    color: '#2cc350',
  },
  incomeInput: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 72,
    fontWeight: '800',
    color: '#2cc350',
    width: 200,
    borderWidth: 0,
  },
  incomeSubtitle: {
    color: '#9ca3af',
    marginBottom: 40,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  quickSelectButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickSelectText: {
    color: '#d1d5db',
  },
  buttonContainer: {
    padding: 24,
    marginTop: 'auto',
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#2cc350',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 18,
  },
  continueButtonIcon: {
    color: '#000000',
    fontSize: 18,
  },
});
