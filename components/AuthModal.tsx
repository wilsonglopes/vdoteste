// components/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Loader2, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Previne scroll no fundo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        if (!whatsapp || !name || !birthDate) {
           throw new Error("Preencha todos os dados.");
        }
        
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, birth_date: birthDate, whatsapp }
          }
        });
        
        if (error) throw error;

        if (data.user) {
          await supabase.auth.signInWithPassword({ email, password });
          setSuccessMessage("Conta criada com sucesso!");
        }

      } else {
        // --- LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // SUCESSO NO LOGIN:
        // 1. Fecha o modal imediatamente
        if (onClose) onClose();
        
        // 2. Chama o sucesso (atualiza estado pai)
        if (onSuccess) onSuccess();

        // 3. Recarrega a página para garantir que o estado do usuário atualize em todo o app (opcional mas recomendado para evitar bugs de cache)
        // window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = () => {
    if (onSuccess) onSuccess();
    if (onClose) onClose();
    window.location.hash = '/'; // Força ir para Home
    
    setTimeout(() => {
        setSuccessMessage(null);
        setIsSignUp(false);
    }, 300);
  };

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md" 
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-[#0f172a] border border-purple-500/30 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] z-[100000]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-50 p-2 bg-black/20 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col h-full">
          
          {successMessage ? (
            <div className="flex flex-col items-center justify-center py-6 text-center h-full">
              <div className="bg-green-500/20 p-4 rounded-full mb-4 animate-bounce-slow">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              
              <h3 className="text-2xl text-white font-serif mb-1">Bem-vindo(a)!</h3>
              <p className="text-slate-400 mb-6 text-sm">Seu cadastro foi realizado.</p>
              
              <div className="w-full bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-4 mb-8 flex items-center gap-4">
                <div className="bg-purple-500/20 p-2.5 rounded-full shrink-0">
                   <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-purple-300 uppercase font-bold tracking-widest mb-0.5">Presente do Oráculo</p>
                  <p className="text-white text-sm leading-tight">
                    Você ganhou <span className="text-yellow-400 font-bold text-lg">1 Crédito Grátis</span> para usar agora!
                  </p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleEnter}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer z-50"
              >
                <span>Acessar Agora</span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl text-white mb-2">
                  {isSignUp ? "Inicie sua Jornada" : "Bem-vindo de volta"}
                </h2>
                <p className="text-slate-400 text-sm px-2">
                  {isSignUp 
                    ? "Cadastre-se para acessar os mistérios. Dados corretos são essenciais." 
                    : "Entre para consultar o oráculo."}
                </p>
              </div>

              <div className="flex p-1 bg-white/5 rounded-lg mb-6">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setIsSignUp(false)}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isSignUp ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setIsSignUp(true)}
                >
                  Cadastrar
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-200 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                        placeholder="Seu nome místico"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 [color-scheme:dark]"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="group">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Senha</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Criar Conta" : "Entrar")}
                </button>
              </form>
            </div>
          )}
          
          {!successMessage && (
            <div className="w-full text-center mt-8 pt-4 border-t border-white/5 shrink-0 z-10">
               <p className="text-[10px] text-slate-600">
                 © 2025 Vozes do Oráculo. Conexão estabelecida.
               </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default AuthModal;
