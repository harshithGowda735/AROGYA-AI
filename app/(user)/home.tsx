import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, History, Info, ChevronRight } from 'lucide-react-native';
import { AIStatusCard } from '../../components/AIStatusCard';

export default function UserHome() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.subtext}>Your health is our priority.</Text>
      </View>

      <AIStatusCard />

      <TouchableOpacity 
        style={styles.mainAction}
        onPress={() => router.push('/(user)/scan')}
      >
        <View style={styles.actionIcon}>
          <Camera size={40} color="#000" />
        </View>
        <View>
          <Text style={styles.actionTitle}>Start New Scan</Text>
          <Text style={styles.actionDesc}>Capture skin condition for analysis</Text>
        </View>
        <ChevronRight size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <History size={18} color="#FFF" />
          <Text style={styles.sectionTitle}>Recent History</Text>
        </View>
        
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyText}>No recent scans found.</Text>
          <Text style={styles.emptySubtext}>Your diagnostic history will appear here.</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Info size={20} color="#00E5FF" />
        <Text style={styles.infoText}>
          DermAI uses advanced on-device AI to detect up to 12 different skin conditions instantly.
        </Text>
      </View>
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
    marginBottom: 24,
  },
  welcome: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
  },
  mainAction: {
    backgroundColor: '#00E5FF',
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginVertical: 20,
    elevation: 8,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  actionIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionDesc: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyHistory: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 15,
    marginTop: 40,
    marginBottom: 60,
  },
  infoText: {
    color: 'rgba(0, 229, 255, 0.8)',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
