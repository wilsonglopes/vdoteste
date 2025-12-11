import React from 'react';
import { SPREADS } from '../../constants';
import { useTarotStore } from '../../store/tarotStore';
import { motion } from 'framer-motion';
import { LayoutGrid, HeartCrack, Calendar, HelpCircle, Magnet, ChevronRight } from 'lucide-react';

const SpreadSelection: React.FC = () => {
  const { setSpread, setStep } = useTarotStore();

  // Mapa de ícones para cada tipo de jogo
  const iconMap: Record<string, React.ReactNode> = {
    mesa_real: <LayoutGrid size={32} className="text-purple-400" />,
    love_ex: <HeartCrack size={32} className="text-red-400" />,
    relationship_check: <HelpCircle size={32} className="text-pink-400" />,
    monthly: <Calendar size={32} className="text-blue-400" />,
    horseshoe_general: <Magnet size={32} className="text-yellow-400" /> // Magnet parece uma ferradura
  };

  const handleSelect = (spreadId: string) => {
    setSpread(spreadId); // Salva qual jogo foi escolhido
    setStep('question'); // Avança para a tela de pergunta
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 px-4 pb-20 animate-fade-in-up">
      
      <div className="text-center mb-12">
        <h2 className="font-playfair text-3xl md:text-5xl text-white mb-4">Escolha sua Leitura</h2>
        <p className="text-slate-400 text-lg">Qual mistério você deseja desvendar hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(SPREADS).map((spread) => (
          <motion.div
            key={spread.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(spread.id)}
            className="bg-slate-900/60 border border-white/10 hover:border-purple-500/50 p-6 rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-purple-900/20 group relative overflow-hidden"
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  {iconMap[spread.id] || <LayoutGrid size={32} />}
                </div>
                <span className="bg-black/40 text-slate-300 text-xs font-bold px-2 py-1 rounded-full border border-white/5">
                  {spread.cardsCount} Cartas
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                {spread.title}
              </h3>
              <p className="text-sm text-purple-400 font-medium mb-3 uppercase tracking-wider">
                {spread.subtitle}
              </p>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                {spread.description}
              </p>

              <div className="flex items-center text-purple-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                Selecionar <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default SpreadSelection;
