/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import VisionScanner from "./components/VisionScanner";
import AudioScanner from "./components/AudioScanner";
import ResultsDashboard from "./components/ResultsDashboard";
import OnboardingModal, { OnboardingData } from "./components/OnboardingModal";
import DigitalTwinView from "./components/DigitalTwinView";
import SymptomWizard from "./components/SymptomWizard";
import UserView from "./components/UserView";
import AshaView from "./components/AshaView";
import HealthGuideBot from "./components/HealthGuideBot";
import HeatmapView from "./components/HeatmapView";
import { GlassCard, ActionButton } from "./components/UIComponents";
import { 
  Mic, 
  Heart, 
  Activity, 
  ShieldCheck, 
  Plus, 
  Menu, 
  Bell, 
  AlertCircle,
  Zap,
  User,
  Wind,
  Languages,
  Home,
  ClipboardList,
  Watch,
  UserCircle,
  Users,
  Settings,
  Map
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// --- Main App ---

export default function App() {
  const [appMode, setAppMode] = useState<'user' | 'asha'>('user');
  const [showScanner, setShowScanner] = useState(false);
  const [showAudioScanner, setShowAudioScanner] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);
  const [showSymptomWizard, setShowSymptomWizard] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [resultsScore, setResultsScore] = useState(74);
  const [language, setLanguage] = useState<'EN' | 'HI' | 'KN'>('EN');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [symptoms, setSymptoms] = useState<any[]>([]);

  // Automatic Location Detection
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log("Location detected locally:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation prompt was denied or failed, staying stealthy.", error);
        }
      );
    }
  }, []);

  const handleAddSymptom = (newSymptom: any) => {
    setSymptoms(prev => [newSymptom, ...prev]);
  };

  const toggleLanguage = () => {
    const langs: ('EN' | 'HI' | 'KN')[] = ['EN', 'HI', 'KN'];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 py-8 flex flex-col relative overflow-hidden bg-surface-dark selection:bg-brand-cyan/20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-brand-cyan/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      {/* Onboarding Flow (Name & Age) */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={(data) => {
          setUserData(data);
          setShowOnboarding(false);
        }} 
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Vision Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <VisionScanner 
            onClose={() => setShowScanner(false)} 
            onCapture={() => {
              setResultsScore(82);
              setTimeout(() => {
                setShowScanner(false);
                setShowResults(true);
              }, 4000);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Audio Scanner Modal */}
      <AnimatePresence>
        {showAudioScanner && (
          <AudioScanner 
            onClose={() => setShowAudioScanner(false)} 
            onComplete={() => {
              setResultsScore(48);
              setTimeout(() => {
                setShowAudioScanner(false);
                setShowResults(true);
              }, 2000);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Results Dashboard Modal */}
      <AnimatePresence>
        {showResults && (
           <ResultsDashboard 
             onClose={() => setShowResults(false)}
             overallScore={resultsScore}
           />
        )}
      </AnimatePresence>

      {/* Digital Twin & History View */}
      <AnimatePresence>
        {showDigitalTwin && (
          <DigitalTwinView 
            onClose={() => setShowDigitalTwin(false)} 
            externalSymptoms={symptoms}
          />
        )}
      </AnimatePresence>

      {/* Symptom Wizard Modal */}
      <AnimatePresence>
        {showSymptomWizard && (
          <SymptomWizard 
            onClose={() => setShowSymptomWizard(false)}
            onAddSymptom={handleAddSymptom}
          />
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-cyan/20 rounded-xl flex items-center justify-center border border-brand-cyan/30">
            <Zap className="w-6 h-6 text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">AROGYA AI</h1>
            <div className="flex items-center gap-1.5 grayscale opacity-40">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] uppercase font-black tracking-widest text-white">Encrypted / Local</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="p-3 bg-white/5 rounded-xl flex items-center gap-2 border border-white/10"
          >
            <Languages className="w-4 h-4 text-brand-gold" />
            <span className="text-[9px] uppercase font-black tracking-widest">{language}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAppMode(appMode === 'user' ? 'asha' : 'user')}
            className={`p-3 rounded-xl flex items-center gap-2 border transition-all ${
              appMode === 'asha' ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan' : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {appMode === 'asha' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            <span className="text-[9px] uppercase font-black tracking-widest">{appMode}</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {appMode === 'user' ? (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <UserView 
                userName={userData?.name}
                language={language}
                onScan={() => setShowScanner(true)}
                onVoice={() => {}} // Integration handled by HealthGuideBot
              />
            </motion.div>
          ) : (
            <motion.div
              key="asha"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AshaView 
                onScan={() => setShowScanner(true)}
                onViewRecords={() => setShowDigitalTwin(true)}
                onViewHeatmap={() => setShowHeatmap(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Heatmap Dashboard Modal */}
      <AnimatePresence>
        {showHeatmap && (
          <HeatmapView onClose={() => setShowHeatmap(false)} />
        )}
      </AnimatePresence>

      {/* Health Guide Bot (AI Assistant) */}
      <HealthGuideBot 
        currentStep={appMode === 'user' ? 2 : 1} 
        onNavigate={(s) => console.log("Navigating to step", s)}
        formData={userData || { name: "", age: 0, village: "", weight: 0, symptoms: [] }}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Global Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-surface-dark/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[35px] max-w-md mx-auto z-20 flex justify-between items-center px-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <NavButton icon={<Home className="w-6 h-6" />} active />
        <NavButton icon={<ClipboardList className="w-6 h-6" />} onClick={() => setShowSymptomWizard(true)} />
        
        <div className="w-16 h-1 w-1 bg-transparent" /> {/* Space for voice bot button if needed, but it's floating now */}
        
        <NavButton icon={<Watch className="w-6 h-6" />} onClick={() => setShowDigitalTwin(true)} />
        <NavButton icon={<Settings className="w-6 h-6" />} onClick={() => {}} />
      </footer>
    </div>
  );
}


const NavButton = ({ icon, onClick, active = false }: { icon: any, onClick?: () => void, active?: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.8 }}
    onClick={onClick}
    className={`p-3 rounded-xl transition-colors ${active ? 'text-brand-cyan bg-brand-cyan/10' : 'text-white/30 hover:text-white/60'}`}
  >
    {icon}
  </motion.button>
);

