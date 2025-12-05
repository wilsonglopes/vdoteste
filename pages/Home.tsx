import React, { useEffect, useState } from 'react';
import { Sparkles, Moon, CloudMoon } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import AuthModal from '../components/AuthModal';

interface HomeProps {
  user?: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [hasDailyCard, setHasDailyCard] = useState(false); 

  useEffect(() => {
    const checkDaily = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      
      const { data } = await supabase
        .from('readings')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'daily')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .maybeSingle();
        
      if (data) setHasDailyCard(true);
    };
    checkDaily();
  }, [user]);

  const handleNavigation = (path: string) => {
    if (!user) {
      setShowAuth(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12 animate-fade-in-up">
      
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onSuccess={() => { setShowAuth(false); window.location.reload(); }} 
      />

      <div className="text-center mb-16">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Self-Knowledge & Spirituality</p>
        <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-tight">
          Discover the Occult
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Connect with your inner wisdom. Consult the sacred cards or reveal the messages hidden in your dreams.
        </p>
      </div>

      {/* --- DAILY CARD BONUS --- */}
      {user && !hasDailyCard && (
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full max-w-md mb-12 bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-500/30 p-4 rounded-xl flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer group shadow-lg shadow-yellow-900/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 group-hover:animate-pulse">
              <Sparkles size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs text-yellow-200 uppercase font-bold tracking-wider">Daily Gift</p>
              <p className="text-white font-serif text-lg">Your Card of the Day is waiting...</p>
            </div>
          </div>
          <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            Reveal
          </span>
        </button>
      )}

      <div className="grid md:grid-cols-2 gap-6 w-full">
        {/* Tarot Card */}
        <div className="group relative bg-slate-900/60 border border-white/10 p-8 rounded-3xl hover:bg-slate-800/60 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-purple-500/20">
              <Sparkles className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Gypsy Tarot</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              9-card spread: Past, Present, and Future. Receive clear guidance for your current moment.
            </p>
            <button 
              onClick={() => handleNavigation('/tarot')}
              className="w-full py-3 rounded-xl border border-purple-500/30 text-purple-200 hover:bg-purple-500 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide"
            >
              Consult Cards
            </button>
          </div>
        </div>

        {/* Dream Card */}
        <div className="group relative bg-slate-900/60 border border-white/10 p-8 rounded-3xl hover:bg-slate-800/60 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
              <CloudMoon className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Dream Interpretation</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Unveil the symbols of your unconscious mind. Write your dream and receive a profound analysis.
            </p>
            <button 
              onClick={() => handleNavigation('/dreams')}
              className="w-full py-3 rounded-xl border border-blue-500/30 text-blue-200 hover:bg-blue-500 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide"
            >
              Interpret Dream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
