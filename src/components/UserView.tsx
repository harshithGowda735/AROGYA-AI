import { motion } from "motion/react";
import { Camera, Mic, Activity, Clock, ShieldCheck, Heart } from "lucide-react";
import { ActionButton, GlassCard } from "./UIComponents";

interface UserViewProps {
  onScan: () => void;
  onVoice: () => void;
  userName?: string;
  language?: string;
}

export default function UserView({ onScan, onVoice, userName, language = "EN" }: UserViewProps) {
  const translations: any = {
    EN: { welcome: "Namaste", sub: "How are you feeling?", scan: "Scan Skin Condition", voice: "Describe Problem", health: "Health Snapshot" },
    HI: { welcome: "नमस्ते", sub: "आप कैसा महसूस कर रहे हैं?", scan: "त्वचा की जांच करें", voice: "समस्या का वर्णन करें", health: "स्वास्थ्य सारांश" },
    KN: { welcome: "ನಮಸ್ಕಾರ", sub: "ನೀವು ಹೇಗೆ ಭಾವಿಸುತ್ತಿದ್ದೀರಿ?", scan: "ಚರ್ಮದ ತಪಾಸಣೆ", voice: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ", health: "ಆರೋಗ್ಯ ಸಾರಾಂಶ" }
  };

  const t = translations[language] || translations.EN;

  return (
    <div className="flex flex-col gap-10 pb-32">
      {/* Personalized Greeting */}
      <section className="flex flex-col gap-1">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl italic tracking-tight text-white"
        >
          {t.welcome}{userName ? `, ${userName}` : ""},
        </motion.h2>
        <p className="text-lg font-light opacity-50">{t.sub}</p>
      </section>

      {/* Hero Action Area */}
      <section className="flex flex-col gap-5">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onScan}
          className="w-full h-56 rounded-[40px] bg-brand-cyan shadow-[0_20px_60px_rgba(0,229,255,0.3)] flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-6 bg-surface-dark/95 rounded-3xl text-brand-cyan shadow-xl group-hover:rotate-6 transition-transform"
          >
            <Camera className="w-12 h-12" />
          </motion.div>
          <div className="text-center px-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-surface-dark">{t.scan}</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-surface-dark/60 opacity-80">Localized AI Neural Scanner</p>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onVoice}
          className="w-full h-24 rounded-[30px] border border-white/20 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8 group"
        >
          <div className="flex items-center gap-5">
            <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold group-hover:bg-brand-gold/20 transition-colors">
              <Mic className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-lg">{t.voice}</h4>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">Multi-language Voice AI</p>
            </div>
          </div>
          <div className="flex gap-1 items-center grayscale opacity-30">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i} 
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-brand-gold rounded-full" 
              />
            ))}
          </div>
        </motion.button>
      </section>

      {/* Offline History / Snapshot */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{t.health}</h4>
          <ShieldCheck className="w-4 h-4 text-brand-cyan opacity-40" />
        </div>
        
        <GlassCard className="p-6 border-white/5 bg-white/[0.02] flex items-center gap-6">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <p className="text-3xl font-black font-serif text-white leading-none">72<span className="text-xs font-sans opacity-40 ml-1">BPM</span></p>
              <p className="text-[10px] text-green-500 font-bold tracking-tighter">● STABLE</p>
            </div>
            <p className="text-[9px] uppercase font-black tracking-widest opacity-40">Local Offline Monitoring</p>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 flex flex-col gap-1 border-white/5">
            <Activity className="w-5 h-5 text-brand-cyan mb-2" />
            <p className="text-xl font-black font-serif text-white tracking-widest">8,421</p>
            <p className="text-[8px] uppercase font-black tracking-widest opacity-30">Steps Today</p>
          </GlassCard>
          <GlassCard className="p-5 flex flex-col gap-1 border-white/5">
            <Clock className="w-5 h-5 text-brand-gold mb-2" />
            <p className="text-xl font-black font-serif text-white tracking-widest">3:42 PM</p>
            <p className="text-[8px] uppercase font-black tracking-widest opacity-30">Scan Log</p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
