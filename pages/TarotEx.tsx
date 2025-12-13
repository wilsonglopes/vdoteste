import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { supabase } from '../services/supabase';
import { DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';

// Componentes
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';

// --- IMPORTANTE: Usando o componente específico do EX ---
import QuestionStepEx from '../components/tarot/QuestionStepEx'; 

import SelectionStep, { CardData } from '../components/tarot/SelectionStep';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const LOCAL_KEY = 'vozes_tarot_ex_state';
const MAX_CARDS = 5; // Limite de 5 cartas

const TarotEx: React.FC = () => {
  const navigate = useNavigate();

  // --- STORE ---
  const { step, setStep, question, setQuestion, selectedCards, setSelectedCards, revealedCount, setRevealedCount, reading, setReading, isLoadingAI, setLoadingAI, resetTarot } = useTarotStore();

  const [deck, setDeck] = useState<CardData[]>([]);
  const [availableCards, setAvailableCards] = useState<CardData[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [revealedLocal, setRevealedLocal] = useState<number>(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const mountedRef = useRef(true);

  const POSITIONS = ["O que sente por mim?", "Tem intenção de voltar?", "Mudou as atitudes?", "Possível futuro", "Conselho"];

  const handleNewReading = () => {
    if (typeof resetTarot === 'function') resetTarot();
    setHoveredCardId(null); setQuestion(''); setSelectedCards([]); setRevealedCount(0); setRevealedLocal(0); setReading(null); setLoadingAI(false);
    initializeDeck();
    try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
  };

  const initializeDeck = () => {
    const fullDeck: CardData[] = [];
    for (let i = 1; i <= DECK_SIZE; i++) {
      fullDeck.push({ id: i, name: (CARD_NAMES as any)[i] || `Carta ${i}`, imageUrl: `https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/${i}.jpg` });
    }
    const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setAvailableCards(shuffled);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); window.addEventListener('resize', checkMobile);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    initializeDeck();
    mountedRef.current = true;
    return () => { mountedRef.current = false; window.removeEventListener('resize', checkMobile); };
  }, []); 

  // --- SELEÇÃO ---
  const handleCardSelect = (card: CardData) => {
    if (selectedCards.length >= MAX_CARDS) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    
    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);
    setAvailableCards(deck.filter(c => !newSelection.find(s => s.id === c.id)));
  };

  // --- REVELAÇÃO ---
  const startReveal = async () => {
    if (!user) { setShowAuth(true); return; }
    const creditCheck = await consumeCredit(user.id);
    if (!creditCheck.success) { if (creditCheck.message === 'no_credits') setShowPlans(true); return; }

    setLoadingAI(true);
    setRevealedLocal(0);

    try {
      for (let i = 1; i <= MAX_CARDS; i++) {
        if (!mountedRef.current) break;
        await new Promise(res => setTimeout(res, 600));
        setRevealedLocal(i);
      }
      let contextPrompt = `\n\n[MÉTODO: TIRADA DO EX - 5 CARTAS]\n`;
      selectedCards.forEach((card, idx) => { contextPrompt += `- Posição ${idx + 1} (${POSITIONS[idx]}): Carta "${card.name}"\n`; });
      contextPrompt += `\nInstrução: Foque na dinâmica de ex-relacionamento.`;
      
      const userName = user?.user_metadata?.name || "Consulente";
      const userDob = user?.user_metadata?.birth_date || "";
      const result = await getTarotReading(question + contextPrompt, selectedCards.map(c => c.id), userName, userDob);
      
      setReading(result);
      setStep('result');
      await saveReading(user.id, 'tarot', { question, cardIds: selectedCards.map(c=>c.id), spread: 'Tirada do Ex' }, result);
    } catch (err) { alert("Erro na conexão."); } finally { setLoadingAI(false); }
  };

  // --- LAYOUT DA MESA (Boneco) ---
  const renderExLayout = () => {
    const renderSlot = (index: number) => {
        const card = selectedCards[index];
        const label = POSITIONS[index];
        const isRevealed = index < revealedLocal;
        if (!card) return null;

        return (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative w-20 h-32 md:w-24 md:h-40 group">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[150%] text-center z-20">
                <span className="text-[9px] font-bold uppercase bg-black/80 text-purple-200 px-2 py-1 rounded border border-white/10 block leading-tight">{label}</span>
            </div>
            
            <div className="w-full h-full relative">
                {!isRevealed ? (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-950 to-purple-900 border border-purple-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                        <div className="absolute inset-1 border border-white/10 rounded-md" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-purple-400/30 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 border border-purple-400/30 rotate-45" />
                        </div>
                    </div>
                ) : (
                    <img src={card.imageUrl} className="w-full h-full object-cover rounded-lg border border-white/20 shadow-xl" />
                )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-black">{index + 1}</div>
          </motion.div>
        );
    };

    return (
      <div className="flex flex-col items-center gap-6 mt-8">
         <div className="flex gap-16 md:gap-32">{renderSlot(0)}{renderSlot(1)}</div>
         <div className="-mt-4">{renderSlot(2)}</div>
         <div className="flex gap-16 md:gap-32">{renderSlot(3)}{renderSlot(4)}</div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 w-full flex flex-col items-center min-h-screen">
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      <PlansModal isOpen={showPlans} onClose={() => setShowPlans(false)} onSelectPlan={() => setShowPlans(false)} />

      {/* HEADER REMOVIDO CONFORME PEDIDO */}

      {step === 'question' && (
        <QuestionStepEx 
          question={question} 
          setQuestion={setQuestion} 
          onNext={() => setStep('selection')} 
          onBack={() => navigate('/nova-leitura')}
        />
      )}
      
      {step === 'selection' && (
        <SelectionStep 
          availableCards={availableCards}
          selectedCards={selectedCards}
          hoveredCardId={hoveredCardId}
          setHoveredCardId={setHoveredCardId}
          onCardSelect={handleCardSelect}
          // Ao completar 5 cartas, o botão "Ver Mesa" aparece (controlado pelo SelectionStep)
          onNext={() => { setRevealedLocal(0); setStep('reveal'); }} 
          onBack={() => setStep('question')}
          isMobile={isMobile}
          maxCards={MAX_CARDS} // 5
        />
      )}

      {(step === 'reveal' || step === 'result') && (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-serif text-white mb-4 text-center">{step === 'reveal' ? 'Revelando a Mesa...' : 'Interpretação'}</h2>
            <div className="w-full overflow-x-auto py-8 flex justify-center bg-white/5 rounded-3xl border border-white/5 mb-8 min-h-[400px]">
                {renderExLayout()}
            </div>
            {step === 'reveal' && revealedLocal === MAX_CARDS && !reading && (
               <button onClick={startReveal} disabled={isLoadingAI} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold flex items-center gap-3 animate-bounce">{isLoadingAI ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Interpretar</>}</button>
            )}
            {step === 'result' && reading && (
                <div className="w-full max-w-3xl bg-slate-900/90 border border-purple-500/30 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex gap-2"><Sparkles className="text-yellow-400"/> A Revelação</h3>
                  <div className="prose prose-invert text-slate-300 whitespace-pre-wrap">{reading.interpretation}</div>
                  <button onClick={() => { handleNewReading(); navigate('/dashboard'); }} className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">Encerrar</button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TarotEx;
