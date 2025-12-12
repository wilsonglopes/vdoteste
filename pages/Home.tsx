import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Using react-router-dom HashRouter implicitly via App structure
import { Sparkles, CloudMoon, ScrollText } from 'lucide-react';
import AuthModal from '../components/AuthModal';

interface HomeProps {
  user: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigation = (path: string) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-12">
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-purple-300/80 uppercase tracking-[0.3em] text-sm font-medium">
            Autoconhecimento & Espiritualidade
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Descubra o Oculto
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            Conecte-se com sua sabedoria interior. Consulte as cartas sagradas ou revele as mensagens escondidas em seus sonhos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Tarot Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
            <div className="relative h-full flex flex-col items-center text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ScrollText className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Baralho Cigano</h3>
              <p className="text-slate-400 text-sm mb-8 flex-grow">
                Tiragem de 9 cartas: Passado, Presente e Futuro. Receba orientação clara para o seu momento atual.
              </p>
              <button 
                onClick={() => handleNavigation('/tarot')}
                className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Consultar Cartas
              </button>
            </div>
          </div>

          {/* Dreams Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
            <div className="relative h-full flex flex-col items-center text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CloudMoon className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Interpretação de Sonhos</h3>
              <p className="text-slate-400 text-sm mb-8 flex-grow">
                Desvende os símbolos do seu inconsciente. Escreva seu sonho e receba uma análise profunda.
              </p>
              <button 
                onClick={() => handleNavigation('/dreams')}
                className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Interpretar Sonho
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Home;
