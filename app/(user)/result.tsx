import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share2, Home, ArrowLeft } from 'lucide-react-native';
import { ResultCard } from '../../components/ResultCard';

export default function ResultScreen() {
  const { result } = useLocalSearchParams();
  const router = useRouter();
  
  const data = JSON.parse(result as string);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Result</Text>
        <TouchableOpacity style={styles.backButton}>
          <Share2 color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ResultCard prediction={data.topPrediction} />

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Disclaimer</Text>
          <Text style={styles.warningText}>
            This is an AI-assisted screening tool, not a final medical diagnosis. 
            Please consult with a qualified healthcare professional or an ASHA worker.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/(user)/home')}
        >
          <Home size={20} color="#000" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  warningBox: {
    backgroundColor: 'rgba(255, 193, 7, 0.05)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  warningTitle: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  warningText: {
    color: 'rgba(255, 193, 7, 0.6)',
    fontSize: 12,
    lineHeight: 18,
  },
  homeButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    marginBottom: 60,
  },
  homeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
