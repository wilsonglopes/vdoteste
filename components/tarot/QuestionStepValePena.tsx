import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react'; // Ícone de dúvida

interface QuestionStepProps {
  question: string;
  setQuestion: (q: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestionStepValePena: React.FC<QuestionStepProps> = ({ question, setQuestion, onNext, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] px-4">
      
      {/* Ícone Específico */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 text-yellow-400">
        <HelpCircle size={64} />
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 text-center drop-shadow-lg">
        Ele(a) Vale a Pena?
      </h2>
      <p className="text-slate-400 text-sm mb-8 text-center max-w-md">
        Uma análise profunda sobre a viabilidade da relação e o que o futuro reserva.
      </p>

      <div className="w-full max-w-lg relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Devo investir nessa relação? O que ele sente de verdade? Vale a pena insistir?"
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all resize-none shadow-xl backdrop-blur-sm"
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">{question.length} caracteres</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!question.trim()}
        className="mt-8 px-10 py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-bold text-lg shadow-lg shadow-yellow-900/20 transition-all flex items-center gap-2"
      >
        Consultar Cartas <ArrowRight size={20} />
      </motion.button>

      {/* Botão Voltar */}
      <div className="w-full max-w-lg flex justify-end mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

    </div>
  );
};

export default QuestionStepValePena;
