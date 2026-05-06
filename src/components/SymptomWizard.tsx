import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Camera,
  CheckCircle2,
  Stethoscope,
  Activity,
  Wind,
  ShieldCheck,
  FileText,
  Upload,
  BrainCircuit
} from "lucide-react";
import { useState } from "react";
import { GlassCard } from "./UIComponents";

interface SymptomWizardProps {
  onClose: () => void;
  onAddSymptom: (symptom: any) => void;
}

const CATEGORIES = [
  { id: 'skin', label: 'Skin Concerns', icon: <Activity className="w-6 h-6" />, desc: 'Rashes, spots, or persistent itching' },
  { id: 'respiratory', label: 'Breathing', icon: <Wind className="w-6 h-6" />, desc: 'Cough, wheezing, or chest pain' },
  { id: 'fever', label: 'Fever & Cold', icon: <Activity className="w-6 h-6" />, desc: 'High temperature or shivering' },
  { id: 'general', label: 'General Pain', icon: <Stethoscope className="w-6 h-6" />, desc: 'Muscle ache, stomach, or fatigue' },
];

export default function SymptomWizard({ onClose, onAddSymptom }: SymptomWizardProps) {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<any>({
    category: null,
    hasCondition: null,
    treatedBefore: null,
    prescriptionImg: null
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    onAddSymptom({
      id: Date.now().toString(),
      type: 'diagnostic',
      title: `${selection.category.label} Checkup`,
      result: selection.treatedBefore === 'yes' ? 'Reviewing History' : 'New Case',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase(),
      color: selection.treatedBefore === 'yes' ? 'gold' : 'cyan',
      meta: selection
    });
    nextStep(); // To success screen
    setTimeout(onClose, 2500);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[70] bg-surface-dark flex flex-col overflow-hidden"
    >
      {/* Header with Progress */}
      <header className="pt-14 px-6 pb-6 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 active:scale-95 transition-all">
            <X className="w-6 h-6 text-white/50" />
          </button>
          <div className="h-1 bg-white/5 w-24 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-brand-cyan" 
               animate={{ width: `${(step / 4) * 100}%` }}
             />
          </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">Step {step}/4</p>
           <p className="text-xs font-bold text-brand-cyan">Smart Diagnosis</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl italic leading-tight">What symptoms are you feeling?</h2>
              <div className="grid gap-4">
                {CATEGORIES.map((cat, idx) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => { setSelection({...selection, category: cat}); nextStep(); }}
                    className="p-5 flex items-center gap-4 glass-button border-white/5 hover:border-brand-cyan/40 bg-white/5 group"
                  >
                    <div className="p-3 rounded-xl bg-brand-cyan/10 text-brand-cyan group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <div className="text-left flex-1">
                       <p className="text-lg font-bold">{cat.label}</p>
                       <p className="text-xs opacity-40">{cat.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-20" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex justify-center">
                 <motion.div 
                   animate={{ 
                     rotateY: [0, 360],
                     y: [0, -10, 0]
                   }}
                   transition={{ duration: 6, repeat: Infinity }}
                   className="w-32 h-32 bg-brand-cyan/10 rounded-full flex items-center justify-center border-2 border-brand-cyan/20 neo-glow-cyan"
                 >
                    <BrainCircuit className="w-16 h-16 text-brand-cyan" />
                 </motion.div>
              </div>
              <h2 className="text-3xl italic text-center leading-tight">Are you currently experiencing {selection.category?.label}?</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setSelection({...selection, hasCondition: true}); nextStep(); }}
                  className="p-8 flex flex-col items-center justify-center gap-4 glass-button bg-brand-cyan/5 border-brand-cyan/30 text-brand-cyan"
                >
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="font-bold">YES</span>
                </button>
                <button 
                  onClick={() => { setSelection({...selection, hasCondition: false}); nextStep(); }}
                  className="p-8 flex flex-col items-center justify-center gap-4 glass-button bg-white/5 border-white/10 opacity-60"
                >
                  <X className="w-8 h-8" />
                  <span className="font-bold">NO</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl italic leading-tight">Have you treated this before at a hospital?</h2>
                <p className="text-sm opacity-40">Previous medical records help the AI understand your history.</p>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={() => { setSelection({...selection, treatedBefore: 'yes'}); nextStep(); }}
                  className={`p-6 flex items-center gap-4 glass-button border-white/10 ${selection.treatedBefore === 'yes' ? 'bg-brand-gold/10 border-brand-gold/40 text-brand-gold' : 'bg-white/5'}`}
                >
                  <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Yes, I have been treated</p>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Recommended for history</p>
                  </div>
                </button>

                <button 
                  onClick={() => { setSelection({...selection, treatedBefore: 'no'}); handleFinish(); }}
                  className="p-6 flex items-center gap-4 glass-button bg-white/5 border-white/10"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                    <X className="w-6 h-6 opacity-30" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold opacity-80">No, this is new</p>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Start fresh diagnosis</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl italic leading-tight">Please upload your prescription</h2>
              <p className="text-sm opacity-40 bg-brand-gold/10 border border-brand-gold/20 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
                Images are encrypted and only used for your private medical history.
              </p>

              <div className="aspect-[4/5] w-full bg-white/5 rounded-[30px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 group relative overflow-hidden">
                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFinish} />
                 <div className="p-8 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan group-hover:scale-110 transition-transform">
                    <Upload className="w-12 h-12" />
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-bold">Click to Upload Image</p>
                    <p className="text-xs opacity-30">Camera or Photo Library</p>
                 </div>
                 <div className="absolute bottom-6 flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full">
                    <FileText className="w-4 h-4 text-brand-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Prescription, Report, or Meds</span>
                 </div>
              </div>
              
              <button 
                onClick={prevStep}
                className="w-full py-4 text-sm font-bold opacity-30 uppercase tracking-widest hover:opacity-100 transition-opacity"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full py-12 text-center"
            >
              <div className="w-28 h-28 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-8 border border-brand-cyan/20 relative">
                 <CheckCircle2 className="w-14 h-14 text-brand-cyan" />
                 <motion.div 
                   animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="absolute inset-0 rounded-full border-2 border-brand-cyan/40"
                 />
              </div>
              <h2 className="text-4xl italic text-white mb-3">Sync Complete</h2>
              <p className="text-sm opacity-50 max-w-xs leading-relaxed">
                 Expert analysis is now scanning your symptoms. Results will appear in your Digital Twin logs.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 5 && (
        <footer className="p-6 pb-12 bg-black/40 border-t border-white/5 flex gap-4">
           {step > 1 && (
             <button onClick={prevStep} className="p-5 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6" />
             </button>
           )}
           <div className="flex-1" />
           <p className="text-[10px] font-bold opacity-20 self-center uppercase tracking-[0.4em]">Secure Cloud Vitals</p>
        </footer>
      )}
    </motion.div>
  );
}
