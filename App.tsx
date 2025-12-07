import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import Dreams from './pages/Dreams';
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

  // Protected Route Wrapper
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
          <Route 
            path="/tarot" 
            element={
              <ProtectedRoute>
                <Tarot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dreams" 
            element={
              <ProtectedRoute>
                <Dreams />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;