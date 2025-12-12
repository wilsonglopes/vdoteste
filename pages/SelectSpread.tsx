import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, Heart, Calendar, HelpCircle, 
  Eye, RefreshCw, MessageCircle, GitBranch, Anchor, Split 
} from 'lucide-react';
import { SPREADS } from '../config/spreads';

const SelectSpread: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (spreadId: string) => {
    navigate(`/tarot?spread=${spreadId}`);
  };

  // Mapeamento de Ícones para os 7 Métodos
  const getIcon = (id: string) => {
    switch (id) {
      case 'templo_afrodite': return <Sparkles className="text-purple-400" size={24} />; // 9 Cartas
      case 'ex': return <RefreshCw className="text-red-400" size={24} />; // Ex
      case 'vale_pena': return <HelpCircle className="text-yellow-400" size={24} />; // Vale a pena?
      case 'mensal': return <Calendar className="text-blue-400" size={24} />; // Mensal
      case 'ferradura': return <Anchor className="text-indigo-400" size={24} />; // Ferradura
      case 'amor_fofoca': return <MessageCircle className="text-pink-500" size={24} />; // Fofoca
      case 'ficar_partir': return <GitBranch className="text-green-400" size={24} />; // Ficar ou Partir
      default: return <Sparkles className="text-white" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-white">Escolha sua Leitura</h1>
            <p className="text-slate-400 text-sm">Qual resposta você busca hoje?</p>
          </div>
        </div>

        {/* Grid de Opções (Responsivo: 1 col mobile, 2 tablet, 3 desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPREADS.map((spread, index) => (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(spread.id)}
              className="bg-[#121214] border border-white/5 p-6 rounded-2xl cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all group relative overflow-hidden flex flex-col justify-between h-full min-h-[180px]"
            >
              {/* Etiqueta Premium para jogos maiores (Fofoca 12 cartas) */}
              {spread.cardsCount >= 12 && (
                <div className="absolute top-0 right-0 bg-pink-900/50 text-pink-200 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-l border-b border-pink-500/20">
                  PREMIUM
                </div>
              )}

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    {getIcon(spread.id)}
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                    {spread.cardsCount} Cartas
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {spread.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {spread.description}
                </p>
              </div>

              <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 group-hover:text-purple-300 transition-colors mt-auto">
                <span>Jogar agora</span>
                <ArrowLeft className="rotate-180 w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SelectSpread;
