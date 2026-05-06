import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, History, ChevronRight, Shield, Zap, ArrowLeft, MapPin, FileText } from 'lucide-react-native';

export default function UserHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandText}>DermAI</Text>
          <Text style={styles.headerTitle}>Diagnostics</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* AI Status */}
        <View style={styles.aiCard}>
          <View style={styles.aiRow}>
            <Zap size={18} color="#00E5FF" />
            <Text style={styles.aiTitle}>OFFLINE NEURAL ENGINE</Text>
          </View>
          <View style={styles.aiRow}>
            <Shield size={14} color="#50E3C2" />
            <Text style={styles.aiStatus}>100% On-Device • No Cloud</Text>
          </View>
        </View>

        {/* Main Action */}
        <TouchableOpacity 
          style={styles.scanCard}
          onPress={() => router.push('/(user)/scan')}
        >
          <View style={styles.scanIconBox}>
            <Camera size={36} color="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>Start New Scan</Text>
            <Text style={styles.scanDesc}>Capture skin condition for AI analysis</Text>
          </View>
          <ChevronRight size={22} color="rgba(0,0,0,0.3)" />
        </TouchableOpacity>

        {/* Heatmap */}
        <TouchableOpacity 
          style={styles.heatmapCard}
          onPress={() => router.push('/(user)/heatmap')}
        >
          <View style={styles.heatmapIcon}>
            <MapPin size={24} color="#FF4B6E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heatmapTitle}>Disease Heatmap</Text>
            <Text style={styles.heatmapDesc}>District-wise outbreak tracker</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        {/* History Section */}
        <Text style={styles.sectionTitle}>Recent Scans</Text>

        {[
          { condition: 'Eczema', confidence: '85%', time: '2 hours ago', risk: 'Low' },
          { condition: 'Psoriasis', confidence: '72%', time: '1 day ago', risk: 'Medium' },
        ].map((item, i) => (
          <View key={i} style={styles.historyCard}>
            <View style={styles.historyIcon}>
              <History size={18} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{item.condition}</Text>
              <Text style={styles.historyMeta}>{item.confidence} confidence • {item.time}</Text>
            </View>
            <View style={[styles.riskBadge, item.risk === 'Low' ? styles.riskLow : styles.riskMed]}>
              <Text style={[styles.riskText, item.risk === 'Low' ? styles.riskTextLow : styles.riskTextMed]}>
                {item.risk}
              </Text>
            </View>
          </View>
        ))}
        {/* Get Report */}
        <TouchableOpacity 
          style={styles.reportBtn}
          onPress={() => router.push('/(user)/report')}
        >
          <FileText size={20} color="#000" />
          <Text style={styles.reportBtnText}>GET REPORT</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    padding: 24,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  brandText: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  aiCard: {
    backgroundColor: 'rgba(0, 229, 255, 0.04)',
    borderRadius: 20,
    padding: 18,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.12)',
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiTitle: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  aiStatus: {
    color: '#50E3C2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scanCard: {
    backgroundColor: '#00E5FF',
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 36,
    ...Platform.select({
      web: { boxShadow: '0 6px 16px rgba(0, 229, 255, 0.35)' },
      default: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
      }
    })
  },
  scanIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scanDesc: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  historyMeta: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginTop: 2,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  riskLow: {
    backgroundColor: 'rgba(80, 227, 194, 0.1)',
  },
  riskMed: {
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
  },
  riskText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  riskTextLow: {
    color: '#50E3C2',
  },
  riskTextMed: {
    color: '#FFA726',
  },
  heatmapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 75, 110, 0.04)',
    borderRadius: 22,
    padding: 20,
    gap: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 110, 0.15)',
  },
  heatmapIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255, 75, 110, 0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  ashaEntryTitle: { color: '#50E3C2', fontSize: 15, fontWeight: 'bold' },
  ashaEntryDesc: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 },
  heatmapTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  heatmapDesc: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#00E5FF', borderRadius: 18,
    paddingVertical: 18, gap: 12, marginTop: 24,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0, 229, 255, 0.3)' },
      default: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 12,
      }
    })
  },
  reportBtnText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
});
