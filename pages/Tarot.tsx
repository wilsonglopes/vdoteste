// pages/Tarot.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { CARDS_TO_SELECT, DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';

// Modais
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';

// Etapas
import QuestionStep from '../components/tarot/QuestionStep';
import SelectionStep, { CardData } from '../components/tarot/SelectionStep';
import ReadingStep from '../components/tarot/ReadingStep';

const LOCAL_KEY = 'vozes_tarot_state_v1';

const Tarot: React.FC = () => {
  const navigate = useNavigate();

  // STORE GLOBAL
  const {
    step, setStep,
    question, setQuestion,
    selectedCards, setSelectedCards,
    revealedCount, setRevealedCount,
    reading, setReading,
    isLoadingAI, setLoadingAI,
    resetTarot
  } = useTarotStore();

  // ESTADOS LOCAIS
  const [deck, setDeck] = useState<CardData[]>([]);
  const [availableCards, setAvailableCards] = useState<CardData[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [revealedLocal, setRevealedLocal] = useState<number>(revealedCount || 0);
  const [showPlans, setShowPlans] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const mountedRef = useRef(true);
  const revealingRef = useRef(false);

  // ================= INITIALIZAÇÃO =================

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
    setAvailableCards(shuffled.filter(c => !selectedCards.find(s => s.id === c.id)));
  };

  const handleNewReading = () => {
    resetTarot();
    setHoveredCardId(null);
    setRevealedLocal(0);
    setLoadingAI(false);
    initializeDeck();
    try { localStorage.removeItem(LOCAL_KEY); } catch {}
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
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
        if (typeof parsed.revealedCount === 'number') {
          setRevealedCount(parsed.revealedCount);
          setRevealedLocal(parsed.revealedCount);
        }
        if (parsed.reading) setReading(parsed.reading);
      }
    } catch {}

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', checkMobile);
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const state = { question, selectedCards, step, revealedCount: revealedLocal, reading };
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); } catch {}
  }, [question, selectedCards, step, revealedLocal, reading]);

  useEffect(() => {
    if (!deck.length) return;
    setAvailableCards(deck.filter(c => !selectedCards.find(s => s.id === c.id)));
  }, [selectedCards, deck]);

  // ================= NAVEGAÇÃO (CORRIGIDA) =================

  const handleStepBack = () => {
    if (step === 'question') {
      navigate('/nova-leitura');
      return;
    }

    if (step === 'selection') {
      setQuestion('');
      setSelectedCards([]);
      setStep('question');
      return;
    }

    if (step === 'reveal') {
      setSelectedCards([]);
      setRevealedLocal(0);
      setRevealedCount(0);
      initializeDeck();
      setStep('selection');
    }
  };

  const handleCardSelect = (card: CardData) => {
    if (selectedCards.length >= CARDS_TO_SELECT) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    setSelectedCards([...selectedCards, card]);
  };

  const handleGoToReveal = () => {
    setRevealedLocal(0);
    setRevealedCount(0);
    setStep('reveal');
  };

  // ================= REVELAÇÃO =================

  const startReveal = async () => {
    if (revealingRef.current) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    const creditCheck = await consumeCredit(user.id);
    if (!creditCheck.success) {
      creditCheck.message === 'no_credits'
        ? setShowPlans(true)
        : alert(creditCheck.message);
      return;
    }

    revealingRef.current = true;

    try {
      setLoadingAI(true);
      for (let i = 1; i <= CARDS_TO_SELECT; i++) {
        if (!mountedRef.current) break;
        await new Promise(res => setTimeout(res, 600));
        setRevealedLocal(i);
        setRevealedCount(i);
      }

      const result = await getTarotReading(
        question,
        selectedCards.map(c => c.id),
        user?.user_metadata?.name || 'Viajante',
        user?.user_metadata?.birth_date || ''
      );

      setReading(result);
      await saveReading(user.id, 'tarot', { question }, result);

    } catch {
      setReading({
        intro: 'Erro na consulta.',
        timeline: { past: '', present: '', future: '' },
        individual_cards: [],
        summary: 'Tente novamente.',
        advice: 'Verifique sua conexão.'
      });
    } finally {
      setLoadingAI(false);
      revealingRef.current = false;
    }
  };

  // ================= RENDER =================

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 w-full flex flex-col items-center">
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <PlansModal isOpen={showPlans} onClose={() => setShowPlans(false)} />

      {step === 'question' && (
        <QuestionStep
          question={question}
          setQuestion={setQuestion}
          onNext={() => setStep('selection')}
          onBack={handleStepBack}
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
          onGoHome={() => {
            handleNewReading();
            navigate('/');
          }}
          onNewReading={handleNewReading}
        />
      )}
    </div>
  );
};

export default Tarot;
