import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, Heart, Calendar, HelpCircle, 
  Eye, RefreshCw, MessageCircle, GitBranch, Anchor 
} from 'lucide-react';
import { SPREADS } from '../config/spreads';

const SelectSpread: React.FC = () => {
  const navigate = useNavigate();

  // Segurança
  if (!SPREADS || !Array.isArray(SPREADS) || SPREADS.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  const handleSelect = (spreadId: string) => {
    switch (spreadId) {
      case 'ex': navigate('/tarot-ex'); break;
      case 'vale_pena': navigate('/tarot-vale-pena'); break;
      case 'mensal': navigate('/tarot-mensal'); break;
      case 'ferradura': navigate('/tarot-ferradura'); break;
      case 'amor_fofoca': navigate('/tarot-fofoca'); break;
      case 'ficar_partir': navigate('/tarot-ficar-partir'); break;
      case 'templo_afrodite': default: navigate('/tarot'); break;
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'templo_afrodite': return <Sparkles className="text-purple-400" size={24} />;
      case 'amor_fofoca': return <MessageCircle className="text-pink-500" size={24} />;
      case 'ex': return <RefreshCw className="text-red-400" size={24} />;
      case 'mensal': return <Calendar className="text-blue-400" size={24} />;
      case 'vale_pena': return <HelpCircle className="text-yellow-400" size={24} />;
      case 'ferradura': return <Anchor className="text-indigo-400" size={24} />;
      case 'ficar_partir': return <GitBranch className="text-green-400" size={24} />;
      default: return <Sparkles className="text-white" size={24} />;
    }
  };

  return (
    // Fundo Principal (Estrelado)
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 pb-20 overflow-x-hidden">
      
      {/* CORREÇÃO AQUI: Removi qualquer bg-color deste container. Ele agora é invisível. */}
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-white">Escolha sua Leitura</h1>
            <p className="text-slate-400 text-sm">Qual resposta você busca hoje?</p>
          </div>
        </div>

        {/* Grid de Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPREADS.map((spread, index) => (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(spread.id)}
              // ESTILO DOS CARDS INDIVIDUAIS (Esses sim têm cor escura)
              // Usei o mesmo estilo da Home que você gostou (slate-900/80)
              className="relative bg-slate-900/80 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-purple-500/50 hover:bg-slate-800/80 transition-all group overflow-hidden flex flex-col justify-between h-full min-h-[180px] shadow-lg backdrop-blur-xl"
            >
              {/* Efeito de brilho interno sutil no hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>

              {spread.cardsCount >= 12 && (
                <div className="absolute top-0 right-0 bg-pink-900/80 text-pink-200 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-l border-b border-pink-500/20 z-10">
                  PREMIUM
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {getIcon(spread.id)}
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-black/40 px-2 py-1 rounded border border-white/5">
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

              <div className="relative z-10 w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 group-hover:text-purple-300 transition-colors mt-auto">
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
