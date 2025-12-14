import React, { useRef } from 'react';
import { Sparkles, RotateCcw, Loader2, BookOpen, Clock, Download, Home, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CARD_BACK_URL } from '../../constants';
import { ReadingResult } from '../../services/geminiService';

export interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface ReadingStepFicarPartirProps {
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

const ReadingStepFicarPartir: React.FC<ReadingStepFicarPartirProps> = ({
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

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    const btnText = document.getElementById('btn-pdf-text');
    if(btnText) btnText.innerText = "Gerando...";
    try {
      const canvas = await html2canvas(resultRef.current, { scale: 2, backgroundColor: '#0f172a', useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = user?.user_metadata?.name ? `Leitura_FicarPartir_${user.user_metadata.name}.pdf` : 'Leitura_FicarPartir.pdf';
      pdf.save(filename);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      if(btnText) btnText.innerText = "Baixar em PDF";
    }
  };

  // --- LAYOUT FICAR OU PARTIR (6 CARTAS) ---
  // Ref: Image d05119f0.jpg
  // Grid de 3 Colunas: Esquerda (1,3) | Centro (5,6) | Direita (2,4)
  const getCardStyle = (index: number) => {
    switch (index) {
      case 0: return "col-start-1 row-start-1"; // 1: Situação Atual (Topo Esq)
      case 1: return "col-start-3 row-start-1"; // 2: Por que ficar? (Topo Dir)
      case 2: return "col-start-1 row-start-2"; // 3: Por que partir? (Baixo Esq)
      case 3: return "col-start-3 row-start-2"; // 4: Sentimento ao Ficar (Baixo Dir)
      case 4: return "col-start-2 row-start-1 translate-y-8"; // 5: Sentimento ao Partir (Centro Topo - Deslocado para baixo visualmente)
      case 5: return "col-start-2 row-start-2"; // 6: Tendência/Conselho (Centro Baixo)
      default: return "";
    }
  };

  return (
    <div className="w-full p-4 md:p-8 bg-transparent flex flex-col items-center">
      
      <div id="reading-result" ref={resultRef} className="w-full flex flex-col items-center">
        
        <div className="text-center mb-6 w-full">
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-2">Ficar ou Partir?</h2>
          <p className="text-slate-400 italic text-lg md:text-xl">"{question}"</p>
        </div>

        {/* GRID ESPECÍFICO 3 COLUNAS x 2 LINHAS */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-w-xl mx-auto mb-12 w-full relative perspective-1000 py-4 justify-items-center">
          {selectedCards.map((card, index) => {
            const isRevealed = index < revealedLocal;
            const customClass = getCardStyle(index);
            const transformStyle = {
              transformStyle: 'preserve-3d' as const,
              transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 900ms cubic-bezier(.2,.8,.25,1)'
            };

            return (
              <div key={card.id} className={`w-20 md:w-24 aspect-[2/3] relative group ${customClass}`}>
                
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white/30 font-serif text-sm font-bold">
                    {index + 1}
                </div>

                <div className="w-full h-full relative transition-transform" style={transformStyle}>
                  {/* VERSO */}
                  <div className="absolute inset-0 w-full h-full rounded-xl border border-fuchsia-500/30 bg-indigo-950 overflow-hidden shadow-2xl" style={{ backfaceVisibility: 'hidden' as const }}>
                    <img src={CARD_BACK_URL} className="w-full h-full object-cover opacity-90 rounded-xl" alt="verso" />
                  </div>
                  {/* FRENTE */}
                  <div className="absolute inset-0 w-full h-full rounded-xl border-2 border-fuchsia-500/70 overflow-hidden shadow-[0_0_30px_rgba(235,50,235,0.15)] bg-black" style={{ backfaceVisibility: 'hidden' as const, transform: 'rotateY(180deg)' }}>
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover rounded-xl" />
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
              <div className="bg-slate-900/50 border border-fuchsia-500/20 p-10 rounded-2xl text-center backdrop-blur-md">
                <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin mx-auto mb-4" />
                <p className="text-purple-200 text-xl font-playfair">Comparando os caminhos...</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900/80 border-l-4 border-fuchsia-500 p-6 rounded-r-xl backdrop-blur-md">
                  <p className="text-lg text-purple-100 italic font-light leading-relaxed">{reading.intro}</p>
                </div>

                <div>
                  <h3 className="text-2xl text-white font-playfair mb-6 flex items-center gap-2"><BookOpen className="text-fuchsia-400" /> Comparativo</h3>
                  
                  {/* Grid 2 colunas para comparar lado a lado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reading.individual_cards?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-fuchsia-500/30 transition-colors">
                        <h4 className="text-fuchsia-400 font-bold mb-1 text-sm uppercase tracking-wider">Posição {idx + 1}: {item.card_name}</h4>
                        <p className="text-slate-300 text-base leading-relaxed">{item.interpretation || item.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-fuchsia-500/20 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
                  <div>
                    <h4 className="text-fuchsia-400 font-playfair text-2xl mb-2">Conclusão</h4>
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
          </div>
        )}
      </div>

      {revealedLocal === 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-2 mb-8 gap-4">
          <button
            onClick={onReveal}
            className="bg-fuchsia-600 text-white px-12 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-fuchsia-900 transition-all shadow-lg w-full max-w-xs"
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

      {revealedLocal === totalCards && reading && (
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 justify-center pb-20">
          <button onClick={onGoHome} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-slate-300 hover:bg-white/10 transition-all font-semibold">
            <Home className="w-5 h-5" /> Voltar ao Início
          </button>
          
          <button onClick={onNewReading} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-all font-semibold shadow-lg">
            <RotateCcw className="w-5 h-5" /> Nova Consulta
          </button>
          
          <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all">
            <Download className="w-5 h-5" /> <span id="btn-pdf-text">Baixar em PDF</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default ReadingStepFicarPartir;
