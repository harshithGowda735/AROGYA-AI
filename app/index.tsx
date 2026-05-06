import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ShieldPlus, ChevronRight } from 'lucide-react-native';
import * as Reanimated from 'react-native-reanimated';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>DermAI</Text>
        <Text style={styles.tagline}>Offline Diagnostic Intelligence</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(user)/home')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 229, 255, 0.1)' }]}>
            <User size={32} color="#00E5FF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>I am a Patient</Text>
            <Text style={styles.cardDesc}>Scan your skin and get instant results offline.</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(asha)/dashboard')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(80, 227, 194, 0.1)' }]}>
            <ShieldPlus size={32} color="#50E3C2" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>I am an ASHA Worker</Text>
            <Text style={styles.cardDesc}>Batch scanning and community health reporting.</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Certified for Rural Health Deployment</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 60,
  },
  brand: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    color: '#00E5FF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  options: {
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 20,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
