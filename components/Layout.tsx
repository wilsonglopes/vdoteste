// components/Layout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { Moon, Star, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import InstallButton from './InstallButton'; 

interface LayoutProps {
  children: ReactNode;
  user?: any;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkRole();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col font-sans text-slate-200 selection:bg-purple-500/30">
      {/* Mystical Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black"></div>
      <div className="fixed inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 flex justify-between items-center border-b border-white/5 bg-slate-950/30 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <Moon className="w-8 h-8 text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.5)] group-hover:text-white transition-colors" />
            <Star className="w-3 h-3 text-yellow-100 absolute -top-1 -right-1 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="font-serif text-lg md:text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-purple-200">
              Vozes do Oráculo
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Botão de Instalar App (Aparece para todos) */}
          <InstallButton />

          {user && (
            <>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-red-300 hover:text-white transition-colors border border-red-500/30 hover:border-red-400/50 bg-red-500/10 hover:bg-red-500/20 px-4 py-1.5 rounded-full"
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </Link>
              )}

              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-purple-300 hover:text-white transition-colors border border-purple-500/30 hover:border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-1.5 rounded-full"
              >
                <User size={14} />
                <span className="hidden md:inline">Grimório</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="text-xs tracking-widest uppercase text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/10 px-2 py-1 rounded-full"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto px-4 pb-6 pt-0 flex-grow">
        {children}
      </main>

      {/* Footer Oficial */}
      <footer className="relative z-10 bg-black py-8 border-t border-white/10 text-center md:text-left mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Vozes do Oráculo. Todos os direitos reservados.
          </div>

          <div className="flex gap-6 text-sm">
            <a href="/#/privacidade" className="text-slate-400 hover:text-purple-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="/#/termos" className="text-slate-400 hover:text-purple-400 transition-colors">
              Termos de Uso
            </a>
          </div>
          
        </div>
        
        {/* Disclaimer Obrigatório Pequeno no Rodapé */}
        <div className="max-w-4xl mx-auto mt-6 text-center px-4">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">
            Este site é para fins de entretenimento. Não substituímos aconselhamento profissional.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
