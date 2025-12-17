import React from 'react';
import { X, Calendar, MessageSquare, Sparkles, ScrollText, Moon } from 'lucide-react';

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: any; // Usamos any aqui para flexibilidade com os formatos antigos e novos
}

const ReadingModal: React.FC<ReadingModalProps> = ({ isOpen, onClose, reading }) => {
  if (!isOpen || !reading) return null;

  // --- 1. LÓGICA DE EXTRAÇÃO DE DADOS ---
  // Esta função descobre onde está o texto da PERGUNTA/RELATO
  const getUserInput = () => {
    if (!reading.input_data) return "Sem dados de entrada.";

    // Se for sonho
    if (reading.type === 'dream' || reading.type === 'sonho') {
      return reading.input_data.dreamText || "Relato não encontrado.";
    }

    // Se for qualquer tipo de Tarot
    return reading.input_data.question || "Pergunta não encontrada.";
  };

  // Esta função descobre onde está a RESPOSTA DA IA
  const getOracleResponse = () => {
    // Tenta pegar de output_data (novo) ou ai_response (antigo)
    const response = reading.output_data || reading.ai_response;

    if (!response) return "Ainda não há interpretação para este item.";

    // Se for sonho (estrutura simples)
    if (reading.type === 'dream' || reading.type === 'sonho') {
      return response.interpretation || typeof response === 'string' ? response : "Erro ao ler interpretação.";
    }

    // Se for Tarot (estrutura JSON complexa)
    if (response.summary) {
      return (
        <div className="space-y-4">
          <p className="font-medium text-purple-200">{response.summary}</p>
          
          {/* Se tiver conselho, mostra destacado */}
          {response.advice && (
            <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded-r-lg">
              <h4 className="text-sm font-bold text-purple-400 mb-1 uppercase">Conselho</h4>
              <p className="italic text-slate-300">{response.advice}</p>
            </div>
          )}

          {/* Se quiser mostrar detalhes das cartas (opcional) */}
          {response.individual_cards && response.individual_cards.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase">Cartas Reveladas</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {response.individual_cards.map((card: any, idx: number) => (
                  <li key={idx}>
                    <span className="text-purple-300 font-bold">{card.card_name}:</span> {card.interpretation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // Fallback se for string antiga
    return typeof response === 'string' ? response : JSON.stringify(response);
  };

  // --- 2. FORMATAÇÃO ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTitle = () => {
    switch (reading.type) {
      case 'dream':
      case 'sonho': return 'Interpretação de Sonho';
      case 'carta_do_dia': return 'Carta do Dia';
      default: return 'Leitura de Tarot';
    }
  };

  const isDream = reading.type === 'dream' || reading.type === 'sonho';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDream ? 'bg-indigo-500/20 text-indigo-400' : 'bg-purple-500/20 text-purple-400'}`}>
              {isDream ? <Moon size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">{getTitle()}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={12} />
                <span>{formatDate(reading.created_at)}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Seção: Pergunta / Relato */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <MessageSquare size={14} />
              {isDream ? "Seu Relato" : "Sua Pergunta"}
            </h4>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-slate-200 leading-relaxed italic">
              "{getUserInput()}"
            </div>
          </div>

          {/* Seção: Resposta do Oráculo */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <ScrollText size={14} />
              Resposta do Oráculo
            </h4>
            <div className="bg-gradient-to-b from-purple-900/10 to-transparent border border-purple-500/10 rounded-xl p-5 text-slate-300 leading-relaxed">
              {getOracleResponse()}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0a0a0c] rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReadingModal;
