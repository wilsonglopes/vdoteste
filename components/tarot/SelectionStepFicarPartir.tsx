import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { CARD_BACK_URL } from '../../constants';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface SelectionStepFicarPartirProps {
  availableCards: CardData[];
  selectedCards: CardData[];
  hoveredCardId: number | null;
  setHoveredCardId: (id: number | null) => void;
  onCardSelect: (card: CardData) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
  limit: number; // Receberá 6
}

const SelectionStepFicarPartir: React.FC<SelectionStepFicarPartirProps> = ({
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
        <p className="text-fuchsia-200 text-lg font-light -mt-1">Siga sua intuição</p>
      </div>

      {/* LEQUE */}
      <div className="relative w-full flex justify-center items-start mb-12 md:mb-32">
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
                  className={`w-full h-full rounded-xl shadow-2xl border-2 transition-colors pointer-events-none ${isHovered ? 'border-fuchsia-400 shadow-fuchsia-500/50' : 'border-white/20 border-opacity-50'}`} 
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* SLOTS */}
      <div className="w-full max-w-5xl mx-auto z-30 px-4 mb-[4px]">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
          
          <div className={`flex justify-center gap-2 md:gap-4 mb-4 w-full ${isMobile ? 'flex-wrap' : 'overflow-x-auto no-scrollbar'}`}>
            {selectedCards.map((card, i) => (
              <motion.div key={card.id} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative flex-shrink-0">
                <img src={CARD_BACK_URL} className="w-10 h-16 md:w-14 md:h-24 rounded border border-fuchsia-500 shadow-md" />
                <span className="absolute -top-2 -right-2 bg-fuchsia-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
              </motion.div>
            ))}
            
            {Array.from({ length: limit - selectedCards.length }).map((_, i) => (
              <div key={i} className="w-10 h-16 md:w-14 md:h-24 rounded border border-dashed border-white/20 bg-white/5 flex-shrink-0" />
            ))}
          </div>

          <div className="flex justify-end items-center px-2">
            <div className="flex items-center gap-4">
              <span className="text-fuchsia-400 font-playfair text-lg">{selectedCards.length} / {limit}</span>
              
              {selectedCards.length === limit && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={onNext}
                  className="bg-fuchsia-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-fuchsia-500 hover:scale-105 flex items-center gap-2 transition-all duration-200"
                >
                  <Sparkles size={18} /> Ver Mesa
                </motion.button>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full flex justify-end mt-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium px-6 py-2 rounded-full shadow-sm backdrop-blur-sm"
          >
            <ArrowLeft size={16} />
            <span>Mudar Pergunta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionStepFicarPartir;
