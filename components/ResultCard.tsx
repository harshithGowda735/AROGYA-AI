import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';

interface ResultCardProps {
  prediction: {
    condition: string;
    probability: number;
    risk: string;
    advice: string;
  };
}

export const ResultCard: React.FC<ResultCardProps> = ({ prediction }) => {
  const isHighRisk = prediction.risk === 'High';

  return (
    <View style={[styles.card, isHighRisk ? styles.highRiskCard : styles.lowRiskCard]}>
      <View style={styles.header}>
        {isHighRisk ? (
          <AlertCircle size={24} color="#FF4B2B" />
        ) : (
          <CheckCircle2 size={24} color="#50E3C2" />
        )}
        <View>
          <Text style={styles.label}>PROBABLE CONDITION</Text>
          <Text style={styles.condition}>{prediction.condition}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>CONFIDENCE</Text>
          <Text style={styles.statValue}>{(prediction.probability * 100).toFixed(1)}%</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>RISK LEVEL</Text>
          <Text style={[styles.statValue, { color: isHighRisk ? '#FF4B2B' : '#50E3C2' }]}>
            {prediction.risk}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.adviceLabel}>CLINICAL ADVICE</Text>
      <Text style={styles.adviceText}>{prediction.advice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  lowRiskCard: {
    borderColor: 'rgba(80, 227, 194, 0.3)',
  },
  highRiskCard: {
    borderColor: 'rgba(255, 75, 43, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  label: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  condition: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  adviceLabel: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  adviceText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
});
