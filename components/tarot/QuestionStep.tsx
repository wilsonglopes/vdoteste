import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuestionStepProps {
  question: string;
  setQuestion: (q: string) => void;
  onNext: () => void;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ question, setQuestion, onNext }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[10vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto animate-fade-in-up px-4">
      <Sparkles className="w-16 h-16 text-purple-300 mb-6 animate-pulse" />
      <h2 className="font-playfair text-4xl md:text-6xl text-white mb-4">O que deseja saber?</h2>
      
      <div className="w-full relative mb-8 max-w-2xl">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Concentre-se e digite sua pergunta aqui..."
          className="w-full bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 text-white focus:ring-2 focus:ring-purple-500 outline-none text-xl min-h-[150px] backdrop-blur-md shadow-inner"
        />
      </div>
      
      <button
        disabled={!question.trim()}
        onClick={onNext}
        className="bg-purple-600 text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-yellow-400 hover:text-purple-900 transition-all disabled:opacity-50 shadow-lg hover:scale-105 transform duration-200"
      >
        Consultar Cartas
      </button>

      {/* Botão Voltar Estilizado */}
      <div className="w-full flex justify-end mt-12 max-w-2xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium px-6 py-2 rounded-full shadow-sm backdrop-blur-sm"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionStep;
