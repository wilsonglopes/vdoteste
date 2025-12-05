// pages/Tarot.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { DECK_SIZE, CARD_NAMES, SPREADS } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';

// Componentes Modais
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';

// Componentes das Etapas
import QuestionStep from '../components/tarot/QuestionStep';
import SelectionStep, { CardData } from '../components/tarot/SelectionStep';
import ReadingStep from '../components/tarot/ReadingStep';
import SpreadSelection from '../components/tarot/SpreadSelection';

const LOCAL_KEY = 'vozes_tarot_state_v2'; // Mantenha v2 para limpar cache antigo

const Tarot: React.FC = () => {
  const navigate = useNavigate();

  // --- STORE GLOBAL ---
  const {
    step, setStep,
    selectedSpreadId,
    question, setQuestion,
    selectedCards, setSelectedCards,
    revealedCount, setRevealedCount,
    reading, setReading,
    isLoadingAI, setLoadingAI,
    resetTarot,
    setSpread // Precisamos expor o setSpread se quisermos resetar específico
  } = useTarotStore();

  // --- CÁLCULO DE CARTAS ---
  const currentSpread = SPREADS[selectedSpreadId as keyof typeof SPREADS] || SPREADS['mesa_real'];
  const CARDS_TARGET = currentSpread.cardsCount;

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

  // --- 1. INICIALIZAÇÃO E SETUP ---

  const handleNewReading = () => {
    // Reseta tudo para o estado inicial LIMPO
    setHoveredCardId(null);
    setQuestion(''); 
    setSelectedCards([]); 
    setRevealedCount(0);
    setRevealedLocal(0);
    setReading(null);
    setLoadingAI(false);
    
    // IMPORTANTE: Volta para a seleção de jogo
    setStep('spread_selection');
    
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

    // LÓGICA DE RECUPERAÇÃO CORRIGIDA
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Se o usuário estava no meio de algo, restaura.
        if (parsed.step && parsed.step !== 'spread_selection') {
           setStep(parsed.step);
        } else {
           // Se estava no início ou vazio, força a escolha
           setStep('spread_selection');
        }
      } else {
        // Novo acesso: força escolha
        setStep('spread_selection');
      }
    } catch (e) { 
      setStep('spread_selection');
    }

    return () => { 
      mountedRef.current = false; 
      window.removeEventListener('resize', checkMobile);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const toStore = { question, selectedCards, step, revealedCount: revealedLocal, reading, isLoadingAI, selectedSpreadId };
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore)); } catch (e) {}
  }, [question, selectedCards, step, revealedLocal, reading, isLoadingAI, selectedSpreadId]);

  useEffect(() => {
    if (!deck || deck.length === 0) return;
    const filtered = deck.filter(c => !selectedCards.find(s => s.id === c.id));
    setAvailableCards(filtered);
  }, [selectedCards, deck]);

  useEffect(() => {
    if (typeof revealedCount === 'number') setRevealedLocal(revealedCount);
  }, [revealedCount]);


  // --- 2. NAVEGAÇÃO (BOTÃO VOLTAR) ---

  const handleStepBack = () => {
    if (step === 'question') {
      // ESTAVA NA PERGUNTA -> QUER TROCAR O JOGO
      setQuestion(''); 
      setStep('spread_selection'); // Volta para os cards de escolha
    } else if (step === 'selection') {
      // ESTAVA ESCOLHENDO CARTAS -> QUER MUDAR A PERGUNTA
      setQuestion(''); 
      setSelectedCards([]); 
      initializeDeck();
      setStep('question');
    } else if (step === 'reveal' || step === 'result') {
      // ESTAVA NO RESULTADO -> QUER REESCOLHER AS CARTAS (MESMO JOGO)
      setSelectedCards([]); 
      setRevealedLocal(0);
      setRevealedCount(0);
      initializeDeck(); 
      setStep('selection');
    } else if (step === 'spread_selection') {
      // ESTAVA NA ESCOLHA -> VAI EMBORA
      navigate('/');
    }
  };

  const handleCardSelect = (card: CardData) => {
    if (selectedCards.length >= CARDS_TARGET) return;
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

      for (let i = 1; i <= CARDS_TARGET; i++) {
        if (!mountedRef.current) break;
        await new Promise(res => setTimeout(res, 600));
        setRevealedLocal(i);
        setRevealedCount(i);
      }

      try {
        const userName = user?.user_metadata?.name || "Viajante";
        const userDob = user?.user_metadata?.birth_date || "";
        const cardIds = selectedCards.map(c => c.id);

        const result = await getTarotReading(question, cardIds, userName, userDob);
        setReading(result);

        if (user) {
          await saveReading(user.id, 'tarot', { question, cardIds, spreadId: selectedSpreadId }, result);
        }

      } catch (err) {
        console.error('[tarot] ai call failed', err);
        setReading({
          intro: "Houve uma interferência espiritual na conexão.",
          timeline: { past: "", present: "", future: "" },
          individual_cards: [],
          summary: "Por favor, tente novamente.",
          advice: "Verifique sua conexão com a internet."
        });
      }

    } finally {
      setLoadingAI(false);
      revealingRef.current = false;
    }
  };

  // --- 4. RENDERIZAÇÃO ---
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen flex flex-col items-center relative w-full overflow-x-hidden scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onSuccess={() => setShowAuth(false)} 
      />
      
      <PlansModal 
        isOpen={showPlans} 
        onClose={() => setShowPlans(false)}
        onSelectPlan={(planId) => {
          alert(`Plano ${planId} selecionado (Pagamento em breve).`);
          setShowPlans(false);
        }}
      />

      {step === 'spread_selection' && (
        <SpreadSelection />
      )}

      {step === 'question' && (
        <QuestionStep 
          question={question}
          setQuestion={setQuestion}
          onNext={() => setStep('selection')}
          onBack={handleStepBack} // Passa a função corrigida
        />
      )}

      {step === 'selection' && (
        <SelectionStep 
          availableCards={availableCards}
          selectedCards={selectedCards}
          hoveredCardId={hoveredCardId}
          setHoveredCardId={setHoveredCardId}
          onCardSelect={handleCardSelect}
          onNext={handleGoToReveal}
          onBack={handleStepBack}
          isMobile={isMobile}
          maxCards={CARDS_TARGET}
        />
      )}

      {(step === 'reveal' || step === 'result') && (
        <ReadingStep 
          question={question}
          selectedCards={selectedCards}
          revealedLocal={revealedLocal}
          reading={reading}
          isLoadingAI={isLoadingAI}
          user={user}
          onReveal={startReveal}
          onBack={handleStepBack}
          onGoHome={() => { handleNewReading(); navigate('/'); }} // Agora reseta tudo
          onNewReading={handleNewReading}
        />
      )}

    </div>
  );
};

export default Tarot;
