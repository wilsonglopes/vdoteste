import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Dreams from './pages/Dreams';
import SelectSpread from './pages/SelectSpread';
import { supabase } from './services/supabase';

// --- PÁGINAS DE JOGOS (CADA MÉTODO TEM SEU ARQUIVO) ---
import Tarot from './pages/Tarot'; // Templo de Afrodite (9 Cartas) - Padrão
import TarotEx from './pages/TarotEx'; // Tirada do Ex (5 Cartas)
// Obs: Crie os arquivos abaixo (copiando do TarotEx e ajustando) para parar o erro de importação
import TarotValePena from './pages/TarotValePena';
import TarotMensal from './pages/TarotMensal';
import TarotFerradura from './pages/TarotFerradura';
import TarotFofoca from './pages/TarotFofoca';
import TarotFicarPartir from './pages/TarotFicarPartir';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        Carregando energias...
      </div>
    );
  }

  // Wrapper para rotas que EXIGEM login
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        
        {/* 1. ROTA DA LANDING PAGE (SEM LAYOUT/MENU) */}
        <Route path="/landingpage" element={<LandingPage />} />

        {/* 2. RESTO DO APP (COM LAYOUT/MENU) */}
        <Route path="*" element={
          <Layout user={session?.user}>
            <Routes>
              {/* Home e Seleção */}
              <Route path="/" element={<Home user={session?.user} />} />
              <Route path="/nova-leitura" element={<SelectSpread />} />

              {/* --- ROTAS DOS JOGOS DE TAROT (Separados por Arquivo) --- */}
              <Route path="/tarot" element={<Tarot />} /> {/* Templo de Afrodite */}
              <Route path="/tarot-ex" element={<TarotEx />} />
              <Route path="/tarot-vale-pena" element={<TarotValePena />} />
              <Route path="/tarot-mensal" element={<TarotMensal />} />
              <Route path="/tarot-ferradura" element={<TarotFerradura />} />
              <Route path="/tarot-fofoca" element={<TarotFofoca />} />
              <Route path="/tarot-ficar-partir" element={<TarotFicarPartir />} />

              {/* Outros Serviços */}
              <Route path="/dreams" element={<Dreams />} />
              <Route path="/escolher" element={<Home user={session?.user} />} />

              {/* Áreas Protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              <Route path="/admin" element={<AdminDashboard />} /> 
            </Routes>
          </Layout>
        } />

      </Routes>
    </Router>
  );
};

export default App;
