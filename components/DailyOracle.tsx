import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { getDailyCardReading } from '../services/geminiService';
import { CARD_BACK_URL, CARD_NAMES, DECK_SIZE } from '../constants';

interface DailyOracleProps {
  user: any;
  onReadingComplete: () => void; // Para atualizar o histórico da tela principal
}

const DailyOracle: React.FC<DailyOracleProps> = ({ user, onReadingComplete }) => {
  const [loading, setLoading] = useState(false);
  const [todayReading, setTodayReading] = useState<any>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    checkDailyReading();
  }, [user]);

  const checkDailyReading = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0]; // Data de hoje (YYYY-MM-DD)

    // Busca se já existe uma leitura do tipo 'daily' feita hoje
    const { data } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'daily')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .maybeSingle();

    if (data) {
      setTodayReading(data);
      setFlipped(true);
    }
  };

  const drawCard = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Sorteia a carta
      const cardId = Math.floor(Math.random() * DECK_SIZE) + 1;
      const cardName = CARD_NAMES[cardId as keyof typeof CARD_NAMES];
      const cardImage = `https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/${cardId}.jpg`;

      // 2. Chama a IA
      const advice = await getDailyCardReading(cardId, user.user_metadata.name || "Viajante");

      // 3. Salva no Banco (Tipo 'daily')
      const { data, error } = await supabase.from('readings').insert({
        user_id: user.id,
        type: 'daily',
        input_data: { question: "Carta do Dia", cardId, cardName, cardImage },
        ai_response: { summary: advice, interpretation: advice }, // Formato compatível com o histórico
        created_at: new Date().toISOString()
      }).select().single();

      if (error) throw error;

      setTodayReading(data);
      setFlipped(true);
      onReadingComplete(); // Atualiza o histórico lá embaixo

    } catch (error) {
      console.error("Erro Carta do Dia:", error);
      alert("O oráculo está em silêncio agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden shadow-lg mb-8">
      
      {/* Fundo decorativo */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        
        {/* CARTA ANIMADA */}
        <div className="shrink-0 perspective-1000 group">
           <div className={`relative w-32 h-48 transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
              
              {/* VERSO (Clicável se não tirou ainda) */}
              <div 
                className={`absolute inset-0 w-full h-full backface-hidden ${flipped ? 'hidden' : 'block'}`}
                onClick={!todayReading ? drawCard : undefined}
              >
                 <div className={`w-full h-full rounded-xl border-2 border-purple-400/50 shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center justify-center bg-indigo-950 ${loading ? 'animate-pulse' : ''}`}>
                    {loading ? <Loader2 className="animate-spin text-purple-300" /> : <img src={CARD_BACK_URL} className="w-full h-full object-cover rounded-lg opacity-80" />}
                 </div>
              </div>

              {/* FRENTE (Resultado) */}
              {todayReading && (
                <div className="absolute inset-0 w-full h-full rounded-xl shadow-2xl border-2 border-gold overflow-hidden rotate-y-180 backface-hidden">
                  <img 
                    src={todayReading.input_data.cardImage} 
                    alt="Carta do Dia" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
           </div>
        </div>

        {/* TEXTO E AÇÃO */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-serif font-bold text-white uppercase tracking-widest">Carta do Dia</h3>
          </div>

          {!todayReading ? (
            <>
              <p className="text-slate-300 mb-6 max-w-md">
                Conecte-se com a energia de hoje. Esta tiragem é um <strong>presente diário</strong> do oráculo para guiar seus passos.
              </p>
              <button 
                onClick={drawCard}
                disabled={loading}
                className="bg-gold hover:bg-yellow-400 text-purple-900 font-bold px-8 py-3 rounded-full shadow-lg shadow-gold/20 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Sintonizando..." : "Revelar Minha Energia"}
              </button>
            </>
          ) : (
            <div className="animate-fade-in">
              <h4 className="text-lg font-bold text-gold mb-2">{todayReading.input_data.cardName}</h4>
              <p className="text-white text-lg leading-relaxed italic mb-4 bg-black/20 p-4 rounded-lg border border-white/5">
                "{todayReading.ai_response.summary}"
              </p>
              <p className="text-xs text-purple-300 flex items-center justify-center md:justify-start gap-1">
                <Calendar size={12} /> Válido para {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DailyOracle;
