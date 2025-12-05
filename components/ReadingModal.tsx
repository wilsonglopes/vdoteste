import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sparkles, Calendar, AlignLeft, HelpCircle } from 'lucide-react';

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: any; // O objeto da leitura selecionada
}

const ReadingModal: React.FC<ReadingModalProps> = ({ isOpen, onClose, reading }) => {
  if (!isOpen || !reading) return null;

  const isTarot = reading.type === 'tarot';
  const date = new Date(reading.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop Escuro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        />

        {/* Janela do Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Cabeçalho */}
          <div className="p-6 border-b border-white/10 bg-slate-950/50 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  isTarot ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'
                }`}>
                  {isTarot ? 'Baralho Cigano' : 'Interpretação de Sonho'}
                </span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Calendar size={12} /> {date}
                </span>
              </div>
              <h3 className="text-xl font-serif text-white">
                {isTarot ? "Detalhes da Leitura" : "Detalhes do Sonho"}
              </h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X size={24} />
            </button>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* 1. A Pergunta ou O Sonho */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 className="text-sm uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                {isTarot ? <HelpCircle size={14} /> : <AlignLeft size={14} />}
                {isTarot ? "Sua Pergunta" : "Seu Relato"}
              </h4>
              <p className="text-slate-200 italic">
                "{isTarot ? reading.input_data?.question : reading.input_data?.dreamText}"
              </p>
            </div>

            {/* 2. O Resultado (Lógica Diferente para Tarot e Sonho) */}
            <div className="space-y-4">
              <h4 className="text-sm uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                {isTarot ? <Sparkles size={14} /> : <Moon size={14} />}
                Resposta do Oráculo
              </h4>

              {isTarot ? (
                // --- LAYOUT TAROT ---
                <div className="space-y-6 text-slate-300 leading-relaxed">
                  {reading.ai_response?.intro && (
                    <p className="bg-purple-900/20 p-4 rounded-lg border-l-2 border-purple-500">
                      {reading.ai_response.intro}
                    </p>
                  )}
                  
                  {/* Timeline */}
                  {reading.ai_response?.timeline && (
                    <div className="grid gap-4">
                      <div className="bg-slate-950 p-4 rounded-lg">
                        <strong className="text-purple-300 block mb-1">Passado / Base</strong>
                        {reading.ai_response.timeline.past}
                      </div>
                      <div className="bg-slate-950 p-4 rounded-lg border border-purple-500/30">
                        <strong className="text-gold block mb-1">Presente / Foco</strong>
                        {reading.ai_response.timeline.present}
                      </div>
                      <div className="bg-slate-950 p-4 rounded-lg">
                        <strong className="text-purple-300 block mb-1">Futuro / Tendência</strong>
                        {reading.ai_response.timeline.future}
                      </div>
                    </div>
                  )}

                  {/* Resumo e Conselho */}
                  <div className="mt-4">
                    <h5 className="text-white font-bold mb-2">Resumo</h5>
                    <p className="mb-4">{reading.ai_response?.summary}</p>
                    
                    <div className="bg-gold/10 border border-gold/30 p-4 rounded-xl text-center">
                      <strong className="text-gold text-sm uppercase block mb-2">Conselho Final</strong>
                      <p className="italic text-white font-serif text-lg">"{reading.ai_response?.advice}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                // --- LAYOUT SONHO ---
                <div className="text-slate-300 leading-loose whitespace-pre-wrap bg-slate-950/50 p-6 rounded-xl border border-white/5">
                  {reading.ai_response?.interpretation}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReadingModal;
