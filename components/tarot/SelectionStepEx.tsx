import React from 'react';
import { motion } from 'framer-motion';

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
  limit: number; // RECEBE 5, 7, ou 9
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
  limit // Quantidade exata de slots
}) => {
  
  // Verifica se completou a seleção para mostrar o botão
  const isComplete = selectedCards.length === limit;

  // Renderiza o Leque de Cartas (Lógica visual simplificada para focar na funcionalidade)
  const renderFan = () => {
    // Se quiser usar exatamente o mesmo leque do original, 
    // copie a lógica de angulação do seu SelectionStep.tsx aqui.
    // Abaixo está uma versão funcional padrão:
    const totalCards = availableCards.length;
    const angleStep = isMobile ? 4 : 2.5; 
    const startAngle = -((totalCards - 1) * angleStep) / 2;

    return (
      <div className="relative w-full h-[300px] md:h-[400px] flex justify-center items-end mb-8 overflow-visible">
        {availableCards.map((card, index) => {
          const angle = startAngle + index * angleStep;
          // Eleva a carta se estiver em hover
          const isHovered = hoveredCardId === card.id;
          
          return (
            <motion.div
              key={card.id}
              className="absolute origin-bottom cursor-pointer shadow-xl rounded-lg border border-white/10"
              style={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 100 : 130,
                rotate: angle,
                x: index * (isMobile ? 1.5 : 3), // Pequeno offset lateral
                zIndex: isHovered ? 100 : index,
              }}
              animate={{
                y: isHovered ? -40 : 0,
                scale: isHovered ? 1.2 : 1,
              }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => onCardSelect(card)}
            >
              {/* Imagem do Verso da Carta */}
              <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
                 {/* Substitua pela sua imagem de verso de carta real */}
                 <div className="w-full h-full border-2 border-yellow-600/50 bg-[url('https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg')] bg-cover bg-center" />
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[70vh]">
      
      {/* Título da etapa */}
      <h2 className="text-2xl md:text-3xl text-white font-serif mb-2">
        Escolha {limit} Cartas
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Siga sua intuição e toque nas cartas acima
      </p>

      {/* 1. O LEQUE DE CARTAS */}
      {renderFan()}

      {/* 2. ÁREA DOS SLOTS (OS ESPAÇOS VAZIOS) */}
      <div className="w-full max-w-4xl bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center transition-all">
        
        {/* Renderiza dinamicamente a quantidade de slots baseada no 'limit' */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4">
          {Array.from({ length: limit }).map((_, index) => {
            const card = selectedCards[index]; // Pega a carta se ela existir nessa posição

            return (
              <div 
                key={index}
                className={`
                  relative rounded-lg flex items-center justify-center transition-all duration-300
                  ${isMobile ? 'w-12 h-20' : 'w-20 h-32'}
                  ${card ? 'border-none shadow-lg shadow-purple-500/20' : 'border-2 border-dashed border-slate-600 bg-white/5'}
                `}
              >
                {card ? (
                  // Se tiver carta selecionada, mostra ela
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src="https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg" 
                    alt="Verso"
                    className="w-full h-full object-cover rounded-lg border border-yellow-500/50"
                  />
                ) : (
                  // Se não, mostra o número do slot ou ícone vazio
                  <span className="text-slate-600 font-bold text-lg">
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full flex justify-between items-center px-4 mt-2">
          {/* Contador de texto */}
          <span className="text-slate-400 font-medium">
            {selectedCards.length} / {limit}
          </span>

          {/* 3. BOTÃO "VER MESA" - SÓ APARECE SE ESTIVER COMPLETO */}
          {isComplete ? (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={onNext}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-900/50 flex items-center gap-2"
            >
              ✨ Ver Mesa
            </motion.button>
          ) : (
            <div className="h-12 w-32" /> // Espaço vazio para não pular o layout
          )}
        </div>
      </div>

      <button onClick={onBack} className="mt-8 text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-2">
        ← Mudar Pergunta
      </button>

    </div>
  );
};

export default SelectionStepEx;
