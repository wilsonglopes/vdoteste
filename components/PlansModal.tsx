import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, Gem, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { loadMercadoPago } from "@mercadopago/sdk-js";

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
}

const PlansModal: React.FC<PlansModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    loadMercadoPago();
  }, []);

  if (!isOpen) return null;

  const handleBuy = async (plan: any) => {
    setLoading(plan.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Faça login para continuar.");
        setLoading(null);
        return;
      }

      const response = await fetch('/.netlify/functions/create-payment-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Pacote ${plan.title}`,
          price: plan.rawPrice,
          quantity: 1,
          userId: user.id,
          email: user.email 
        })
      });

      const data = await response.json();
      
      if (data.preferenceId) {
        const mp = new window.MercadoPago('APP_USR-b1f663d0-5d18-4458-b345-e7889fcdaaa7', {
          locale: 'pt-BR'
        });

        mp.checkout({
          preference: {
            id: data.preferenceId
          },
          autoOpen: true,
        });

        setLoading(null);
      } else {
        alert('Erro ao iniciar pagamento.');
        setLoading(null);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
      setLoading(null);
    }
  };

  // --- AQUI ESTÃO OS NOVOS VALORES ---
  const plans = [
    {
      id: 'basico',
      title: 'O Curioso',
      price: 'R$ 19,90',
      rawPrice: 19.90,
      credits: 5, // Alterado para 5
      features: ['5 Consultas (R$ 3,98 cada)', 'Baralho Cigano ou Sonhos', 'Histórico salvo', 'Sem validade'],
      icon: <Star className="w-6 h-6 text-blue-400" />,
      color: 'from-blue-900 to-slate-900',
      border: 'border-blue-500/30',
      button: 'Comprar 5 Créditos'
    },
    {
      id: 'popular',
      title: 'O Buscador',
      price: 'R$ 39,90',
      rawPrice: 39.90,
      credits: 12, // Alterado para 12
      features: ['12 Consultas (R$ 3,32 cada)', 'Economize 15%', 'Histórico salvo', 'Sem validade'],
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      color: 'from-purple-900 to-slate-900',
      border: 'border-yellow-500/50',
      highlight: true,
      button: 'Comprar 12 Créditos'
    },
    {
      id: 'pro',
      title: 'O Mestre',
      price: 'R$ 69,90',
      rawPrice: 69.90,
      credits: 24, // Alterado para 24
      features: ['24 Consultas (R$ 2,91 cada)', 'Melhor oferta', 'Economia de 30%', 'Ideal para uso frequente'],
      icon: <Gem className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-900 to-slate-900',
      border: 'border-pink-500/30',
      button: 'Comprar 24 Créditos'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 md:p-8 text-center bg-gradient-to-b from-purple-900/20 to-transparent shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Adquira Energia</h2>
            <p className="text-slate-400 text-sm">Escolha um pacote de créditos.</p>
          </div>

          <div className="p-6 md:p-8 pt-0 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative flex flex-col p-6 rounded-2xl border ${plan.border} bg-gradient-to-b ${plan.color} hover:scale-[1.02] transition-transform duration-300 shadow-xl`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-purple-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-white/20 z-10 whitespace-nowrap">
                      Mais Vendido
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className="p-2 bg-white/10 rounded-lg">{plan.icon}</div>
                    <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <div className="text-slate-400 text-xs mt-1 font-bold">{plan.credits} Créditos</div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleBuy(plan)}
                    disabled={!!loading}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg ${
                      plan.highlight 
                        ? 'bg-purple-500 text-white hover:bg-yellow-400 hover:text-purple-900 border border-purple-400' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Abrindo...</span>
                      </div>
                    ) : (
                      plan.button
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-center text-slate-500 text-[10px] mt-8 flex items-center justify-center gap-2">
               Pagamento seguro via Mercado Pago
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PlansModal;
