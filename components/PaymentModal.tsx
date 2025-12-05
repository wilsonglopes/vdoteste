import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShoppingCart, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferenceId: string | null;
  amount: number | null; // OBRIGATÓRIO para o Brick funcionar
  planTitle?: string;
  planPrice?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  preferenceId, 
  amount,
  planTitle = "Créditos",
  planPrice = "R$ 0,00"
}) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Inicializa o Mercado Pago com sua Chave Pública
      initMercadoPago('APP_USR-7c3fa8cf-7680-42a9-bcd7-388e72fbcfe6', {
        locale: 'pt-BR'
      });
    } catch (err) {
      console.error("Erro init MP:", err);
    }
  }, []);

  // Se não tiver os dados essenciais, não renderiza nada
  if (!isOpen || !preferenceId || !amount) return null;

  const customization = {
    paymentMethods: {
      ticket: "all",
      bankTransfer: "all", // Pix
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
    visual: {
      style: {
        theme: 'dark', // Tema escuro para combinar com o site
      },
      hidePaymentButton: false
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        {/* Fundo Escuro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Janela do Pagamento */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#1a1b26] rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[90vh]"
        >
          {/* Cabeçalho */}
          <div className="flex flex-col p-6 border-b border-white/10 bg-[#16161e] shrink-0 relative">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>

            <div className="flex items-start gap-4 pr-8">
              <div className="bg-purple-600/20 p-3 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-serif text-xl mb-1">Finalizar Pagamento</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-300">{planTitle}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-gold font-bold">{planPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Área do Brick */}
          <div className="p-4 overflow-y-auto custom-scrollbar bg-[#1a1b26] flex-1 relative min-h-[300px]">
             
             {/* Loading State */}
             {!ready && !error && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-0 bg-[#1a1b26]">
                 <Loader2 className="w-8 h-8 animate-spin mb-3 text-purple-500" />
                 <p className="text-sm">Carregando ambiente seguro...</p>
               </div>
             )}

             {/* Mensagem de Erro */}
             {error && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 z-10 bg-[#1a1b26] p-6 text-center">
                 <p className="mb-4">{error}</p>
                 <button onClick={onClose} className="text-sm underline text-slate-500">Fechar</button>
               </div>
             )}

             {/* Componente Oficial */}
             <div className={ready ? "opacity-100" : "opacity-0"}>
               <Payment
                 initialization={{ 
                    preferenceId: preferenceId,
                    amount: amount // <--- AQUI ESTÁ A CORREÇÃO CRUCIAL
                 }}
                 customization={customization}
                 onReady={() => setReady(true)}
                 onError={(err) => {
                   console.error('Erro no Brick:', err);
                   setError("Não foi possível carregar o pagamento. Se você usa bloqueador de anúncios, tente desativá-lo.");
                   setReady(true);
                 }}
                 onSubmit={async (param) => {
                   console.log('Pagamento processado', param);
                   // O próprio Brick pode redirecionar ou você pode fechar o modal aqui
                 }}
               />
             </div>
             
             {ready && !error && (
               <div className="mt-6 text-center flex items-center justify-center gap-2 text-[10px] text-slate-500">
                 <ShieldCheck size={12} />
                 <span>Ambiente criptografado pelo Mercado Pago</span>
               </div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
