import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { User, Star, History, Calendar, Phone, Mail, Sparkles, LogOut, Plus, ChevronRight, Edit2, PlayCircle } from 'lucide-react';
import PlansModal from '../components/PlansModal';
import ReadingModal from '../components/ReadingModal';
import EditProfileModal from '../components/EditProfileModal';

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
  
  const [showPlans, setShowPlans] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);

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
      year: 'numeric'
    });
  };

  // --- NAVEGAÇÃO SEGURA (DEBUG) ---
  const handleStartReading = () => {
    console.log("Clicou em Iniciar Nova Leitura -> indo para /nova-leitura");
    navigate('/nova-leitura');
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
      
      <PlansModal 
        isOpen={showPlans} 
        onClose={() => setShowPlans(false)}
        onSelectPlan={(planId) => {
          setShowPlans(false);
        }}
      />

      <ReadingModal 
        isOpen={!!selectedReading}
        onClose={() => setSelectedReading(null)}
        reading={selectedReading}
      />

      <EditProfileModal 
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={profile}
        onUpdate={fetchDashboardData} 
      />

      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-serif text-lg lg:text-xl font-bold shadow-lg border border-white/20">
                {profile?.name?.charAt(0).toUpperCase() || 'V'}
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-white leading-tight">Meu Grimório</h1>
                <p className="text-xs lg:text-sm text-purple-300 truncate max-w-[200px]">
                  {profile?.name}
                </p>
              </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-red-400 text-sm font-medium"
            title="Sair"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* --- BOTÃO DE AÇÃO PRINCIPAL (ATUALIZADO) --- */}
        <div 
             className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/50 p-6 rounded-2xl shadow-2xl relative overflow-hidden flex items-center justify-between group cursor-pointer hover:shadow-purple-500/20 transition-all"
             onClick={handleStartReading}
        >
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <div className="relative z-10">
             <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">Iniciar Nova Leitura</h2> {/* MUDOU O TEXTO */}
             <p className="text-purple-200 text-sm lg:text-base">Escolha uma tiragem e descubra seu destino agora.</p>
           </div>

           <div className="relative z-10 bg-white text-purple-900 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
             <PlayCircle size={32} />
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card de Créditos */}
          <div className="bg-slate-900/60 border border-purple-500/30 p-6 lg:p-8 rounded-2xl shadow-lg relative overflow-hidden group flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star size={80} />
            </div>
            <div>
              <h3 className="text-slate-400 text-xs lg:text-sm uppercase tracking-wider mb-2 font-bold">Saldo de Energia</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl lg:text-5xl font-bold text-gold">{profile?.credits}</span>
                <span className="text-sm lg:text-base text-slate-300">créditos</span>
              </div>
            </div>
            <button 
              onClick={() => setShowPlans(true)}
              className="w-full py-3 bg-white/10 hover:bg-gold hover:text-purple-900 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <Plus size={18} /> Adquirir Mais
            </button>
          </div>

          {/* Card de Perfil */}
          <div className="md:col-span-2 bg-slate-900/60 border border-white/10 p-6 lg:p-8 rounded-2xl shadow-lg relative group flex flex-col justify-center min-h-[200px]">
            <button 
              onClick={() => setShowEditProfile(true)}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-purple-600/20 text-slate-400 hover:text-purple-300 rounded-lg transition-all"
              title="Editar Perfil"
            >
              <Edit2 size={20} />
            </button>

            <h3 className="text-slate-400 text-xs lg:text-sm uppercase tracking-wider mb-6 flex items-center gap-2 font-bold">
              <User size={16} /> Dados do Viajante
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                <Mail className="text-purple-400 shrink-0" size={24} />
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">E-mail</p>
                  <p className="text-sm lg:text-base text-slate-200 truncate">{profile?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                  <Phone className="text-green-400 shrink-0" size={24} />
                  <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">WhatsApp</p>
                  <p className="text-sm lg:text-base text-slate-200 truncate">{profile?.whatsapp || '-'}</p>
                  </div>
              </div>

              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 md:col-span-2 lg:col-span-1">
                  <Calendar className="text-blue-400 shrink-0" size={24} />
                  <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Nascimento</p>
                  <p className="text-sm lg:text-base text-slate-200">
                      {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('pt-BR') : '-'}
                  </p>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico */}
        <div>
          <h2 className="text-xl lg:text-3xl font-serif text-white mb-6 flex items-center gap-3">
            <History className="text-purple-400" size={28} /> Histórico
          </h2>

          {readings.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-6">Seu grimório está vazio.</p>
              <button 
                onClick={handleStartReading} // <--- CORRIGIDO TAMBÉM
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-base font-bold transition-transform hover:scale-105"
              >
                Iniciar Jornada
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {readings.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedReading(item)}
                  className="bg-slate-900/80 border border-white/5 p-5 lg:p-6 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/80 transition-all group cursor-pointer relative overflow-hidden shadow-md hover:shadow-purple-900/20"
                >
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-purple-400 transition-colors">
                    <ChevronRight size={24} />
                  </div>

                  <div className="flex justify-between items-start mb-3 pr-10">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-md text-[10px] lg:text-xs font-bold uppercase tracking-wider border ${
                        item.type === 'tarot' ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' : 'bg-blue-900/30 border-blue-500/30 text-blue-300'
                      }`}>
                        {item.type === 'tarot' ? 'Tarot' : 'Sonho'}
                      </span>
                      <span className="text-xs text-slate-500">
                          {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white font-medium text-lg lg:text-xl mb-2 pr-8 truncate">
                    {item.type === 'tarot' 
                      ? item.input_data?.question 
                      : `"${item.input_data?.dreamText?.substring(0, 40)}..."`
                    }
                  </p>
                  
                  <p className="text-slate-400 text-xs lg:text-sm line-clamp-2 pr-8 leading-relaxed">
                    {item.type === 'tarot' 
                      ? item.ai_response?.summary 
                      : item.ai_response?.interpretation
                    }
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
