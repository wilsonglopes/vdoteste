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
  // maxCards não é necessário passar via prop, pois este arquivo É FIXO em 5
}

const SelectionStepEx: React.FC<SelectionStepProps> = ({
  availableCards,
  selectedCards,
  hoveredCardId,
  setHoveredCardId,
  onCardSelect,
  onNext,
  onBack,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const MAX_CARDS = 5; // FIXO: Nunca vai mudar neste arquivo

  // Centraliza o leque ao iniciar
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const isComplete = selectedCards.length === MAX_CARDS;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      <div className="text-center mb-2 z-10">
        <h2 className="text-2xl font-serif text-white">
          Escolha {MAX_CARDS} Cartas
        </h2>
        <p className="text-slate-400 text-xs animate-pulse">Siga sua intuição</p>
      </div>

      {/* --- LEQUE AJUSTADO PARA 5 CARTAS (Mais espaçado) --- */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 flex items-center overflow-x-auto py-10 px-4 custom-scrollbar select-none"
        style={{ perspective: '1000px', overflowY: 'hidden' }}
      >
        <div className="flex mx-auto min-w-max px-[10vw] items-center justify-center h-[350px]">
          <AnimatePresence>
            {availableCards.map((card, index) => {
              // MATEMÁTICA ESPECÍFICA PARA 5 A 10 CARTAS (Fica bonito com poucas cartas)
              const total = availableCards.length;
              const mid = total / 2;
              const offset = index - mid;
              
              // Ajuste: Com poucas cartas, podemos espaçar mais (rotate maior)
              const rotate = offset * 5; // 5 graus de rotação (mais aberto)
              const yOffset = Math.abs(offset) * 5; // Curva mais acentuada
              const xOffset = offset * 10; // Positivo = separa as cartas (não sobrepõe tanto)

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, y: 200 }}
                  animate={{ 
                    opacity: 1, 
                    y: yOffset + 20, // Empurra um pouco pra baixo
                    x: xOffset,
                    rotate: rotate,
                    scale: hoveredCardId === card.id ? 1.15 : 1,
                    zIndex: hoveredCardId === card.id ? 100 : index
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="relative cursor-pointer transform-style-3d origin-bottom"
                  style={{ 
                    marginRight: '-20px', 
                    transformOrigin: '50% 120%' // Ponto de rotação ajustado
                  }}
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onCardSelect(card)}
                >
                  {/* Visual da Carta (Igual em todos) */}
                  <div className="w-24 h-40 md:w-32 md:h-52 rounded-xl bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border border-[#ffffff20] shadow-2xl group-hover:border-yellow-400/80 transition-all duration-200">
                    <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="absolute inset-1.5 border border-[#ffffff10] rounded-lg" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <div className="w-12 h-12 border border-purple-500/30 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 border border-purple-500/50 rotate-45" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* --- SLOTS FIXOS EM 5 --- */}
      {/* Container Transparente (Sem fundo colorido) */}
      <div className="w-full max-w-4xl border-t border-white/10 p-4 mt-auto z-20">
        
        <div className="flex justify-center gap-3 flex-wrap mb-4">
          {/* Loop fixo de 5 posições */}
          {Array.from({ length: MAX_CARDS }).map((_, index) => {
            const card = selectedCards[index];
            return (
              <div 
                key={index}
                className="w-12 h-20 md:w-16 md:h-24 rounded border border-dashed border-white/20 bg-white/5 flex items-center justify-center relative overflow-hidden transition-all"
              >
                {card ? (
                  <motion.img 
                    src={card.imageUrl} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                ) : (
                  <span className="text-white/20 text-xs font-bold">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Botão VER MESA (Aparece ao completar 5) */}
        <div className="flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors px-3 py-2 rounded hover:bg-white/5"
          >
            <RotateCcw size={14} /> Reiniciar
          </button>

          <span className="text-xs font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
            {selectedCards.length} / {MAX_CARDS}
          </span>

          <div className="w-24 flex justify-end">
             {isComplete && (
               <motion.button
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 onClick={onNext}
                 className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg shadow-green-900/30 animate-pulse"
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

export default SelectionStepEx;
