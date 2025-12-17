import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home'; // Página dos 2 cards
import Dreams from './pages/Dreams';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfUse from './pages/legal/TermsOfUse';
import SelectSpread from './pages/SelectSpread';
import { supabase } from './services/supabase';

// Imports dos Jogos
import Tarot from './pages/Tarot'; 
import TarotEx from './pages/TarotEx';
import TarotValePena from './pages/TarotValePena';
import TarotMensal from './pages/TarotMensal';
import TarotFerradura from './pages/TarotFerradura';
import TarotFofoca from './pages/TarotFofoca';
import TarotFicarPartir from './pages/TarotFicarPartir';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // VERIFICAÇÃO DE SUBDOMÍNIO
  // Se o endereço incluir "app.", consideramos que é o ambiente do sistema
  const isAppSubdomain = window.location.hostname.includes('app.');

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
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Carregando energias...</div>;
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      // Se tentar acessar o app sem logar, manda para a Landing Page (site principal)
      if (isAppSubdomain) {
         window.location.href = 'https://vozesdooraculo.com.br';
         return null;
      }
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  // --- CENÁRIO 1: USUÁRIO ACESSOU "VOZESDOORACULO.COM.BR" (Landing Page) ---
  if (!isAppSubdomain) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<TermsOfUse />} />
          {/* Qualquer outra rota manda volta pra Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  // --- CENÁRIO 2: USUÁRIO ACESSOU "APP.VOZESDOORACULO.COM.BR" (Sistema) ---
  return (
    <Router>
      <Routes>
        <Route path="*" element={
          <Layout user={session?.user}>
            <Routes>
              {/* A Raiz do App é a Home (2 cards) */}
              <Route path="/" element={<Home user={session?.user} />} />
              
              <Route path="/nova-leitura" element={<SelectSpread />} />
              
              {/* Jogos */}
              <Route path="/tarot" element={<Tarot />} />
              <Route path="/tarot-ex" element={<TarotEx />} />
              <Route path="/tarot-vale-pena" element={<TarotValePena />} />
              <Route path="/tarot-mensal" element={<TarotMensal />} />
              <Route path="/tarot-ferradura" element={<TarotFerradura />} />
              <Route path="/tarot-fofoca" element={<TarotFofoca />} />
              <Route path="/tarot-ficar-partir" element={<TarotFicarPartir />} />
              <Route path="/dreams" element={<Dreams />} />
              
              {/* Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Redirecionamentos Internos */}
              <Route path="/inicio" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
