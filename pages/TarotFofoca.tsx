import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';

// Componentes Modais
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';

// --- COMPONENTES ESPECÍFICOS PARA "FOFOCANDO SOBRE O AMOR" ---
import QuestionStepFofoca from '../components/tarot/QuestionStepFofoca'; 
import SelectionStepFofoca, { CardData } from '../components/tarot/SelectionStepFofoca';
import ReadingStepFofoca from '../components/tarot/ReadingStepFofoca';

// --- CONFIGURAÇÃO ---
const READING_TYPE = 'fofoca_amor'; 
const CARD_LIMIT = 12; // Limite fixo de 12 cartas (Premium)
const LOCAL_KEY = 'vozes_tarot_fofoca_v1'; 

const TarotFofoca: React.FC = () => {
  const navigate = useNavigate();

  // --- STORE GLOBAL ---
  const {
    step, setStep,
    question, setQuestion,
    selectedCards, setSelectedCards,
    revealedCount, setRevealedCount,
    reading, setReading,
    isLoadingAI, setLoadingAI,
    resetTarot
  } = useTarotStore();

  // --- ESTADOS LOCAIS ---
  const [deck, setDeck] = useState<CardData[]>([]);
  const [availableCards, setAvailableCards] = useState<CardData[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
   
  const [revealedLocal, setRevealedLocal] = useState<number>(revealedCount || 0);
   
  const [showPlans, setShowPlans] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const abortRevealRef = useRef({ aborted: false });
  const mountedRef = useRef(true);

  // --- 1. INICIALIZAÇÃO ---
  const handleNewReading = () => {
    abortRevealRef.current.aborted = true;
    if (typeof resetTarot === 'function') resetTarot();
    abortRevealRef.current.aborted = false;
    
    setHoveredCardId(null);
    setQuestion(''); 
    setSelectedCards([]); 
    setRevealedCount(0);
    setRevealedLocal(0);
    setReading(null);
    setLoadingAI(false);
    
    initializeDeck();
    try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
  };

  const initializeDeck = () => {
    const fullDeck: CardData[] = [];
    for (let i = 1; i <= DECK_SIZE; i++) {
      fullDeck.push({
        id: i,
        name: (CARD_NAMES as any)[i] || `Carta ${i}`,
        imageUrl: `https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/${i}.jpg`
      });
    }
    const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    const filtered = shuffled.filter(c => !selectedCards.find(s => s.id === c.id));
    setAvailableCards(filtered);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    initializeDeck();
    mountedRef.current = true;

    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.question) setQuestion(parsed.question);
        if (parsed.selectedCards) setSelectedCards(parsed.selectedCards);
        if (parsed.step) setStep(parsed.step);
        
        if (parsed.reading) {
            setReading(parsed.reading);
            setLoadingAI(false); 
        } else {
            setLoadingAI(false); 
            if (parsed.step === 'reveal') {
                 setRevealedCount(0);
                 setRevealedLocal(0);
            }
        }

        if (typeof parsed.revealedCount === 'number' && parsed.reading) {
           setRevealedCount(parsed.revealedCount);
           setRevealedLocal(parsed.revealedCount);
        }
      }
    } catch (e) { }

    return () => { 
      mountedRef.current = false; 
      window.removeEventListener('resize', checkMobile);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const toStore = { question, selectedCards, step, revealedCount: revealedLocal, reading, isLoadingAI: false };
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore)); } catch (e) {}
  }, [question, selectedCards, step, revealedLocal, reading]);

  useEffect(() => {
    if (!deck || deck.length === 0) return;
    const filtered = deck.filter(c => !selectedCards.find(s => s.id === c.id));
    setAvailableCards(filtered);
  }, [selectedCards, deck]);

  useEffect(() => {
    if (typeof revealedCount === 'number') setRevealedLocal(revealedCount);
  }, [revealedCount]);

  // --- 2. NAVEGAÇÃO ---
  const handleStepBack = () => {
    if (step === 'question') {
      handleNewReading();
      navigate('/nova-leitura');
    } else if (step === 'selection') {
      setQuestion(''); 
      setSelectedCards([]); 
      setStep('question');
    } else if (step === 'reveal') {
      setSelectedCards([]); 
      setRevealedLocal(0);
      setRevealedCount(0);
      initializeDeck(); 
      setStep('selection');
    }
  };

  const handleCardSelect = (card: CardData) => {
    if (selectedCards.length >= CARD_LIMIT) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    setSelectedCards([...selectedCards, card]);
  };

  const handleGoToReveal = () => {
    setRevealedLocal(0);
    setRevealedCount(0);
    setStep('reveal');
  };

  // --- 3. LÓGICA DE REVELAÇÃO ---
  const revealingRef = useRef(false);

  const startReveal = async () => {
    if (revealingRef.current) return;
    if (isLoadingAI) return;
    
    if (!user) {
      setShowAuth(true);
      return;
    }

    const creditCheck = await consumeCredit(user.id);

    if (!creditCheck.success) {
      if (creditCheck.message === 'no_credits') {
        setShowPlans(true);
      } else {
        alert(creditCheck.message || "Erro ao verificar créditos.");
      }
      return;
    }

    revealingRef.current = true;

    try {
      setLoadingAI(true);
      setRevealedLocal(0);
      setRevealedCount(0);

      // Loop de 12 cartas
      for (let i = 1; i <= CARD_LIMIT; i++) {
        if (!mountedRef.current) break;
        await new Promise(res => setTimeout(res, 400)); // Um pouco mais rápido para não demorar
        setRevealedLocal(i);
        setRevealedCount(i);
      }

      try {
        const userName = user?.user_metadata?.name || "Viajante";
        const userDob = user?.user_metadata?.birth_date || "";
        const cardIds = selectedCards.map(c => c.id);

        const contextQuestion = `[MÉTODO: FOFOCANDO SOBRE O AMOR (12 CARTAS)] ${question}`;
        
        const result = await getTarotReading(contextQuestion, cardIds, userName, userDob);
        setReading(result);

        if (user) {
          await saveReading(user.id, READING_TYPE, { question, cardIds }, result);
        }

      } catch (err) {
        console.error('[tarot] ai call failed', err);
        setReading({
          intro: "Erro na conexão com o oráculo.",
          timeline: { past: "", present: "", future: "" },
          individual_cards: [],
          summary: "Tente novamente.",
          advice: "Verifique sua conexão."
        });
      }

    } finally {
      setLoadingAI(false);
      revealingRef.current = false;
    }
  };

  // --- 4. RENDERIZAÇÃO ---
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 w-full flex flex-col items-center relative overflow-x-hidden scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      
      <PlansModal 
        isOpen={showPlans} 
        onClose={() => setShowPlans(false)}
        onSelectPlan={(planId) => {
          alert(`Plano ${planId} selecionado (Pagamento em breve).`);
          setShowPlans(false);
        }}
      />

      {step === 'question' && (
        <QuestionStepFofoca
          question={question}
          setQuestion={setQuestion}
          onNext={() => setStep('selection')}
          onBack={handleStepBack}
        />
      )}

      {step === 'selection' && (
        <SelectionStepFofoca
          availableCards={availableCards}
          selectedCards={selectedCards}
          hoveredCardId={hoveredCardId}
          setHoveredCardId={setHoveredCardId}
          onCardSelect={handleCardSelect}
          onNext={handleGoToReveal}
          onBack={handleStepBack}
          isMobile={isMobile}
          limit={CARD_LIMIT} 
        />
      )}

      {(step === 'reveal' || step === 'result') && (
        <ReadingStepFofoca
          question={question}
          selectedCards={selectedCards}
          revealedLocal={revealedLocal}
          reading={reading}
          isLoadingAI={isLoadingAI}
          user={user}
          onReveal={startReveal}
          onBack={handleStepBack}
          onGoHome={() => { handleNewReading(); navigate('/'); }}
          onNewReading={handleNewReading}
        />
      )}

    </div>
  );
};

export default TarotFofoca;

