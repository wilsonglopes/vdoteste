import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Moon, Star, ArrowRight, ShieldCheck, Heart, ChevronDown, Zap, MessageCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const goToApp = () => {
    navigate('/'); 
  };

  const faqs = [
    { q: "Como o oráculo consegue ler as cartas?", a: "O Vozes do Oráculo utiliza um sistema avançado que combina milhares de padrões de tiragens clássicas do Baralho Cigano com arquétipos profundos, cruzando os significados das cartas com a sua energia e pergunta para gerar uma leitura única." },
    { q: "É seguro consultar?", a: "Totalmente. Utilizamos plataformas de pagamento blindadas e seus dados pessoais e espirituais são mantidos em sigilo absoluto no seu grimório pessoal." },
    { q: "Preciso ser esotérico para usar?", a: "Não! O Vozes do Oráculo é para todos que buscam clareza, seja no amor, trabalho ou autoconhecimento. A linguagem é simples, direta e acolhedora." },
    { q: "O que acontece se eu não gostar?", a: "Confiamos tanto na conexão que a primeira leitura é um presente nosso (bônus de cadastro). Você vive a experiência sem compromisso." }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050511] text-white font-sans overflow-x-hidden">
      
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050511]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-purple-400 fill-purple-400" />
            <span className="font-serif text-xl font-bold tracking-wide">Vozes do Oráculo</span>
          </div>
          <button 
            onClick={goToApp}
            className="text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 rounded-full transition-all"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 text-purple-200 text-xs font-bold tracking-widest uppercase mb-8 shadow-lg shadow-purple-500/20">
            <Sparkles size={14} className="text-yellow-400" /> Sabedoria Ancestral
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-snug bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-lg py-4">
            O Universo tem uma <br/> mensagem para você.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
            Desbloqueie respostas imediatas sobre seu destino. <br className="hidden md:block"/>
            A magia do <strong className="text-white">Baralho Cigano</strong> interpretada com precisão absoluta para o seu momento.
          </p>

          <p className="text-sm text-purple-300 italic mb-10 max-w-lg mx-auto border-l-2 border-purple-500 pl-4 py-2 bg-purple-900/10 rounded-r-lg">
            "Para uma revelação verdadeira, respire fundo e concentre-se em sua pergunta. Atraia boas energias antes de iniciar."
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={goToApp}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold px-12 py-5 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_rgba(168,85,247,0.7)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Consultar Grátis
              <ArrowRight size={22} />
            </button>
            <span className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Bônus Disponível
            </span>
          </div>
        </motion.div>
      </header>

      {/* SOCIAL PROOF */}
      <div className="w-full border-y border-white/5 bg-black/20 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest text-center">
          <span className="flex items-center gap-2"><Users className="text-purple-500" /> +15.000 Leituras Realizadas</span>
          <span className="flex items-center gap-2"><ShieldCheck className="text-green-500" /> 100% Seguro e Privado</span>
          <span className="flex items-center gap-2"><Star className="text-yellow-500" /> 4.9/5 Avaliação Média</span>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Como funciona a magia?</h2>
            <p className="text-slate-400">Em apenas 3 passos simples, você terá a clareza que procura.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageCircle, title: "1. Pergunte", text: "Concentre-se no que te aflige. Amor, dinheiro ou saúde? Digite sua dúvida para o oráculo." },
              { icon: Sparkles, title: "2. Escolha", text: "Use sua intuição para selecionar 9 cartas do baralho sagrado. Sua energia guia o resultado." },
              { icon: Zap, title: "3. Receba", text: "Nossa sabedoria analisa os arquétipos e te entrega uma interpretação detalhada e acolhedora em segundos." }
            ].map((step, i) => (
              <div key={i} className="bg-[#111022] p-8 rounded-3xl border border-white/5 hover:border-purple-500/50 transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                  <step.icon className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-24 bg-gradient-to-b from-[#0f0c29] to-[#1a1638]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center">Histórias de quem já consultou</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Camila R.", role: "Artesã", text: "Eu estava travada sem saber se investia no meu ateliê. A leitura foi tão clara que me deu coragem. Hoje estou vendendo o dobro!", stars: 5 },
              { name: "Juliana M.", role: "Designer", text: "Impressionante. Eu sempre fui cética, mas a interpretação do meu sonho bateu exatamente com o que estou vivendo. Arrepiei.", stars: 5 },
              { name: "Patricia S.", role: "Empresária", text: "Uso toda semana para planejar meus passos. É como ter uma mentora espiritual no bolso. O valor é simbólico pelo que entrega.", stars: 5 }
            ].map((dep, i) => (
              <div key={i} className="bg-[#0f0c29] p-8 rounded-2xl border border-white/10 relative">
                <div className="absolute -top-4 left-8 text-6xl text-purple-800 opacity-50 font-serif">"</div>
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(dep.stars)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 italic mb-6 relative z-10 leading-relaxed">"{dep.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{dep.name}</p>
                    <p className="text-xs text-purple-400">{dep.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Perguntas Frequentes</h2>
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
                          Resgatar meu Bônus Grátis <ArrowRight size={16} />
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

      {/* CTA FINAL – CORRIGIDO */}
      <section className="py-20 px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 leading-normal md:leading-tight break-words">
            Seu futuro espera por uma pergunta.
          </h2>

          <p className="text-xl text-slate-400 mb-12">
            Cadastre-se agora e receba <strong>1 Crédito Grátis</strong> para sua primeira revelação.
          </p>
          
          <button 
            onClick={goToApp}
            className="bg-white text-purple-950 hover:bg-purple-50 font-bold px-12 py-5 rounded-full text-xl shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            Quero Minha Leitura Grátis
            <ArrowRight size={24} />
          </button>
          
          <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1"><ShieldCheck size={14} /> Compra Segura</span>
            <span className="flex items-center gap-1"><Heart size={14} /> Feito com Magia</span>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-600 text-xs border-t border-white/5 bg-black">
        <p>© 2025 Vozes do Oráculo. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
