import { motion } from "motion/react";
import { GlassCard } from "./UIComponents";
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Stethoscope, 
  Activity, 
  Droplets, 
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { ReactNode } from "react";

interface ResultsDashboardProps {
  onClose: () => void;
  overallScore?: number;
}

const ConditionBadge = ({ 
  icon, 
  label, 
  score, 
  status, 
  color = "cyan",
  delay = 0 
}: { 
  icon: ReactNode; 
  label: string; 
  score: number; 
  status: string; 
  color?: "cyan" | "gold" | "red";
  delay?: number;
}) => {
  const colorMap = {
    cyan: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5",
    gold: "text-brand-gold border-brand-gold/20 bg-brand-gold/5",
    red: "text-red-500 border-red-500/20 bg-red-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-[20px] border glass-card flex items-center justify-between mb-3`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm opacity-50 uppercase tracking-widest font-bold text-[10px]">{label}</p>
          <p className="text-lg font-semibold tracking-tight leading-none">{status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-2xl font-bold font-serif ${colorMap[color].split(' ')[0]}`}>{score}</p>
        <p className="text-[8px] opacity-40 uppercase tracking-widest font-bold">Risk Index</p>
      </div>
    </motion.div>
  );
};

const HealthRing = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score < 40) return "#00E5FF";
    if (score < 70) return "#FBC02D";
    return "#FF4B2B";
  };

  const ringColor = getColor();

  return (
    <div className="relative w-64 h-64 flex items-center justify-center mx-auto my-8">
      {/* 3D Background Circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="90"
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
          className="rounded-full"
        />
        {/* The Progress Ring */}
        <motion.circle
          cx="128"
          cy="128"
          r="90"
          fill="transparent"
          stroke={ringColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          style={{ filter: `drop-shadow(0 0 10px ${ringColor}40)` }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <motion.p 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-6xl font-bold font-serif tracking-tighter"
          style={{ color: ringColor }}
        >
          {score}
        </motion.p>
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40 mt-1">Aggregated Risk</p>
        <motion.div 
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 1 }}
           className="mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
        >
           <span className="text-[8px] uppercase tracking-widest font-bold">Status: {score > 70 ? 'Action Required' : score > 40 ? 'Monitoring' : 'Stable'}</span>
        </motion.div>
      </div>

      {/* Subtle Rotating Accent */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10px] border border-white/5 rounded-full pointer-events-none"
      />
    </div>
  );
};

export default function ResultsDashboard({ onClose, overallScore = 74 }: ResultsDashboardProps) {
  const isHighRisk = overallScore > 70;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-black flex flex-col font-sans overflow-y-auto"
    >
      {/* Header */}
      <div className="pt-12 px-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <button onClick={onClose} className="p-4 rounded-full bg-white/5 border border-white/10">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl italic">Diagnostic Scan</h2>
        <div className="flex gap-2">
           <button className="p-3 bg-white/5 rounded-2xl"><Share2 className="w-5 h-5 opacity-40" /></button>
           <button className="p-3 bg-white/5 rounded-2xl"><Download className="w-5 h-5 opacity-40" /></button>
        </div>
      </div>

      <div className="p-6 flex-1 bg-gradient-to-b from-surface-dark to-container-dark/20">
        {/* Visual Summary */}
        <section className="mb-10 text-center">
          <p className="text-sm font-light opacity-60">Scan completed offline via Neural Engine v2.4</p>
          <HealthRing score={overallScore} />
        </section>

        {/* Condition Badges */}
        <section className="mb-12">
          <h3 className="text-xl italic mb-6 px-1">Detailed Risk Breakdown</h3>
          <ConditionBadge 
            icon={<Activity className="w-6 h-6" />}
            label="Micro-Anemia Screen"
            status="HIGH RISK"
            score={84}
            color="red"
            delay={1.2}
          />
          <ConditionBadge 
            icon={<Stethoscope className="w-6 h-6" />}
            label="Respiratory Profile"
            status="STABLE"
            score={32}
            color="cyan"
            delay={1.3}
          />
          <ConditionBadge 
            icon={<Droplets className="w-6 h-6" />}
            label="Hydration Levels"
            status="MONITOR"
            score={56}
            color="gold"
            delay={1.4}
          />
        </section>

        {/* Action Section */}
        <section className="mt-auto pb-10">
           {isHighRisk ? (
              <GlassCard className="p-6 border-red-500/20 bg-red-500/5 mb-6">
                 <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                    <div>
                       <p className="text-lg font-bold leading-tight">Recommended: Clinical Visit</p>
                       <p className="text-sm opacity-60 mt-1">Based on conjunctiva scan, potential iron deficiency detected. Visit your nearest PHC.</p>
                    </div>
                 </div>
              </GlassCard>
           ) : (
              <GlassCard className="p-6 border-brand-cyan/20 bg-brand-cyan/5 mb-6">
                 <div className="flex items-start gap-4">
                    <ShieldCheck className="w-8 h-8 text-brand-cyan shrink-0" />
                    <div>
                       <p className="text-lg font-bold leading-tight">All Vitals Stabilized</p>
                       <p className="text-sm opacity-60 mt-1">Continue your daily wellness routine and check back in a week.</p>
                    </div>
                 </div>
              </GlassCard>
           )}

           {/* The Autonomous CTA */}
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className={`w-full py-6 rounded-[25px] flex items-center justify-between px-8 shadow-2xl transition-all duration-500 ${
               isHighRisk 
                 ? "bg-red-500 text-white shadow-red-500/30" 
                 : "bg-brand-cyan text-surface-dark shadow-brand-cyan/30"
             }`}
           >
             <div className="flex flex-col items-start translate-y-[-2px]">
                <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">
                   {isHighRisk ? "Clinical Referral" : "Lifestyle Management"}
                </span>
                <span className="text-xl font-bold tracking-tight">
                   {isHighRisk ? "Schedule PHC Visit" : "View Wellness Guide"}
                </span>
             </div>
             <div className="p-2 bg-white/20 rounded-full">
                <MapPin className="w-6 h-6" />
             </div>
           </motion.button>
           
           <button className="w-full mt-6 py-4 text-white/40 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              Learn about our AI Model <ChevronRight className="w-4 h-4" />
           </button>
        </section>
      </div>
    </motion.div>
  );
}
