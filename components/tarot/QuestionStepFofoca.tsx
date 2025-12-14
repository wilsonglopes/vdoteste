import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionStepProps {
  question: string;
  setQuestion: (q: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestionStepFofoca: React.FC<QuestionStepProps> = ({ question, setQuestion, onNext, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] px-4">
      
      {/* Ícone Rosa para "Fofoca" */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 text-pink-500">
        <MessageCircle size={64} />
      </motion.div>

      <div className="flex items-center gap-2 mb-2">
         <h2 className="text-3xl md:text-4xl font-serif text-white text-center drop-shadow-lg">
            Fofocando sobre o Amor
         </h2>
         <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Premium</span>
      </div>
      
      <p className="text-slate-400 text-sm mb-8 text-center max-w-md">
        Descubra tudo o que ele(a) pensa, sente e esconde. Uma investigação completa de 12 cartas.
      </p>

      <div className="w-full max-w-lg relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: O que ele está escondendo de mim? O que ele fala sobre nós para os amigos? Quais são as verdadeiras intenções?"
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all resize-none shadow-xl backdrop-blur-sm"
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">{question.length} caracteres</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!question.trim()}
        className="mt-8 px-10 py-4 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-bold text-lg shadow-lg shadow-pink-900/20 transition-all flex items-center gap-2"
      >
        Consultar Cartas <ArrowRight size={20} />
      </motion.button>

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

export default QuestionStepFofoca;
