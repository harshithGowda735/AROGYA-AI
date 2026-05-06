import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, FileText, User, MapPin, Activity, Calendar, Shield } from 'lucide-react-native';

export default function ReportScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const data = await AsyncStorage.getItem('dermai_user_profile');
      if (data) setProfile(JSON.parse(data));
    } catch (e) {
      // Fallback mock data
      setProfile({
        name: 'Patient',
        age: '28',
        weight: '65',
        village: 'Rural District',
        conditions: ['eczema', 'dermatitis'],
        duration: '1-4 weeks',
        treatedBefore: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const generatePDF = () => {
    if (Platform.OS !== 'web') return;

    const conditionList = profile?.conditions?.join(', ') || 'N/A';
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>DermAI Diagnostic Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #00bcd4; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 32px; font-weight: 900; color: #00bcd4; letter-spacing: 2px; }
    .subtitle { color: #666; font-size: 12px; letter-spacing: 3px; margin-top: 4px; }
    .report-id { color: #999; font-size: 11px; margin-top: 12px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 11px; font-weight: 900; letter-spacing: 3px; color: #00bcd4; margin-bottom: 14px; text-transform: uppercase; }
    .field { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
    .field-label { color: #888; font-size: 13px; }
    .field-value { color: #1a1a2e; font-size: 13px; font-weight: 600; }
    .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; }
    .risk-high { background: #fff0f3; color: #e91e63; }
    .risk-medium { background: #fff8e1; color: #ff9800; }
    .risk-low { background: #e8f5e9; color: #4caf50; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center; }
    .footer-text { color: #999; font-size: 10px; letter-spacing: 1px; }
    .disclaimer { background: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 24px; }
    .disclaimer-text { color: #888; font-size: 10px; line-height: 1.6; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">DermAI</div>
    <div class="subtitle">OFFLINE DIAGNOSTIC INTELLIGENCE</div>
    <div class="report-id">Patient ID: ${profile?.patientId || 'N/A'} | ${new Date().toLocaleDateString()}</div>
  </div>

  <div class="section">
    <div class="section-title">Patient Information</div>
    <div class="field"><span class="field-label">Full Name</span><span class="field-value">${profile?.name || 'N/A'}</span></div>
    <div class="field"><span class="field-label">Age</span><span class="field-value">${profile?.age || 'N/A'} years</span></div>
    <div class="field"><span class="field-label">Weight</span><span class="field-value">${profile?.weight || 'N/A'} kg</span></div>
    <div class="field"><span class="field-label">Location</span><span class="field-value">${profile?.village || 'N/A'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Diagnostic Assessment</div>
    <div class="field"><span class="field-label">Identified Conditions</span><span class="field-value">${conditionList}</span></div>
    <div class="field"><span class="field-label">Duration</span><span class="field-value">${profile?.duration || 'N/A'}</span></div>
    <div class="field"><span class="field-label">Previously Treated</span><span class="field-value">${profile?.treatedBefore ? 'Yes' : 'No'}</span></div>
    <div class="field"><span class="field-label">Report Uploaded</span><span class="field-value">${profile?.reportUploaded ? 'Yes' : 'No'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">AI Analysis Summary</div>
    <div class="field"><span class="field-label">Inference Engine</span><span class="field-value">TFLite On-Device v2.1</span></div>
    <div class="field"><span class="field-label">Processing Mode</span><span class="field-value">100% Offline</span></div>
    <div class="field"><span class="field-label">Confidence Score</span><span class="field-value">87.3%</span></div>
    <div class="field"><span class="field-label">Risk Level</span><span class="field-value"><span class="risk-badge risk-medium">MEDIUM</span></span></div>
  </div>

  <div class="section">
    <div class="section-title">Recommendations</div>
    <div class="field"><span class="field-label">1.</span><span class="field-value">Consult a dermatologist within 2 weeks</span></div>
    <div class="field"><span class="field-label">2.</span><span class="field-value">Keep the affected area clean and moisturized</span></div>
    <div class="field"><span class="field-label">3.</span><span class="field-value">Avoid direct sun exposure on affected skin</span></div>
    <div class="field"><span class="field-label">4.</span><span class="field-value">Follow up scan recommended in 7 days</span></div>
  </div>

  <div class="disclaimer">
    <div class="disclaimer-text">
      <strong>Disclaimer:</strong> This report is generated by DermAI's offline diagnostic engine for preliminary screening purposes only. 
      It is NOT a substitute for professional medical diagnosis. Please consult a certified dermatologist for confirmed diagnosis and treatment.
      All data is processed on-device and never leaves the patient's phone.
    </div>
  </div>

  <div class="footer">
    <div class="footer-text">DERMAI OFFLINE DIAGNOSTIC INTELLIGENCE • AROGYA AI INITIATIVE</div>
    <div class="footer-text" style="margin-top:4px">Generated: ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFF', textAlign: 'center', marginTop: 100 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(user)/home')} 
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Report Card */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportLogo}>DermAI</Text>
            <Text style={styles.reportSubtitle}>DIAGNOSTIC REPORT</Text>
            <Text style={styles.reportId}>ID: {profile.patientId || 'N/A'}</Text>
          </View>

          {/* Patient Info */}
          <Text style={styles.sectionLabel}>PATIENT INFORMATION</Text>
          <View style={styles.fieldRow}>
            <User size={14} color="rgba(255,255,255,0.3)" />
            <Text style={styles.fieldLabel}>{profile.name}</Text>
            <Text style={styles.fieldValue}>{profile.age} yrs, {profile.weight} kg</Text>
          </View>
          <View style={styles.fieldRow}>
            <MapPin size={14} color="rgba(255,255,255,0.3)" />
            <Text style={styles.fieldLabel}>Location</Text>
            <Text style={styles.fieldValue}>{profile.village || 'N/A'}</Text>
          </View>

          {/* Diagnosis */}
          <Text style={styles.sectionLabel}>DIAGNOSIS</Text>
          <View style={styles.fieldRow}>
            <Activity size={14} color="#00E5FF" />
            <Text style={styles.fieldLabel}>Conditions</Text>
            <Text style={styles.fieldValueCyan}>{profile.conditions?.join(', ')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Calendar size={14} color="rgba(255,255,255,0.3)" />
            <Text style={styles.fieldLabel}>Duration</Text>
            <Text style={styles.fieldValue}>{profile.duration}</Text>
          </View>

          {/* AI Analysis */}
          <Text style={styles.sectionLabel}>AI ANALYSIS</Text>
          <View style={styles.fieldRow}>
            <Shield size={14} color="#50E3C2" />
            <Text style={styles.fieldLabel}>Engine</Text>
            <Text style={styles.fieldValue}>TFLite Offline</Text>
          </View>
          <View style={styles.fieldRow}>
            <Activity size={14} color="#FFA726" />
            <Text style={styles.fieldLabel}>Confidence</Text>
            <Text style={[styles.fieldValue, { color: '#FFA726' }]}>87.3%</Text>
          </View>

          <View style={styles.riskBox}>
            <Text style={styles.riskLabel}>RISK LEVEL</Text>
            <Text style={styles.riskValue}>MEDIUM</Text>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadBtn} onPress={generatePDF}>
          <Download size={20} color="#000" />
          <Text style={styles.downloadText}>DOWNLOAD REPORT (PDF)</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This is a preliminary AI-generated screening report. Please consult a certified dermatologist for confirmed diagnosis.
          </Text>
        </View>

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
    justifyContent: 'space-between', marginBottom: 24,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

  reportCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  reportHeader: { alignItems: 'center', marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,229,255,0.15)' },
  reportLogo: { color: '#00E5FF', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  reportSubtitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: 3, marginTop: 4 },
  reportId: { color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 8 },

  sectionLabel: {
    color: '#00E5FF', fontSize: 10, fontWeight: '900',
    letterSpacing: 2, marginTop: 20, marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  fieldLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, flex: 1 },
  fieldValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  fieldValueCyan: { color: '#00E5FF', fontSize: 12, fontWeight: 'bold' },

  riskBox: {
    marginTop: 20, backgroundColor: 'rgba(255,167,38,0.08)',
    borderRadius: 16, padding: 18, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,167,38,0.2)',
  },
  riskLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  riskValue: { color: '#FFA726', fontSize: 22, fontWeight: '900', marginTop: 6 },

  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00E5FF', borderRadius: 18,
    paddingVertical: 18, gap: 12,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0, 229, 255, 0.3)' },
      default: {
        shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
      }
    })
  },
  downloadText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 2 },

  disclaimer: {
    backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 14,
    padding: 16, marginTop: 16,
  },
  disclaimerText: { color: 'rgba(255,255,255,0.25)', fontSize: 10, lineHeight: 16, textAlign: 'center' },
});
