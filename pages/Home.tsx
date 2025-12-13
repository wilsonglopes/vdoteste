import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CloudMoon } from 'lucide-react';

interface HomeProps {
  user?: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    // Mantivemos o fundo geral do app para não quebrar a padronização, 
    // mas o conteúdo interno agora segue EXATAMENTE o design que você mandou.
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans pb-20 flex flex-col">
      
      <div className="w-full flex flex-col items-center justify-center flex-grow min-h-[80vh] gap-12 px-4">
        
        {/* Cabeçalho (Tipografia idêntica ao exemplo) */}
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

        {/* Grid de Cards (Com o efeito Glow/Neon) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* CARD 1: TAROT (Visual Roxo/Rosa) */}
          <div className="group relative">
            {/* O brilho atrás do card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
            
            {/* O conteúdo do card */}
            <div className="relative h-full flex flex-col items-center text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Baralho Cigano</h3>
              <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">
                Tiragem de cartas especializada. Receba orientação clara para o seu momento atual.
              </p>
              <button 
                onClick={() => navigate('/nova-leitura')}
                className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 uppercase text-xs tracking-wider font-medium"
              >
                Consultar Cartas
              </button>
            </div>
          </div>

          {/* CARD 2: SONHOS (Visual Azul/Índigo) */}
          <div className="group relative">
            {/* O brilho atrás do card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
            
            {/* O conteúdo do card */}
            <div className="relative h-full flex flex-col items-center text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CloudMoon className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">Interpretação de Sonhos</h3>
              <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">
                Desvende os símbolos do seu inconsciente. Escreva seu sonho e receba uma análise profunda.
              </p>
              <button 
                onClick={() => navigate('/dreams')}
                className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 uppercase text-xs tracking-wider font-medium"
              >
                Interpretar Sonho
              </button>
            </div>
          </div>

        </div>
      </div>

      <footer className="text-center text-slate-500 text-xs py-6">
        <p>&copy; 2025 Vozes do Oráculo. Conexão estabelecida.</p>
      </footer>
    </div>
  );
};

export default Home;
