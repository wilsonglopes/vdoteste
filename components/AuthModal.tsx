import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    birth_date: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              birth_date: formData.birth_date // Sending as string YYYY-MM-DD
            }
          }
        });
        if (error) throw error;
        setMessage("Cadastro realizado! Verifique seu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        onClose(); // Close modal on success
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-white mb-2">
              {isSignUp ? "Inicie sua Jornada" : "Bem-vindo de volta"}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp 
                ? "Cadastre-se para acessar os mistérios." 
                : "Entre para consultar o oráculo."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-white/5 rounded-lg mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setIsSignUp(false)}
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isSignUp ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setIsSignUp(true)}
            >
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded bg-green-500/10 border border-green-500/20 text-green-200 text-xs">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-4 animate-fade-in">
                <div className="group">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-purple-400 transition-colors">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    placeholder="Seu nome místico"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="group">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-purple-400 transition-colors">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                    value={formData.birth_date}
                    onChange={e => setFormData({...formData, birth_date: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-purple-400 transition-colors">Email</label>
              <input
                type="email"
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                placeholder="voce@exemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="group">
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-purple-400 transition-colors">Senha</label>
              <input
                type="password"
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Criar Conta" : "Entrar")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;