import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import { UserData, AppState, Message } from '../types';
import { useFortunaModel } from '../hooks/useFortunaModel';

interface Props {
  userData: UserData;
  onNavigate: (state: AppState) => void;
}

/**
 * Detect if a message is about a purchase to show insight card
 */
const detectPurchaseIntent = (message: string): boolean => {
  const purchaseKeywords = ['buy', 'purchase', 'afford', 'spend', 'get a', 'want to get', 'laptop', 'phone', 'car'];
  const lower = message.toLowerCase();
  return purchaseKeywords.some(keyword => lower.includes(keyword));
};

export const ChatScreen: React.FC<Props> = ({ userData, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      parts: [{ text: `Hey ${userData.name || 'there'}! How can I help with your money today?` }],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const latestModelResponseRef = useRef('');

  // Initialize the Fortuna AI model
  const { 
    isReady, 
    error: modelError,
    response,
    sendMessage,
    isGenerating,
    messageHistory,
  } = useFortunaModel();

  useEffect(() => {
    latestModelResponseRef.current = response;
  }, [response]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  // Show model loading status (optional - can be used for debugging)
  useEffect(() => {
    if (modelError) {
      console.warn('Fortuna Model Error:', modelError);
    }
    if (isReady) {
      console.log('Fortuna Model Ready');
    }
  }, [isReady, modelError]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ text: input }],
      timestamp: new Date()
    };

    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Generate response using the Fortuna model
      let responseText: string;
      
      if (isReady) {
        // Use the on-device AI model
        await sendMessage(userInput);
        responseText = latestModelResponseRef.current || "I couldn't generate a response. Try again.";
      } else {
        // Fallback to basic response if model not ready
        responseText = "I'm still warming up! Give me a moment and try again. 🔄";
      }

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: responseText }],
        timestamp: new Date()
      };

      // Add insight card for purchase-related queries
      if (detectPurchaseIntent(userInput)) {
        const savingsImpact = userData.savings < 5000 ? -15 : -5;
        modelMessage.insight = {
          savings: userData.savings,
          impact: `${savingsImpact}%`,
          recommendation: userData.savings < 5000 
            ? "Wait 2 months to stay safe." 
            : "You're in good shape, but keep an eye on your emergency fund."
        };
      }

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: "Oops, my vibe is off. Try again? 😅" }],
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, userData, isReady, sendMessage, messageHistory]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => onNavigate(AppState.DASHBOARD)} 
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Fortuna</Text>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
          <Text style={styles.headerSubtitle}>Your financial bestie 💚</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Image 
            source={{ uri: 'https://picsum.photos/100' }} 
            style={styles.avatarImage}
          />
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>Today, 9:41 AM</Text>
        </View>

        {messages.map(m => (
          <View 
            key={m.id} 
            style={[
              styles.messageRow,
              m.role === 'user' && styles.messageRowUser
            ]}
          >
            {m.role === 'model' && (
              <View style={styles.modelAvatar}>
                <Text style={styles.modelIcon}>🤖</Text>
              </View>
            )}
            <View style={[
              styles.messageBubble,
              m.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleModel
            ]}>
              <Text style={[
                styles.messageText,
                m.role === 'user' ? styles.messageTextUser : styles.messageTextModel
              ]}>
                {m.parts[0].text}
              </Text>
              {m.insight && (
                <View style={styles.insightCard}>
                  <View style={styles.insightRow}>
                    <View style={styles.insightLeft}>
                      <Text style={styles.insightIcon}>💰</Text>
                      <Text style={styles.insightLabel}>Current Savings</Text>
                    </View>
                    <Text style={styles.insightValue}>${m.insight.savings.toLocaleString()}</Text>
                  </View>
                  <View style={styles.insightRow}>
                    <View style={styles.insightLeft}>
                      <Text style={styles.insightIcon}>⚠️</Text>
                      <Text style={styles.insightLabel}>Emerg. Fund Impact</Text>
                    </View>
                    <Text style={[styles.insightValue, styles.insightValueWarning]}>
                      {m.insight.impact}
                    </Text>
                  </View>
                  <View style={styles.recommendationCard}>
                    <Text style={styles.recommendationIcon}>✓</Text>
                    <View>
                      <Text style={styles.recommendationLabel}>Recommendation</Text>
                      <Text style={styles.recommendationText}>{m.insight.recommendation}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, styles.typingDotDelay1]} />
            <View style={[styles.typingDot, styles.typingDotDelay2]} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput 
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            placeholder="Ask anything..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={styles.input}
            multiline
          />
          <Text style={styles.micIcon}>🎤</Text>
        </View>
        <TouchableOpacity 
          onPress={handleSend} 
          style={styles.sendButton}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#112115',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#ffffff',
  },
  lockIcon: {
    fontSize: 14,
    color: '#2cc350',
  },
  headerSubtitle: {
    color: 'rgba(44, 195, 80, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 24,
  },
  dateBadge: {
    alignItems: 'center',
    marginBottom: 32,
  },
  dateText: {
    fontSize: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  messageRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  modelAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1c3321',
    borderWidth: 1,
    borderColor: 'rgba(44, 195, 80, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  modelIcon: {
    fontSize: 14,
    color: '#2cc350',
  },
  messageBubble: {
    maxWidth: '80%',
    gap: 4,
  },
  messageBubbleUser: {
    alignItems: 'flex-end',
  },
  messageBubbleModel: {
    alignItems: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    color: '#ffffff',
    padding: 16,
    borderRadius: 16,
  },
  messageTextUser: {
    backgroundColor: '#2cc350',
    color: '#000000',
    borderBottomRightRadius: 4,
  },
  messageTextModel: {
    backgroundColor: '#1c3321',
    color: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  insightCard: {
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightIcon: {
    fontSize: 14,
    color: '#60a5fa',
  },
  insightLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  insightValueWarning: {
    color: '#f87171',
  },
  recommendationCard: {
    backgroundColor: 'rgba(44, 195, 80, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    flexDirection: 'row',
    gap: 8,
  },
  recommendationIcon: {
    fontSize: 14,
    color: '#2cc350',
  },
  recommendationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2cc350',
    textTransform: 'uppercase',
  },
  recommendationText: {
    fontSize: 14,
    color: '#ffffff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: 'fit-content',
    borderRadius: 9999,
    marginLeft: 48,
  },
  typingDot: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
  },
  typingDotDelay1: {
    animationDelay: '0.2s',
  },
  typingDotDelay2: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 8,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: '#1c3321',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 9999,
    height: 48,
    paddingLeft: 20,
    paddingRight: 48,
    fontSize: 14,
    color: '#ffffff',
  },
  micIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2cc350',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendIcon: {
    fontSize: 20,
    color: '#000000',
  },
  bottomSpacer: {
    height: 24,
  },
});
