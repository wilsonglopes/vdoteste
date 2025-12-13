import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Moon, ArrowRight, Star } from 'lucide-react';

interface HomeProps {
  user?: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    // AQUI ESTÁ A MUDANÇA: Fundo padronizado com o gradiente lilás/roxo
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans selection:bg-purple-500 selection:text-white pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        
        {/* (Removi as div de blur manuais para ficar limpo igual a tela de Tarot) */}

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Star size={12} className="text-yellow-400" />
            <span className="text-xs font-medium tracking-wider uppercase text-slate-300">Autoconhecimento & Espiritualidade</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Descubra o <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Oculto</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Conecte-se com sua sabedoria interior. Consulte as cartas sagradas ou revele as mensagens escondidas em seus sonhos.
          </p>

          {/* Cards de Navegação */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* CARD 1: BARALHO CIGANO */}
            <div className="group relative bg-[#0f0f12]/60 border border-white/10 hover:border-purple-500/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center text-center backdrop-blur-sm">
              <div className="mb-6 p-4 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Baralho Cigano</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Tiragens especializadas para Amor, Trabalho e Futuro. Receba orientação clara para o seu momento.
              </p>
              
              <button 
                onClick={() => navigate('/nova-leitura')} 
                className="mt-auto px-8 py-3 bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 rounded-full text-white font-medium transition-all flex items-center gap-2 group-hover:gap-3"
              >
                Consultar Cartas <ArrowRight size={16} />
              </button>
            </div>

            {/* CARD 2: SONHOS */}
            <div className="group relative bg-[#0f0f12]/60 border border-white/10 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col items-center text-center backdrop-blur-sm">
              <div className="mb-6 p-4 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Moon size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Interpretação de Sonhos</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Desvende os símbolos do seu inconsciente. Escreva seu sonho e receba uma análise profunda.
              </p>
              <button 
                onClick={() => navigate('/dreams')} 
                className="mt-auto px-8 py-3 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-full text-white font-medium transition-all flex items-center gap-2 group-hover:gap-3"
              >
                Interpretar Sonho <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </section>

      <footer className="text-center text-slate-600 text-xs py-8">
        <p>&copy; 2025 Vozes do Oráculo. Conexão estabelecida.</p>
      </footer>
    </div>
  );
};

export default Home;
