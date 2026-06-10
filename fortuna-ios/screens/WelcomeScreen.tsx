import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <View style={styles.container}>
      {/* Decorative Blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>✨</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Your money,{'\n'}your vibe.
          </Text>
          <Text style={styles.subtitle}>
            Private. Personal. Powered by AI that stays on your phone.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={onStart}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.buttonIcon}>→</Text>
        </TouchableOpacity>
        
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </View>
        <View style={styles.indicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#102217',
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '50%',
    height: '30%',
    backgroundColor: 'rgba(44, 195, 80, 0.1)',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob2: {
    position: 'absolute',
    bottom: '20%',
    right: '-5%',
    width: '40%',
    height: '30%',
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 9999,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 195, 80, 0.3)',
    borderRadius: 24,
    opacity: 0.3,
  },
  iconBox: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#1a2a1e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconText: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
    marginHorizontal: 'auto',
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 37.4,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    gap: 24,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    backgroundColor: '#2cc350',
    borderRadius: 12,
    shadowColor: '#2cc350',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 20,
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: '500',
  },
  signInLink: {
    color: '#2cc350',
    fontWeight: '700',
    marginLeft: 4,
  },
  indicator: {
    height: 4,
    width: '33%',
    backgroundColor: '#374151',
    borderRadius: 9999,
    alignSelf: 'center',
    marginTop: 16,
  },
});
