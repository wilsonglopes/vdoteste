import React, { useRef } from 'react';
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
  maxCards: number; // Limite vindo da página pai
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

  // Calcula quantos slots faltam ou se está cheio
  const isComplete = selectedCards.length === maxCards;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      <div className="text-center mb-4 z-10">
        <h2 className="text-2xl font-serif text-white mb-1">
          Escolha {maxCards} Cartas
        </h2>
        <p className="text-slate-400 text-sm animate-pulse">Siga sua intuição</p>
      </div>

      {/* LEQUE DE CARTAS */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 flex items-center overflow-x-auto py-8 px-4 custom-scrollbar select-none"
        style={{ perspective: '1000px' }}
      >
        <div className="flex mx-auto min-w-max px-[50vw] items-center justify-center h-[200px] md:h-[300px]">
          <AnimatePresence>
            {availableCards.map((card, index) => {
              const mid = availableCards.length / 2;
              const rotate = (index - mid) * 2.5; 
              const yOffset = Math.abs(index - mid) * Math.abs(index - mid) * 0.08; 

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    y: yOffset,
                    rotate: rotate,
                    scale: hoveredCardId === card.id ? 1.1 : 1,
                    zIndex: hoveredCardId === card.id ? 50 : index
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="relative -ml-8 md:-ml-12 cursor-pointer transform-style-3d group"
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onCardSelect(card)}
                >
                  {/* VERSO DA CARTA NO LEQUE (Estilo Dourado) */}
                  <div className="w-20 h-32 md:w-32 md:h-48 rounded-xl bg-gradient-to-br from-indigo-950 to-purple-900 border border-purple-500/30 shadow-2xl group-hover:border-yellow-400/80 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="absolute inset-1 border border-white/10 rounded-lg" />
                    {/* Desenho central decorativo (simulado) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-purple-400/30 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border border-purple-400/30 rotate-45" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ÁREA DOS SLOTS (AJUSTADA PARA maxCards) */}
      <div className="w-full max-w-4xl bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mt-auto mb-4 relative z-20">
        
        <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
          {/* AQUI ESTAVA O ERRO: Agora usamos Array.from com maxCards */}
          {Array.from({ length: maxCards }).map((_, index) => {
            const card = selectedCards[index];
            return (
              <div 
                key={index}
                className="w-12 h-20 md:w-16 md:h-24 rounded border border-dashed border-white/20 bg-white/5 flex items-center justify-center relative overflow-hidden"
              >
                {card ? (
                  <motion.div 
                    layoutId={`selected-${card.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full bg-gradient-to-br from-indigo-950 to-purple-900"
                  >
                     {/* Mostra o verso da carta selecionada (mini) */}
                     <div className="w-full h-full opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                  </motion.div>
                ) : (
                  <span className="text-white/10 text-xs font-bold">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* CONTROLES */}
        <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <RotateCcw size={16} /> <span className="hidden md:inline">Reiniciar</span>
          </button>

          <span className="text-sm font-mono text-purple-300">
            {selectedCards.length} / {maxCards}
          </span>

          <div className="w-24 flex justify-end">
             {/* BOTÃO "VER MESA" (Só aparece quando completa) */}
             {isComplete && (
               <motion.button
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
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
