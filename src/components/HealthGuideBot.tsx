import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  Sparkles,
  Bot,
  User,
  AlertCircle,
  Mic,
  MicOff,
  Languages,
  Volume2,
  VolumeX,
  ChevronDown
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { OnboardingData } from "./OnboardingModal";

interface HealthGuideBotProps {
  currentStep: number;
  onNavigate: (step: number) => void;
  formData: OnboardingData;
  language: 'EN' | 'HI' | 'KN';
  onLanguageChange: (lang: 'EN' | 'HI' | 'KN') => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  isError?: boolean;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default function HealthGuideBot({ 
  currentStep, 
  onNavigate, 
  formData,
  language: selectedLanguage,
  onLanguageChange: setSelectedLanguage
}: HealthGuideBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);

  // Initial Greeting based on language
  useEffect(() => {
    if (messages.length === 0) {
      const greetings = {
        EN: `Namaste${formData.name ? `, ${formData.name}` : ''}! I am your AI Health Guide. I can help you complete your profile or analyze any skin concerns. How can I assist you today?`,
        HI: `नमस्ते${formData.name ? `, ${formData.name}` : ''}! मैं आपका AI स्वास्थ्य गाइड हूँ। मैं आपकी प्रोफ़ाइल पूरी करने या त्वचा संबंधी किसी भी चिंता का विश्लेषण करने में आपकी मदद कर सकता हूँ। मैं आज आपकी क्या सहायता कर सकता हूँ?`,
        KN: `ನಮಸ್ಕಾರ${formData.name ? `, ${formData.name}` : ''}! ನಾನು ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಲು ಅಥವಾ ಯಾವುದೇ ಚರ್ಮದ ಸಮಸ್ಯೆಗಳನ್ನು ವಿಲೇಷಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`
      };
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: greetings[selectedLanguage]
      }]);
    }
  }, [selectedLanguage, formData.name]);

  const recognitionRef = useRef<any>(null);

  const langConfig = {
    EN: { code: 'en-US', label: 'English', text: 'Voice in English' },
    HI: { code: 'hi-IN', label: 'हिंदी', text: 'हिंदी में बात करें' },
    KN: { code: 'kn-IN', label: 'ಕನ್ನಡ', text: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ' }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        // Automatically send after voice input
        setTimeout(() => handleSend(transcript), 500);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [selectedLanguage]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current.lang = langConfig[selectedLanguage].code;
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const speakText = (text: string) => {
    if (!isAutoSpeak) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langConfig[selectedLanguage].code;
    window.speechSynthesis.cancel(); // Stop any current speech
    window.speechSynthesis.speak(utterance);
  };

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const parts: any[] = [{ text: textToSend || "Analyze this image." }];
      if (selectedImage) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: selectedImage.split(',')[1]
          }
        });
      }

      const systemInstruction = `
        You are a supportive, professional, and proactive "AI Health Guide" assistant for a medical diagnostic app.
        Your goal is to guide the user through a 4-step onboarding process:
        Step 1: Personal Profile (Name, Age, Village, Weight)
        Step 2: Symptom Selection
        Step 3: Treatment History
        Step 4: Medical Report Upload
        
        Current Language Preference: ${langConfig[selectedLanguage].label} (${langConfig[selectedLanguage].code})
        ALWAYS respond in the language specified above unless the user switches.
        
        Current User Context:
        - Current Step: ${currentStep}
        - Name: ${formData.name || 'Unknown'}
        - Age: ${formData.age || 'Unknown'}
        - Symptoms: ${formData.symptoms.join(', ') || 'None selected'}
        
        Guidelines:
        1. Always include a medical disclaimer in ${langConfig[selectedLanguage].label}: "I am an AI assistant, not a doctor. Please consult a healthcare professional for clinical diagnosis."
        2. Be proactive. If a user mentions symptoms or shows an image of a rash, suggest moving to Step 2.
        3. If a user asks about uploading reports, suggest moving to Step 4.
        4. If a user asks who you are, explain your role as a guide.
        5. Use the user's name if available.
        6. Return a JSON object with:
           - reply: Your text response in ${langConfig[selectedLanguage].label}.
           - targetStep: (Optional) The step number (1, 2, 3, or 4) to navigate local application to.
      `;


      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              targetStep: { type: Type.NUMBER, description: "Optional step to navigate to (1-4)" }
            },
            required: ["reply"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      }]);

      speakText(data.reply);

      if (data.targetStep && data.targetStep !== currentStep) {
        onNavigate(data.targetStep);
      }
    } catch (error) {
      console.error("AI Guide Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered a neural sync error. Please try again or continue manually.",
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            boxShadow: "0 15px 40px rgba(0,229,255,0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-[110] w-16 h-16 bg-brand-cyan rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,229,255,0.2)] text-surface-dark transition-all"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Bot className="w-8 h-8" />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-brand-cyan"
          />
        </motion.button>
      )}

      {/* Chat Sidebar/Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              damping: 28, 
              stiffness: 260 
            }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] z-[120] bg-surface-dark/95 backdrop-blur-2xl border-l border-white/10 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-cyan/20 rounded-xl flex items-center justify-center text-brand-cyan border border-brand-cyan/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg leading-tight text-white">Health Assistant</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-tighter text-brand-cyan font-black"
                    >
                      <Languages className="w-3 h-3" />
                      {langConfig[selectedLanguage].label}
                      <ChevronDown className={`w-2 h-2 transition-transform ${showLanguagePicker ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 opacity-40 text-white" />
              </button>

              <AnimatePresence>
                {showLanguagePicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-20 left-6 right-6 bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col p-2"
                  >
                    {(Object.keys(langConfig) as Array<'EN' | 'HI' | 'KN'>).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setShowLanguagePicker(false);
                        }}
                        className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-between rounded-xl ${
                          selectedLanguage === lang ? 'text-brand-cyan bg-brand-cyan/5' : 'text-white/40'
                        }`}
                      >
                        {langConfig[lang].label}
                        {selectedLanguage === lang && <Sparkles className="w-3 h-3" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                      msg.role === 'user' 
                      ? 'bg-white/10 border-white/10 text-white/50' 
                      : 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-white/10 text-white' 
                        : msg.isError ? 'bg-red-500/10 border border-red-500/20 text-red-200' : 'bg-white/[0.03] text-white/80'
                      }`}>
                        {msg.image && (
                          <img src={msg.image} alt="Upload" className="w-full rounded-xl mb-3 border border-white/10 shadow-lg" />
                        )}
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 p-4 bg-white/[0.03] rounded-2xl items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
                    <span className="text-[10px] opacity-40 italic tracking-widest font-black uppercase text-white/60">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="px-6 py-2">
              <div className="flex items-start gap-2 p-3 bg-brand-gold/5 border border-brand-gold/10 rounded-xl">
                <AlertCircle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <p className="text-[9px] text-brand-gold/60 leading-tight uppercase tracking-tighter font-bold">
                  Assistant Only. Not a medical replacement. Consult a doctor for clinical diagnosis.
                </p>
              </div>
            </div>

            {/* Input */}
            <div className="p-6 bg-white/[0.02] border-t border-white/10 space-y-4">
              {/* Voice & Speaker Controls */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-1.5 grayscale opacity-30">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] uppercase tracking-tighter font-black text-white">Neural Synced</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsAutoSpeak(!isAutoSpeak)}
                    className={`p-2 rounded-lg border transition-all ${isAutoSpeak ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan' : 'bg-white/5 border-white/10 text-white/30'}`}
                    title={isAutoSpeak ? "Mute Bot" : "Unmute Bot"}
                  >
                    {isAutoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={toggleRecording}
                    className={`p-2 rounded-lg border transition-all ${isRecording ? 'bg-red-500/20 border-red-500/30 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-white/30'}`}
                    title={isRecording ? "Stop Recording" : "Start Voice Chat"}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {selectedImage && (
                <div className="relative inline-block">
                  <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-brand-cyan/50" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full text-white shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <div className="flex gap-3 items-end">
                <div className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl relative overflow-hidden focus-within:border-brand-cyan/50 transition-colors">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask your guide..."
                    className="w-full bg-transparent p-4 min-h-[56px] max-h-32 outline-none resize-none text-sm placeholder:opacity-30 text-white"
                  />
                  <div className="flex px-4 py-2 border-t border-white/[0.05] justify-between items-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-white/10 rounded-lg text-brand-cyan transition-colors"
                      title="Upload scan"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={(!input.trim() && !selectedImage) || isTyping}
                      className="bg-brand-cyan text-surface-dark p-2 rounded-xl disabled:opacity-30 transition-all active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
