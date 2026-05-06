import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { FloatingChatbot } from '../components/FloatingChatbot';

export default function Layout() {
  return (
    <View style={styles.outer}>
      <StatusBar style="light" />
      <View style={styles.mobileFrame}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0A0A0F' },
            animation: 'fade',
          }}
        />
        {/* Floating AI Chatbot — visible on every screen */}
        <FloatingChatbot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#050508',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    width: Platform.OS === 'web' ? 420 : '100%',
    maxWidth: 420,
    height: '100%',
    maxHeight: Platform.OS === 'web' ? 900 : '100%',
    backgroundColor: '#0A0A0F',
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      web: { boxShadow: '0 0 40px rgba(0, 229, 255, 0.1)' },
      default: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 40,
      },
    }),
  },
});
