import React, { useRef } from 'react';
import { Sparkles, RotateCcw, Loader2, BookOpen, Clock, Download, Home, ArrowLeft, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CARD_BACK_URL } from '../../constants';
import { ReadingResult } from '../../services/geminiService';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface ReadingStepFofocaProps {
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

const ReadingStepFofoca: React.FC<ReadingStepFofocaProps> = ({
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
  const totalCards = selectedCards.length;

  // Detecta se houve erro na leitura para mostrar o botão de tentar novamente
  const isError = reading?.intro?.includes("Erro") || reading?.intro?.includes("falha");

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    const btnText = document.getElementById('btn-pdf-text');
    if(btnText) btnText.innerText = "Gerando...";
    try {
      const canvas = await html2canvas(resultRef.current, { scale: 2, backgroundColor: '#0f172a', useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = user?.user_metadata?.name ? `Leitura_Fofoca_${user.user_metadata.name}.pdf` : 'Leitura_Fofoca.pdf';
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
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-2">Fofocando sobre o Amor</h2>
          <p className="text-slate-400 italic text-lg md:text-xl">"{question}"</p>
        </div>

        {/* --- GRID DE 12 CARTAS COMPACTO --- */}
        {/* max-w-2xl força as colunas a ficarem mais próximas */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-w-2xl mx-auto mb-8 w-full relative perspective-1000 py-4 justify-items-center">
          {selectedCards.map((card, index) => {
            const isRevealed = index < revealedLocal;
            
            const transformStyle = {
              transformStyle: 'preserve-3d' as const,
              transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 900ms cubic-bezier(.2,.8,.25,1)'
            };

            return (
              <div key={card.id} className="w-20 md:w-24 aspect-[2/3] relative group">
                {/* Número Indicador */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-pink-300/50 font-serif text-xs font-bold">
                    {index + 1}
                </div>

                <div className="w-full h-full relative transition-transform" style={transformStyle}>
                  {/* VERSO */}
                  <div className="absolute inset-0 w-full h-full rounded-lg border border-pink-500/30 bg-indigo-950 overflow-hidden shadow-md" style={{ backfaceVisibility: 'hidden' as const }}>
                    <img src={CARD_BACK_URL} className="w-full h-full object-cover opacity-90" alt="verso" />
                  </div>
                  {/* FRENTE */}
                  <div className="absolute inset-0 w-full h-full rounded-lg border-2 border-pink-500 overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-black" style={{ backfaceVisibility: 'hidden' as const, transform: 'rotateY(180deg)' }}>
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ÁREA DE RESULTADO */}
        {revealedLocal === totalCards && (
          <div className="w-full animate-fade-in-up space-y-8 pb-8">
            {isLoadingAI || !reading ? (
              <div className="bg-slate-900/50 border border-pink-500/20 p-10 rounded-2xl text-center backdrop-blur-md">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
                <p className="text-purple-200 text-lg font-playfair">Investigando as energias...</p>
              </div>
            ) : (
              <>
                {/* Se der erro, mostra aviso vermelho. Se não, mostra resultado normal */}
                {isError ? (
                    <div className="bg-red-900/50 border-l-4 border-red-500 p-6 rounded-r-xl backdrop-blur-md shadow-lg text-center">
                        <h3 className="text-xl text-white font-bold mb-2">Houve uma falha na conexão</h3>
                        <p className="text-slate-200">{reading.intro}</p>
                        <p className="text-slate-400 text-sm mt-2">{reading.advice}</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-slate-900/80 border-l-4 border-pink-500 p-6 rounded-r-xl backdrop-blur-md shadow-lg">
                        <p className="text-lg text-purple-100 italic font-light leading-relaxed">{reading.intro}</p>
                        </div>

                        <div>
                        <h3 className="text-2xl text-white font-playfair mb-6 flex items-center gap-2"><BookOpen className="text-pink-400" /> Detalhes da Investigação</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reading.individual_cards?.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-pink-500/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-pink-900/50 text-pink-300 text-xs font-bold px-2 py-1 rounded-full">#{idx + 1}</span>
                                    <h4 className="text-pink-100 font-bold text-sm uppercase tracking-wide">{item.card_name}</h4>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{item.interpretation || item.meaning}</p>
                            </div>
                            ))}
                        </div>
                        </div>

                        <div className="bg-slate-950 border border-pink-500/30 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                        <div>
                            <h4 className="text-pink-300 font-playfair text-2xl mb-2">Revelação Final</h4>
                            <p className="text-white text-lg font-medium">{reading.summary}</p>
                        </div>
                        <hr className="border-white/10" />
                        <div>
                            <p className="text-sm text-slate-500 uppercase tracking-widest mb-2">Conselho</p>
                            <p className="text-purple-200 italic text-xl font-serif">"{reading.advice}"</p>
                        </div>
                        </div>
                    </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTÃO REVELAR (INÍCIO) */}
      {revealedLocal === 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-2 mb-8 gap-4">
          <button
            onClick={onReveal}
            className="bg-pink-600 text-white px-12 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-pink-900 transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] w-full max-w-xs"
          >
            Revelar Agora
          </button>
          
          <div className="w-full max-w-md flex justify-end mt-2">
            <button onClick={onBack} className="flex items-center gap-2 bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              <ArrowLeft size={16} /> <span>Trocar Cartas</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTÕES DE AÇÃO FINAL (OU TENTAR NOVAMENTE) */}
      {revealedLocal === totalCards && reading && (
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 justify-center pb-20 mt-4">
          {/* Se houver erro, mostra APENAS o botão de tentar novamente */}
          {isError ? (
             <button 
                onClick={onReveal} 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-500 hover:scale-[1.02] transition-all w-full md:w-auto"
             >
                <RefreshCw className="w-5 h-5" /> Tentar Novamente
             </button>
          ) : (
             <>
                <button onClick={onGoHome} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-slate-300 hover:bg-white/10 transition-all font-semibold">
                    <Home className="w-5 h-5" /> Voltar ao Início
                </button>
                
                <button onClick={onNewReading} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-pink-600 text-white hover:bg-pink-500 transition-all font-semibold shadow-lg">
                    <RotateCcw className="w-5 h-5" /> Nova Consulta
                </button>
                
                <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all">
                    <Download className="w-5 h-5" /> <span id="btn-pdf-text">Baixar em PDF</span>
                </button>
             </>
          )}
        </div>
      )}

    </div>
  );
};

export default ReadingStepFofoca;
