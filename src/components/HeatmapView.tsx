import { motion, AnimatePresence } from "motion/react";
import { 
  Map, 
  Activity, 
  ShieldAlert, 
  Users, 
  Info, 
  X, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Database,
  Filter,
  Clock
} from "lucide-react";
import { GlassCard } from "./UIComponents";
import { useState, useMemo } from "react";

interface PatientRecord {
  id: string;
  condition: string;
  category: string;
  date: string;
}

interface DataPoint {
  id: number;
  x: number;
  y: number;
  type: 'high' | 'med' | 'low';
  label: string;
  lat: string;
  lng: string;
  records: PatientRecord[];
  stability: string;
  updatedAt: string; // ISO date for filtering
}

interface HeatmapViewProps {
  onClose: () => void;
}

type RiskType = 'high' | 'med' | 'low';
type TimeRange = '7d' | '30d' | 'all';

export default function HeatmapView({ onClose }: HeatmapViewProps) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [activeRisks, setActiveRisks] = useState<RiskType[]>(['high', 'med', 'low']);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  // Enhanced regional data with patient records and update dates
  const dataPoints: DataPoint[] = useMemo(() => [
    { 
      id: 1, x: 25, y: 30, type: 'high', label: 'Eczema Cluster', lat: '16.822', lng: '75.713', stability: 'Worsening',
      updatedAt: '2024-05-01',
      records: [
        { id: "REC-001", condition: "Atopic Dermatitis", category: "High", date: "2024-05-01" },
        { id: "REC-004", condition: "Chronic Eczema", category: "High", date: "2024-05-02" }
      ]
    },
    { 
      id: 2, x: 60, y: 45, type: 'med', label: 'Psoriasis Outbreak', lat: '16.845', lng: '75.789', stability: 'Stable',
      updatedAt: '2024-04-20',
      records: [
        { id: "REC-002", condition: "Plaque Psoriasis", category: "Med", date: "2024-04-28" }
      ]
    },
    { 
      id: 3, x: 40, y: 70, type: 'low', label: 'Healthy Zone', lat: '16.801', lng: '75.744', stability: 'Improving',
      updatedAt: '2024-05-05',
      records: []
    },
    { 
      id: 4, x: 80, y: 20, type: 'high', label: 'Fungal Cluster', lat: '16.899', lng: '75.821', stability: 'Worsening',
      updatedAt: '2024-05-03',
      records: [
        { id: "REC-005", condition: "Tinea Pedis", category: "High", date: "2024-05-03" },
        { id: "REC-008", condition: "Fungal Infection", category: "High", date: "2024-05-04" }
      ]
    },
    { 
      id: 5, x: 15, y: 80, type: 'med', label: 'Acne Reports', lat: '16.788', lng: '75.699', stability: 'Stable',
      updatedAt: '2024-03-15',
      records: [
        { id: "REC-009", condition: "Cystic Acne", category: "Med", date: "2024-05-01" }
      ]
    },
    { 
      id: 6, x: 50, y: 15, type: 'high', label: 'Critical Alert', lat: '16.911', lng: '75.755', stability: 'Worsening',
      updatedAt: '2024-05-04',
      records: [
        { id: "REC-012", condition: "Melanoma Screening", category: "High", date: "2024-05-05" }
      ]
    },
  ], []);

  const filteredPoints = useMemo(() => {
    const now = new Date('2024-05-06'); // Using current static date for filtering demo
    return dataPoints.filter(point => {
      const pointDate = new Date(point.updatedAt);
      const diffTime = Math.abs(now.getTime() - pointDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const riskMatch = activeRisks.includes(point.type);
      let dateMatch = true;

      if (timeRange === '7d') dateMatch = diffDays <= 7;
      else if (timeRange === '30d') dateMatch = diffDays <= 30;

      return riskMatch && dateMatch;
    });
  }, [dataPoints, activeRisks, timeRange]);

  const toggleRisk = (risk: RiskType) => {
    setActiveRisks(prev => 
      prev.includes(risk) ? prev.filter(r => r !== risk) : [...prev, risk]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[200] bg-surface-dark p-6 flex flex-col gap-6"
    >
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif italic text-white leading-none">Government Heatmap</h2>
          <p className="text-[10px] uppercase font-black tracking-widest text-brand-cyan/60 mt-1">Regional Outbreak Detection • Sector 4B</p>
        </div>
        <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Map Visualization */}
      <GlassCard className="flex-1 relative overflow-hidden bg-black/40 border-white/5 p-0">
        {/* Animated Map Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }} />
        </div>

        {/* Data Points */}
        <div className="absolute inset-0 p-8">
          <AnimatePresence>
            {filteredPoints.map((point) => (
              <motion.div
                key={point.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: selectedPoint?.id === point.id ? [1.2, 1.4, 1.2] : [1, 1.2, 1],
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, delay: point.id * 0.3 },
                  opacity: { duration: 0.5, delay: point.id * 0.1 }
                }}
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => setSelectedPoint(point)}
              >
                <div className={`w-full h-full rounded-full blur-sm transition-colors ${
                  point.type === 'high' ? 'bg-red-500' : 
                  point.type === 'med' ? 'bg-brand-gold' : 'bg-brand-cyan'
                } ${selectedPoint?.id === point.id ? 'opacity-100 scale-125' : 'opacity-70'}`} />
                <div className={`absolute inset-1.5 rounded-full border-2 transition-all ${
                  point.type === 'high' ? 'border-white bg-red-600' : 
                  point.type === 'med' ? 'border-white bg-brand-gold' : 'border-white bg-brand-cyan'
                } ${selectedPoint?.id === point.id ? 'scale-110 shadow-[0_0_20px_white]' : ''}`} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
               <Database className="w-12 h-12 mb-4" />
               <p className="text-xs uppercase font-black tracking-widest text-center">No reports match<br/>applied filters</p>
            </div>
          )}
        </div>

        {/* Detailed Point Modal Overlay */}
        <AnimatePresence>
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-4 left-4 right-4 z-50"
            >
              <GlassCard className="p-6 bg-surface-dark/95 border-brand-cyan/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      selectedPoint.type === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-brand-cyan/20 text-brand-cyan'
                    }`}>
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white">{selectedPoint.label}</h3>
                      <div className="flex items-center gap-2 opacity-40">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-black tracking-widest">{selectedPoint.lat}°N, {selectedPoint.lng}°E</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPoint(null)}
                    className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white/5 rounded-2xl">
                    <p className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">Local Stability</p>
                    <p className={`text-sm font-bold ${selectedPoint.stability === 'Worsening' ? 'text-red-500' : 'text-green-500'}`}>
                      {selectedPoint.stability}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl">
                    <p className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">Last Sync</p>
                    <p className="text-sm font-bold text-white font-mono tracking-tighter opacity-60 text-xs italic">{selectedPoint.updatedAt}</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[120px] overflow-y-auto no-scrollbar">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    Associated Records ({selectedPoint.records.length})
                  </h4>
                  {selectedPoint.records.length > 0 ? (
                    selectedPoint.records.map((rec) => (
                      <div key={rec.id} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${rec.category === 'High' ? 'bg-red-500' : 'bg-brand-gold'}`} />
                          <span className="text-xs font-bold text-white/80">{rec.condition}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 opacity-20" />
                          <span className="text-[10px] opacity-40 font-mono italic">{rec.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] italic opacity-20 text-center py-4">No critical records identified in this zone.</p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend & Risk Filter */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 group">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-3 h-3 text-white/20" />
            <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">Risk Toggles</span>
          </div>
          <button 
            onClick={() => toggleRisk('high')}
            className={`px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-2 transition-all ${activeRisks.includes('high') ? 'opacity-100' : 'opacity-30'}`}
          >
             <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
             <span className="text-[9px] uppercase font-black text-white/60 tracking-widest">High</span>
          </button>
          <button 
            onClick={() => toggleRisk('med')}
            className={`px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-2 transition-all ${activeRisks.includes('med') ? 'opacity-100' : 'opacity-30'}`}
          >
             <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(251,192,45,0.5)]" />
             <span className="text-[9px] uppercase font-black text-white/60 tracking-widest">Medium</span>
          </button>
          <button 
            onClick={() => toggleRisk('low')}
            className={`px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-2 transition-all ${activeRisks.includes('low') ? 'opacity-100' : 'opacity-30'}`}
          >
             <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
             <span className="text-[9px] uppercase font-black text-white/60 tracking-widest">Low</span>
          </button>
        </div>

        {/* Date Filter Controls */}
        <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-white/20" />
            <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">Time Window</span>
          </div>
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex p-1.5 shadow-2xl overflow-hidden">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTimeRange(opt.id as TimeRange)}
                className={`px-4 py-2 text-[8px] uppercase font-black tracking-widest rounded-xl transition-all ${
                  timeRange === opt.id ? 'bg-brand-cyan text-surface-dark' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Visible Points", value: filteredPoints.length, icon: <Activity className="w-4 h-4" /> },
          { label: "High Hazard", value: filteredPoints.filter(p => p.type === 'high').length, icon: <ShieldAlert className="w-4 h-4 text-red-500" /> },
          { label: "Records", value: filteredPoints.reduce((acc, p) => acc + p.records.length, 0), icon: <Users className="w-4 h-4" /> },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4 flex flex-col gap-1 border-white/5">
            <div className="flex justify-between items-center opacity-40 mb-1">
              {stat.icon}
              <span className="text-[8px] font-black uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-xl font-black font-serif text-white">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="mt-2 w-full py-5 bg-white/5 border border-white/10 rounded-[30px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
      >
        Exit Monitor
      </button>
    </motion.div>
  );
}

