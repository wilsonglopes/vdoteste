import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import Dreams from './pages/Dreams';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import SelectSpread from './pages/SelectSpread'; // <--- 1. NOVO IMPORT
import { supabase } from './services/supabase';

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
        {/* Mantida isolada aqui para não pegar o menu */}
        <Route path="/landingpage" element={<LandingPage />} />

        {/* 2. RESTO DO APP (COM LAYOUT/MENU) */}
        <Route path="*" element={
          <Layout user={session?.user}>
            <Routes>
              {/* Rota Raiz: Carrega a HOME original */}
              <Route path="/" element={<Home user={session?.user} />} />
              
              {/* --- NOVA ROTA: SELEÇÃO DE LEITURA --- */}
              {/* Aqui o usuário escolhe o tipo de tiragem (Ex, Mensal, etc) */}
              <Route path="/nova-leitura" element={<SelectSpread />} />

              {/* Outras rotas públicas ou do app */}
              <Route path="/tarot" element={<Tarot />} />
              <Route path="/dreams" element={<Dreams />} />
              <Route path="/escolher" element={<Home user={session?.user} />} />

              {/* Rota Protegida: Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Rota Admin */}
              <Route path="/admin" element={<AdminDashboard />} /> 
            </Routes>
          </Layout>
        } />

      </Routes>
    </Router>
  );
};

export default App;
