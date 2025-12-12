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
  maxCards: number; // <--- NOVO: Recebe o limite do jogo
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
  maxCards // <--- Usando o limite
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      {/* Título e Instrução */}
      <div className="text-center mb-4 z-10">
        <h2 className="text-2xl font-serif text-white mb-1">
          Escolha {maxCards} Cartas
        </h2>
        <p className="text-slate-400 text-sm animate-pulse">Siga sua intuição</p>
      </div>

      {/* --- LEQUE DE CARTAS (Área de Scroll) --- */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 flex items-center overflow-x-auto py-8 px-4 custom-scrollbar select-none"
        style={{ perspective: '1000px' }}
      >
        <div className="flex mx-auto min-w-max px-[50vw] items-center justify-center h-[200px] md:h-[300px]">
          <AnimatePresence>
            {availableCards.map((card, index) => {
              // Cálculo para o efeito de arco do leque
              const total = availableCards.length;
              const mid = total / 2;
              const dist = Math.abs(index - mid);
              const rotate = (index - mid) * 2.5; 
              const yOffset = dist * dist * 0.08; 

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
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative -ml-8 md:-ml-12 cursor-pointer transform-style-3d group"
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onCardSelect(card)}
                >
                  {/* Carta (Verso) */}
                  <div className="w-20 h-32 md:w-32 md:h-48 rounded-xl bg-gradient-to-br from-indigo-950 to-purple-900 border border-purple-500/30 shadow-2xl group-hover:border-yellow-400/80 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all duration-300">
                    <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="absolute inset-1 border border-white/10 rounded-lg" />
                    
                    {/* Brilho ao passar o mouse */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* --- SLOTS (ESPAÇOS DAS CARTAS ESCOLHIDAS) --- */}
      {/* Aqui corrigimos: Usamos 'maxCards' para desenhar a quantidade exata de slots */}
      <div className="w-full max-w-4xl bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mt-auto mb-4 relative z-20">
        
        <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
          {Array.from({ length: maxCards }).map((_, index) => {
            const card = selectedCards[index];
            return (
              <div 
                key={index}
                className="w-12 h-20 md:w-16 md:h-24 rounded border border-dashed border-white/20 bg-white/5 flex items-center justify-center relative overflow-hidden"
              >
                {card ? (
                  <motion.img 
                    layoutId={`selected-${card.id}`}
                    src={card.imageUrl} // Exibe a imagem se já foi selecionada (opcional, ou manter verso)
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                ) : (
                  <span className="text-white/10 text-xs font-bold">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Contador e Ações */}
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

          <div className="w-20 flex justify-end">
             {/* O botão de avançar aparece sozinho ou fica desabilitado até completar */}
             {selectedCards.length === maxCards && (
               <motion.button
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 onClick={onNext}
                 className="flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-sm cursor-pointer animate-pulse"
               >
                 Revelar <ArrowRight size={16} />
               </motion.button>
             )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SelectionStep;
