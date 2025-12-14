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
  // Não precisamos de maxCards aqui, é fixo em 5
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
  const FIXED_LIMIT = 5; // TRAVADO EM 5

  // Centraliza o scroll
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const isComplete = selectedCards.length === FIXED_LIMIT;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      <div className="text-center mb-6 z-10">
        <h2 className="text-2xl font-serif text-white">
          Escolha {FIXED_LIMIT} Cartas
        </h2>
        <p className="text-slate-400 text-xs animate-pulse">Siga sua intuição</p>
      </div>

      {/* --- LEQUE RESTAURADO (Lógica do Arco Original) --- */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 flex items-center overflow-x-auto py-10 px-4 custom-scrollbar select-none"
        style={{ perspective: '1000px', overflowY: 'hidden' }}
      >
        <div className="flex mx-auto min-w-max px-[10vw] items-center justify-center h-[350px]">
          <AnimatePresence>
            {availableCards.map((card, index) => {
              // MATEMÁTICA DO ARCO QUE VOCÊ GOSTA
              const total = availableCards.length;
              const mid = total / 2;
              const offset = index - mid;
              
              // Rotação suave baseada no centro
              const rotate = offset * 2.5; 
              // Curva em arco (sobe nas pontas)
              const yOffset = Math.abs(offset) * 2.5; 

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, y: 200 }}
                  animate={{ 
                    opacity: 1, 
                    y: yOffset, // Aplica a curva
                    rotate: rotate, // Aplica a rotação
                    scale: hoveredCardId === card.id ? 1.15 : 1,
                    zIndex: hoveredCardId === card.id ? 100 : index
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  // O SEGREDO DO LEQUE PERFEITO ESTÁ AQUI:
                  style={{ 
                    transformOrigin: '50% 200%', // O ponto de rotação é bem abaixo da carta
                    marginLeft: '-40px' // Sobreposição das cartas
                  }}
                  className="relative cursor-pointer"
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onCardSelect(card)}
                >
                  {/* Visual da Carta (Verso) */}
                  <div className="w-24 h-40 md:w-32 md:h-52 rounded-xl bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border border-[#ffffff20] shadow-2xl group-hover:border-yellow-400/80 transition-all duration-200">
                    <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="absolute inset-1.5 border border-[#ffffff10] rounded-lg" />
                    
                    {/* Detalhe do Verso */}
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

      {/* --- ÁREA DOS SLOTS (FIXA EM 5) --- */}
      {/* Container Transparente (Sem caixa lilás) */}
      <div className="w-full max-w-4xl border-t border-white/10 p-4 mt-auto z-20">
        
        <div className="flex justify-center gap-3 flex-wrap mb-4">
          {/* HARDCODED: Array de 5 posições. Impossível aparecer 9. */}
          {Array.from({ length: FIXED_LIMIT }).map((_, index) => {
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

        {/* Rodapé com Botões */}
        <div className="flex justify-between items-center">
          {/* Botão Voltar/Reiniciar */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors px-3 py-2 rounded hover:bg-white/5"
          >
            <RotateCcw size={14} /> Mudar Opção
          </button>

          <span className="text-xs font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
            {selectedCards.length} / {FIXED_LIMIT}
          </span>

          <div className="w-24 flex justify-end">
             {/* Botão Ver Mesa (Aparece ao completar 5) */}
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
