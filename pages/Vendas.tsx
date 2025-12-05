import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Moon, Star, ArrowRight, ShieldCheck, Heart, 
  ChevronDown, Zap, MessageCircle, Users, Check, X, BrainCircuit, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Vendas: React.FC = () => {
  const navigate = useNavigate();

  const goToApp = () => {
    navigate('/'); // Leva para a Home (Cadastro/Login)
  };

  const faqs = [
    { 
      q: "A leitura por Inteligência Artificial funciona mesmo?", 
      a: "Sim. O Vozes do Oráculo utiliza um modelo de IA avançado treinado em milhares de tiragens de Tarot Cigano e simbologia dos sonhos. Ele não 'inventa' respostas, ele interpreta os arquétipos das cartas que você escolheu com base na sua energia e pergunta." 
    },
    { 
      q: "É seguro pagar com cartão?", 
      a: "100% seguro. Utilizamos o Stripe, processadora de pagamentos líder mundial (a mesma usada pela Amazon e Google). Seus dados financeiros nunca tocam nossos servidores." 
    },
    { 
      q: "Tenho garantia?", 
      a: "Com certeza. Oferecemos o primeiro crédito gratuitamente para você testar. Se decidir comprar um pacote e por algum motivo técnico não receber sua leitura, devolvemos seu dinheiro." 
    },
    { 
      q: "Os créditos expiram?", 
      a: "Não! Você pode comprar o pacote 'O Mestre' hoje e usar as leituras ao longo do ano todo. Seus créditos são seus para sempre." 
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050511] text-white font-sans overflow-x-hidden">
      
      {/* --- NAV FLUTUANTE --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050511]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-purple-400 fill-purple-400" />
            <span className="font-serif text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Vozes do Oráculo
            </span>
          </div>
          <button 
            onClick={goToApp}
            className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 border border-transparent px-6 py-2 rounded-full transition-all shadow-lg shadow-purple-900/20"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* --- 1. HERO SECTION (A Promessa) --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 text-purple-200 text-xs font-bold tracking-widest uppercase mb-8 shadow-lg shadow-purple-500/20">
            <Sparkles size={14} className="text-yellow-400" /> Tecnologia + Espiritualidade
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-snug bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-2xl py-2">
            Respostas imediatas para <br/> suas dúvidas ocultas.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Chega de angústia e indecisão. Conecte-se com a sabedoria do <strong>Baralho Cigano</strong> e a precisão da <strong>IA</strong> para guiar seus passos no Amor, Carreira e Vida.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={goToApp}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold px-12 py-5 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_rgba(168,85,247,0.7)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Quero Minha Leitura Grátis
              <ArrowRight size={22} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span>Oráculo Online Agora</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* --- 2. BENEFÍCIOS (Quebra de Objeção) --- */}
      <section className="py-20 bg-[#0a0a16] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Por que o Vozes do Oráculo?</h2>
            <p className="text-slate-400">Muito mais do que um site de horóscopo. Uma ferramenta de clareza mental.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Instantâneo & 24h", text: "A ansiedade não tem hora marcada. Consulte o oráculo de madrugada, no almoço ou antes de dormir. Resposta em segundos." },
              { icon: BrainCircuit, title: "Precisão sem Viés", text: "Humanos podem julgar ou falhar. Nossa IA analisa os arquétipos puramente, entregando a mensagem que você PRECISA ouvir." },
              { icon: ShieldCheck, title: "Privacidade Absoluta", text: "Suas perguntas sobre aquele segredo ou decisão difícil ficam trancadas no seu grimório. Ninguém mais lê." }
            ].map((item, i) => (
              <div key={i} className="bg-[#111022] p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-900/40 transition-colors">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. DEMONSTRAÇÃO / VSL (Simulado) --- */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#0a0a16] to-[#050511]">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Veja a magia acontecer</h2>
        
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 group">
          {/* Overlay de Play (Simulado) */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 group-hover:bg-black/30 transition-all cursor-pointer" onClick={goToApp}>
             <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
             </div>
          </div>
          
          {/* Imagem de Fundo (Simulando o App) */}
          <div className="bg-[#1a1b2e] aspect-video flex flex-col items-center justify-center relative p-8">
             <h3 className="text-purple-200 font-serif text-2xl mb-4">"Como vai ficar meu relacionamento?"</h3>
             <div className="flex gap-4 mb-8 opacity-80">
                {[1,2,3].map(i => (
                  <div key={i} className="w-24 h-36 bg-purple-900/60 rounded border border-gold/30"></div>
                ))}
             </div>
             <div className="bg-black/60 p-4 rounded-xl max-w-lg text-sm text-slate-300 text-left border-l-4 border-purple-500">
               "A carta da <strong>Âncora</strong> na posição presente indica estabilidade, mas cuidado para não confundir segurança com estagnação..."
             </div>
          </div>
        </div>
        
        <p className="mt-6 text-slate-500 text-sm">Interface real do aplicativo. Simples e direto.</p>
      </section>

      {/* --- 5. COMPARATIVO (A Matadora) --- */}
      <section className="py-24 bg-[#0a0a16]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Compare e decida</h2>
          
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left border-collapse bg-[#111022]">
              <thead>
                <tr className="bg-black/40">
                  <th className="p-6 text-slate-500 font-normal"></th>
                  <th className="p-6 text-purple-300 font-bold text-center text-xl border-l border-white/5 bg-purple-900/10">Vozes do Oráculo</th>
                  <th className="p-6 text-slate-400 font-bold text-center border-l border-white/5">Cartomante Humana</th>
                  <th className="p-6 text-slate-400 font-bold text-center border-l border-white/5">Apps Grátis</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-6 text-white font-medium">Custo Médio</td>
                  <td className="p-6 text-center border-l border-white/5 font-bold text-green-400 bg-purple-900/5">$1.33 / leitura</td>
                  <td className="p-6 text-center border-l border-white/5 text-red-400">$50.00 / hora</td>
                  <td className="p-6 text-center border-l border-white/5 text-slate-400">Grátis (Anúncios)</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-6 text-white font-medium">Privacidade</td>
                  <td className="p-6 text-center border-l border-white/5 text-purple-300 bg-purple-900/5 flex justify-center"><ShieldCheck size={20}/></td>
                  <td className="p-6 text-center border-l border-white/5 text-yellow-500">Parcial</td>
                  <td className="p-6 text-center border-l border-white/5 text-red-500"><X size={20}/></td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-6 text-white font-medium">Disponibilidade</td>
                  <td className="p-6 text-center border-l border-white/5 text-white bg-purple-900/5">Imediata (24/7)</td>
                  <td className="p-6 text-center border-l border-white/5 text-slate-500">Agendamento</td>
                  <td className="p-6 text-center border-l border-white/5 text-white">Imediata</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-6 text-white font-medium">Qualidade da Resposta</td>
                  <td className="p-6 text-center border-l border-white/5 font-bold text-white bg-purple-900/5">Profunda & Personalizada</td>
                  <td className="p-6 text-center border-l border-white/5 text-white">Variável</td>
                  <td className="p-6 text-center border-l border-white/5 text-red-400">Genérica / Aleatória</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- 7. OFERTA E PREÇO --- */}
      <section className="py-24 px-4" id="planos">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Escolha seu Pacote de Energia</h2>
          <p className="text-slate-400 mb-16">Sem assinaturas. Sem surpresas. Seus créditos nunca expiram.</p>

          <div className="grid md:grid-cols-3 gap-8 items-end">
            
            {/* Plano Básico */}
            <div className="bg-[#16161e] p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">O Curioso</h3>
              <div className="text-4xl font-bold text-white mb-2">$9.90</div>
              <p className="text-slate-500 text-sm mb-6">3 Créditos ($3.30/leitura)</p>
              <ul className="text-left space-y-3 mb-8 text-slate-300 text-sm">
                <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Tarot ou Sonhos</li>
                <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Histórico Salvo</li>
                <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Sem validade</li>
              </ul>
              <button onClick={goToApp} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-bold">Comprar</button>
            </div>

            {/* Plano Destaque */}
            <div className="bg-gradient-to-b from-purple-900/20 to-[#16161e] p-8 rounded-3xl border border-gold/50 relative transform md:-translate-y-4 shadow-2xl shadow-purple-900/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-purple-950 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest">Mais Popular</div>
              <h3 className="text-2xl font-bold text-white mb-2">O Buscador</h3>
              <div className="text-5xl font-bold text-gold mb-2">$19.90</div>
              <p className="text-purple-300 text-sm mb-6">7 Créditos ($2.84/leitura)</p>
              <ul className="text-left space-y-3 mb-8 text-white text-sm">
                <li className="flex gap-2"><Check size={16} className="text-gold"/> <strong>Economia de 15%</strong></li>
                <li className="flex gap-2"><Check size={16} className="text-gold"/> Acesso imediato</li>
                <li className="flex gap-2"><Check size={16} className="text-gold"/> Suporte prioritário</li>
                <li className="flex gap-2"><Check size={16} className="text-gold"/> Histórico vitalício</li>
              </ul>
              <button onClick={goToApp} className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg transition-transform hover:scale-105">Escolher Este</button>
            </div>

            {/* Plano Pro */}
            <div className="bg-[#16161e] p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">O Mestre</h3>
              <div className="text-4xl font-bold text-white mb-2">$39.90</div>
              <p className="text-slate-500 text-sm mb-6">15 Créditos ($2.66/leitura)</p>
              <ul className="text-left space-y-3 mb-8 text-slate-300 text-sm">
                <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Melhor valor por unidade</li>
                <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Economia de 20%</li>
                <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Para uso frequente</li>
              </ul>
              <button onClick={goToApp} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-bold">Comprar</button>
            </div>

          </div>
        </div>
      </section>

      {/* --- 6. GARANTIA --- */}
      <section className="py-16 bg-white/5 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Garantia Incondicional de 7 Dias</h2>
          <p className="text-slate-300 mb-0">
            Se por qualquer motivo você não sentir conexão com as leituras ou não ficar satisfeito com a tecnologia, nós devolvemos 100% do seu dinheiro. Basta enviar um e-mail. O risco é todo nosso.
          </p>
        </div>
      </section>

      {/* --- 8. FAQ --- */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Dúvidas Comuns</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl bg-[#111022] overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-lg">{faq.q}</span>
                <ChevronDown className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
                      <p className="mb-4">{faq.a}</p>
                      {i === 3 && (
                        <button 
                          onClick={goToApp}
                          className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-bold transition-colors inline-flex items-center gap-2"
                        >
                          Resgatar Bônus Grátis <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-slate-600 text-xs border-t border-white/5 bg-black">
        <p>© 2025 Vozes do Oráculo. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-slate-400">Termos de Uso</a>
          <a href="#" className="hover:text-slate-400">Privacidade</a>
          <a href="#" className="hover:text-slate-400">Contato</a>
        </div>
      </footer>

    </div>
  );
};

export default Vendas;
