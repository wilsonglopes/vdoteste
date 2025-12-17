import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Voltar para Home
        </button>

        <h1 className="text-3xl md:text-4xl font-serif text-white mb-6 flex items-center gap-3">
          <FileText className="text-purple-500" /> Termos de Uso
        </h1>

        <div className="space-y-6 text-sm md:text-base leading-relaxed bg-white/5 p-8 rounded-2xl border border-white/10">
          
          {/* DISCLAIMER IMPORTANTE PARA ADS */}
          <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-xl flex gap-3 items-start">
            <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-amber-200 font-bold uppercase text-xs tracking-wider mb-1">Isenção de Responsabilidade (Disclaimer)</h3>
              <p className="text-amber-100/80 text-sm">
                Os serviços oferecidos pelo Vozes do Oráculo são destinados exclusivamente para fins de <strong>entretenimento, autoconhecimento e lazer</strong>. 
                As leituras não constituem e não substituem aconselhamento profissional médico, psicológico, jurídico ou financeiro.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o Vozes do Oráculo, você concorda em cumprir estes Termos de Uso. O serviço é destinado apenas a maiores de 18 anos.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">2. Sobre o Serviço</h2>
            <p>
              Utilizamos Inteligência Artificial para interpretar simbolismos de cartas de Tarot e Sonhos. Embora busquemos oferecer orientações coerentes, os resultados podem variar e não devem ser tomados como previsões infalíveis de futuro. Você é o único responsável pelas decisões que toma em sua vida.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">3. Créditos e Pagamentos</h2>
            <p>
              O sistema funciona através de créditos adquiridos. Uma vez consumidos para realizar uma leitura, os créditos não são reembolsáveis, visto que o serviço digital foi executado e entregue instantaneamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">4. Conduta do Usuário</h2>
            <p>
              É proibido utilizar o site para qualquer fim ilegal ou não autorizado. Reservamo-nos o direito de suspender contas que violem estas diretrizes.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">5. Alterações</h2>
            <p>
              Podemos atualizar estes termos periodicamente. O uso contínuo do serviço após as alterações constitui aceitação dos novos termos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
