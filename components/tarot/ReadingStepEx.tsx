import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, HeartCrack, RefreshCw, Home } from 'lucide-react';

interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface ReadingResult {
  intro: string;
  timeline?: { past: string; present: string; future: string };
  individual_cards?: { card_name: string; meaning: string }[];
  summary: string;
  advice: string;
}

interface ReadingStepExProps {
  question: string;
  selectedCards: CardData[];
  revealedLocal: number; // Quantas cartas já viraram visualmente
  reading: ReadingResult | null;
  isLoadingAI: boolean;
  user: any;
  onReveal: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onNewReading: () => void;
  layoutType?: string; // Opcional, mas aceito
}

const ReadingStepEx: React.FC<ReadingStepExProps> = ({
  question,
  selectedCards,
  revealedLocal,
  reading,
  isLoadingAI,
  onReveal,
  onBack,
  onGoHome,
  onNewReading
}) => {

  // Auto-iniciar a revelação se ainda não começou
  useEffect(() => {
    if (revealedLocal === 0 && !isLoadingAI && !reading) {
      // Pequeno delay para transição suave
      const timer = setTimeout(() => {
        onReveal();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [revealedLocal, isLoadingAI, reading, onReveal]);

  // Função para renderizar o grid de 5 cartas
  const renderCards = () => {
    return (
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 my-8 max-w-4xl">
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
                {/* VERSO (Costas da carta) */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-lg border-2 border-white/20 shadow-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <img 
                    src="https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg" 
                    alt="Verso" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* FRENTE (Imagem da carta) */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-lg border-2 border-yellow-500/50 shadow-2xl overflow-hidden bg-slate-900"
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
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                    <span className="text-[10px] md:text-xs text-white font-serif tracking-wider">
                      {card.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pb-20">
      
      {/* Cabeçalho da Leitura */}
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center p-3 bg-red-900/30 rounded-full mb-4 border border-red-500/30">
          <HeartCrack className="text-red-400 w-6 h-6" />
        </div>
        <h2 className="text-2xl md:text-3xl text-white font-serif mb-2">A Revelação</h2>
        <p className="text-slate-300 italic max-w-lg mx-auto">"{question}"</p>
      </div>

      {/* ÁREA DAS CARTAS (5 CARTAS) */}
      {renderCards()}

      {/* ÁREA DE RESULTADO DA IA */}
      <div className="w-full max-w-3xl px-4">
        {isLoadingAI && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Sparkles className="text-purple-400 w-12 h-12" />
            </motion.div>
            <p className="text-purple-200 animate-pulse text-lg font-serif">
              O oráculo está interpretando a energia do seu Ex...
            </p>
          </div>
        )}

        {!isLoadingAI && reading && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm"
          >
            {/* Introdução */}
            <div className="mb-8 border-b border-slate-700 pb-6">
              <h3 className="text-xl text-purple-300 font-bold mb-4 font-serif">Visão Geral</h3>
              <p className="text-slate-200 leading-relaxed text-lg">
                {reading.intro}
              </p>
            </div>

            {/* Interpretação das Cartas */}
            {reading.individual_cards && reading.individual_cards.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl text-blue-300 font-bold mb-4 font-serif">Significado das Cartas</h3>
                <div className="space-y-4">
                  {reading.individual_cards.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500">
                      <span className="block text-blue-200 font-bold mb-1">{item.card_name}</span>
                      <p className="text-slate-300 text-sm">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conselho Final */}
            <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl">
              <h3 className="text-xl text-red-300 font-bold mb-3 font-serif flex items-center gap-2">
                <HeartCrack size={20} /> Conselho do Oráculo
              </h3>
              <p className="text-slate-100 italic font-medium">
                {reading.advice}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={onNewReading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all"
              >
                <RefreshCw size={18} /> Nova Pergunta
              </button>
              <button 
                onClick={onGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-lg shadow-purple-900/50 transition-all"
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
