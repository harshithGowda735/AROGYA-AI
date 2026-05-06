import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, Check, AlertCircle, RefreshCw, Zap } from "lucide-react";

interface VisionScannerProps {
  onClose: () => void;
  onCapture: (image: string) => void;
}

export default function VisionScanner({ onClose, onCapture }: VisionScannerProps) {
  const [isAligned, setIsAligned] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Simulate alignment logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing) {
        setIsAligned(Math.random() > 0.3); // Randomly simulate alignment for the demo
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleCapture = () => {
    if (!isAligned) return;
    setIsAnalyzing(true);
    // Simulate capture and analysis
    setTimeout(() => {
      onCapture("captured_image_placeholder");
    }, 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col font-sans"
    >
      {/* 3D Container for Flip Animation */}
      <div className="relative flex-1 perspective-1000">
        <AnimatePresence mode="wait">
          {!isAnalyzing ? (
            <motion.div
              key="scanner"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Camera Viewport */}
              <div className="relative flex-1 overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover grayscale-[0.2] brightness-110"
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 flex flex-col pointer-events-none">
                  {/* Targeting Reticle */}
                  <div className="flex-1 flex items-center justify-center relative">
                    {/* Reticle Circle */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <motion.div 
                        animate={{ 
                          borderColor: isAligned ? ["#00E5FF", "#50E3C2", "#00E5FF"] : ["#FF4B2B", "#FF416C"] 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-full h-full border-2 rounded-full flex items-center justify-center relative ${
                          isAligned ? "neo-glow-cyan" : "shadow-[0_0_20px_rgba(255,75,43,0.4)]"
                        }`}
                      >
                        {/* Scanning Pulsating Ring */}
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`absolute inset-[-4px] border border-current rounded-full ${
                             isAligned ? "text-brand-cyan" : "text-red-500"
                          }`}
                        />
                        
                        {/* Center Marks */}
                        <div className="w-1 h-8 bg-white/20 absolute" />
                        <div className="w-8 h-1 bg-white/20 absolute" />
                      </motion.div>
                    </div>

                    {/* Corner Borders */}
                    <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-white/40" />
                    <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-white/40" />
                    <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-white/40" />
                    <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-white/40" />
                  </div>

                  {/* Top Bar Status */}
                  <div className="pt-12 px-6 flex justify-between items-start">
                    <button 
                      onClick={onClose}
                      className="p-4 rounded-full bg-white/10 backdrop-blur-md pointer-events-auto"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className={`px-4 py-2 rounded-full border backdrop-blur-md flex items-center gap-2 transition-colors ${
                      isAligned ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan" : "bg-red-500/20 border-red-500 text-red-500"
                    }`}>
                      {isAligned ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                        {isAligned ? "Target Locked" : "Align Eye within Circle"}
                      </span>
                    </div>
                  </div>

                  {/* Floating Instructions */}
                  <div className="absolute bottom-40 left-0 right-0 text-center px-10">
                    <p className="text-white/80 font-light text-sm italic">
                      {isAligned 
                        ? "Hold steady. Automatic flash activation ready."
                        : "Focus on the center. Ensure bright lighting."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Capture Area */}
              <div className="h-40 bg-surface-dark flex items-center justify-center px-6 relative">
                 <motion.button
                   whileTap={{ scale: 0.9 }}
                   disabled={!isAligned}
                   onClick={handleCapture}
                   className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                     isAligned 
                       ? "bg-brand-cyan neo-glow-cyan shadow-xl cursor-pointer" 
                       : "bg-white/5 opacity-50 cursor-not-allowed border border-white/10"
                   }`}
                 >
                   <Camera className={`w-10 h-10 ${isAligned ? "text-surface-dark" : "text-white/20"}`} />
                 </motion.button>
                 
                 <div className="absolute left-10 opacity-30 flex flex-col items-center">
                    <Zap className="w-6 h-6 mb-1 text-brand-gold" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">Auto Flash</span>
                 </div>
                 <div className="absolute right-10 opacity-30 flex flex-col items-center">
                    <RefreshCw className="w-6 h-6 mb-1" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">Flip</span>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analyzing"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 glass-card m-6 flex flex-col items-center justify-center text-center p-10 overflow-hidden"
            >
              {/* Analysis Animation */}
              <div className="relative w-48 h-48 mb-8">
                 <motion.div 
                   animate={{ 
                     rotate: 360,
                     borderColor: ["#00E5FF", "#FBC02D", "#00E5FF"]
                   }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 border-t-4 border-r-4 border-transparent rounded-full"
                 />
                 <motion.div 
                   animate={{ 
                     scale: [1, 1.2, 1],
                     opacity: [0.5, 1, 0.5]
                   }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-8 rounded-full bg-brand-cyan/20 flex items-center justify-center"
                 >
                    <RefreshCw className="w-12 h-12 text-brand-cyan animate-spin-slow" />
                 </motion.div>
              </div>

              <h2 className="text-3xl italic mb-4">Patient Scanning...</h2>
              <p className="text-white/60 font-light max-w-xs mx-auto mb-8">
                Analyzing scan via localized neural engine. No cloud dependency.
              </p>

              <div className="w-full space-y-6">
                {[
                  { label: "Validating Image Quality", p: 25 },
                  { label: "Extracting Dermatological Features", p: 50 },
                  { label: "Running AI Inference (MobileNetV2)", p: 75 },
                  { label: "Generating Clinical Result", p: 100 }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/40">{step.label}</span>
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-brand-cyan" 
                      />
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: i * 1, ease: i === 0 ? "easeOut" : "linear" }}
                        className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(0,229,255,0.4)]" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex items-center gap-3 p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-2xl">
                 <Zap className="w-5 h-5 text-brand-cyan animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">On-Device Processing Active</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
