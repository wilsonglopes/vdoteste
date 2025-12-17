import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { CARD_BACK_URL } from '../../constants';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface SelectionStepFofocaProps {
  availableCards: CardData[];
  selectedCards: CardData[];
  hoveredCardId: number | null;
  setHoveredCardId: (id: number | null) => void;
  onCardSelect: (card: CardData) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
  limit: number; // Receberá 12
}

const SelectionStepFofoca: React.FC<SelectionStepFofocaProps> = ({
  availableCards,
  selectedCards,
  hoveredCardId,
  setHoveredCardId,
  onCardSelect,
  onNext,
  onBack,
  isMobile,
  limit
}) => {
   
  const angleSpread = isMobile ? 100 : 130;
  const transformOriginY = isMobile ? '180%' : '200%';
  const hoverTranslateY = isMobile ? '-20px' : '-40px';

  const handleTouch = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-card-id]');

    if (cardElement) {
      const id = Number(cardElement.getAttribute('data-card-id'));
      if (id !== hoveredCardId) {
        setHoveredCardId(id);
      }
    } else {
      setHoveredCardId(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative justify-start pt-4 md:pt-8 min-h-[80vh]">
       
      <div className="text-center z-20 px-4 mb-6">
        <h3 className="font-playfair text-3xl md:text-4xl text-white mb-1">Escolha {limit} Cartas</h3>
        <p className="text-pink-200 text-lg font-light -mt-1">Uma investigação completa</p>
      </div>

      {/* LEQUE (Mantido igual) */}
      <div className="relative w-full flex justify-center items-start mb-4 md:mb-12 flex-grow">
        <div 
          className="relative flex justify-center items-center" 
          style={{ height: isMobile ? "180px" : "260px", marginTop: "-20px" }}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch} 
        >
          {availableCards.map((card, index) => {
            const total = availableCards.length;
            const angle = total > 1 ? (index / (total - 1) - 0.5) * angleSpread : 0;
            const isHovered = card.id === hoveredCardId;
            const isSelected = !!selectedCards.find(c => c.id === card.id);

            return (
              <div
                key={card.id}
                data-card-id={card.id} 
                onClick={() => onCardSelect(card)}
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
                <img 
                  src={CARD_BACK_URL} 
                  alt="Verso" 
                  className={`w-full h-full rounded-xl shadow-2xl border-2 transition-colors pointer-events-none ${isHovered ? 'border-pink-400 shadow-pink-500/50' : 'border-white/20 border-opacity-50'}`} 
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* SLOTS - CORREÇÃO AQUI */}
      {/* Removemos o backdrop grande e focamos apenas nos slots centralizados */}
      <div className="w-full max-w-5xl mx-auto z-30 px-2 pb-8">
        
         {/* Container Flex Wrap para quebrar linha */}
         <div className="flex flex-wrap justify-center gap-2 mb-6">
            
            {/* Cartas Selecionadas */}
            {selectedCards.map((card, i) => (
              <motion.div 
                key={card.id} 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="relative"
              >
                <img 
                  src={CARD_BACK_URL} 
                  className="w-10 h-16 md:w-14 md:h-24 rounded border border-pink-500 shadow-md object-cover" 
                  alt={`Carta ${i+1}`}
                />
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
              </motion.div>
            ))}
            
            {/* Slots Vazios */}
            {/* Mostramos todos os slots restantes até o limite */}
            {Array.from({ length: limit - selectedCards.length }).map((_, i) => (
              <div 
                key={i} 
                className="w-10 h-16 md:w-14 md:h-24 rounded border border-dashed border-white/20 bg-white/5 flex items-center justify-center"
              >
                 {/* Opcional: número do slot vazio bem sutil */}
                 <span className="text-white/10 text-xs font-bold">{selectedCards.length + i + 1}</span>
              </div>
            ))}
         </div>

         {/* Controles e Botões */}
         <div className="flex justify-between items-center px-4 bg-slate-900/50 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs uppercase font-bold tracking-wider"
            >
              <ArrowLeft size={14} /> Mudar Pergunta
            </button>

            <div className="flex items-center gap-4">
              <span className="text-pink-300 font-mono text-sm">{selectedCards.length} / {limit}</span>
              
              {selectedCards.length === limit && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={onNext}
                  className="bg-pink-600 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:bg-pink-500 hover:scale-105 flex items-center gap-2 transition-all duration-200 text-sm"
                >
                  <Sparkles size={16} /> Ver Mesa
                </motion.button>
              )}
            </div>
         </div>

      </div>
    </div>
  );
};

export default SelectionStepFofoca;
