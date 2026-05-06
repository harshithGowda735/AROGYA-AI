import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, ShieldCheck } from 'lucide-react-native';

export const AIStatusCard = () => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Zap size={20} color="#00E5FF" />
      <Text style={styles.title}>OFFLINE NEURAL ENGINE</Text>
    </View>
    <View style={styles.statusRow}>
      <ShieldCheck size={16} color="#50E3C2" />
      <Text style={styles.statusText}>100% On-Device Protection</Text>
    </View>
    <Text style={styles.description}>
      No data leaves this device. Analysis is performed locally using TFLite.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statusText: {
    color: '#50E3C2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    lineHeight: 16,
  },
});
