import React from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, ArrowRight } from 'lucide-react'; // Ícone específico

interface QuestionStepProps {
  question: string;
  setQuestion: (q: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestionStepMensal: React.FC<QuestionStepProps> = ({ question, setQuestion, onNext, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] px-4">
      
      {/* Ícone Específico para MENSAL */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 text-blue-400">
        <CalendarRange size={64} />
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 text-center drop-shadow-lg">
        Previsão Mensal
      </h2>
      <p className="text-slate-400 text-sm mb-8 text-center max-w-md">
        Visualize os próximos 30 dias. Qual área da sua vida precisa de mais clareza?
      </p>

      <div className="w-full max-w-lg relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Como será minha vida financeira este mês? O que esperar no amor?"
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none shadow-xl backdrop-blur-sm"
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">{question.length} caracteres</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!question.trim()}
        className="mt-8 px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-bold text-lg shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
      >
        Ver Previsão <ArrowRight size={20} />
      </motion.button>
    </div>
  );
};

export default QuestionStepMensal;
