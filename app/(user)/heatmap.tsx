import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, MapPin, TrendingUp } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const DISTRICT_DATA = [
  { name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946, cases: 342, risk: 'high', disease: 'Eczema' },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394, cases: 198, risk: 'high', disease: 'Psoriasis' },
  { name: 'Tumkur', lat: 13.3392, lng: 77.1017, cases: 156, risk: 'medium', disease: 'Dermatitis' },
  { name: 'Hassan', lat: 13.0072, lng: 76.1004, cases: 89, risk: 'medium', disease: 'Fungal Infection' },
  { name: 'Mandya', lat: 12.5218, lng: 76.8951, cases: 210, risk: 'high', disease: 'Scabies' },
  { name: 'Raichur', lat: 16.2120, lng: 77.3439, cases: 134, risk: 'medium', disease: 'Eczema' },
  { name: 'Bellary', lat: 15.1394, lng: 76.9214, cases: 267, risk: 'high', disease: 'Melanoma' },
  { name: 'Dharwad', lat: 15.4589, lng: 75.0078, cases: 78, risk: 'low', disease: 'Acne' },
  { name: 'Gulbarga', lat: 17.3297, lng: 76.8343, cases: 301, risk: 'high', disease: 'Psoriasis' },
  { name: 'Shimoga', lat: 13.9299, lng: 75.5681, cases: 45, risk: 'low', disease: 'Vitiligo' },
  { name: 'Chitradurga', lat: 14.2226, lng: 76.3987, cases: 112, risk: 'medium', disease: 'Dermatitis' },
  { name: 'Davangere', lat: 14.4644, lng: 75.9218, cases: 167, risk: 'medium', disease: 'Fungal Infection' },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'high': return '#FF4B6E';
    case 'medium': return '#FFA726';
    case 'low': return '#50E3C2';
    default: return '#FFF';
  }
};

const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    #map { width: 100%; height: 100vh; background: #0A0A0F; }
    .leaflet-container { background: #0A0A0F !important; }
    .custom-popup .leaflet-popup-content-wrapper {
      background: rgba(15,15,25,0.95);
      color: #fff;
      border: 1px solid rgba(0,229,255,0.2);
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(0,229,255,0.15);
    }
    .custom-popup .leaflet-popup-tip { background: rgba(15,15,25,0.95); }
    .popup-title { font-size: 14px; font-weight: 900; letter-spacing: 1px; margin-bottom: 4px; }
    .popup-disease { color: #00E5FF; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; }
    .popup-cases { color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 6px; }
    .popup-risk { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 6px; display: inline-block; margin-top: 6px; }
    .risk-high { background: rgba(255,75,110,0.2); color: #FF4B6E; }
    .risk-medium { background: rgba(255,167,38,0.2); color: #FFA726; }
    .risk-low { background: rgba(80,227,194,0.2); color: #50E3C2; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [14.5, 76.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    var districts = ${JSON.stringify(DISTRICT_DATA)};

    // Heatmap layer
    var heatData = districts.map(function(d) {
      var intensity = d.risk === 'high' ? 1.0 : d.risk === 'medium' ? 0.6 : 0.3;
      return [d.lat, d.lng, intensity];
    });

    L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      gradient: {
        0.2: '#50E3C2',
        0.5: '#FFA726',
        0.8: '#FF4B6E',
        1.0: '#FF1744'
      }
    }).addTo(map);

    // District markers
    districts.forEach(function(d) {
      var color = d.risk === 'high' ? '#FF4B6E' : d.risk === 'medium' ? '#FFA726' : '#50E3C2';
      var riskClass = 'risk-' + d.risk;

      var marker = L.circleMarker([d.lat, d.lng], {
        radius: Math.max(6, d.cases / 30),
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.35
      }).addTo(map);

      marker.bindPopup(
        '<div class="popup-title">' + d.name + '</div>' +
        '<div class="popup-disease">' + d.disease.toUpperCase() + '</div>' +
        '<div class="popup-cases">' + d.cases + ' reported cases</div>' +
        '<div class="popup-risk ' + riskClass + '">' + d.risk.toUpperCase() + ' RISK</div>',
        { className: 'custom-popup' }
      );
    });
  </script>
</body>
</html>
`;

export default function HeatmapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(user)/home')} 
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disease Heatmap</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={mapHTML}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <WebView source={{ html: mapHTML }} style={{ flex: 1 }} />
        )}
      </View>

      {/* Bottom Stats Panel */}
      <View style={styles.statsPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {/* Summary Cards */}
          <View style={[styles.summaryCard, { borderColor: 'rgba(255,75,110,0.3)' }]}>
            <AlertTriangle size={16} color="#FF4B6E" />
            <Text style={styles.summaryValue}>5</Text>
            <Text style={styles.summaryLabel}>HIGH RISK</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: 'rgba(255,167,38,0.3)' }]}>
            <TrendingUp size={16} color="#FFA726" />
            <Text style={styles.summaryValue}>4</Text>
            <Text style={styles.summaryLabel}>MEDIUM</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: 'rgba(80,227,194,0.3)' }]}>
            <MapPin size={16} color="#50E3C2" />
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>LOW RISK</Text>
          </View>

          {/* Top districts */}
          {DISTRICT_DATA.filter(d => d.risk === 'high').map((d, i) => (
            <View key={i} style={styles.districtChip}>
              <View style={[styles.riskDot, { backgroundColor: getRiskColor(d.risk) }]} />
              <View>
                <Text style={styles.chipName}>{d.name}</Text>
                <Text style={styles.chipDisease}>{d.disease} • {d.cases}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16,
    backgroundColor: 'rgba(10,10,15,0.85)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  mapContainer: { flex: 1, marginTop: 0 },
  mapFallback: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  mapFallbackText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },

  /* Stats Panel */
  statsPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(15,15,20,0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  statsScroll: { paddingHorizontal: 20, gap: 16, alignItems: 'center' },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20, padding: 18, alignItems: 'center',
    borderWidth: 1, minWidth: 100, gap: 8,
  },
  summaryValue: { color: '#FFF', fontSize: 26, fontWeight: '900' },
  summaryLabel: {
    color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
  },
  districtChip: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  riskDot: { width: 12, height: 12, borderRadius: 6 },
  chipName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  chipDisease: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4, fontWeight: '500' },
});
