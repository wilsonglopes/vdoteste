import React, { ReactNode } from 'react';
import { Moon, Star } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming HashRouter usage in App
import { supabase } from '../services/supabase';

interface LayoutProps {
  children: ReactNode;
  user?: any;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col font-sans text-slate-200 selection:bg-purple-500/30">
      {/* Mystical Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black"></div>
      
      {/* Stars Overlay (Static CSS simulation) */}
      <div className="fixed inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 flex justify-between items-center border-b border-white/5 bg-slate-950/30 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <Moon className="w-8 h-8 text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.5)] group-hover:text-white transition-colors" />
            <Star className="w-3 h-3 text-yellow-100 absolute -top-1 -right-1 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-purple-200">
              Vozes do Oráculo
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <button 
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/10 px-3 py-1 rounded-full"
            >
              Sair
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-slate-600 text-xs">
        <p>© {new Date().getFullYear()} Vozes do Oráculo. Conexão estabelecida.</p>
      </footer>
    </div>
  );
};

export default Layout;