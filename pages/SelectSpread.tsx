import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Heart, Calendar, HelpCircle, Eye } from 'lucide-react';
import { SPREADS } from '../config/spreads';

const SelectSpread: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (spreadId: string) => {
    // Navega para a página de Tarot passando o ID do jogo escolhido
    navigate(`/tarot?spread=${spreadId}`);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'amor_fofoca': return <Heart className="text-pink-500" size={24} />;
      case 'ex': return <HelpCircle className="text-purple-400" size={24} />;
      case 'mensal': return <Calendar className="text-blue-400" size={24} />;
      case 'vale_pena': return <Eye className="text-yellow-400" size={24} />;
      default: return <Sparkles className="text-white" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-serif">Escolha sua Leitura</h1>
            <p className="text-slate-400 text-sm">Qual resposta você busca hoje?</p>
          </div>
        </div>

        {/* Grid de Opções */}
        <div className="grid md:grid-cols-2 gap-4">
          {SPREADS.map((spread, index) => (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(spread.id)}
              className="bg-[#121214] border border-white/5 p-6 rounded-2xl cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all group relative overflow-hidden"
            >
              {/* Highlight para o Fofocando (Premium) */}
              {spread.id === 'amor_fofoca' && (
                <div className="absolute top-0 right-0 bg-pink-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  PREMIUM
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {getIcon(spread.id)}
                </div>
                <span className="text-xs font-mono text-slate-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                  {spread.cardsCount} Cartas
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {spread.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {spread.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SelectSpread;