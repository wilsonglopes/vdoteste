import React from 'react';
import { SPREADS } from '../../constants';
import { useTarotStore } from '../../store/tarotStore';
import { motion } from 'framer-motion';
import { LayoutGrid, HeartCrack, Calendar, HelpCircle, Magnet, ChevronRight } from 'lucide-react';

const SpreadSelection: React.FC = () => {
  const { setSpread, setStep } = useTarotStore();

  // Ícones para cada tipo de jogo
  const iconMap: Record<string, React.ReactNode> = {
    mesa_real: <LayoutGrid size={32} className="text-purple-400" />,
    love_ex: <HeartCrack size={32} className="text-red-400" />,
    relationship_check: <HelpCircle size={32} className="text-pink-400" />,
    monthly: <Calendar size={32} className="text-blue-400" />,
    horseshoe_general: <Magnet size={32} className="text-yellow-400" />
  };

  const handleSelect = (spreadId: string) => {
    setSpread(spreadId); // Salva no store qual jogo foi escolhido
    setStep('question'); // Avança para a pergunta
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 px-4 pb-20 animate-fade-in-up">
      
      <div className="text-center mb-10">
        <h2 className="font-playfair text-3xl md:text-4xl text-white mb-2">Escolha sua Leitura</h2>
        <p className="text-slate-400 text-sm md:text-base">Qual resposta você busca hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(SPREADS).map((spread: any) => (
          <motion.div
            key={spread.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(spread.id)}
            className="bg-slate-900/80 border border-white/10 hover:border-purple-500/50 p-5 rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-purple-900/20 group relative overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                {iconMap[spread.id] || <LayoutGrid size={24} />}
              </div>
              <span className="bg-black/40 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full border border-white/5">
                {spread.cardsCount} Cartas
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
              {spread.title}
            </h3>
            <p className="text-xs text-purple-400 font-medium mb-2 uppercase tracking-wider">
              {spread.subtitle}
            </p>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-grow line-clamp-3">
              {spread.description}
            </p>

            <div className="flex items-center text-purple-400 text-xs font-bold group-hover:translate-x-1 transition-transform mt-auto">
              Selecionar <ChevronRight size={14} className="ml-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelection;
