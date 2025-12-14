import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, HeartCrack, Sparkles } from 'lucide-react'; // Ícone HeartCrack específico para Ex

interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface ReadingStepExProps {
  question: string;
  selectedCards: CardData[];
  revealedLocal: number;
  reading: any;
  isLoadingAI: boolean;
  user: any;
  onReveal: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onNewReading: () => void;
}

const ReadingStepEx: React.FC<ReadingStepExProps> = ({
  question,
  selectedCards,
  revealedLocal,
  reading,
  isLoadingAI,
  onReveal,
  onGoHome,
  onNewReading
}) => {

  // Auto-iniciar revelação
  useEffect(() => {
    if (revealedLocal === 0 && !isLoadingAI && !reading) {
      setTimeout(() => onReveal(), 500);
    }
  }, [revealedLocal, isLoadingAI, reading, onReveal]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center pb-20">
      
      {/* 1. Cabeçalho da Mesa (Igual ao original) */}
      <div className="text-center mb-8 px-4 mt-2">
        <h2 className="text-2xl md:text-3xl text-white font-serif mb-2 drop-shadow-md">
          A Mensagem do Oráculo
        </h2>
        <p className="text-slate-400 italic max-w-lg mx-auto text-sm md:text-base">
          "{question}"
        </p>
      </div>

      {/* 2. Área das Cartas - Layout Centralizado para 5 Cartas */}
      <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 mb-10 max-w-4xl px-2">
        {selectedCards.map((card, index) => {
          const isRevealed = index < revealedLocal;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-24 h-40 md:w-32 md:h-52 perspective-1000"
            >
              <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-700"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isRevealed ? 180 : 0 }}
              >
                {/* Costas */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-lg border border-white/20 shadow-xl bg-slate-900"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <img 
                    src="https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg" 
                    alt="Verso" 
                    className="w-full h-full object-cover rounded-lg opacity-90"
                  />
                </div>

                {/* Frente */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-lg border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden bg-black"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)' 
                  }}
                >
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* Nome da carta (Overlay sutil) */}
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-2 pt-6 text-center">
                    <span className="text-[10px] md:text-xs text-[#D4AF37] font-serif uppercase tracking-widest">
                      {card.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Área de Resultado (IA) */}
      <div className="w-full max-w-3xl px-4 z-20">
        
        {/* Loading State */}
        {isLoadingAI && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Sparkles className="text-purple-400 w-10 h-10" />
            </motion.div>
            <p className="text-purple-200 animate-pulse font-serif">
              Interpretando as energias...
            </p>
          </div>
        )}

        {/* Resultado Final */}
        {!isLoadingAI && reading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B0B15]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-md"
          >
            <div className="space-y-6 text-slate-300 leading-relaxed font-light">
               
               {/* Introdução */}
               <div className="border-b border-white/5 pb-4">
                  <h3 className="text-xl text-white font-serif mb-2 flex items-center gap-2">
                     <HeartCrack size={20} className="text-red-400"/> Visão Geral
                  </h3>
                  <p>{reading.intro}</p>
               </div>

               {/* Cartas Individuais */}
               {reading.individual_cards && (
                 <div className="grid gap-4 mt-4">
                    {reading.individual_cards.map((item: any, i: number) => (
                       <div key={i} className="bg-white/5 p-4 rounded-lg border-l-2 border-purple-500">
                          <strong className="text-purple-300 block mb-1 text-sm uppercase tracking-wide">{item.card_name}</strong>
                          <p className="text-sm opacity-90">{item.meaning}</p>
                       </div>
                    ))}
                 </div>
               )}

               {/* Conselho */}
               <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-xl mt-6">
                  <h4 className="text-purple-300 font-bold mb-2 text-sm uppercase tracking-wider">Conselho do Oráculo</h4>
                  <p className="italic text-white">{reading.advice}</p>
               </div>

            </div>

            {/* Botões Finais (Estilo idêntico) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-white/5">
              <button 
                onClick={onNewReading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full transition-all font-medium text-sm"
              >
                <RefreshCw size={18} /> Nova Pergunta
              </button>
              <button 
                onClick={onGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-lg shadow-purple-900/40 transition-all text-sm"
              >
                <Home size={18} /> Voltar ao Início
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReadingStepEx;
