import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, X, Check, Activity, Volume2, RefreshCw } from "lucide-react";

interface AudioScannerProps {
  onClose: () => void;
  onComplete: (blob: Blob) => void;
}

const LANGUAGES = [
  { text: "Speak to analyze", lang: "English" },
  { text: "ಕೆಮ್ಮಿ ಪರೀಕ್ಷಿಸಿ", lang: "Kannada" },
  { text: "खांसी जांचें", lang: "Hindi" },
];

export default function AudioScanner({ onClose, onComplete }: AudioScannerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [langIndex, setLangIndex] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Rotating languages
  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % LANGUAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const startVisualization = useCallback((stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    source.connect(analyser);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = 0;
    const draw = () => {
      if (!ctx || !analyserRef.current || !dataArrayRef.current) return;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Spectrogram layout
      const width = canvas.width;
      const height = canvas.height;
      
      // Shift image left for rolling effect
      const imageData = ctx.getImageData(1, 0, width - 1, height);
      ctx.putImageData(imageData, 0, 0);

      // Draw new column
      const colWidth = 1;
      const step = height / dataArrayRef.current.length;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const value = dataArrayRef.current[i];
        const percent = value / 255;
        
        // Neo-clinical colors: Cyan to Deep blue
        const r = 0;
        const g = Math.floor(229 * percent);
        const b = Math.floor(255 * percent);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${percent > 0.1 ? 1 : 0.2})`;
        ctx.fillRect(width - colWidth, height - (i * step), colWidth, step);
      }
    };

    draw();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsRecording(true);
      setProgress(0);
      startVisualization(stream);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds
      
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / duration) * 100, 100);
        setProgress(p);
        
        if (elapsed >= duration) {
          stopRecording();
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Stop streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Simulate analysis
    setTimeout(() => {
      onComplete(new Blob());
    }, 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col font-sans"
    >
      {/* Top Bar */}
      <div className="pt-12 px-6 flex justify-between items-center relative z-10">
        <button 
          onClick={onClose}
          className="p-4 rounded-full bg-white/10 backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 backdrop-blur-md">
            <Volume2 className="w-4 h-4 text-brand-cyan" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-cyan">Spectrogram Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {!isAnalyzing ? (
            <motion.div 
              key="recording"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 relative flex items-center justify-center p-6">
                {/* 3D Spectrogram Canvas Container */}
                <div className="w-full h-64 glass-card overflow-hidden relative border-brand-cyan/20">
                  <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={300}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {!isRecording && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-xs">Waiting for Input</p>
                     </div>
                  )}
                  {/* Grid overlay */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-6 grid-rows-4 opacity-10">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="border-[0.5px] border-white" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="h-64 bg-surface-dark flex flex-col items-center justify-center p-8 gap-6">
                {/* Multilingual Display */}
                <div className="h-6 flex items-center justify-center overflow-hidden w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={langIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-xl italic font-serif text-white/90">{LANGUAGES[langIndex].text}</span>
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-brand-gold mt-1">
                        {LANGUAGES[langIndex].lang}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative">
                  {/* Progress Ring */}
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/5"
                    />
                    {isRecording && (
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray="377"
                        animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                        className="text-brand-cyan neo-glow-cyan"
                      />
                    )}
                  </svg>

                  {/* Main Action Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`absolute inset-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isRecording ? "bg-red-500 shadow-xl shadow-red-500/40" : "bg-brand-cyan neo-glow-cyan shadow-xl shadow-brand-cyan/40"
                    }`}
                  >
                    {isRecording ? (
                       <X className="w-10 h-10 text-white" />
                    ) : (
                       <Mic className="w-10 h-10 text-surface-dark" />
                    )}
                  </motion.button>
                </div>
                
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">
                  {isRecording ? "Capturing: 5.0s Lock" : "Tap to start diagnostic scan"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
               key="analyzing"
               initial={{ rotateX: 90, opacity: 0 }}
               animate={{ rotateX: 0, opacity: 1 }}
               className="flex-1 flex flex-col items-center justify-center text-center p-10"
            >
               <div className="relative w-48 h-48 mb-8">
                  <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 rounded-full border-2 border-dashed border-brand-gold/30"
                  />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 20px rgba(0,229,255,0.2)",
                        "0 0 50px rgba(0,229,255,0.4)",
                        "0 0 20px rgba(0,229,255,0.2)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-10 rounded-full bg-brand-cyan flex items-center justify-center"
                  >
                     <Activity className="w-10 h-10 text-surface-dark" />
                  </motion.div>
               </div>

               <h2 className="text-3xl italic mb-4">Neural Audio Processing</h2>
               <p className="text-white/60 font-light max-w-xs mx-auto mb-10">
                 Deconstructing respiratory patterns into biometric markers...
               </p>

               <div className="grid grid-cols-8 gap-1 h-12 w-full max-w-xs">
                 {[...Array(8)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: ["20%", "100%", "20%"] }}
                     transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                     className="bg-brand-gold/40 rounded-full flex-1"
                   />
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
