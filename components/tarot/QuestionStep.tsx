import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface QuestionStepProps {
  question: string;
  setQuestion: (q: string) => void;
  onNext: () => void;
  onBack: () => void;
  // NOVAS PROPRIEDADES OPCIONAIS:
  customTitle?: string;
  customPlaceholder?: string;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, 
  setQuestion, 
  onNext, 
  onBack,
  customTitle,       // Recebe o título personalizado
  customPlaceholder  // Recebe o texto de exemplo
}) => {
  
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] px-4">
      
      {/* Ícone Animado */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-6 text-purple-400"
      >
        <Sparkles size={48} />
      </motion.div>

      {/* Título Personalizável */}
      <h2 className="text-3xl md:text-4xl font-serif text-white mb-8 text-center drop-shadow-lg">
        {customTitle || "O que deseja saber?"} {/* Usa o customizado ou o padrão */}
      </h2>

      {/* Área de Texto */}
      <div className="w-full max-w-lg relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={customPlaceholder || "Concentre-se e digite sua pergunta aqui..."}
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none shadow-xl backdrop-blur-sm"
        />
        
        {/* Contador de caracteres (opcional/decorativo) */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
          {question.length} caracteres
        </div>
      </div>

      {/* Botão de Ação */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!question.trim()}
        className="mt-8 px-10 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-bold text-lg shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2"
      >
        Consultar Cartas <ArrowRight size={20} />
      </motion.button>

    </div>
  );
};

export default QuestionStep;
