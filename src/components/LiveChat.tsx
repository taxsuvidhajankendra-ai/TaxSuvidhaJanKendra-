import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, MessageSquare, Phone } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WHATSAPP_NUMBER = "919876543210"; // Replace with real number

export const LiveChat = ({ lang }: { lang: 'en' | 'hi' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [chatMode, setChatMode] = useState<'none' | 'website'>('none');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('chat_session_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chat_session_id', newId);
    return newId;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMode === 'website') {
      const q = query(
        collection(db, 'chats'),
        where('sessionId', '==', sessionId),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      }, (error) => {
        console.error("Chat error:", error);
      });

      return () => unsubscribe();
    }
  }, [chatMode, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    try {
      await addDoc(collection(db, 'chats'), {
        text: inputText,
        createdAt: Timestamp.now(),
        isAdmin: false,
        sessionId: sessionId,
        senderName: 'Customer'
      });
      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-brand-blue p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg leading-none">{lang === 'en' ? 'Live Support' : 'लाइव सपोर्ट'}</h3>
                  <p className="text-blue-200 text-xs mt-1">{lang === 'en' ? "We're online to help you" : "हम आपकी मदद के लिए ऑनलाइन हैं"}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
              {showOptions && chatMode === 'none' ? (
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-center">
                  <p className="text-slate-500 text-center mb-4 text-sm font-medium">
                    {lang === 'en' ? 'How would you like to chat with us?' : 'आप हमसे कैसे चैट करना चाहेंगे?'}
                  </p>
                  
                  <button 
                    onClick={openWhatsApp}
                    className="w-full bg-emerald-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    <Phone className="w-5 h-5" />
                    {lang === 'en' ? 'WhatsApp Chat' : 'व्हाट्सएप चैट'}
                  </button>

                  <button 
                    onClick={() => setChatMode('website')}
                    className="w-full bg-brand-blue text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {lang === 'en' ? 'Website Live Chat' : 'वेबसाइट लाइव चैट'}
                  </button>
                </div>
              ) : (
                <>
                  <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                  >
                    {messages.length === 0 && (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="text-slate-500 text-sm">
                          {lang === 'en' ? 'Start a conversation! Our team will respond shortly.' : 'बातचीत शुरू करें! हमारी टीम जल्द ही जवाब देगी।'}
                        </p>
                      </div>
                    )}
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={cn(
                          "flex flex-col max-w-[80%]",
                          msg.isAdmin ? "self-start" : "self-end items-end"
                        )}
                      >
                        <div className={cn(
                          "p-4 rounded-2xl text-sm font-medium shadow-sm",
                          msg.isAdmin 
                            ? "bg-white text-slate-700 rounded-tl-none border border-slate-100" 
                            : "bg-brand-blue text-white rounded-tr-none"
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
                          {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (lang === 'en' ? 'Just now' : 'अभी')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <form 
                    onSubmit={sendMessage}
                    className="p-4 bg-white border-t border-slate-100 flex gap-2"
                  >
                    <input 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={lang === 'en' ? "Type your message..." : "अपना संदेश टाइप करें..."}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!inputText.trim()}
                      className="bg-brand-blue text-white p-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all z-50 relative",
          isOpen ? "bg-slate-900 text-white" : "bg-brand-blue text-white"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
