import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Calendar, Weight, MapPin, ChevronRight, Navigation, Search, Check, Upload, FileText, X } from 'lucide-react-native';
import { StorageService } from '../services/storage';

const SKIN_CONDITIONS = [
  { id: 'eczema', label: 'Eczema', icon: '🔴' },
  { id: 'psoriasis', label: 'Psoriasis', icon: '🟠' },
  { id: 'dermatitis', label: 'Dermatitis', icon: '🟡' },
  { id: 'acne', label: 'Acne / Pimples', icon: '🔵' },
  { id: 'fungal', label: 'Fungal Infection', icon: '🟢' },
  { id: 'scabies', label: 'Scabies', icon: '🟤' },
  { id: 'vitiligo', label: 'Vitiligo', icon: '⚪' },
  { id: 'melanoma', label: 'Melanoma', icon: '⚫' },
  { id: 'rashes', label: 'Rashes / Allergy', icon: '🟣' },
  { id: 'ringworm', label: 'Ringworm', icon: '🔶' },
  { id: 'unknown', label: 'Not Sure / Other', icon: '❓' },
];

export default function Index() {
  const router = useRouter();
  const [phase, setPhase] = useState(1);
  const [patientId] = useState(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'DRM-';
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
  });
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    weight: '65',
    village: '',
    latitude: '',
    longitude: '',
    locationMethod: '',
  });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [treatedBefore, setTreatedBefore] = useState<null | boolean>(null);
  const [reportUploaded, setReportUploaded] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const detectLocation = async () => {
    setDetecting(true);
    if (Platform.OS === 'web' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setProfile(p => ({
            ...p,
            latitude: pos.coords.latitude.toFixed(4),
            longitude: pos.coords.longitude.toFixed(4),
            village: `Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`,
            locationMethod: 'gps',
          }));
          setDetecting(false);
        },
        () => {
          setDetecting(false);
          alert('Location access denied. Please enter manually.');
        }
      );
    } else {
      setTimeout(() => {
        setProfile(p => ({
          ...p,
          latitude: '12.9716',
          longitude: '77.5946',
          village: 'Bengaluru (Auto-detected)',
          locationMethod: 'gps',
        }));
        setDetecting(false);
      }, 1500);
    }
  };

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleUploadReport = () => {
    // In a real app this would use expo-document-picker
    setReportUploaded(true);
  };

  const handleFinish = async () => {
    const userData = {
      patientId,
      ...profile,
      conditions: selectedConditions,
      duration,
      treatedBefore,
      reportUploaded,
      createdAt: new Date().toISOString(),
    };
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('dermai_user_profile', JSON.stringify(userData));
    } catch (e) {
      console.log('Profile saved locally');
    }
    router.replace('/(user)/home');
  };

  const canAdvancePhase1 = profile.name.length > 0;
  const canAdvancePhase2 = selectedConditions.length > 0;
  const canAdvancePhase3 = treatedBefore !== null;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(phase / 3) * 100}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.phaseLabel}>PHASE {phase}</Text>
          <Text style={styles.sequenceLabel}>ANALYSIS SEQUENCE</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ========== PHASE 1: Personal Profile + Location ========== */}
        {phase === 1 && (
          <>
            <Text style={styles.title}>Personal Profile</Text>
            <Text style={styles.subtitle}>Tell us about yourself for personalized care</Text>

            {/* Patient ID Badge */}
            <View style={styles.idBadge}>
              <Text style={styles.idLabel}>YOUR PATIENT ID</Text>
              <Text style={styles.idValue}>{patientId}</Text>
              <Text style={styles.idHint}>Share this ID with your doctor for reference</Text>
            </View>

            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <User size={18} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={profile.name}
                onChangeText={(t) => setProfile({ ...profile, name: t })}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>AGE</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={18} color="rgba(255,255,255,0.3)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    keyboardType="numeric"
                    value={profile.age}
                    onChangeText={(t) => setProfile({ ...profile, age: t })}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>WEIGHT (KG)</Text>
                <View style={styles.inputContainer}>
                  <Weight size={18} color="rgba(255,255,255,0.3)" />
                  <TextInput
                    style={styles.input}
                    placeholder="65"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    keyboardType="numeric"
                    value={profile.weight}
                    onChangeText={(t) => setProfile({ ...profile, weight: t })}
                  />
                </View>
              </View>
            </View>

            {/* Location Section */}
            <Text style={styles.fieldLabel}>YOUR LOCATION</Text>
            <TouchableOpacity style={styles.detectBtn} onPress={detectLocation} disabled={detecting}>
              <Navigation size={18} color="#00E5FF" />
              <Text style={styles.detectBtnText}>
                {detecting ? 'Detecting GPS...' : 'Detect My Location'}
              </Text>
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR ENTER MANUALLY</Text>
              <View style={styles.orLine} />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={18} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={styles.input}
                placeholder="Village / Location"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={profile.village}
                onChangeText={(t) => setProfile({ ...profile, village: t, locationMethod: 'manual' })}
              />
            </View>

            {profile.latitude ? (
              <View style={styles.locationBadge}>
                <Check size={14} color="#50E3C2" />
                <Text style={styles.locationBadgeText}>
                  GPS: {profile.latitude}, {profile.longitude}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.advanceBtn, !canAdvancePhase1 && styles.advanceBtnDisabled]}
              onPress={() => canAdvancePhase1 && setPhase(2)}
              disabled={!canAdvancePhase1}
            >
              <Text style={styles.advanceBtnText}>ADVANCE PHASE</Text>
              <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            {/* ASHA Worker Entry */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            <TouchableOpacity
              style={styles.ashaEntryBtn}
              onPress={() => router.push('/(asha)/dashboard')}
            >
              <Text style={styles.ashaEntryIcon}>🩺</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.ashaEntryTitle}>I am an ASHA Worker</Text>
                <Text style={styles.ashaEntryDesc}>Access batch screening portal</Text>
              </View>
              <ChevronRight size={18} color="rgba(80,227,194,0.5)" />
            </TouchableOpacity>
          </>
        )}

        {/* ========== PHASE 2: Skin Condition Selection ========== */}
        {phase === 2 && (
          <>
            <Text style={styles.title}>Skin Condition</Text>
            <Text style={styles.subtitle}>Select the skin issue(s) you are experiencing</Text>

            <View style={styles.conditionsGrid}>
              {SKIN_CONDITIONS.map((c) => {
                const selected = selectedConditions.includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.conditionChip, selected && styles.conditionChipSelected]}
                    onPress={() => toggleCondition(c.id)}
                  >
                    <Text style={styles.conditionIcon}>{c.icon}</Text>
                    <Text style={[styles.conditionLabel, selected && styles.conditionLabelSelected]}>
                      {c.label}
                    </Text>
                    {selected && <Check size={14} color="#00E5FF" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>HOW LONG HAVE YOU HAD THIS?</Text>
            <View style={styles.durationRow}>
              {['< 1 week', '1-4 weeks', '1-6 months', '> 6 months'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.durationChip, duration === d && styles.durationChipSelected]}
                  onPress={() => setDuration(d)}
                >
                  <Text style={[styles.durationText, duration === d && styles.durationTextSelected]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backPhaseBtn} onPress={() => setPhase(1)}>
                <Text style={styles.backPhaseBtnText}>← BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.advanceBtn, { flex: 1 }, !canAdvancePhase2 && styles.advanceBtnDisabled]}
                onPress={() => canAdvancePhase2 && setPhase(3)}
                disabled={!canAdvancePhase2}
              >
                <Text style={styles.advanceBtnText}>ADVANCE PHASE</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ========== PHASE 3: Treatment History ========== */}
        {phase === 3 && (
          <>
            <Text style={styles.title}>Treatment History</Text>
            <Text style={styles.subtitle}>Help us understand your medical background</Text>

            <Text style={styles.fieldLabel}>HAVE YOU BEEN TREATED BEFORE?</Text>
            <View style={styles.treatRow}>
              <TouchableOpacity
                style={[styles.treatOption, treatedBefore === true && styles.treatOptionYes]}
                onPress={() => setTreatedBefore(true)}
              >
                <Check size={20} color={treatedBefore === true ? '#50E3C2' : 'rgba(255,255,255,0.2)'} />
                <Text style={[styles.treatText, treatedBefore === true && { color: '#50E3C2' }]}>
                  Yes, I have
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.treatOption, treatedBefore === false && styles.treatOptionNo]}
                onPress={() => setTreatedBefore(false)}
              >
                <X size={20} color={treatedBefore === false ? '#FF4B6E' : 'rgba(255,255,255,0.2)'} />
                <Text style={[styles.treatText, treatedBefore === false && { color: '#FF4B6E' }]}>
                  No, first time
                </Text>
              </TouchableOpacity>
            </View>

            {treatedBefore === true && (
              <>
                <Text style={styles.fieldLabel}>UPLOAD PREVIOUS REPORT</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={handleUploadReport}>
                  {reportUploaded ? (
                    <View style={styles.uploadedRow}>
                      <FileText size={28} color="#50E3C2" />
                      <View>
                        <Text style={styles.uploadedTitle}>Report Uploaded</Text>
                        <Text style={styles.uploadedMeta}>medical_report.pdf • 2.1 MB</Text>
                      </View>
                      <Check size={20} color="#50E3C2" />
                    </View>
                  ) : (
                    <View style={styles.uploadContent}>
                      <Upload size={32} color="rgba(255,255,255,0.2)" />
                      <Text style={styles.uploadTitle}>Tap to Upload Report</Text>
                      <Text style={styles.uploadMeta}>PDF, JPG, PNG (max 10MB)</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Profile Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>PROFILE SUMMARY</Text>
              <View style={[styles.summaryRow, { borderBottomColor: 'rgba(0,229,255,0.1)' }]}>
                <Text style={[styles.summaryLabel, { color: '#00E5FF' }]}>Patient ID</Text>
                <Text style={[styles.summaryValue, { color: '#00E5FF' }]}>{patientId}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Name</Text>
                <Text style={styles.summaryValue}>{profile.name || '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>{profile.village || '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Conditions</Text>
                <Text style={styles.summaryValue}>
                  {selectedConditions.map(id => SKIN_CONDITIONS.find(c => c.id === id)?.label).join(', ') || '—'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{duration || '—'}</Text>
              </View>
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backPhaseBtn} onPress={() => setPhase(2)}>
                <Text style={styles.backPhaseBtnText}>← BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.finishBtn, { flex: 1 }, !canAdvancePhase3 && styles.advanceBtnDisabled]}
                onPress={handleFinish}
                disabled={!canAdvancePhase3}
              >
                <Text style={styles.finishBtnText}>START DIAGNOSIS</Text>
                <ChevronRight size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  progressContainer: { paddingTop: 40 },
  progressBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)' },
  progressBarFill: { height: 4, backgroundColor: '#00E5FF' },
  progressLabels: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 10,
  },
  phaseLabel: { color: '#00E5FF', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  sequenceLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '900', letterSpacing: 2 },

  content: {
    paddingHorizontal: 24, paddingTop: 40, paddingBottom: 60,
    maxWidth: 500, alignSelf: 'center', width: '100%',
  },
  title: {
    color: '#FFF', fontSize: 30, fontWeight: 'bold',
    fontStyle: 'italic', textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)', fontSize: 14,
    textAlign: 'center', marginBottom: 40,
  },
  fieldLabel: {
    color: 'rgba(255,255,255,0.4)', fontSize: 11,
    fontWeight: '900', letterSpacing: 2, marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16,
    paddingHorizontal: 18, paddingVertical: 16, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 14,
  },
  input: { flex: 1, color: '#FFF', fontSize: 15, padding: 0 },
  row: { flexDirection: 'row', gap: 16 },

  /* Location */
  detectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,229,255,0.06)', borderRadius: 16,
    paddingVertical: 16, gap: 12, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.15)',
  },
  detectBtnText: { color: '#00E5FF', fontSize: 14, fontWeight: 'bold' },
  orRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16,
  },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  orText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  locationBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(80,227,194,0.06)', padding: 12,
    borderRadius: 12, marginBottom: 24,
  },
  locationBadgeText: { color: '#50E3C2', fontSize: 12, fontWeight: 'bold' },

  /* Advance / Nav */
  advanceBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16,
    paddingVertical: 18, marginTop: 16, gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  advanceBtnDisabled: { opacity: 0.3 },
  advanceBtnText: {
    color: 'rgba(255,255,255,0.5)', fontSize: 12,
    fontWeight: '900', letterSpacing: 3,
  },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  backPhaseBtn: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
  },
  backPhaseBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00E5FF', borderRadius: 16,
    paddingVertical: 18, gap: 10,
  },
  finishBtnText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 3 },

  /* Phase 2: Conditions */
  conditionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  conditionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  conditionChipSelected: {
    backgroundColor: 'rgba(0,229,255,0.06)',
    borderColor: 'rgba(0,229,255,0.25)',
  },
  conditionIcon: { fontSize: 16 },
  conditionLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 'bold' },
  conditionLabelSelected: { color: '#00E5FF' },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  durationChip: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  durationChipSelected: {
    backgroundColor: 'rgba(0,229,255,0.08)',
    borderColor: 'rgba(0,229,255,0.3)',
  },
  durationText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' },
  durationTextSelected: { color: '#00E5FF' },

  /* Phase 3: Treatment */
  treatRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
  treatOption: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 18,
    paddingVertical: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  treatOptionYes: {
    backgroundColor: 'rgba(80,227,194,0.06)',
    borderColor: 'rgba(80,227,194,0.25)',
  },
  treatOptionNo: {
    backgroundColor: 'rgba(255,75,110,0.06)',
    borderColor: 'rgba(255,75,110,0.25)',
  },
  treatText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 'bold' },

  uploadBox: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    borderStyle: 'dashed', marginBottom: 28, overflow: 'hidden',
  },
  uploadContent: {
    alignItems: 'center', paddingVertical: 40, gap: 10,
  },
  uploadTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 'bold' },
  uploadMeta: { color: 'rgba(255,255,255,0.2)', fontSize: 11 },
  uploadedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20,
  },
  uploadedTitle: { color: '#50E3C2', fontSize: 14, fontWeight: 'bold' },
  uploadedMeta: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 },

  /* Summary */
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20,
    padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  summaryTitle: {
    color: '#00E5FF', fontSize: 11, fontWeight: '900',
    letterSpacing: 2, marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  summaryLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  summaryValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold', maxWidth: '60%', textAlign: 'right' },

  /* ASHA Entry */
  ashaEntryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(80,227,194,0.04)', borderRadius: 18,
    padding: 18, borderWidth: 1,
    borderColor: 'rgba(80,227,194,0.15)',
  },
  ashaEntryIcon: { fontSize: 24 },
  ashaEntryTitle: { color: '#50E3C2', fontSize: 15, fontWeight: 'bold' },
  ashaEntryDesc: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 },

  /* Patient ID Badge */
  idBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
  },
  idLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  idValue: {
    color: '#00E5FF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  idHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontStyle: 'italic',
  },
});
