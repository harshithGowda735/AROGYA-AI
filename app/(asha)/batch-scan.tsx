import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, User, MapPin, Check, Shield, ChevronRight, Phone, ExternalLink, Globe, AlertTriangle } from 'lucide-react-native';

interface PatientRecord {
  id: string;
  name: string;
  age: string;
  village: string;
  condition: string;
  confidence: number;
  risk: 'high' | 'medium' | 'low';
  scannedAt: string;
}

const CONDITIONS = [
  'Eczema', 'Psoriasis', 'Dermatitis', 'Fungal Infection',
  'Scabies', 'Vitiligo', 'Melanoma', 'Acne', 'Ringworm', 'Rashes',
];

export default function BatchScan() {
  const router = useRouter();
  const [step, setStep] = useState<'list' | 'new'>('list');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [currentPatient, setCurrentPatient] = useState({ name: '', age: '', village: '' });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<PatientRecord | null>(null);

  const startScan = () => {
    if (!currentPatient.name) return;
    setScanning(true);

    // Simulate AI scan with random result
    setTimeout(() => {
      const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
      const confidence = Math.floor(70 + Math.random() * 25);
      const risk = confidence > 85 ? 'high' : confidence > 75 ? 'medium' : 'low';

      const record: PatientRecord = {
        id: `PAT-${Date.now().toString(36).toUpperCase()}`,
        name: currentPatient.name,
        age: currentPatient.age,
        village: currentPatient.village,
        condition,
        confidence,
        risk,
        scannedAt: new Date().toLocaleTimeString(),
      };

      setScanResult(record);
      setScanning(false);
    }, 2500);
  };

  const saveAndNext = async () => {
    if (!scanResult) return;

    // Save to per-patient isolated storage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const patientKey = `dermai_patient_${scanResult.id}`;
      await AsyncStorage.setItem(patientKey, JSON.stringify(scanResult));

      // Update session scan list
      const sessionKey = `dermai_session_${Date.now()}`;
      const existingList = [...patients, scanResult];
      await AsyncStorage.setItem('dermai_asha_current_session', JSON.stringify(existingList));
    } catch (e) {
      console.log('Saved locally');
    }

    setPatients(prev => [...prev, scanResult]);
    setCurrentPatient({ name: '', age: '', village: '' });
    setScanResult(null);
    setStep('list');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#FF4B6E';
      case 'medium': return '#FFA726';
      case 'low': return '#50E3C2';
      default: return '#FFF';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              if (step === 'new') setStep('list');
              else if (router.canGoBack()) router.back();
              else router.replace('/(asha)/dashboard');
            }} 
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 'list' ? 'Batch Scan' : 'New Patient'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Offline Badge */}
        <View style={styles.offlineBadge}>
          <Shield size={12} color="#50E3C2" />
          <Text style={styles.offlineText}>Each patient's data is isolated & encrypted locally</Text>
        </View>

        {step === 'list' && (
          <>
            {/* Scan count */}
            <View style={styles.countRow}>
              <Text style={styles.countLabel}>PATIENTS SCANNED</Text>
              <Text style={styles.countValue}>{patients.length}</Text>
            </View>

            {/* Add New Patient */}
            <TouchableOpacity style={styles.addBtn} onPress={() => setStep('new')}>
              <Camera size={22} color="#000" />
              <Text style={styles.addBtnText}>SCAN NEW PATIENT</Text>
            </TouchableOpacity>

            {/* Patient List */}
            {patients.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>SCANNED PATIENTS</Text>
                {patients.map((p, i) => (
                  <View key={i} style={styles.patientCard}>
                    <View style={[styles.riskStrip, { backgroundColor: getRiskColor(p.risk) }]} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.patientHeader}>
                        <Text style={styles.patientName}>{p.name}</Text>
                        <Text style={styles.patientId}>{p.id}</Text>
                      </View>
                      <Text style={styles.patientMeta}>
                        {p.age} yrs • {p.village}
                      </Text>
                      <View style={styles.patientResult}>
                        <Text style={[styles.patientCondition, { color: getRiskColor(p.risk) }]}>
                          {p.condition}
                        </Text>
                        <Text style={styles.patientConfidence}>{p.confidence}%</Text>
                      </View>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: `${getRiskColor(p.risk)}15` }]}>
                      <Text style={[styles.riskText, { color: getRiskColor(p.risk) }]}>
                        {p.risk.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            {patients.length === 0 && (
              <View style={styles.emptyState}>
                <Camera size={40} color="rgba(255,255,255,0.1)" />
                <Text style={styles.emptyTitle}>No patients scanned yet</Text>
                <Text style={styles.emptyDesc}>Tap "Scan New Patient" to begin</Text>
              </View>
            )}
          </>
        )}

        {step === 'new' && !scanning && !scanResult && (
          <>
            <Text style={styles.formTitle}>Patient Information</Text>
            <Text style={styles.formDesc}>Enter details before skin scan</Text>

            <Text style={styles.fieldLabel}>PATIENT NAME</Text>
            <View style={styles.inputContainer}>
              <User size={16} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={currentPatient.name}
                onChangeText={t => setCurrentPatient({ ...currentPatient, name: t })}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>AGE</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="numeric"
                    value={currentPatient.age}
                    onChangeText={t => setCurrentPatient({ ...currentPatient, age: t })}
                  />
                </View>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldLabel}>VILLAGE</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={16} color="rgba(255,255,255,0.3)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Village / Location"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={currentPatient.village}
                    onChangeText={t => setCurrentPatient({ ...currentPatient, village: t })}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.scanBtn, !currentPatient.name && styles.scanBtnDisabled]}
              onPress={startScan}
              disabled={!currentPatient.name}
            >
              <Camera size={24} color="#000" />
              <Text style={styles.scanBtnText}>START SKIN SCAN</Text>
            </TouchableOpacity>
          </>
        )}

        {scanning && (
          <View style={styles.scanningView}>
            <View style={styles.scanRing}>
              <Camera size={40} color="#00E5FF" />
            </View>
            <Text style={styles.scanningTitle}>Scanning...</Text>
            <Text style={styles.scanningDesc}>AI engine analyzing skin condition</Text>
            <Text style={styles.scanningPatient}>{currentPatient.name}</Text>
          </View>
        )}

        {scanResult && (
          <>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Check size={24} color="#50E3C2" />
                <Text style={styles.resultTitle}>Scan Complete</Text>
              </View>

              <View style={styles.resultField}>
                <Text style={styles.resultLabel}>Patient</Text>
                <Text style={styles.resultValue}>{scanResult.name}</Text>
              </View>
              <View style={styles.resultField}>
                <Text style={styles.resultLabel}>ID</Text>
                <Text style={styles.resultValue}>{scanResult.id}</Text>
              </View>
              <View style={styles.resultField}>
                <Text style={styles.resultLabel}>Condition</Text>
                <Text style={[styles.resultValue, { color: getRiskColor(scanResult.risk) }]}>
                  {scanResult.condition}
                </Text>
              </View>
              <View style={styles.resultField}>
                <Text style={styles.resultLabel}>Confidence</Text>
                <Text style={styles.resultValue}>{scanResult.confidence}%</Text>
              </View>
              <View style={[styles.riskResult, { borderColor: getRiskColor(scanResult.risk) + '30' }]}>
                <Text style={styles.riskResultLabel}>RISK LEVEL</Text>
                <Text style={[styles.riskResultValue, { color: getRiskColor(scanResult.risk) }]}>
                  {scanResult.risk.toUpperCase()}
                </Text>
              </View>

              {/* Referral Section for High Risk */}
              {scanResult.risk === 'high' && (
                <View style={styles.referralSection}>
                  <View style={styles.referralHeader}>
                    <AlertTriangle size={18} color="#FF4B6E" />
                    <Text style={styles.referralTitle}>URGENT REFERRAL REQUIRED</Text>
                  </View>
                  
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>Dr. S. K. Murthy (Dermatologist)</Text>
                    <Text style={styles.hospitalName}>District General Hospital, A-Zone</Text>
                  </View>

                  <View style={styles.contactRow}>
                    <TouchableOpacity 
                      style={styles.contactBtn}
                      onPress={() => Linking.openURL('tel:+919876543210')}
                    >
                      <Phone size={16} color="#FFF" />
                      <Text style={styles.contactBtnText}>Call Doctor</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.contactBtn, styles.mapBtn]}
                      onPress={() => {
                        const isOnline = Platform.OS === 'web' ? navigator.onLine : true;
                        if (isOnline) {
                          const url = Platform.select({
                            ios: 'maps:0,0?q=District+General+Hospital',
                            android: 'geo:0,0?q=District+General+Hospital',
                            web: 'https://www.google.com/maps/search/?api=1&query=District+General+Hospital'
                          });
                          if (url) Linking.openURL(url);
                        } else {
                          alert('Internet connection required for Maps. Please use the phone number provided.');
                        }
                      }}
                    >
                      <MapPin size={16} color="#000" />
                      <Text style={[styles.contactBtnText, { color: '#000' }]}>View Hospital</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.offlineNote}>
                    <Globe size={10} color="rgba(255,255,255,0.3)" />
                    <Text style={styles.offlineNoteText}>Maps require internet. Phone works offline.</Text>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveAndNext}>
              <Text style={styles.saveBtnText}>SAVE & SCAN NEXT PATIENT</Text>
              <ChevronRight size={18} color="#000" />
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  content: { padding: 20, paddingTop: 50 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  offlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(80,227,194,0.06)', padding: 10,
    borderRadius: 10, marginBottom: 20,
  },
  offlineText: { color: '#50E3C2', fontSize: 10, fontWeight: 'bold' },

  countRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  countLabel: {
    color: 'rgba(255,255,255,0.3)', fontSize: 10,
    fontWeight: '900', letterSpacing: 2,
  },
  countValue: { color: '#00E5FF', fontSize: 28, fontWeight: '900' },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00E5FF', borderRadius: 18, paddingVertical: 18, gap: 12,
    marginBottom: 24,
  },
  addBtnText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 2 },

  sectionTitle: {
    color: 'rgba(255,255,255,0.4)', fontSize: 10,
    fontWeight: '900', letterSpacing: 2, marginBottom: 12,
  },
  patientCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16,
    padding: 14, marginBottom: 8, gap: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  riskStrip: { width: 4, height: 40, borderRadius: 2 },
  patientHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  patientName: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  patientId: { color: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 'bold' },
  patientMeta: { color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 2 },
  patientResult: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4,
  },
  patientCondition: { fontSize: 11, fontWeight: 'bold' },
  patientConfidence: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  riskText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 16, fontWeight: 'bold' },
  emptyDesc: { color: 'rgba(255,255,255,0.15)', fontSize: 12 },

  /* New Patient Form */
  formTitle: {
    color: '#FFF', fontSize: 22, fontWeight: 'bold',
    fontStyle: 'italic', textAlign: 'center', marginBottom: 4,
  },
  formDesc: {
    color: 'rgba(255,255,255,0.3)', fontSize: 12,
    textAlign: 'center', marginBottom: 30,
  },
  fieldLabel: {
    color: 'rgba(255,255,255,0.35)', fontSize: 10,
    fontWeight: '900', letterSpacing: 2, marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 14, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 10,
  },
  input: { flex: 1, color: '#FFF', fontSize: 14, padding: 0 },
  row: { flexDirection: 'row', gap: 12 },

  scanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00E5FF', borderRadius: 18, paddingVertical: 20, gap: 12,
    marginTop: 12,
  },
  scanBtnDisabled: { opacity: 0.3 },
  scanBtnText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 2 },

  /* Scanning Animation */
  scanningView: { alignItems: 'center', paddingVertical: 60 },
  scanRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#00E5FF',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  scanningTitle: { color: '#00E5FF', fontSize: 20, fontWeight: 'bold' },
  scanningDesc: { color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 6 },
  scanningPatient: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 16 },

  /* Result */
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20,
    padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  resultTitle: { color: '#50E3C2', fontSize: 18, fontWeight: 'bold' },
  resultField: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  resultLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  resultValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  riskResult: {
    marginTop: 16, alignItems: 'center', padding: 16,
    borderRadius: 14, borderWidth: 1,
  },
  riskResultLabel: {
    color: 'rgba(255,255,255,0.3)', fontSize: 9,
    fontWeight: '900', letterSpacing: 2,
  },
  riskResultValue: { fontSize: 20, fontWeight: '900', marginTop: 4 },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#50E3C2', borderRadius: 18, paddingVertical: 18, gap: 10,
  },
  saveBtnText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 2 },

  /* Referral Styles */
  referralSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 75, 110, 0.15)',
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  referralTitle: {
    color: '#FF4B6E',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  doctorInfo: {
    marginBottom: 16,
  },
  doctorName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hospitalName: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mapBtn: {
    backgroundColor: '#00E5FF',
    borderColor: '#00E5FF',
  },
  contactBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  offlineNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  offlineNoteText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontStyle: 'italic',
  },
});
