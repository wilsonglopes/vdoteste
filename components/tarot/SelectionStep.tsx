import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface SelectionStepProps {
  availableCards: CardData[];
  selectedCards: CardData[];
  hoveredCardId: number | null;
  setHoveredCardId: (id: number | null) => void;
  onCardSelect: (card: CardData) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
  maxCards: number; // AQUI ESTÁ A CHAVE: Recebe o número (5) da página pai
}

const SelectionStep: React.FC<SelectionStepProps> = ({
  availableCards,
  selectedCards,
  hoveredCardId,
  setHoveredCardId,
  onCardSelect,
  onNext,
  onBack,
  isMobile,
  maxCards
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  // O BOTÃO SÓ APARECE SE O NÚMERO DE CARTAS FOR IGUAL AO MÁXIMO
  const isComplete = selectedCards.length === maxCards;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      {/* Título Dinâmico: Mostra "Escolha 5 Cartas" */}
      <div className="text-center mb-4 z-10">
        <h2 className="text-2xl font-serif text-white mb-1">
          Escolha {maxCards} Cartas
        </h2>
        <p className="text-slate-400 text-sm animate-pulse">Siga sua intuição</p>
      </div>

      {/* Leque de Cartas */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 flex items-center overflow-x-auto py-4 px-4 custom-scrollbar select-none"
        style={{ perspective: '1000px', overflowY: 'hidden' }}
      >
        <div className="flex mx-auto min-w-max px-[50vw] items-center justify-center h-[300px]">
          <AnimatePresence>
            {availableCards.map((card, index) => {
              const total = availableCards.length;
              const mid = total / 2;
              const offset = index - mid;
              const rotate = offset * 2.5; 
              const yOffset = Math.abs(offset) * 2; 

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ 
                    opacity: 1, 
                    y: yOffset,
                    rotate: rotate,
                    scale: hoveredCardId === card.id ? 1.1 : 1,
                    zIndex: hoveredCardId === card.id ? 100 : index
                  }}
                  className="relative -ml-8 md:-ml-12 cursor-pointer transform-style-3d origin-bottom"
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onCardSelect(card)}
                >
                  <div className="w-20 h-32 md:w-32 md:h-48 rounded-xl bg-gradient-to-br from-indigo-950 to-purple-900 border border-purple-500/30 shadow-2xl transition-all duration-200">
                    <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="absolute inset-1 border border-white/10 rounded-lg" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ÁREA DOS SLOTS (CORRIGIDA) */}
      {/* Container transparente, sem fundo colorido */}
      <div className="w-full max-w-4xl border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 mt-auto mb-4 relative z-20 shadow-lg">
        
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
          
          {/* AQUI ESTAVA O ERRO: Agora ele desenha EXATAMENTE 'maxCards' quadrados */}
          {Array.from({ length: maxCards }).map((_, index) => {
            const card = selectedCards[index];
            return (
              <div 
                key={index}
                className="w-10 h-16 md:w-14 md:h-20 rounded border border-dashed border-white/20 bg-transparent flex items-center justify-center relative overflow-hidden"
              >
                {card ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="w-full h-full bg-indigo-900"
                  >
                     <div className="w-full h-full opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                  </motion.div>
                ) : (
                  <span className="text-white/20 text-[10px] font-bold">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Botão VER MESA (Aparece quando completa) */}
        <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-3">
          <button onClick={onBack} className="text-slate-400 text-xs flex items-center gap-1 hover:text-white">
            <RotateCcw size={14} /> Reiniciar
          </button>

          <span className="text-xs font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
            {selectedCards.length} / {maxCards}
          </span>

          <div className="w-24 flex justify-end">
             {/* SELECIONOU 5 DE 5? ENTÃO APARECE O BOTÃO */}
             {isComplete && (
               <motion.button
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 onClick={onNext}
                 className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg animate-pulse"
               >
                 Ver Mesa <ArrowRight size={14} />
               </motion.button>
             )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SelectionStep;
