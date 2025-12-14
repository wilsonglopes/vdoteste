import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface SelectionStepExProps {
  availableCards: CardData[];
  selectedCards: CardData[];
  hoveredCardId: number | null;
  setHoveredCardId: (id: number | null) => void;
  onCardSelect: (card: CardData) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
  limit: number; // RECEBE 5
}

const SelectionStepEx: React.FC<SelectionStepExProps> = ({
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
  
  const isComplete = selectedCards.length === limit;

  // --- LÓGICA DO LEQUE (Mantida idêntica ao padrão visual de 9 cartas) ---
  const renderFan = () => {
    const totalCards = availableCards.length;
    // Ângulos abertos para parecer o leque original
    const angleStep = isMobile ? 3.5 : 2.5; 
    const startAngle = -((totalCards - 1) * angleStep) / 2;

    return (
      <div className="relative w-full h-[320px] md:h-[450px] flex justify-center items-end mb-4 overflow-visible z-10">
        {availableCards.map((card, index) => {
          const angle = startAngle + index * angleStep;
          const isHovered = hoveredCardId === card.id;
          
          return (
            <motion.div
              key={card.id}
              className="absolute origin-bottom cursor-pointer shadow-2xl rounded-lg border border-white/10"
              style={{
                width: isMobile ? 60 : 90,
                height: isMobile ? 100 : 150,
                rotate: angle,
                x: index * (isMobile ? 1 : 2), 
                zIndex: isHovered ? 100 : index,
              }}
              animate={{
                y: isHovered ? -40 : 0,
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => onCardSelect(card)}
            >
              <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
                 {/* Imagem do Verso */}
                 <img 
                    src="https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg" 
                    alt="Verso"
                    className="w-full h-full object-cover opacity-90"
                 />
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      
      {/* Cabeçalho igual ao original */}
      <div className="text-center mb-2 mt-4 z-20">
        <h2 className="text-3xl md:text-4xl text-white font-serif mb-2 drop-shadow-md">
          Escolha {limit} Cartas
        </h2>
        <p className="text-slate-400 text-sm tracking-wide">
          Siga sua intuição
        </p>
      </div>

      {/* Renderiza o Leque */}
      {renderFan()}

      {/* CARD DE SLOTS (A PARTE DE BAIXO)
         Layout idêntico ao original: fundo escuro, bordas arredondadas.
      */}
      <div className="w-full max-w-5xl bg-[#0B0B15] border border-white/10 rounded-3xl p-6 md:p-10 flex flex-col items-center shadow-2xl z-20 relative -mt-8">
        
        {/* Container dos Slots */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
          {Array.from({ length: limit }).map((_, index) => {
            const card = selectedCards[index];
            
            return (
              <div 
                key={index}
                className={`
                  relative rounded-lg flex items-center justify-center transition-all duration-300
                  ${isMobile ? 'w-12 h-20' : 'w-20 h-32'}
                  ${card ? 'border-none ring-2 ring-purple-500/50 shadow-lg' : 'border border-dashed border-slate-700 bg-white/5'}
                `}
              >
                {card ? (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src="https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg" 
                    alt="Escolhida"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                    // Se não tem carta, não mostra nada ou número discreto
                    <span className="hidden md:block text-slate-800 font-bold text-xl">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Barra de Ação (Contador e Botão) */}
        <div className="w-full flex justify-between items-center h-14 px-2 md:px-8 border-t border-white/5 pt-4">
          <span className="text-slate-400 font-medium text-lg">
            {selectedCards.length} / {limit}
          </span>

          {isComplete && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onNext}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all"
            >
              <span className="text-xl">✨</span> Ver Mesa
            </motion.button>
          )}
        </div>
      </div>

      <button 
        onClick={onBack} 
        className="mt-8 mb-8 px-6 py-2 border border-white/10 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Mudar Pergunta
      </button>

    </div>
  );
};

export default SelectionStepEx;
