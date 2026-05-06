import { motion } from "motion/react";
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Search, 
  Plus, 
  LayoutDashboard,
  ClipboardList,
  Activity,
  History,
  TrendingUp,
  Camera,
  Map
} from "lucide-react";
import { GlassCard } from "./UIComponents";

interface AshaViewProps {
  onScan: () => void;
  onViewRecords: () => void;
  onViewHeatmap: () => void;
}

export default function AshaView({ onScan, onViewRecords, onViewHeatmap }: AshaViewProps) {
  const villageStats = [
    { label: "Village Scans", value: "142", icon: <Users className="w-4 h-4 text-brand-cyan" />, trend: "+12%" },
    { label: "High Risk", value: "08", icon: <AlertTriangle className="w-4 h-4 text-red-500" />, trend: "-2" },
    { label: "Referrals", value: "24", icon: <Activity className="w-4 h-4 text-brand-gold" />, trend: "+4" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* ASHA Header */}
      <section className="flex flex-col gap-1">
        <h2 className="text-3xl font-serif italic text-white">ASHA Worker Dashboard</h2>
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-brand-cyan" />
          <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Village Sector 4B • Bijapur</span>
        </div>
      </section>

      {/* Main Actions */}
      <section className="grid grid-cols-2 gap-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onScan}
          className="col-span-2 group min-h-[160px] rounded-[30px] bg-brand-cyan shadow-[0_20px_50px_rgba(0,229,255,0.2)] flex flex-col items-center justify-center gap-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-surface-dark/95 rounded-2xl flex items-center justify-center text-brand-cyan shadow-2xl group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black uppercase tracking-tighter text-surface-dark">New Patient Scan</h3>
            <p className="text-[10px] font-bold text-surface-dark/60 tracking-widest opacity-80 uppercase">Localized AI Screening</p>
          </div>
        </motion.button>

        <GlassCard 
          className="p-6 flex flex-col items-center gap-3 bg-white/5 border-white/10"
          onClick={onViewRecords}
        >
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/60">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Village Records</span>
        </GlassCard>

        <GlassCard 
          className="p-6 flex flex-col items-center gap-3 bg-white/5 border-white/10"
          onClick={onViewHeatmap}
        >
          <div className="w-10 h-10 bg-brand-cyan/10 rounded-xl flex items-center justify-center text-brand-cyan">
            <Map className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Gov Heatmap</span>
        </GlassCard>
      </section>

      {/* Village Analytics */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Village Health Snapshot</h4>
          <TrendingUp className="w-3 h-3 text-brand-cyan opacity-40" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {villageStats.map((stat, i) => (
            <GlassCard key={i} className="min-w-[140px] p-5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
                <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
              </div>
              <div>
                <p className="text-3xl font-black font-serif text-white">{stat.value}</p>
                <p className="text-[9px] uppercase font-black tracking-widest opacity-40">{stat.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Recent Scans List */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-1">Recent Consultations</h4>
        <div className="space-y-3">
          {[
            { name: "Rajesh K.", time: "12m ago", diagnosis: "Psoriasis (Low Risk)", status: "Completed" },
            { name: "Sunita M.", time: "1h ago", diagnosis: "Eczema (Med Risk)", status: "Referred" },
            { name: "Amit B.", time: "3h ago", diagnosis: "Melanoma Sub Type", status: "High Risk" },
          ].map((item, i) => (
            <GlassCard key={i} className="p-4 flex items-center justify-between border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold text-white/40">
                  {item.name.split(' ')[0][0]}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{item.name}</p>
                  <p className="text-[10px] opacity-40">{item.diagnosis}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[9px] font-black uppercase tracking-widest ${
                  item.status === 'High Risk' ? 'text-red-500' : 
                  item.status === 'Referred' ? 'text-brand-gold' : 'text-green-500'
                }`}>
                  {item.status}
                </p>
                <p className="text-[10px] opacity-20">{item.time}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
