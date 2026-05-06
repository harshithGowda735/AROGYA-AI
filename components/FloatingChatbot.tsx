import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Animated, Modal,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Bot, X, Send, Mic, MicOff, Volume2, VolumeX, Stethoscope } from 'lucide-react-native';

// ── OpenRouter config ─────────────────────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY_HERE';
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free';
const SYSTEM_PROMPT = `You are DermAI Assistant, an expert dermatology AI assistant embedded in a rural health diagnostic app used by ASHA workers and patients in India.

Your role:
- Explain skin disease diagnoses in simple, clear language (avoid heavy jargon)
- Provide practical clinical advice and home care tips
- Guide ASHA workers on when to refer patients to a dermatologist
- Mention generic medicines/treatments where appropriate (not brand names)
- Be empathetic, concise and helpful
- If asked about non-dermatology topics, gently redirect to skin health

Keep answers under 120 words unless more detail is specifically needed. Always respond in English.`;

type Message = { role: 'user' | 'assistant'; content: string };

// ── Web Speech Recognition helper ─────────────────────────────────────────────
let SpeechRecognition: any = null;
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

// ── Main component ─────────────────────────────────────────────────────────────
export const FloatingChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm DermAI Assistant powered by Llama 3.3 70B.\n\nAsk me anything about skin conditions, treatments, or when to refer a patient. You can also use the 🎙️ mic to speak!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const micPulse = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef<any>(null);

  // Floating button pulse
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Mic recording pulse
  useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      micPulse.setValue(1);
    }
  }, [isListening]);

  // ── Text-to-Speech ────────────────────────────────────────────────────────
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    // Strip markdown/emoji for cleaner speech
    const clean = text.replace(/[*_#`~\[\]()>]/g, '').replace(/\n+/g, ' ').trim();
    setIsSpeaking(true);
    Speech.speak(clean, {
      language: 'en-IN',
      pitch: 1.0,
      rate: 0.92,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // ── Speech-to-Text (Web Speech API) ──────────────────────────────────────
  const startListening = () => {
    if (Platform.OS !== 'web' || !SpeechRecognition) {
      // Native fallback: show a hint (full native STT requires native module)
      alert('Voice input is available in the browser. On the APK, type your question.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  // ── Send message to OpenRouter ────────────────────────────────────────────
  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    if (isSpeaking) stopSpeaking();

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/harshithGowda735/AROGYA-AI',
          'X-Title': 'DermAI',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newMessages],
        }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content
        ?? "I'm sorry, I couldn't get a response. Please try again.";
      const updated = [...newMessages, { role: 'assistant' as const, content: reply }];
      setMessages(updated);
      speakText(reply);
    } catch {
      const errMsg = '⚠️ Network error. Please check your connection and try again.';
      setMessages([...newMessages, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  // Auto-send when mic transcript lands in input
  useEffect(() => {
    if (input && !isListening && !loading) {
      // small delay so user sees the transcript before sending
      const t = setTimeout(() => sendMessage(input), 600);
      return () => clearTimeout(t);
    }
  }, [input, isListening]);

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────────────────── */}
      {!open && (
        <View style={styles.fabContainer}>
          <Animated.View style={[styles.fabRing, { transform: [{ scale: pulseAnim }] }]} />
          <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.85}>
            <Bot size={26} color="#000" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Chat Modal ───────────────────────────────────────────────────── */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.chatBox}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Stethoscope size={16} color="#000" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>DermAI Assistant</Text>
                  <Text style={styles.headerSub}>Llama 3.3 70B • Voice + Text</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                {/* Toggle voice output */}
                <TouchableOpacity
                  style={styles.headerBtn}
                  onPress={() => { if (isSpeaking) stopSpeaking(); setVoiceEnabled(v => !v); }}
                >
                  {voiceEnabled
                    ? <Volume2 size={16} color="#00E5FF" />
                    : <VolumeX size={16} color="rgba(255,255,255,0.3)" />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { stopSpeaking(); setOpen(false); }} style={styles.headerBtn}>
                  <X size={16} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg, i) => (
                <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                  {msg.role === 'assistant' && (
                    <View style={styles.aiBadge}>
                      <Bot size={10} color="#00E5FF" />
                      <Text style={styles.aiBadgeText}>DermAI</Text>
                    </View>
                  )}
                  <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                    {msg.content}
                  </Text>
                  {msg.role === 'assistant' && (
                    <TouchableOpacity onPress={() => speakText(msg.content)} style={styles.speakBtn}>
                      <Volume2 size={12} color="rgba(0,229,255,0.6)" />
                      <Text style={styles.speakBtnText}>Replay</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {loading && (
                <View style={[styles.bubble, styles.aiBubble, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                  <ActivityIndicator size="small" color="#00E5FF" />
                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              )}
            </ScrollView>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPrompts}>
                {['What is Eczema?', 'When to refer for Melanoma?', 'Home care for Fungal Infection', 'Signs of Scabies'].map((q) => (
                  <TouchableOpacity key={q} style={styles.quickChip} onPress={() => sendMessage(q)}>
                    <Text style={styles.quickChipText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Listening indicator */}
            {isListening && (
              <View style={styles.listeningBar}>
                <Animated.View style={[styles.micDot, { transform: [{ scale: micPulse }] }]} />
                <Text style={styles.listeningText}>Listening... speak now</Text>
              </View>
            )}

            {/* Input row */}
            <View style={styles.inputRow}>
              {/* Mic button */}
              <Animated.View style={{ transform: [{ scale: isListening ? micPulse : 1 }] }}>
                <TouchableOpacity
                  style={[styles.micBtn, isListening && styles.micBtnActive]}
                  onPress={startListening}
                >
                  {isListening ? <MicOff size={18} color="#000" /> : <Mic size={18} color="#00E5FF" />}
                </TouchableOpacity>
              </Animated.View>

              <TextInput
                style={styles.input}
                placeholder="Ask about a skin condition..."
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
                multiline
                maxLength={500}
              />

              <TouchableOpacity
                style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
                onPress={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <Send size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute', bottom: 28, right: 20,
    alignItems: 'center', justifyContent: 'center', zIndex: 999,
  },
  fabRing: {
    position: 'absolute', width: 70, height: 70, borderRadius: 35,
    borderWidth: 2, borderColor: 'rgba(0, 229, 255, 0.45)',
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#00E5FF',
    alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 0 28px rgba(0, 229, 255, 0.65)' },
      default: {
        shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.75, shadowRadius: 18, elevation: 12,
      },
    }),
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' },
  chatBox: {
    backgroundColor: '#0D0D15', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    height: '82%', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#00E5FF', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    padding: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20,
  },
  messages: { flex: 1 },
  bubble: { maxWidth: '88%', borderRadius: 16, padding: 12, gap: 5 },
  aiBubble: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(0,229,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.1)', borderTopLeftRadius: 4,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#00E5FF', borderTopRightRadius: 4 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  aiBadgeText: { color: '#00E5FF', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  bubbleText: { color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 20 },
  userBubbleText: { color: '#000', fontWeight: '500' },
  speakBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  speakBtnText: { color: 'rgba(0,229,255,0.6)', fontSize: 10 },
  typingText: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  quickPrompts: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  quickChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(0,229,255,0.07)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.18)',
  },
  quickChipText: { color: '#00E5FF', fontSize: 11, fontWeight: '600' },
  listeningBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: 'rgba(255,60,60,0.08)', borderTopWidth: 1, borderTopColor: 'rgba(255,60,60,0.15)',
  },
  micDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF4444' },
  listeningText: { color: '#FF6666', fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  micBtn: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 1.5, borderColor: '#00E5FF',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,229,255,0.06)',
  },
  micBtnActive: { backgroundColor: '#FF4444', borderColor: '#FF4444' },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    color: '#FFF', fontSize: 13, maxHeight: 100,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#00E5FF', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.3 },
});
