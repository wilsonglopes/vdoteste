import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SPREADS } from '../constants';
import { useTarotStore } from '../store/tarotStore';
import { motion } from 'framer-motion';
import { LayoutGrid, HeartCrack, Calendar, HelpCircle, Magnet, ChevronRight, ArrowLeft } from 'lucide-react';

const SelectSpread: React.FC = () => {
  const navigate = useNavigate();
  const { setSpread, setStep, resetTarot } = useTarotStore();

  const iconMap: Record<string, React.ReactNode> = {
    mesa_real: <LayoutGrid size={32} className="text-purple-400" />,
    love_ex: <HeartCrack size={32} className="text-red-400" />,
    relationship_check: <HelpCircle size={32} className="text-pink-400" />,
    monthly: <Calendar size={32} className="text-blue-400" />,
    horseshoe_general: <Magnet size={32} className="text-yellow-400" />
  };

  const handleSelect = (spreadId: string) => {
    // 1. Reseta o estado anterior para evitar lixo
    resetTarot();
    // 2. Define o jogo escolhido
    setSpread(spreadId);
    // 3. Define que o próximo passo é a pergunta
    setStep('question');
    // 4. Navega para a mesa de jogo
    navigate('/tarot');
  };

  return (
    <div className="min-h-screen w-full py-10 px-4 flex flex-col items-center animate-fade-in-up">
      
      <div className="w-full max-w-6xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Voltar para Home
        </button>

        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-3">Escolha sua Leitura</h2>
          <p className="text-slate-400 text-lg">Qual mistério o oráculo deve revelar hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(SPREADS).map((spread: any) => (
            <motion.div
              key={spread.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(spread.id)}
              className="bg-slate-900/80 border border-white/10 hover:border-purple-500/50 p-6 rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-purple-900/30 group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    {iconMap[spread.id] || <LayoutGrid size={32} />}
                  </div>
                  <span className="bg-purple-900/50 text-purple-200 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/20">
                    {spread.cardsCount} Cartas
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {spread.title}
                </h3>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-3">
                  {spread.subtitle}
                </p>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {spread.description}
                </p>

                <div className="flex items-center text-purple-400 text-sm font-bold group-hover:translate-x-1 transition-transform mt-auto border-t border-white/5 pt-4">
                  Iniciar Leitura <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectSpread;
