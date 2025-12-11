import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { supabase } from '../services/supabase';
import { DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';
import { SPREADS } from '../config/spreads';

// Componentes Modais
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';

// Componentes das Etapas
import QuestionStep from '../components/tarot/QuestionStep';
import SelectionStep, { CardData } from '../components/tarot/SelectionStep';
// Substituímos o ReadingStep pelo nosso renderizador personalizado para suportar os layouts
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react';

const LOCAL_KEY = 'vozes_tarot_state_v1';

const Tarot: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. IDENTIFICAR O JOGO ESCOLHIDO
  // Se não vier nada na URL, usa o 'templo_afrodite' (9 cartas) como padrão para compatibilidade
  const spreadId = searchParams.get('spread') || 'templo_afrodite';
  const spreadConfig = SPREADS.find(s => s.id === spreadId) || SPREADS[0];

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

  // --- INICIALIZAÇÃO ---
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

    return () => { 
      mountedRef.current = false; 
      window.removeEventListener('resize', checkMobile);
      subscription.unsubscribe();
    };
  }, [spreadId]); 

  // Sincronia de revelação
  useEffect(() => {
    if (typeof revealedCount === 'number') setRevealedLocal(revealedCount);
  }, [revealedCount]);

  // --- NAVEGAÇÃO ---
  const handleStepBack = () => {
    if (step === 'question') {
      navigate('/nova-leitura'); // Volta para a seleção
    } else if (step === 'selection') {
      setQuestion(''); 
      setSelectedCards([]); 
      setStep('question');
    } else if (step === 'reveal' || step === 'result') {
      setSelectedCards([]); 
      setRevealedLocal(0);
      setRevealedCount(0);
      initializeDeck(); 
      setStep('selection');
    }
  };

  // --- LÓGICA DE SELEÇÃO DINÂMICA ---
  const handleCardSelect = (card: CardData) => {
    // 1. Respeita o limite do Jogo Escolhido (spreadConfig.cardsCount)
    if (selectedCards.length >= spreadConfig.cardsCount) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    
    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    // 2. Se completou, avança para a mesa
    if (newSelection.length === spreadConfig.cardsCount) {
        setTimeout(handleGoToReveal, 1000);
    }
  };

  const handleGoToReveal = () => {
    setRevealedLocal(0);
    setRevealedCount(0);
    setStep('reveal');
  };

  // --- LÓGICA DE REVELAÇÃO E INTERPRETAÇÃO ---
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

      // Animação de revelação carta a carta
      for (let i = 1; i <= spreadConfig.cardsCount; i++) {
        if (!mountedRef.current) break;
        await new Promise(res => setTimeout(res, 600));
        setRevealedLocal(i);
        setRevealedCount(i);
      }

      try {
        const userName = user?.user_metadata?.name || "Viajante";
        const userDob = user?.user_metadata?.birth_date || "";
        const cardIds = selectedCards.map(c => c.id);

        // --- CONTEXTO ENRIQUECIDO PARA A IA (MÁGICA) ---
        // Envia a posição e o significado de cada carta
        let contextPrompt = `\n\n[CONTEXTO TÉCNICO DO JOGO - ${spreadConfig.title}]:\n`;
        spreadConfig.positions.forEach((pos, idx) => {
            const cardName = selectedCards[idx]?.name || `Carta ID ${selectedCards[idx]?.id}`; // Nome da carta vem do objeto se tiver, ou ID
            contextPrompt += `- Posição ${idx + 1} (${pos.meaning}): A carta sorteada foi "${cardName}"\n`;
        });
        contextPrompt += `\nInstrução Especial: ${spreadConfig.aiInstruction}`;
        
        const finalQuestion = question + contextPrompt;

        // Chama a IA
        const result = await getTarotReading(finalQuestion, cardIds, userName, userDob);
        setReading(result);
        setStep('result');

        if (user) {
          await saveReading(user.id, 'tarot', { question, cardIds, spread: spreadConfig.title }, result);
        }

      } catch (err) {
        console.error('[tarot] ai call failed', err);
        alert("Erro na conexão com o oráculo. Tente novamente.");
      }

    } finally {
      setLoadingAI(false);
      revealingRef.current = false;
    }
  };

  // --- RENDERIZADOR DE LAYOUTS (MESA DINÂMICA) ---
  const renderTableLayout = () => {
    const type = spreadConfig.layoutType;

    const renderSlot = (index: number) => {
        const card = selectedCards[index];
        const meaning = spreadConfig.positions[index]?.meaning;
        const isRevealed = index < revealedLocal;

        if (!card) return null;

        return (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative group w-20 h-32 md:w-24 md:h-40 cursor-pointer"
            title={meaning}
          >
            {/* Label da Posição */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[160%] text-center z-20 pointer-events-none">
                <span className="text-[9px] md:text-[10px] text-purple-200 font-bold uppercase bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm leading-tight block truncate">
                {meaning}
                </span>
            </div>

            {/* Carta (Verso ou Frente) */}
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d">
                {!isRevealed ? (
                    // Verso
                    <div className="absolute inset-0 bg-indigo-950 border-2 border-purple-500/50 rounded-lg flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] shadow-lg">
                        <Sparkles className="w-6 h-6 text-purple-500/50" />
                    </div>
                ) : (
                    // Frente
                    <img 
                        src={card.imageUrl} 
                        alt={card.name} 
                        className="w-full h-full object-cover rounded-lg shadow-xl border border-white/20"
                    />
                )}
            </div>
            
            {/* Número */}
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow border border-black z-30">
                {index + 1}
            </div>
          </motion.div>
        );
    };

    // 1. MENSAL (Cruz)
    if (type === 'cross') {
      return (
        <div className="relative w-[320px] h-[500px] md:w-[450px] md:h-[600px] mx-auto">
           <div className="absolute top-0 left-1/2 -translate-x-1/2">{renderSlot(3)}</div>
           <div className="absolute top-0 left-[85%]">{renderSlot(4)}</div>
           <div className="absolute top-1/3 left-[5%]">{renderSlot(1)}</div>
           <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 scale-110 shadow-2xl">{renderSlot(0)}</div>
           <div className="absolute top-1/3 right-[5%]">{renderSlot(2)}</div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2">{renderSlot(5)}</div>
        </div>
      );
    }

    // 2. FOFOCA E TEMPLO (Grid 4x3 ou 3x3)
    if (type === 'love_grid') {
      return (
        <div className="grid grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-2xl mx-auto">
           {selectedCards.map((_, i) => <div key={i} className="flex justify-center">{renderSlot(i)}</div>)}
        </div>
      );
    }

    // 3. EX (Boneco/H)
    if (type === 'ex_cross') {
      return (
        <div className="flex flex-col items-center gap-6 mt-4">
           <div className="flex gap-16 md:gap-32">
              {renderSlot(0)}{renderSlot(1)}
           </div>
           <div className="-mt-4">
              {renderSlot(2)}
           </div>
           <div className="flex gap-16 md:gap-32">
              {renderSlot(3)}{renderSlot(4)}
           </div>
        </div>
      );
    }

    // 4. FERRADURA (V)
    if (type === 'horseshoe') {
      return (
        <div className="relative w-full max-w-xl h-[400px] mx-auto mt-4">
           <div className="absolute top-0 left-0">{renderSlot(0)}</div>
           <div className="absolute top-0 right-0">{renderSlot(6)}</div>
           <div className="absolute top-1/4 left-[15%]">{renderSlot(1)}</div>
           <div className="absolute top-1/4 right-[15%]">{renderSlot(5)}</div>
           <div className="absolute top-1/2 left-[30%]">{renderSlot(2)}</div>
           <div className="absolute top-1/2 right-[30%]">{renderSlot(4)}</div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2">{renderSlot(3)}</div>
        </div>
      );
    }

    // 5. VALE A PENA (Bloco)
    if (type === 'block') {
        return (
          <div className="flex flex-col gap-6 items-center max-w-md mx-auto mt-4">
             <div className="flex gap-4">{renderSlot(0)}{renderSlot(1)}{renderSlot(2)}</div>
             <div className="flex gap-4">{renderSlot(3)}{renderSlot(4)}{renderSlot(5)}</div>
             <div className="flex gap-4">{renderSlot(6)}</div>
          </div>
        );
    }

    // Default (Linha)
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {selectedCards.map((_, i) => <div key={i}>{renderSlot(i)}</div>)}
      </div>
    );
  };

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 w-full flex flex-col items-center relative overflow-x-hidden scrollbar-hide min-h-screen">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      <PlansModal isOpen={showPlans} onClose={() => setShowPlans(false)} onSelectPlan={() => setShowPlans(false)} />

      {/* HEADER FIXO DO JOGO */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
         <button onClick={handleStepBack} className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 text-sm font-bold">
            <ArrowLeft size={18} /> Voltar
         </button>
         <div className="text-right">
            <h2 className="text-purple-300 font-serif text-lg leading-none">{spreadConfig.title}</h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{spreadConfig.cardsCount} Cartas</span>
         </div>
      </div>

      {step === 'question' && (
        <QuestionStep 
          question={question}
          setQuestion={setQuestion}
          onNext={() => setStep('selection')}
          onBack={handleStepBack}
        />
      )}

      {step === 'selection' && (
        // AQUI ESTÁ O LEQUE ORIGINAL MANTIDO
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
        <div className="w-full flex flex-col items-center">
            {/* Título da Fase */}
            <h2 className="text-2xl font-serif text-white mb-8 animate-fade-in text-center">
                {step === 'reveal' ? 'Revelando a Mesa...' : 'Interpretação do Oráculo'}
            </h2>

            {/* A MESA DESENHADA (Custom Layout) */}
            <div className="w-full overflow-x-auto py-8 px-2 flex justify-center bg-white/5 rounded-3xl border border-white/5 mb-8 shadow-inner min-h-[400px]">
                {renderTableLayout()}
            </div>

            {/* BOTÃO DE REVELAR (Se ainda não revelou tudo ou não chamou a AI) */}
            {step === 'reveal' && revealedLocal === spreadConfig.cardsCount && !reading && (
               <button
                 onClick={startReveal}
                 disabled={isLoadingAI}
                 className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold flex items-center gap-3 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-bounce"
               >
                 {isLoadingAI ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Interpretar Jogo</>}
               </button>
            )}

            {/* TEXTO DA RESPOSTA (AI) */}
            {step === 'result' && reading && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-3xl bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <Sparkles className="text-yellow-400 w-6 h-6" />
                    <h3 className="text-2xl font-bold text-white font-serif">A Revelação</h3>
                  </div>

                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                    {reading.interpretation}
                  </div>

                  <div className="mt-8 p-6 bg-purple-900/20 rounded-xl border border-purple-500/20">
                    <h4 className="text-purple-300 font-bold mb-2 text-sm uppercase tracking-wide">Conselho Final</h4>
                    <p className="text-white italic text-lg">"{reading.summary}"</p>
                  </div>

                  <button 
                    onClick={() => { handleNewReading(); navigate('/dashboard'); }}
                    className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/5 font-bold uppercase tracking-wider text-sm"
                  >
                    Encerrar e Voltar ao Grimório
                  </button>
                </motion.div>
            )}
        </div>
      )}

    </div>
  );
};

export default Tarot;
