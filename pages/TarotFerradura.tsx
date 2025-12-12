import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { supabase } from '../services/supabase';
import { DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';
import QuestionStep from '../components/tarot/QuestionStep';
import SelectionStep, { CardData } from '../components/tarot/SelectionStep';
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react';

const MAX_CARDS = 7; 

const TarotFerradura: React.FC = () => {
  const navigate = useNavigate();
  const TITLE = "Método da Ferradura";
  const POSITIONS = ["Passado", "Presente", "Futuro", "O Caminho", "Influência Externa", "Obstáculos", "Desfecho"];

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

  const handleNewReading = () => {
    if (typeof resetTarot === 'function') resetTarot();
    setQuestion(''); setSelectedCards([]); setRevealedCount(0); setRevealedLocal(0); setReading(null); setLoadingAI(false);
    initializeDeck();
  };

  const initializeDeck = () => {
    const fullDeck: CardData[] = [];
    for (let i = 1; i <= DECK_SIZE; i++) fullDeck.push({ id: i, name: (CARD_NAMES as any)[i] || `Carta ${i}`, imageUrl: `https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/${i}.jpg` });
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

  const handleCardSelect = (card: CardData) => {
    if (selectedCards.length >= MAX_CARDS) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);
    setAvailableCards(deck.filter(c => !newSelection.find(s => s.id === c.id)));
    if (newSelection.length === MAX_CARDS) setTimeout(() => { setRevealedLocal(0); setStep('reveal'); }, 1000);
  };

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

      let contextPrompt = `\n\n[MÉTODO: ${TITLE}]\n`;
      selectedCards.forEach((card, idx) => { contextPrompt += `- Posição ${idx + 1} (${POSITIONS[idx]}): Carta "${card.name}"\n`; });
      contextPrompt += `\nInstrução: Analise a linha do tempo, a evolução dos fatos e o resultado provável.`;
      
      const userName = user?.user_metadata?.name || "Consulente";
      const userDob = user?.user_metadata?.birth_date || "";
      const result = await getTarotReading(question + contextPrompt, selectedCards.map(c => c.id), userName, userDob);
      
      setReading(result);
      setStep('result');
      await saveReading(user.id, 'tarot', { question, cardIds: selectedCards.map(c=>c.id), spread: TITLE }, result);
    } catch (err) { alert("Erro na conexão."); } finally { setLoadingAI(false); }
  };

  const renderLayout = () => {
    const renderSlot = (index: number) => {
        const card = selectedCards[index];
        const isRevealed = index < revealedLocal;
        if (!card) return null;
        return (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative w-20 h-32 md:w-24 md:h-40 group cursor-pointer mx-auto">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[180%] text-center z-20 pointer-events-none">
                <span className="text-[9px] font-bold uppercase bg-black/80 text-purple-200 px-2 py-1 rounded border border-white/10 block leading-tight">{POSITIONS[index]}</span>
            </div>
            {!isRevealed ? (
                <div className="w-full h-full bg-indigo-950 border-2 border-purple-500/50 rounded-lg flex items-center justify-center"><Sparkles className="text-purple-500/50" /></div>
            ) : (
                <img src={card.imageUrl} className="w-full h-full object-cover rounded-lg border border-white/20 shadow-xl" />
            )}
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-black">{index + 1}</div>
          </motion.div>
        );
    };

    return (
        <div className="relative w-full max-w-xl h-[400px] mx-auto mt-8">
           <div className="absolute top-0 left-0">{renderSlot(0)}</div>
           <div className="absolute top-0 right-0">{renderSlot(6)}</div>
           <div className="absolute top-1/4 left-[15%]">{renderSlot(1)}</div>
           <div className="absolute top-1/4 right-[15%]">{renderSlot(5)}</div>
           <div className="absolute top-1/2 left-[30%]">{renderSlot(2)}</div>
           <div className="absolute top-1/2 right-[30%]">{renderSlot(4)}</div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2">{renderSlot(3)}</div>
        </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 w-full flex flex-col items-center min-h-screen">
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      <PlansModal isOpen={showPlans} onClose={() => setShowPlans(false)} onSelectPlan={() => setShowPlans(false)} />

      <div className="w-full flex justify-between items-center mb-4">
         <button onClick={() => navigate('/nova-leitura')} className="flex items-center text-slate-400 hover:text-white gap-2 text-sm font-bold"><ArrowLeft size={18} /> Voltar</button>
         <div className="text-right"><h2 className="text-purple-300 font-serif text-lg">{TITLE}</h2><span className="text-[10px] text-slate-500 uppercase">{MAX_CARDS} Cartas</span></div>
      </div>

      {step === 'question' && <QuestionStep question={question} setQuestion={setQuestion} onNext={() => setStep('selection')} onBack={() => navigate('/nova-leitura')} />}
      {step === 'selection' && <SelectionStep availableCards={availableCards} selectedCards={selectedCards} hoveredCardId={hoveredCardId} setHoveredCardId={setHoveredCardId} onCardSelect={handleCardSelect} onNext={() => { setRevealedLocal(0); setStep('reveal'); }} onBack={() => setStep('question')} isMobile={isMobile} maxCards={MAX_CARDS} />}

      {(step === 'reveal' || step === 'result') && (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-serif text-white mb-4 text-center">{step === 'reveal' ? 'O Caminho' : 'Interpretação'}</h2>
            <div className="w-full overflow-x-auto py-8 flex justify-center bg-white/5 rounded-3xl border border-white/5 mb-8 min-h-[450px]">
                {renderLayout()}
            </div>
            {step === 'reveal' && revealedLocal === MAX_CARDS && !reading && (
               <button onClick={startReveal} disabled={isLoadingAI} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold flex items-center gap-3 animate-bounce">{isLoadingAI ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Interpretar</>}</button>
            )}
            {step === 'result' && reading && (
                <div className="w-full max-w-3xl bg-slate-900/90 border border-purple-500/30 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex gap-2"><Sparkles className="text-yellow-400"/> A Revelação</h3>
                  <div className="prose prose-invert text-slate-300 whitespace-pre-wrap">{reading.interpretation}</div>
                  <div className="mt-6 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20"><h4 className="text-purple-300 font-bold text-sm uppercase">Conselho</h4><p className="text-white italic">"{reading.summary}"</p></div>
                  <button onClick={() => { handleNewReading(); navigate('/dashboard'); }} className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">Encerrar</button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TarotFerradura;