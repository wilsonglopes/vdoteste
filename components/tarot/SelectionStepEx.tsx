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
  limit: number; // Define quantos slots aparecem (ex: 5)
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
  
  // Verifica se o usuário já escolheu o número exato de cartas
  const isComplete = selectedCards.length === limit;

  // --- LÓGICA DO LEQUE (VISUAL FIXO) ---
  const renderFan = () => {
    // Configurações visuais para manter o leque idêntico ao original
    const totalCards = availableCards.length;
    
    // Ajuste fino para o arco parecer com a imagem enviada (denso e curvado)
    const arcAngle = isMobile ? 80 : 100; // Abertura total do leque em graus
    const startAngle = -arcAngle / 2;
    const angleStep = arcAngle / (totalCards - 1);
    
    // Raio do arco (distância do ponto de rotação)
    const radius = isMobile ? 300 : 500; 

    return (
      <div 
        className="relative w-full flex justify-center items-end overflow-hidden"
        style={{ height: isMobile ? '320px' : '450px' }} // Altura fixa para o container do leque
      >
        {availableCards.map((card, index) => {
          const angle = startAngle + index * angleStep;
          const isHovered = hoveredCardId === card.id;
          
          // Cálculo trigonométrico simples para posicionar em arco
          // Isso garante que o leque fique perfeito visualmente
          const radian = (angle * Math.PI) / 180;
          const x = Math.sin(radian) * (radius * 0.8); 
          const y = Math.cos(radian) * (radius * 0.2); // Achatamento vertical para efeito 3D
          
          return (
            <motion.div
              key={card.id}
              className="absolute cursor-pointer shadow-2xl rounded-lg border border-white/10"
              style={{
                width: isMobile ? 60 : 90,
                height: isMobile ? 100 : 150,
                left: '50%', // Centraliza horizontalmente
                bottom: isMobile ? '50px' : '80px', // Posição base
                marginLeft: isMobile ? -30 : -45, // Ajuste do centro do elemento
                transformOrigin: '50% 150%', // Ponto de rotação deslocado para baixo (efeito leque)
                zIndex: isHovered ? 100 : index,
              }}
              animate={{
                rotate: angle, // A rotação calculada
                y: isHovered ? -40 : y * 1.5, // Levanta no hover, senão segue o arco Y
                x: x, // Segue o arco X
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => onCardSelect(card)}
            >
              {/* VERSO DA CARTA - Design Padrão */}
              <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative border-2 border-yellow-900/40">
                {/* Textura ou Imagem do Verso */}
                <div 
                    className="w-full h-full opacity-80"
                    style={{
                        backgroundImage: `url('https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                {/* Detalhe de borda interna (opcional, para dar acabamento premium) */}
                <div className="absolute inset-1 border border-yellow-500/20 rounded-md"></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      
      {/* Cabeçalho */}
      <div className="text-center mb-4 mt-4 z-10 relative">
        <h2 className="text-3xl md:text-4xl text-white font-serif mb-2 drop-shadow-lg">
          Escolha {limit} Cartas
        </h2>
        <p className="text-slate-300 text-sm font-medium tracking-wide">
          Siga sua intuição
        </p>
      </div>

      {/* 1. O LEQUE (Visualmente idêntico ao original) */}
      <div className="-mt-10 md:-mt-16 w-full max-w-6xl mx-auto">
        {renderFan()}
      </div>

      {/* 2. OS SLOTS (DINÂMICOS - Mudam conforme o limite) */}
      {/* Container escuro arredondado igual ao print */}
      <div className="w-full max-w-4xl bg-[#0a0a0f] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col items-center relative z-20 shadow-2xl">
        
        {/* Grid de Slots */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-4">
          {Array.from({ length: limit }).map((_, index) => {
            const card = selectedCards[index];
            
            return (
              <div 
                key={index}
                className={`
                  relative rounded-lg flex items-center justify-center transition-all duration-300
                  ${isMobile ? 'w-14 h-24' : 'w-20 h-36'}
                  ${card 
                    ? 'border-none shadow-[0_0_15px_rgba(168,85,247,0.4)]' // Brilho roxo quando tem carta
                    : 'border-2 border-dashed border-slate-700 bg-white/5' // Slot vazio discreto
                  }
                `}
              >
                {card ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full"
                  >
                    <img 
                      src="https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg" 
                      alt={`Carta ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-purple-500/30"
                    />
                  </motion.div>
                ) : (
                  <span className="text-slate-700 font-bold text-lg select-none">
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé do Card: Contador e Botão */}
        <div className="w-full flex justify-between items-center px-4 mt-4 h-12">
            
            {/* Contador */}
            <span className="text-slate-300 font-medium tracking-widest text-sm md:text-base">
                {selectedCards.length} / {limit}
            </span>

            {/* Botão de Ação (Só aparece quando completar) */}
            <div className="flex-1 flex justify-end">
                {isComplete && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-2 md:py-3 rounded-full font-bold shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-colors"
                    >
                        <span className="mr-1">✨</span> Ver Mesa
                    </motion.button>
                )}
            </div>
        </div>
      </div>

      {/* Botão Mudar Pergunta (fora do card) */}
      <button 
        onClick={onBack} 
        className="mt-8 px-6 py-2 border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Mudar Pergunta
      </button>

    </div>
  );
};

export default SelectionStepEx;
