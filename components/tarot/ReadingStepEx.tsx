import React, { useRef } from 'react';
// import { motion } from 'framer-motion'; // Se não estiver usando motion explicitamente no JSX abaixo, pode remover ou manter
import { Sparkles, RotateCcw, Loader2, BookOpen, Clock, Download, Home, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CARD_BACK_URL } from '../../constants'; // Removido CARDS_TO_SELECT
import { ReadingResult } from '../../services/geminiService';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface ReadingStepExProps {
  question: string;
  selectedCards: CardData[];
  revealedLocal: number;
  reading: ReadingResult | null;
  isLoadingAI: boolean;
  user: any;
  onReveal: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onNewReading: () => void;
}

const ReadingStepEx: React.FC<ReadingStepExProps> = ({
  question,
  selectedCards,
  revealedLocal,
  reading,
  isLoadingAI,
  user,
  onReveal,
  onBack,
  onGoHome,
  onNewReading
}) => {
  
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Limite dinâmico baseado na quantidade de cartas escolhidas (5)
  const totalCards = selectedCards.length;

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    
    const btnText = document.getElementById('btn-pdf-text');
    if(btnText) btnText.innerText = "Gerando...";

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
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
      const filename = user?.user_metadata?.name ? `Leitura_Ex_${user.user_metadata.name}.pdf` : 'Leitura_Tarot_Ex.pdf';
      pdf.save(filename);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      if(btnText) btnText.innerText = "Baixar em PDF";
    }
  };

  return (
    <div className="w-full p-4 md:p-8 bg-transparent flex flex-col items-center">
      
      <div id="reading-result" ref={resultRef} className="w-full flex flex-col items-center">
        
        <div className="text-center mb-6 w-full">
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-2">A Mensagem do Oráculo</h2>
          <p className="text-slate-400 italic text-lg md:text-xl">"{question}"</p>
        </div>

        {/* GRID ADAPTADO PARA 5 CARTAS (Flex Wrap para centralizar) */}
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto mb-10 w-full">
          {selectedCards.map((card, index) => {
            const isRevealed = index < revealedLocal;
            const transformStyle = {
              transformStyle: 'preserve-3d' as const,
              transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 900ms cubic-bezier(.2,.8,.25,1)'
            };

            return (
              // Ajustei a largura para ficar proporcional (w-24 md:w-32) ou manter o aspect ratio original
              <div key={card.id} className="w-24 md:w-32 aspect-[2/3] relative group perspective-1000">
                <div className="w-full h-full relative transition-transform" style={transformStyle}>
                  {/* VERSO */}
                  <div className="absolute inset-0 w-full h-full rounded-xl border border-purple-500/30 bg-indigo-950 overflow-hidden shadow-2xl" style={{ backfaceVisibility: 'hidden' as const }}>
                    <img src={CARD_BACK_URL} className="w-full h-full object-cover opacity-90 rounded-xl" alt="verso" />
                  </div>
                  {/* FRENTE */}
                  <div className="absolute inset-0 w-full h-full rounded-xl border-2 border-gold/70 overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.15)] bg-black" style={{ backfaceVisibility: 'hidden' as const, transform: 'rotateY(180deg)' }}>
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ÁREA DE RESULTADO (Aparece quando todas viram) */}
        {revealedLocal === totalCards && (
          <div className="w-full animate-fade-in-up space-y-8 pb-8">
            {isLoadingAI || !reading ? (
              <div className="bg-slate-900/50 border border-purple-500/20 p-10 rounded-2xl text-center backdrop-blur-md">
                <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
                <p className="text-purple-200 text-xl font-playfair">A Cigana Esmeralda está lendo seu destino...</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900/80 border-l-4 border-gold p-6 rounded-r-xl backdrop-blur-md">
                  <p className="text-lg text-purple-100 italic font-light leading-relaxed">{reading.intro}</p>
                </div>

                <div>
                  <h3 className="text-2xl text-white font-playfair mb-6 flex items-center gap-2"><BookOpen className="text-purple-400" /> Análise das Cartas</h3>
                  <div className="space-y-4">
                    {reading.individual_cards?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                        <h4 className="text-gold font-bold mb-1 text-sm uppercase tracking-wider">Posição {idx + 1}: {item.card_name}</h4>
                        <p className="text-slate-300 text-base leading-relaxed">{item.interpretation || item.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TIMELINE (Se a leitura retornar timeline, exibe. Caso contrário, não quebra) */}
                {reading.timeline && (
                    <div>
                    <h3 className="text-2xl text-white font-playfair mb-6 flex items-center gap-2"><Clock className="text-purple-400" /> Jornada do Tempo</h3>
                    <div className="space-y-6">
                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10">
                        <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-bold rounded-full mb-3 uppercase">Passado / Base</span>
                        <p className="text-slate-200 leading-relaxed text-lg">{reading.timeline.past}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 p-6 rounded-2xl border border-gold/40 shadow-lg">
                        <span className="inline-block px-3 py-1 bg-gold text-purple-900 text-xs font-bold rounded-full mb-3 uppercase">Presente / Foco</span>
                        <p className="text-white leading-relaxed text-lg">{reading.timeline.present}</p>
                        </div>
                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10">
                        <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-bold rounded-full mb-3 uppercase">Futuro / Tendência</span>
                        <p className="text-slate-200 leading-relaxed text-lg">{reading.timeline.future}</p>
                        </div>
                    </div>
                    </div>
                )}

                <div className="bg-slate-950 border border-gold/20 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
                  <div>
                    <h4 className="text-gold font-playfair text-2xl mb-2">A Resposta do Oráculo</h4>
                    <p className="text-white text-lg font-medium">{reading.summary}</p>
                  </div>
                  <hr className="border-white/10" />
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-widest mb-2">Conselho Final</p>
                    <p className="text-purple-200 italic text-xl font-serif">"{reading.advice}"</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTÃO REVELAR (SÓ APARECE SE NENHUMA TIVER SIDO REVELADA AINDA) */}
      {revealedLocal === 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-2 mb-8 gap-4">
          <button
            onClick={onReveal}
            className="bg-purple-600 text-white px-12 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-purple-900 transition-all shadow-lg w-full max-w-xs"
          >
            Revelar Agora
          </button>
          
          <div className="w-full max-w-md flex justify-end mt-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft size={16} />
              <span>Trocar Cartas</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTÕES FINAIS */}
      {revealedLocal === totalCards && reading && (
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 justify-center pb-20">
          <button 
            onClick={onGoHome} 
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-slate-300 hover:bg-white/10 transition-all font-semibold"
          >
            <Home className="w-5 h-5" /> Voltar ao Início
          </button>
          
          <button 
            onClick={onNewReading} 
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-all font-semibold shadow-lg"
          >
            <RotateCcw className="w-5 h-5" /> Nova Consulta
          </button>
          
          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all"
          >
            <Download className="w-5 h-5" /> <span id="btn-pdf-text">Baixar em PDF</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default ReadingStepEx;
