// pages/Tarot.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Loader2, BookOpen, Clock, Download, Home } from 'lucide-react';
import { supabase } from '../services/supabase';
import { CARDS_TO_SELECT, CARD_BACK_URL, DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading } from '../services/geminiService';
import { useTarotStore } from '../store/tarotStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

const LOCAL_KEY = 'vozes_tarot_state_v1';

const Tarot: React.FC = () => {
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);

  const {
    step, setStep,
    question, setQuestion,
    selectedCards, setSelectedCards,
    revealedCount, setRevealedCount,
    reading, setReading,
    isLoadingAI, setLoadingAI,
    resetTarot
  } = useTarotStore();

  const [deck, setDeck] = useState<CardData[]>([]);
  const [availableCards, setAvailableCards] = useState<CardData[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // local revealed to avoid render race
  const [revealedLocal, setRevealedLocal] = useState<number>(revealedCount || 0);

  const abortRevealRef = useRef({ aborted: false });
  const aiPromiseRef = useRef<Promise<any> | null>(null);
  const mountedRef = useRef(true);

  // --- LÓGICA DO PDF ---
  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    
    const btnText = document.getElementById('btn-pdf-text');
    if(btnText) btnText.innerText = "Gerando...";

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = user?.user_metadata?.name ? `Leitura_${user.user_metadata.name}.pdf` : 'Leitura_Tarot.pdf';
      pdf.save(filename);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      if(btnText) btnText.innerText = "Baixar Leitura em PDF";
    }
  };

  /* reset explicit */
  const handleNewReading = () => {
    abortRevealRef.current.aborted = true;
    aiPromiseRef.current = null;
    if (typeof resetTarot === 'function') resetTarot();
    abortRevealRef.current.aborted = false;
    setHoveredCardId(null);
    initializeDeck();
    setRevealedLocal(0);
    setRevealedCount(0);
    try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
  };

  // --- ALTERAÇÃO AQUI: RESETAR ANTES DE SAIR ---
  const handleGoHome = () => {
      // 1. Limpa todo o estado e o localStorage chamando a função de reset
      handleNewReading();
      // 2. Navega para a home limpa
      navigate('/');
  };

  /* ---------- responsive + user ---------- */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user } }) => setUser(user))
      .catch(() => {});
  }, []);

  /* ---------- deck init ---------- */
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
    initializeDeck();
    abortRevealRef.current.aborted = false;
    mountedRef.current = true;

    // restore minimal persisted state
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.question) setQuestion(parsed.question);
        if (Array.isArray(parsed?.selectedCards)) setSelectedCards(parsed.selectedCards);
        if (typeof parsed?.step === 'string') setStep(parsed.step);
        if (typeof parsed?.revealedCount === 'number') {
          setRevealedCount(parsed.revealedCount);
          setRevealedLocal(parsed.revealedCount);
        }
        if (parsed?.reading) setReading(parsed.reading);
        if (typeof parsed?.isLoadingAI === 'boolean') setLoadingAI(parsed.isLoadingAI);
      }
    } catch (e) {
      // ignore
    }

    return () => { mountedRef.current = false; abortRevealRef.current.aborted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* keep availableCards in sync */
  useEffect(() => {
    if (!deck || deck.length === 0) return;
    const filtered = deck.filter(c => !selectedCards.find(s => s.id === c.id));
    setAvailableCards(filtered);
  }, [selectedCards, deck]);

  /* sync global -> local revealed */
  useEffect(() => {
    if (typeof revealedCount === 'number') setRevealedLocal(revealedCount);
  }, [revealedCount]);

  /* persist minimal state */
  useEffect(() => {
    const toStore = {
      question,
      selectedCards,
      step,
      revealedCount: revealedLocal,
      reading,
      isLoadingAI
    };
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore));
    } catch (e) {}
  }, [question, selectedCards, step, revealedLocal, reading, isLoadingAI]);

  /* card select */
  const handleCardClick = (card: CardData) => {
    if (selectedCards.length >= CARDS_TO_SELECT) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    setSelectedCards([...selectedCards, card]);
  };

  /* start reveal */
  const revealingRef = useRef(false);

  const startReveal = async () => {
    console.log('[tarot] startReveal called', { isLoadingAI, revealing: revealingRef.current, selectedCount: selectedCards.length, CARDS_TO_SELECT });

    if (revealingRef.current) return;
    revealingRef.current = true;

    try {
      if (isLoadingAI) console.log('[tarot] isLoadingAI true — proceeding anyway');

      setLoadingAI(true);
      setRevealedLocal(0);
      setRevealedCount(0);

      if (selectedCards.length < CARDS_TO_SELECT) {
        console.warn('[tarot] selectedCards < CARDS_TO_SELECT — aborting reveal', selectedCards.length);
        setLoadingAI(false);
        revealingRef.current = false;
        return;
      }

      for (let i = 1; i <= CARDS_TO_SELECT; i++) {
        if (!mountedRef.current) break;
        await new Promise(res => setTimeout(res, 600));
        setRevealedLocal(i);
        setRevealedCount(i);
        console.log(`[tarot] revealed ${i}/${CARDS_TO_SELECT}`);
      }

      try {
        const userName = user?.user_metadata?.name || "Viajante";
        const userDob = user?.user_metadata?.birth_date || "";
        const cardIds = selectedCards.map(c => c.id);

        console.log('[tarot] calling getTarotReading...', { cardIds, question });
        const result = await getTarotReading(question, cardIds, userName, userDob);
        console.log('[tarot] ai result received');
        setReading(result);
      } catch (err) {
        console.error('[tarot] ai call failed', err);
        setReading({
          intro: "Erro na consulta ao oráculo.",
          timeline: { past: "", present: "", future: "" },
          individual_cards: [],
          summary: "Tente novamente.",
          advice: "Verifique sua conexão."
        });
      }

    } finally {
      setLoadingAI(false);
      revealingRef.current = false;
      console.log('[tarot] reveal finished');
    }
  };

  /* layout constants */
  const angleSpread = isMobile ? 100 : 130;
  const transformOriginY = isMobile ? '180%' : '200%';
  const hoverTranslateY = isMobile ? '-20px' : '-40px';

  /* ---------- TELA 1 = QUESTION ---------- */
  if (step === 'question') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto animate-fade-in-up px-4">
        <Sparkles className="w-16 h-16 text-purple-300 mb-6 animate-pulse" />
        <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">O que deseja saber?</h2>

        <div className="w-full relative mb-8 max-w-2xl">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Concentre-se e digite sua pergunta aqui..."
            className="w-full bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 text-white focus:ring-2 focus:ring-purple-500 outline-none text-xl min-h-[150px] backdrop-blur-md shadow-inner"
          />
        </div>

        <button
          disabled={!question.trim()}
          onClick={() => setStep('selection')}
          className="bg-gold text-purple-900 px-10 py-4 rounded-full font-bold text-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg hover:scale-105 transform duration-200"
        >
          Consultar Cartas
        </button>
      </div>
    );
  }

  /* ---------- TELA 2 = SELECTION ---------- */
  if (step === 'selection') {
    return (
      <div className="flex flex-col items-center w-full overflow-hidden relative">
        <div className="text-center z-20 mt-6 px-4">
          <h3 className="font-playfair text-3xl md:text-4xl text-white mb-1">Escolha 9 Cartas</h3>
          <p className="text-purple-200 text-lg font-light -mt-1">Siga sua intuição</p>
        </div>

        <div className="relative w-full flex justify-center items-start mt-2 mb-[10px]">
          <div className="relative flex justify-center items-center" style={{ height: isMobile ? "180px" : "260px", marginTop: "-20px" }}>
            {availableCards.map((card, index) => {
              const total = availableCards.length;
              const angle = total > 1 ? (index / (total - 1) - 0.5) * angleSpread : 0;
              const isHovered = card.id === hoveredCardId;
              const isSelected = !!selectedCards.find(c => c.id === card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`absolute cursor-pointer transition-all duration-300 origin-bottom ${isSelected ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  style={{
                    transform: `rotate(${angle}deg) ${isHovered ? `translateY(${hoverTranslateY}) scale(1.06)` : 'translateY(0) scale(1)'}`,
                    transformOrigin: `50% ${transformOriginY}`,
                    zIndex: isHovered ? 100 : index,
                    width: isMobile ? '70px' : '120px',
                    height: isMobile ? '110px' : '180px',
                  }}
                >
                  <img src={CARD_BACK_URL} alt="Verso" className={`w-full h-full rounded-xl shadow-2xl border-2 transition-colors ${isHovered ? 'border-gold shadow-gold/50' : 'border-white/20 border-opacity-50'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* SLOT */}
        <div className="w-full max-w-5xl mx-auto z-30 px-4 mb-[4px] mt-[40px] md:mt-[120px]">
          <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-center gap-2 md:gap-4 mb-4 w-full overflow-x-auto px-2 py-2 no-scrollbar">
              {selectedCards.map((card, i) => (
                <motion.div key={card.id} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative flex-shrink-0">
                  <img src={CARD_BACK_URL} className="w-10 h-16 md:w-14 md:h-24 rounded border border-gold shadow-md" />
                  <span className="absolute -top-2 -right-2 bg-gold text-purple-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
                </motion.div>
              ))}

              {Array.from({ length: CARDS_TO_SELECT - selectedCards.length }).map((_, i) => (
                <div key={i} className="w-10 h-16 md:w-14 md:h-24 rounded border border-dashed border-white/20 bg-white/5" />
              ))}
            </div>

            <div className="flex justify-between items-center px-2">
              <button onClick={() => setStep('question')} className="text-slate-400 hover:text-white text-sm flex items-center gap-2">
                <RotateCcw size={16} /> Voltar
              </button>

              <div className="flex items-center gap-4">
                <span className="text-gold font-playfair text-lg">{selectedCards.length} / {CARDS_TO_SELECT}</span>

                {selectedCards.length === CARDS_TO_SELECT && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => {
                      setRevealedLocal(0);
                      setRevealedCount(0);
                      setStep('reveal');
                      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e) {}
                    }}
                    className="bg-gold text-purple-900 font-bold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-400 hover:scale-105 flex items-center gap-2"
                  >
                    <Sparkles size={18} /> Revelar
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- TELA 3 = REVEAL ---------- */
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen flex flex-col items-center">
      <div id="reading-result" ref={resultRef} className="w-full p-4 md:p-8 bg-transparent">
          <div className="text-center mb-12 w-full">
            <h2 className="font-playfair text-3xl md:text-4xl text-white mb-3">A Mensagem do Oráculo</h2>
            <p className="text-slate-400 italic text-lg md:text-xl">"{question}"</p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-md mx-auto mb-16 w-full">
            {selectedCards.map((card, index) => {
              const isRevealed = index < revealedLocal;
              const transformStyle = {
                transformStyle: 'preserve-3d' as const,
                transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 900ms cubic-bezier(.2,.8,.25,1)'
              };

              return (
                <div key={card.id} className="aspect-[2/3] relative group">
                  <div className="w-full h-full relative transition-transform" style={transformStyle}>
                    <div className="absolute inset-0 w-full h-full rounded-xl border border-purple-500/30 bg-indigo-950 overflow-hidden shadow-2xl" style={{ backfaceVisibility: 'hidden' as const }}>
                      <img src={CARD_BACK_URL} className="w-full h-full object-cover opacity-90 rounded-xl" alt="verso" />
                    </div>

                    <div className="absolute inset-0 w-full h-full rounded-xl border-2 border-gold/70 overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.15)] bg-black" style={{ backfaceVisibility: 'hidden' as const, transform: 'rotateY(180deg)' }}>
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÃO ABAIXO DAS CARTAS */}
          {revealedLocal === 0 && (
            <div className="w-full flex justify-center mt-4 mb-10">
              <button
                onClick={() => startReveal()}
                className="bg-gold text-purple-900 px-10 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg"
              >
                Revelar Agora
              </button>
            </div>
          )}

          {revealedLocal === CARDS_TO_SELECT && (
            <div className="w-full animate-fade-in-up space-y-8 pb-8">
              {isLoadingAI || !reading ? (
                <div className="bg-slate-900/50 border border-purple-500/20 p-10 rounded-2xl text-center backdrop-blur-md">
                  <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
                  <p className="text-purple-200 text-xl font-playfair">A Cigana Esmeralda está lendo seu destino...</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900/80 border-l-4 border-gold p-6 rounded-r-xl backdrop-blur-md">
                    <p className="text-lg text-purple-100 italic font-light leading-relaxed">{reading.intro}</p>
                  </div>

                  <div>
                    <h3 className="text-2xl text-white font-playfair mb-6 flex items-center gap-2">
                      <BookOpen className="text-purple-400" /> Análise das Cartas
                    </h3>
                    <div className="space-y-4">
                      {reading.individual_cards?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                          <h4 className="text-gold font-bold mb-1 text-sm uppercase tracking-wider">Posição {item.position}: {item.card_name}</h4>
                          <p className="text-slate-300 text-base leading-relaxed">{item.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl text-white font-playfair mb-6 flex items-center gap-2">
                      <Clock className="text-purple-400" /> Jornada do Tempo
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10">
                        <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-bold rounded-full mb-3 uppercase">Passado / Base</span>
                        <p className="text-slate-200 leading-relaxed text-lg">{reading.timeline.past}</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 p-6 rounded-2xl border border-gold/40 shadow-lg">
                        <span className="inline-block px-3 py-1 bg-gold text-purple-900 text-xs font-bold rounded-full mb-3 uppercase">Presente / Foco</span>
                        <p className="text-white leading-relaxed text-lg">{reading.timeline.present}</p>
                      </div>

                      <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10">
                        <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-bold rounded-full mb-3 uppercase">Futuro / Tendência</span>
                        <p className="text-slate-200 leading-relaxed text-lg">{reading.timeline.future}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-gold/20 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
                    <div>
                      <h4 className="text-gold font-playfair text-2xl mb-2">A Resposta do Oráculo</h4>
                      <p className="text-white text-lg font-medium">{reading.summary}</p>
                    </div>
                    <hr className="border-white/10" />
                    <div>
                      <p className="text-sm text-slate-500 uppercase tracking-widest mb-2">Conselho Final</p>
                      <p className="text-purple-200 italic text-xl font-serif">"{reading.advice}"</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
      </div>

      {revealedLocal === CARDS_TO_SELECT && reading && (
          <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 justify-center pb-20">
             <button
               onClick={handleGoHome}
               className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all font-semibold"
             >
               <Home className="w-5 h-5" />
               Voltar ao Início
             </button>

             <button 
                onClick={handleNewReading} 
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-all font-semibold"
             >
               <RotateCcw className="w-5 h-5" />
               Nova Consulta
             </button>

             <button
               onClick={handleDownloadPDF}
               className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all"
             >
               <Download className="w-5 h-5" />
               <span id="btn-pdf-text">Baixar em PDF</span>
             </button>
          </div>
      )}
    </div>
  );
};

export default Tarot;
