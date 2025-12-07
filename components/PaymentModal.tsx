import React, { useEffect, useState } from 'react';
import { Payment } from '@mercadopago/sdk-react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferenceId: string | null;
  amount: number | null;
  planTitle: string;
  planPrice: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  preferenceId, 
  amount, 
  planTitle, 
  planPrice 
}) => {
  
  // Estado para garantir que temos o e-mail ANTES de mostrar o Brick
  const [isReady, setIsReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // 1. Inicializa com sua chave nova
    initMercadoPago('APP_USR-b1f663d0-5d18-4458-b345-e7889fcdaaa7', {
      locale: 'pt-BR'
    });

    // 2. Busca o usuário e só libera o componente depois
    const prepare = async () => {
      if (isOpen) {
        setIsReady(false); // Trava a tela
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email) {
          console.log("Email encontrado:", user.email);
          setUserEmail(user.email);
          setIsReady(true); // Libera o componente
        } else {
          // Fallback se não achar o e-mail (evita tela branca)
          setUserEmail('cliente@vozesdooraculo.com');
          setIsReady(true);
        }
      }
    };
    prepare();
  }, [isOpen]);

  if (!isOpen || !preferenceId) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#18181b] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#27272a]">
          <div>
            <h3 className="text-lg font-bold text-white">Finalizar Pagamento</h3>
            <p className="text-sm text-gray-400">{planTitle} • {planPrice}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 max-h-[80vh] overflow-y-auto min-h-[300px] flex flex-col justify-center">
          
          {!isReady ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-purple-400">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-sm">Preparando ambiente seguro...</p>
            </div>
          ) : (
            <Payment
              initialization={{
                amount: amount || 0,
                preferenceId: preferenceId,
                // AQUI ESTÁ O SEGREDO: O e-mail já está preenchido
                payer: {
                  email: userEmail, 
                },
              }}
              customization={{
                paymentMethods: {
                  ticket: "all",
                  bankTransfer: "all",
                  creditCard: "all",
                  debitCard: "all",
                  mercadoPago: "all",
                },
                visual: {
                  style: {
                    theme: 'dark',
                  },
                  hidePaymentButton: false, 
                },
              }}
              onSubmit={async ({ formData }) => {
                console.log("Pagamento enviado", formData);
              }}
              onReady={() => console.log("Brick Carregado")}
              onError={(error) => console.error("Erro no Brick:", error)}
            />
          )}
        </div>
        
        <div className="p-3 text-center text-[10px] text-gray-500 border-t border-white/5 bg-[#18181b]">
          Ambiente Seguro Mercado Pago
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
