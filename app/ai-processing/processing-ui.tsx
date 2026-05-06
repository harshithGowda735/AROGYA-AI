import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RefreshCw, Zap } from 'lucide-react-native';
import * as Reanimated from 'react-native-reanimated';
import { TFLiteEngine } from '../../services/tfliteEngine';
import { StorageService } from '../../services/storage';

export default function ProcessingUI() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    "Validating Image Quality",
    "Extracting Dermatological Features",
    "Running AI Inference (MobileNetV2)",
    "Generating Clinical Result"
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setStep(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    const runInference = async () => {
      try {
        const result = await TFLiteEngine.classifyImage(uri as string);
        await StorageService.saveDiagnosis({
          ...result,
          imageUri: uri,
        });
        
        // Brief delay for better UX
        setTimeout(() => {
          router.replace({
            pathname: '/(user)/result',
            params: { result: JSON.stringify(result) }
          });
        }, 1500);
      } catch (e) {
        console.error(e);
        router.back();
      }
    };

    runInference();

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationBox}>
           <RefreshCw size={48} color="#00E5FF" style={styles.spinner} />
        </View>

        <Text style={styles.title}>Analyzing Scan...</Text>
        <Text style={styles.subtitle}>
          Neural processing active. No cloud dependency.
        </Text>

        <View style={styles.stepsContainer}>
          {steps.map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepText, i > step && styles.pendingStep]}>{s}</Text>
                {i === step && <ActivityIndicator size="small" color="#00E5FF" />}
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  { width: i < step ? '100%' : i === step ? '50%' : '0%' }
                ]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.badge}>
          <Zap size={14} color="#00E5FF" />
          <Text style={styles.badgeText}>LOCAL INFERENCE MODE</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
    justifyContent: 'center',
    padding: 40,
  },
  content: {
    alignItems: 'center',
  },
  animationBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  spinner: {
    // Rotation would be handled by Reanimated in a full impl
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 48,
  },
  stepsContainer: {
    width: '100%',
    gap: 20,
  },
  stepRow: {
    gap: 8,
  },
  stepInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pendingStep: {
    color: 'rgba(255,255,255,0.2)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00E5FF',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 60,
  },
  badgeText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
