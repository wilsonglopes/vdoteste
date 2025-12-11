// pages/Dreams.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Moon, Loader2, Download, RotateCcw, Home, ArrowLeft } from 'lucide-react';
import { interpretDream } from '../services/geminiService';
import { useDreamStore } from '../store/dreamStore';
import { saveReading } from '../services/historyService';
import { consumeCredit } from '../services/userService';
import PlansModal from '../components/PlansModal';
import AuthModal from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '../services/supabase';

const LOCAL_KEY = 'vozes_dream_state_v1';

const Dreams: React.FC = () => {
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  const [showPlans, setShowPlans] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const {
    dreamText, setDreamText,
    interpretation, setInterpretation,
    loading, setLoading
  } = useDreamStore();

  // --- FUNÇÃO PARA DEIXAR O TEXTO BONITO (REMOVE **) ---
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    // Divide o texto onde tiver **
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      // Se a parte começar e terminar com **, é negrito
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove os asteriscos e aplica estilo Dourado/Roxo
        return (
          <strong key={index} className="text-purple-300 font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Texto normal
      return part;
    });
  };

  // --- 1. INICIALIZAÇÃO E RECUPERAÇÃO DE ESTADO ---
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user)).catch(() => {});
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.dreamText) setDreamText(parsed.dreamText);
        if (parsed.interpretation) setInterpretation(parsed.interpretation);
      }
    } catch (e) { }

    return () => subscription.unsubscribe();
  }, []);

  // --- 2. SALVAR ESTADO ---
  useEffect(() => {
    const toStore = { dreamText, interpretation };
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore)); } catch (e) {}
  }, [dreamText, interpretation]);

  // --- AÇÕES ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamText.trim()) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    const creditCheck = await consumeCredit(user.id);
    if (!creditCheck.success) {
      if (creditCheck.message === 'no_credits') {
        setShowPlans(true);
      } else {
        alert(creditCheck.message);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await interpretDream(dreamText);
      setInterpretation(result);

      if (user) {
        await saveReading(user.id, 'dream', { dreamText }, { interpretation: result });
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao interpretar sonho.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewDream = () => {
    setInterpretation(null);
    setDreamText('');
    try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
  };

  const handleGoHome = () => {
    setInterpretation(null);
    setDreamText('');
    try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
    navigate('/');
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    const btnText = document.getElementById('btn-dream-pdf-text');
    if(btnText) btnText.innerText = "Gerando...";
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#020617',
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = user?.user_metadata?.name ? `Sonho_${user.user_metadata.name}.pdf` : 'Interpretacao_Sonho.pdf';
      pdf.save(filename);
    } catch (error) {
      console.error("Erro PDF:", error);
      alert("Erro ao gerar PDF.");
    } finally {
      if(btnText) btnText.innerText = "Baixar em PDF";
    }
  };

  const isResultMode = !!interpretation;

  return (
    <div 
      className={`
        w-full max-w-3xl mx-auto px-4
        ${isResultMode 
          ? 'min-h-screen py-10 overflow-y-auto scrollbar-hide' 
          : 'h-screen overflow-hidden flex flex-col items-center justify-center'
        }
      `}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onSuccess={() => setShowAuth(false)} 
      />
      
      <PlansModal 
        isOpen={showPlans} 
        onClose={() => setShowPlans(false)}
        onSelectPlan={(planId) => {
          alert(`Plano ${planId} selecionado.`);
          setShowPlans(false);
        }}
      />
      
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="font-serif text-3xl text-white mb-2 flex justify-center items-center gap-2">
           <Moon className="w-6 h-6 text-purple-300" /> Guardião dos Sonhos
        </h2>
        <p className="text-slate-400">
          Descreva seu sonho com detalhes. O oráculo buscará significados ocultos.
        </p>
      </div>

      {!interpretation && (
        <form onSubmit={handleSubmit} className="w-full relative mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg -z-10"></div>

          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="Eu estava voando sobre um oceano violeta..."
            className="w-full h-32 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none font-light leading-relaxed text-lg"
          />

          <div className="flex justify-center mt-6 gap-4">
            <button
              type="submit"
              disabled={loading || !dreamText.trim()}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-base backdrop-blur-md transition-all disabled:opacity-50 border border-white/10 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Interpretar Sonho"}
            </button>
          </div>

          <div className="w-full flex justify-center mt-8">
            <button
              type="button"
              onClick={handleGoHome}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-3 py-2"
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>
          </div>
        </form>
      )}

      {interpretation && (
        <div className="w-full flex flex-col gap-8 animate-fade-in-up pb-20">
            
            <div ref={resultRef} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
              <div className="mb-6 text-center border-b border-white/5 pb-6">
                 <p className="text-slate-500 text-sm italic mb-2">Seu relato:</p>
                 <p className="text-slate-300 italic text-sm line-clamp-3">"{dreamText}"</p>
              </div>
              <h3 className="font-serif text-2xl text-purple-200 mb-6 flex items-center justify-center gap-2">
                <Moon className="w-6 h-6" /> O Significado
              </h3>
              
              {/* AQUI ESTÁ A MÁGICA DO NEGRITO */}
              <div className="text-slate-200 leading-loose font-light whitespace-pre-wrap text-lg">
                {renderFormattedText(interpretation)}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Vozes do Oráculo • Interpretação de Sonhos
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
                 <button
                   onClick={handleGoHome}
                   className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all font-semibold"
                 >
                   <Home className="w-5 h-5" />
                   Voltar ao Início
                 </button>

                 <button 
                    onClick={handleNewDream} 
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all font-semibold"
                 >
                   <RotateCcw className="w-5 h-5" />
                   Nova Interpretação
                 </button>

                 <button
                   onClick={handleDownloadPDF}
                   className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all"
                 >
                   <Download className="w-5 h-5" />
                   <span id="btn-dream-pdf-text">Baixar em PDF</span>
                 </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dreams;
