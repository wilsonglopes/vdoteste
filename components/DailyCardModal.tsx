import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CARD_BACK_URL, DECK_SIZE, CARD_NAMES } from '../constants';
import { getTarotReading, ReadingResult } from '../services/geminiService';
import { saveReading } from '../services/historyService';

interface DailyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

const DailyCardModal: React.FC<DailyCardModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'shuffling' | 'revealing' | 'result'>('intro');
  const [card, setCard] = useState<{ id: number; name: string; imageUrl: string } | null>(null);
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Reseta ao abrir
  useEffect(() => {
    if (isOpen && step !== 'result') {
      setStep('intro');
      setCard(null);
      setReading(null);
    }
  }, [isOpen]);

  const drawCard = async () => {
    setStep('shuffling');
    
    // Simula embaralhamento
    setTimeout(async () => {
      // Sorteia carta
      const randomId = Math.floor(Math.random() * DECK_SIZE) + 1;
      const selectedCard = {
        id: randomId,
        name: (CARD_NAMES as any)[randomId] || `Carta ${randomId}`,
        imageUrl: `https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/${randomId}.jpg`
      };
      
      setCard(selectedCard);
      setStep('revealing');
      setLoadingAI(true);

      try {
        // Chama a IA (Sem consumir créditos, pois é brinde)
        const result = await getTarotReading(
          `[MÉTODO: CARTA DO DIA] Qual a energia para o meu dia hoje?`,
          [selectedCard.id],
          user?.user_metadata?.name || "Viajante"
        );
        
        setReading(result);
        
        // Salva no histórico
        if (user) {
          await saveReading(user.id, 'carta_do_dia', { question: "Carta do Dia", cardIds: [selectedCard.id] }, result);
        }
        
        setStep('result');
        onSuccess(); // Avisa o dashboard para atualizar
      } catch (error) {
        console.error("Erro carta do dia:", error);
        setStep('intro'); // Volta em caso de erro
        alert("Erro ao conectar com o oráculo. Tente novamente.");
      } finally {
        setLoadingAI(false);
      }
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
          <X size={24} />
        </button>

        <div className="p-6 flex flex-col items-center justify-center flex-grow overflow-y-auto custom-scrollbar">
          
          {step === 'intro' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={40} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-serif text-white">Carta da Sorte</h2>
              <p className="text-slate-400">
                Conecte-se com sua energia. O universo tem uma mensagem única para o seu dia de hoje.
              </p>
              <button 
                onClick={drawCard}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                Tirar Minha Carta
              </button>
            </div>
          )}

          {(step === 'shuffling' || (step === 'revealing' && loadingAI)) && (
            <div className="flex flex-col items-center justify-center py-10">
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-32 h-48 rounded-xl border-2 border-amber-500/50 bg-indigo-950 overflow-hidden shadow-2xl mb-6"
              >
                <img src={CARD_BACK_URL} className="w-full h-full object-cover" alt="Verso" />
              </motion.div>
              <p className="text-amber-200 animate-pulse font-serif text-lg">
                {step === 'shuffling' ? "Embaralhando energias..." : "Interpretando..."}
              </p>
            </div>
          )}

          {step === 'result' && reading && card && (
            <div className="flex flex-col items-center animate-fade-in text-center pb-4">
              <h3 className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-2">Sua Energia Hoje</h3>
              <div className="w-40 h-60 rounded-xl border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] overflow-hidden mb-6 relative group">
                 <img src={card.imageUrl} className="w-full h-full object-cover" alt={card.name} />
                 <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 text-white font-bold text-sm">
                    {card.name}
                 </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 text-left w-full">
                <p className="text-slate-200 text-sm leading-relaxed">{reading.summary}</p>
              </div>
              
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 w-full">
                 <p className="text-amber-200 italic text-sm">"{reading.advice}"</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DailyCardModal;
