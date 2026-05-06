import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Calendar, 
  MapPin, 
  Weight, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Camera,
  Upload,
  FileText
} from "lucide-react";
import { useState } from "react";
import { GlassCard } from "./UIComponents";
import HealthGuideBot from "./HealthGuideBot";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
  language: 'EN' | 'HI' | 'KN';
  onLanguageChange: (lang: 'EN' | 'HI' | 'KN') => void;
}

export interface OnboardingData {
  name: string;
  age: string;
  village: string;
  weight: string;
  symptoms: string[];
  treatedBefore: boolean | null;
  hasMedicalReport: boolean;
}

const SYMPTOMS_LIST = [
  "Skin Rash", "Itching", "Redness", "Swelling", 
  "Dry Skin", "Fever", "Cough", "Body Ache", 
  "Fatigue", "Headache"
];

export default function OnboardingModal({ isOpen, onComplete, language, onLanguageChange }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: "",
    village: "",
    weight: "",
    symptoms: [],
    treatedBefore: null,
    hasMedicalReport: false
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const progress = (step / 4) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-3xl overflow-hidden">
      {/* Background Ambience Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-20%] w-full h-full bg-brand-cyan/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-20%] w-full h-full bg-brand-gold/10 blur-[120px] rounded-full" 
        />
      </div>

      {/* Progress Bar */}
      <div className="pt-14 px-6 relative z-10">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-cyan shadow-[0_0_15px_rgba(0,229,255,0.5)]"
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-[10px] uppercase tracking-widest font-black text-brand-cyan">Phase {step}</p>
          <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Analysis Sequence</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6" style={{ perspective: 2000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.8, rotateY: -30, z: -200 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 30, z: -200 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full max-w-md"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl italic mb-2 tracking-tight">Personal Profile</h2>
                  <p className="text-sm opacity-50">Tell us about yourself for personalized care</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1 mb-2 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 w-5 h-5 text-brand-cyan opacity-40" />
                      <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-cyan outline-none transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1 mb-2 block">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-4 w-5 h-5 text-brand-cyan opacity-40" />
                      <input 
                        type="number"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-cyan outline-none transition-all"
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1 mb-2 block">Weight (kg)</label>
                    <div className="relative">
                      <Weight className="absolute left-4 top-4 w-5 h-5 text-brand-cyan opacity-40" />
                      <input 
                        type="number"
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-cyan outline-none transition-all"
                        placeholder="65"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1 mb-2 block">Village Name</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-brand-cyan opacity-40" />
                      <input 
                        value={formData.village}
                        onChange={e => setFormData({...formData, village: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-cyan outline-none transition-all"
                        placeholder="Village / Location"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl italic mb-2 tracking-tight">Symptom Checklist</h2>
                  <p className="text-sm opacity-50">Select everything that applies to you</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto no-scrollbar pb-4">
                  {SYMPTOMS_LIST.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-4 rounded-2xl border text-sm font-bold transition-all text-left flex items-center justify-between group ${
                        formData.symptoms.includes(symptom)
                        ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-lg shadow-brand-cyan/10"
                        : "bg-white/5 border-white/10 text-white/60"
                      }`}
                    >
                      {symptom}
                      {formData.symptoms.includes(symptom) && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/30 neo-glow-gold">
                    <ShieldCheck className="w-10 h-10 text-brand-gold" />
                  </div>
                </div>
                <h2 className="text-3xl italic tracking-tight">Clinical History</h2>
                <p className="text-lg opacity-70">Have you treated these symptoms before at a hospital or clinic?</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => setFormData({...formData, treatedBefore: true})}
                    className={`p-8 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                      formData.treatedBefore === true 
                      ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-xl" 
                      : "bg-white/5 border-white/5 opacity-50"
                    }`}
                  >
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="font-bold">YES</span>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, treatedBefore: false})}
                    className={`p-8 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                      formData.treatedBefore === false 
                      ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-xl" 
                      : "bg-white/5 border-white/5 opacity-50"
                    }`}
                  >
                    <ArrowRight className="w-8 h-8" />
                    <span className="font-bold">NO</span>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10">
                <div className="text-center">
                  <h2 className="text-4xl italic mb-2 tracking-tight font-serif text-white">
                    {formData.treatedBefore ? "Medical Vault" : "Ready to Launch"}
                  </h2>
                  <p className="text-sm opacity-40 italic px-6 text-white/50">
                    {formData.treatedBefore ? "Synchronize prescriptions or reports for analysis (Optional)" : "All biological parameters have been successfully validated"}
                  </p>
                </div>
                
                {formData.treatedBefore ? (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`aspect-square w-full rounded-[45px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-5 cursor-pointer relative overflow-hidden shadow-2xl ${
                      formData.hasMedicalReport 
                      ? "bg-green-500/10 border-green-500 shadow-green-500/10" 
                      : "bg-white/5 border-white/10 hover:bg-white/[0.08]"
                    }`}
                    onClick={() => setFormData({...formData, hasMedicalReport: !formData.hasMedicalReport})}
                  >
                    <div className={`p-8 rounded-full transition-all duration-700 ${formData.hasMedicalReport ? "bg-green-500/20 text-green-500 rotate-0" : "bg-brand-cyan/10 text-brand-cyan -rotate-12 group-hover:rotate-0"}`}>
                      {formData.hasMedicalReport ? <CheckCircle2 className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
                    </div>
                    <div className="text-center px-10">
                      <p className={`font-black uppercase tracking-[0.2em] text-xs ${formData.hasMedicalReport ? "text-green-500" : "text-white"}`}>
                        {formData.hasMedicalReport ? "Securely Linked" : "Tap to Link Clinical Data"}
                      </p>
                      {!formData.hasMedicalReport && <p className="text-[10px] opacity-30 mt-3 font-bold uppercase tracking-widest text-white">Optional Step</p>}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center py-10 gap-8">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                        boxShadow: ["0 0 30px rgba(0,229,255,0.2)", "0 0 60px rgba(0,229,255,0.5)", "0 0 30px rgba(0,229,255,0.2)"]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 bg-brand-cyan/10 rounded-full flex items-center justify-center border-2 border-brand-cyan/40"
                    >
                      <Zap className="w-16 h-16 text-brand-cyan neo-glow-cyan" />
                    </motion.div>
                    <p className="text-[10px] opacity-30 text-center px-14 leading-loose uppercase tracking-[0.3em] font-black text-white">
                      Identity & Neural State Validated
                    </p>
                  </div>
                )}
              </div>
            )}

    <div className="mt-10 flex gap-4">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="p-5 rounded-[25px] border border-white/10 bg-white/5 active:scale-95 transition-all text-white/40"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={
                  (step === 1 && (!formData.name || !formData.age || !formData.village)) ||
                  (step === 2 && formData.symptoms.length === 0) ||
                  (step === 3 && formData.treatedBefore === null)
                }
                onClick={handleNext}
                className={`flex-1 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl relative overflow-hidden group ${
                  ((step === 1 && (!formData.name || !formData.age || !formData.village)) ||
                  (step === 2 && formData.symptoms.length === 0) ||
                  (step === 3 && formData.treatedBefore === null))
                  ? "bg-white/5 text-white/5 grayscale pointer-events-none border border-white/5" 
                  : "bg-brand-cyan text-surface-dark neo-glow-cyan shadow-brand-cyan/30"
                }`}
              >
                <span className="relative z-10">{step === 4 ? "Initialize Health Twin" : "Advance Phase"}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.div 
                  className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" 
                />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <HealthGuideBot 
        currentStep={step} 
        onNavigate={(newStep) => setStep(newStep)} 
        formData={formData} 
        language={language}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
}

const InputField = ({ icon, label, value, placeholder, onChange, type = "text" }: any) => (
  <div className="group space-y-2">
    <label className="text-[9px] uppercase tracking-[0.4em] font-black opacity-20 ml-3 group-focus-within:opacity-100 group-focus-within:text-brand-cyan transition-all duration-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-cyan transition-all duration-300">
        {icon}
      </div>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/5 rounded-[22px] py-4 pl-14 pr-5 focus:bg-white/[0.08] focus:border-brand-cyan/30 outline-none transition-all placeholder:text-white/5 text-sm font-medium tracking-wide shadow-inner shadow-black/20 text-white"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const DiagnosticButton = ({ active, onClick, label, desc, icon, color }: any) => (
  <motion.button 
    whileHover={{ scale: 1.04, y: -4 }}
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    className={`p-8 rounded-[35px] border transition-all duration-700 flex flex-col items-center gap-3 relative overflow-hidden shadow-2xl ${
      active 
      ? `bg-brand-${color}/10 border-brand-${color} text-brand-${color} shadow-brand-${color}/20 ring-1 ring-brand-${color}/20` 
      : "bg-white/5 border-white/5 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-white/[0.08] hover:border-white/20"
    }`}
  >
    <div className={`p-4 rounded-[22px] transition-all duration-700 ${active ? `bg-brand-${color}/20 scale-110` : "bg-white/10"}`}>
      {icon}
    </div>
    <div className="text-center">
      <p className="font-black uppercase tracking-[0.2em] text-[11px] mb-1">{label}</p>
      <p className="text-[9px] opacity-60 font-medium tracking-widest">{desc}</p>
    </div>
    {active && (
      <motion.div 
        layoutId="active-glow" 
        className={`absolute inset-[-20%] bg-brand-${color}/5 blur-[30px] rounded-full -z-10`}
      />
    )}
  </motion.button>
);
