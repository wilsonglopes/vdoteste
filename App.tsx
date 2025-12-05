import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import Dreams from './pages/Dreams';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import Vendas from './pages/Vendas';
import SelectSpread from './pages/SelectSpread'; // <--- Importação do seletor
import { supabase } from './services/supabase';

// Declaração para o TypeScript aceitar o gtag (Analytics)
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- 1. RASTREAMENTO DE BANNERS (RECUPERADO) ---
  useEffect(() => {
    const url = window.location.href;
    // Procura por utm_content na URL
    const match = url.match(/utm_content=([^&]+)/);
    
    if (match && match[1]) {
      const creativeName = match[1];
      console.log("Rastreando Criativo:", creativeName);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'clique_banner', {
          'nome_criativo': creativeName,
          'origem': 'feltrofacil'
        });
      }
    }
  }, []);

  // --- 2. AUTENTICAÇÃO ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS (SEM MENU DO APP) --- */}
        {/* Elas ficam fora do Layout para terem design 100% imersivo */}
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/landingpage" element={<LandingPage />} />

        {/* --- ROTAS DO APP (COM MENU/RODAPÉ PADRÃO) --- */}
        {/* Usamos o * para capturar todas as outras rotas e aplicar o Layout nelas */}
        <Route
          path="*"
          element={
            <Layout user={session?.user}>
              <Routes>
                {/* Home do App */}
                <Route path="/" element={<Home user={session?.user} />} />
                
                {/* Funcionalidades */}
                <Route path="/escolher" element={<SelectSpread />} />
                <Route path="/tarot" element={<Tarot />} />
                <Route path="/dreams" element={<Dreams />} />

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
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
