// pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { User, Star, History, Calendar, Phone, Mail, Sparkles, LogOut, Plus, ChevronRight } from 'lucide-react';
import PlansModal from '../components/PlansModal';
import ReadingModal from '../components/ReadingModal'; // <--- Importação Nova

interface UserProfile {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  birth_date: string;
  credits: number;
  subscription_status: string;
}

interface Reading {
  id: string;
  type: 'tarot' | 'dream';
  created_at: string;
  input_data: any;
  ai_response: any;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  
  // Modais
  const [showPlans, setShowPlans] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null); // <--- Estado para o Modal de Leitura

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const { data: historyData, error: historyError } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (historyError) throw historyError;

      setProfile({
        ...userData,
        email: user.email || ''
      });
      setReadings(historyData || []);

    } catch (error) {
      console.error("Erro ao carregar grimório:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] text-purple-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse">Abrindo o Grimório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans pb-20">
      
      {/* Modal de Planos */}
      <PlansModal 
        isOpen={showPlans} 
        onClose={() => setShowPlans(false)}
        onSelectPlan={(planId) => {
          alert(`Plano ${planId} selecionado. Integração em breve!`);
          setShowPlans(false);
        }}
      />

      {/* Modal de Detalhes da Leitura (NOVO) */}
      <ReadingModal 
        isOpen={!!selectedReading}
        onClose={() => setSelectedReading(null)}
        reading={selectedReading}
      />

      {/* Header do Dashboard */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-serif text-xl font-bold shadow-lg border border-white/20">
               {profile?.name?.charAt(0).toUpperCase() || 'V'}
             </div>
             <div>
               <h1 className="text-lg font-bold text-white leading-tight">Meu Grimório</h1>
               <p className="text-xs text-purple-300">Bem-vindo, {profile?.name?.split(' ')[0]}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-red-400"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Cards de Status */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card de Créditos */}
          <div className="bg-slate-900/60 border border-purple-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star size={80} />
            </div>
            <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Saldo de Energia</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-gold">{profile?.credits}</span>
              <span className="text-sm text-slate-300">créditos</span>
            </div>
            <button 
              onClick={() => setShowPlans(true)}
              className="w-full py-2.5 bg-white/10 hover:bg-gold hover:text-purple-900 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-transparent"
            >
              <Plus size={16} /> Adquirir Mais
            </button>
          </div>

          {/* Card de Perfil */}
          <div className="md:col-span-2 bg-slate-900/60 border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col justify-center">
            <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2 font-bold">
              <User size={16} /> Dados do Viajante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                <Mail className="text-purple-400 shrink-0" size={18} />
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-500 uppercase">E-mail</p>
                  <p className="text-sm text-slate-200 truncate">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                <Phone className="text-green-400 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">WhatsApp</p>
                  <p className="text-sm text-slate-200">{profile?.whatsapp || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                <Calendar className="text-blue-400 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Nascimento</p>
                  <p className="text-sm text-slate-200">
                    {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('pt-BR') : '--/--/----'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Histórico Interativa */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
            <History className="text-purple-400" /> Histórico de Revelações
          </h2>

          {readings.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Seu grimório ainda está em branco.</p>
              <p className="text-slate-500 text-sm mb-6">Faça sua primeira consulta para gravar seu destino.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-colors shadow-lg"
              >
                Iniciar Jornada
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {readings.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedReading(item)} // CLIQUE PARA ABRIR DETALHES
                  className="bg-slate-900/80 border border-white/5 p-6 rounded-xl hover:border-purple-500/50 hover:bg-slate-800/80 transition-all group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
                    <ChevronRight size={24} />
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        item.type === 'tarot' ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' : 'bg-blue-900/20 border-blue-500/30 text-blue-300'
                      }`}>
                        {item.type === 'tarot' ? 'Baralho Cigano' : 'Sonho'}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white font-medium text-lg mb-2 pr-8">
                    {item.type === 'tarot' 
                      ? item.input_data?.question 
                      : `Sonho: "${item.input_data?.dreamText?.substring(0, 50)}..."`
                    }
                  </p>
                  
                  <p className="text-slate-400 text-sm line-clamp-2 pr-4">
                    {item.type === 'tarot' 
                      ? item.ai_response?.summary 
                      : item.ai_response?.interpretation
                    }
                  </p>
                  
                  <p className="text-xs text-purple-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Clique para ver detalhes completos
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
