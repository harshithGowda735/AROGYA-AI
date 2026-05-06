import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, FileStack, Settings, Plus, ChevronRight, BarChart3 } from 'lucide-react-native';

export default function AshaDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>ASHA Portal</Text>
          <Text style={styles.region}>Region: Rural District A-12</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Users color="#50E3C2" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL SCANS</Text>
          <Text style={styles.statValue}>128</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PENDING SYNC</Text>
          <Text style={styles.statValue}>14</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => router.push('/(asha)/batch-scan')}
      >
        <View style={[styles.iconBox, { backgroundColor: 'rgba(80, 227, 194, 0.1)' }]}>
          <Plus size={28} color="#50E3C2" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Batch Community Scan</Text>
          <Text style={styles.actionDesc}>Scan multiple patients in offline mode</Text>
        </View>
        <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.listCard}>
            <View style={styles.listIcon}>
              <FileStack size={20} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>Batch Scan Session #{1024 + i}</Text>
              <Text style={styles.listSubtitle}>8 Patients • 2 High Risk Flagged</Text>
            </View>
            <Text style={styles.listTime}>2h ago</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.reportBtn}>
        <BarChart3 size={20} color="#000" />
        <Text style={styles.reportBtnText}>Generate Regional Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  region: {
    color: '#50E3C2',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 4,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(80, 227, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionCard: {
    backgroundColor: 'rgba(80, 227, 194, 0.05)',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(80, 227, 194, 0.2)',
    marginBottom: 40,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    marginBottom: 12,
  },
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listSubtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginTop: 2,
  },
  listTime: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
  },
  reportBtn: {
    backgroundColor: '#50E3C2',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 60,
  },
  reportBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
