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
  maxCards: number; // Recebe o limite correto (5, 7, 12...)
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

  // Centraliza o scroll no início
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  // Verifica se completou a seleção
  const isComplete = selectedCards.length === maxCards;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      {/* Título */}
      <div className="text-center mb-2 z-10">
        <h2 className="text-2xl font-serif text-white">
          Escolha {maxCards} Cartas
        </h2>
        <p className="text-slate-400 text-xs animate-pulse">Siga sua intuição</p>
      </div>

      {/* --- LEQUE DE CARTAS (RESTAURADO) --- */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 flex items-center overflow-x-auto py-10 px-4 custom-scrollbar select-none"
        style={{ perspective: '1000px', overflowY: 'hidden' }}
      >
        <div className="flex mx-auto min-w-max px-[10vw] items-center justify-center h-[350px]">
          <AnimatePresence>
            {availableCards.map((card, index) => {
              // Lógica do Arco Restaurada
              const total = availableCards.length;
              const mid = total / 2;
              const offset = index - mid;
              
              // Ajuste fino para o arco parecer um leque de verdade
              const rotate = offset * 3; // 3 graus por carta
              const yOffset = Math.abs(offset) * 2; // Curva suave
              const xOffset = offset * -15; // Sobreposição lateral

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ 
                    opacity: 1, 
                    y: yOffset,
                    x: xOffset,
                    rotate: rotate,
                    scale: hoveredCardId === card.id ? 1.15 : 1,
                    zIndex: hoveredCardId === card.id ? 100 : index
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="relative cursor-pointer transform-style-3d origin-bottom"
                  style={{ 
                    marginRight: '-30px', // Força sobreposição visual
                    transformOrigin: '50% 150%' // Ponto de rotação lá embaixo (efeito leque real)
                  }}
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onCardSelect(card)}
                >
                  {/* Visual da Carta (Verso Místico) */}
                  <div className="w-24 h-40 md:w-32 md:h-52 rounded-xl bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border border-[#ffffff20] shadow-2xl group-hover:border-yellow-400/80 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.4)] transition-all duration-200">
                    {/* Textura de fundo */}
                    <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    
                    {/* Borda interna dourada */}
                    <div className="absolute inset-1.5 border border-[#ffffff10] rounded-lg" />
                    
                    {/* Símbolo central */}
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

      {/* --- SLOTS CORRIGIDOS (Quantidade Dinâmica) --- */}
      <div className="w-full max-w-4xl bg-slate-900/90 border-t border-white/10 backdrop-blur-md p-4 mt-auto z-20">
        
        {/* Renderiza EXATAMENTE o número de slots pedido (maxCards) */}
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap mb-4">
          {Array.from({ length: maxCards }).map((_, index) => {
            const card = selectedCards[index];
            return (
              <div 
                key={index}
                className="w-10 h-16 md:w-14 md:h-20 rounded border border-dashed border-white/20 bg-white/5 flex items-center justify-center relative overflow-hidden"
              >
                {card ? (
                  <motion.img 
                    src={card.imageUrl} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                ) : (
                  <span className="text-white/20 text-[10px] font-bold">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Barra de Ações */}
        <div className="flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors px-3 py-2 rounded hover:bg-white/5"
          >
            <RotateCcw size={14} /> Reiniciar
          </button>

          <span className="text-xs font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
            {selectedCards.length} / {maxCards}
          </span>

          <div className="w-24 flex justify-end">
             {/* BOTÃO VER MESA (Aparece ao completar) */}
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

export default SelectionStep;
