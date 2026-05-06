import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  History, 
  Activity, 
  Clock, 
  ChevronRight, 
  Stethoscope, 
  Pill, 
  Watch, 
  Thermometer,
  Cloudy,
  Moon,
  Wind
} from "lucide-react";
import { GlassCard } from "./UIComponents";

interface DigitalTwinViewProps {
  onClose: () => void;
  externalSymptoms?: any[];
}

const HistoryItem = ({ type, title, result, date, color = "cyan", index = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 + 0.5 }}
    className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 group cursor-pointer hover:bg-white/5 transition-colors px-2 rounded-xl"
  >
    <div className={`p-3 rounded-xl bg-${color === 'cyan' ? 'brand-cyan' : 'brand-gold'}/10 border border-${color === 'cyan' ? 'brand-cyan' : 'brand-gold'}/20`}>
      {type === 'vision' ? <Activity className="w-5 h-5 text-brand-cyan" /> : type === 'audio' ? <Wind className="w-5 h-5 text-brand-gold" /> : <Stethoscope className="w-5 h-5 text-brand-cyan" />}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold tracking-tight">{title}</p>
      <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold font-sans">{date}</p>
    </div>
    <div className="text-right">
      <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${result === 'Normal' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {result}
      </div>
    </div>
  </motion.div>
);

const WearableMetric = ({ icon, label, value, unit, trend, index = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      type: "spring", 
      damping: 15, 
      delay: index * 0.1 + 0.3 
    }}
  >
    <GlassCard className="p-4 flex flex-col gap-2 min-w-[140px] transform-gpu transition-all duration-300">
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
        className="flex justify-between items-start"
      >
        <div className="p-2 bg-white/5 rounded-lg border border-white/10 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
          {icon}
        </div>
        <div className={`text-[10px] font-black ${trend === 'up' ? 'text-green-500' : 'text-red-500'} tracking-tighter`}>
          {trend === 'up' ? '↑ LIVE' : '↓ LIVE'}
        </div>
      </motion.div>
      <div className="mt-2" style={{ transform: "translateZ(20px)" }}>
        <p className="text-3xl font-black font-serif tracking-tighter text-white">{value}<span className="text-[10px] font-sans opacity-40 ml-1 font-bold">{unit}</span></p>
        <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-black">{label}</p>
      </div>
    </GlassCard>
  </motion.div>
);

export default function DigitalTwinView({ onClose, externalSymptoms = [] }: DigitalTwinViewProps) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-black flex flex-col font-sans"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-20%] w-full h-full bg-brand-cyan/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-20%] w-full h-full bg-brand-gold/10 blur-[150px] rounded-full" 
        />
      </div>

      {/* Sticky Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pt-12 px-6 pb-6 bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl italic">Digital Twin</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-cyan">Active Monitoring</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-brand-cyan rounded-full flex items-center justify-center p-0.5">
           <div className="w-full h-full bg-surface-dark rounded-full flex items-center justify-center">
             <Watch className="w-5 h-5 text-brand-cyan" />
           </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Real-time Wearable Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl italic">Live Biometrics</h3>
            <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-full animate-pulse">DEVICE CONNECTED</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            <WearableMetric index={0} icon={<Activity className="w-4 h-4 text-brand-cyan" />} label="Heart Rate" value="74" unit="BPM" trend="up" />
            <WearableMetric index={1} icon={<Thermometer className="w-4 h-4 text-brand-gold" />} label="Body Temp" value="98.4" unit="°F" trend="down" />
            <WearableMetric index={2} icon={<Cloudy className="w-4 h-4 text-blue-400" />} label="SpO2" value="98" unit="%" trend="up" />
            <WearableMetric index={3} icon={<Moon className="w-4 h-4 text-purple-400" />} label="Sleep" value="7.2" unit="hrs" trend="up" />
          </div>
        </motion.section>

        {/* Diagnostic History */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl italic">Diagnosis Logs</h3>
            <button className="text-[10px] uppercase font-bold text-brand-cyan flex items-center gap-2">Full Archive <ChevronRight className="w-3 h-3" /></button>
          </div>
          <GlassCard className="p-4">
             {externalSymptoms.map((s, idx) => (
               <HistoryItem key={s.id} {...s} index={idx} />
             ))}
             <HistoryItem type="vision" title="Conjunctiva Scan (Anemia)" result="Normal" date="24 APR, 2026" index={externalSymptoms.length} />
             <HistoryItem type="audio" title="Cough Pattern Analysis" result="Abnormal" date="18 APR, 2026" color="gold" index={externalSymptoms.length + 1} />
             <HistoryItem type="vision" title="Dermal Surface Scan" result="Normal" date="12 APR, 2026" index={externalSymptoms.length + 2} />
          </GlassCard>
        </motion.section>

        {/* Digital Prescription (Smart Medicines) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl italic">Self-Care & Meds</h3>
            <Pill className="w-5 h-5 text-brand-gold opacity-50" />
          </div>
          <div className="flex flex-col gap-4">
             <div className="p-5 flex items-start gap-4 glass-card border-brand-gold/20 bg-brand-gold/5 relative overflow-hidden group">
                <div className="absolute right-[-20px] top-[-20px] p-8 bg-brand-gold/10 rounded-full blur-2xl group-hover:bg-brand-gold/20 transition-all" />
                <Clock className="w-8 h-8 text-brand-gold shrink-0 mt-1" />
                <div>
                   <p className="text-lg font-bold">Vitamin B12 (Oral Drop)</p>
                   <p className="text-xs opacity-60">Take 2 drops before sleep. Based on analysis of your last fatigue report.</p>
                   <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Next dose in 1h 45m</span>
                   </div>
                </div>
             </div>

             <div className="p-5 flex items-start gap-4 glass-card">
                <Stethoscope className="w-8 h-8 text-white/40 shrink-0 mt-1" />
                <div>
                   <p className="text-lg font-semibold opacity-80">Previous: PHC Visit</p>
                   <p className="text-xs opacity-40">Consultation on 15 APR at Urban Center. Advised respiratory monitoring.</p>
                </div>
             </div>
          </div>
        </motion.section>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 rounded-[25px] bg-brand-cyan text-surface-dark font-bold text-lg shadow-xl shadow-brand-cyan/30 flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
           <Download className="w-6 h-6" /> 
           Generate Full Report
        </motion.button>
        <p className="text-center text-[10px] opacity-30 mt-6 uppercase tracking-[0.4em] font-bold">E-Health Record #AR-2024-88A</p>
      </div>
    </motion.div>
  );
}

function Download(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
