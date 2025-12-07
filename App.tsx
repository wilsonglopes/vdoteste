// App.tsx
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import Dreams from './pages/Dreams';
import Dashboard from './pages/Dashboard'; // <--- Importação Nova
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

  // Wrapper para rotas que EXIGEM login (como o Dashboard)
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Layout user={session?.user}>
        <Routes>
          <Route path="/" element={<Home user={session?.user} />} />
          
          {/* Rotas Abertas (A proteção agora é interna, no botão Revelar) */}
          <Route path="/tarot" element={<Tarot />} />
          <Route path="/dreams" element={<Dreams />} />

          {/* Rota Protegida (Só entra logado) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
