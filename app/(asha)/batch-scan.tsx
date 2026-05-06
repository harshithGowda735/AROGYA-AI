import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView } from '../../components/CameraView';
import { TFLiteEngine } from '../../services/tfliteEngine';
import { User, CheckCircle } from 'lucide-react-native';

export default function BatchScan() {
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const [scannedPatients, setScannedPatients] = useState<any[]>([]);

  const handleCapture = async (uri: string) => {
    setIsCapturing(false);
    const result = await TFLiteEngine.classifyImage(uri);
    setScannedPatients([...scannedPatients, { 
      id: Date.now(), 
      name: `Patient ${scannedPatients.length + 1}`,
      result 
    }]);
  };

  return (
    <View style={styles.container}>
      {!isCapturing ? (
        <View style={styles.dashboard}>
          <View style={styles.header}>
            <Text style={styles.title}>Batch Session</Text>
            <Text style={styles.subtitle}>{scannedPatients.length} Patients Scanned</Text>
          </View>

          <FlatList 
            data={scannedPatients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.patientCard}>
                <User color="#50E3C2" size={20} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientResult}>{item.result.topPrediction.condition}</Text>
                </View>
                <CheckCircle color="#50E3C2" size={16} />
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No patients scanned yet.</Text>
              </View>
            )}
          />

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.scanBtn}
              onPress={() => setIsCapturing(true)}
            >
              <Text style={styles.scanBtnText}>Scan Next Patient</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.finishBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.finishBtnText}>Finish Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView 
          onClose={() => setIsCapturing(false)} 
          onCapture={handleCapture} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  dashboard: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  patientName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  patientResult: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
  },
  footer: {
    paddingBottom: 40,
    gap: 12,
  },
  scanBtn: {
    backgroundColor: '#50E3C2',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  scanBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  finishBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});
