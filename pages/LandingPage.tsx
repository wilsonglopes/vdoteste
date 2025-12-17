import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Star, ArrowRight, CheckCircle2, Zap, HelpCircle, 
  BrainCircuit, MessageSquare, MousePointerClick, Eye, Gift
} from 'lucide-react';
import AuthModal from '../components/AuthModal'; // <--- Importando o Modal

// --- ASSETS ---
const HERO_BG = "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/criativos/fundo1_lp.jpg";
const LEQUE_CARTAS = "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/criativos/leque.jpg"; 

// --- IMAGENS DAS CARTAS ---
const CARD_IMAGES = {
  FUTURO: "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/criativos/sol.jpg",     
  AMOR: "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/criativos/coracao.jpg",   
  FINANCAS: "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/criativos/peixes.jpg", 
  DESTINO: "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/criativos/chave.jpg"    
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false); // Estado para controlar o modal

  const handleRegister = () => {
    // Agora abre o modal em vez de redirecionar
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    // FORÇA O NAVEGADOR A IR PARA O SUBDOMÍNIO
    window.location.href = 'https://app.vozesdooraculo.com.br';
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* MODAL DE CADASTRO (Invisível até clicar no botão) */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />

      {/* ================= HERO SECTION (FULL SCREEN) ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="Universo Místico" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl px-4 mx-auto text-center flex flex-col items-center mt-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-2 bg-green-900/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-green-500/30"
          >
            <Gift size={14} className="text-green-400" />
            <span className="text-xs font-bold text-green-200 uppercase tracking-widest">Oferta de Boas-Vindas</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-6 drop-shadow-[0_0_25px_rgba(0,0,0,0.8)] leading-tight uppercase tracking-tighter"
          >
            Cadastre-se e Ganhe<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-400">3 consultas gratuitas</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-2xl text-slate-200 font-light max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow-md"
          >
            Análise simbólica e interpretativa <strong className="text-yellow-400">para quem busca clareza interior</strong> e compreensão mais profunda de si mesmo(a).
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegister}
            className="group relative bg-white text-black px-12 py-5 rounded-full text-lg font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Resgatar Meus 3 Créditos <ArrowRight size={20} />
            </span>
          </motion.button>
          
          <p className="mt-4 text-xs text-slate-400 uppercase tracking-widest">Sem necessidade de cartão de crédito</p>
        </div>
      </section>

      {/* ================= O QUE RESOLVEMOS (FULL WIDTH) ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 py-24 bg-[#080808] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-6xl font-serif text-white mb-4 uppercase tracking-wide">Símbolos para reflexão pessoal</h2>
            <p className="text-purple-300/80 text-sm md:text-base uppercase tracking-widest">Cada carta representa um tema para reflexão pessoal</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full">
            {[
              { title: "Caminhos & Possibilidades", subtitle: "O SOL", img: CARD_IMAGES.FUTURO, desc: "Reflexões sobre vitalidade, energia e clareza." },
              { title: "Relações & Emoções", subtitle: "O CORAÇÃO", img: CARD_IMAGES.AMOR, desc: "Temas ligados a sentimentos, vínculos e afetos." },
              { title: "Movimento & Recursos", subtitle: "OS PEIXES", img: CARD_IMAGES.FINANCAS, desc: "Simbolismos sobre fluxo, decisões e organização." },
              { title: "Escolhas & Direções", subtitle: "A CHAVE", img: CARD_IMAGES.DESTINO, desc: "Reflexões sobre caminhos, alternativas e mudanças." },
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="group cursor-pointer flex flex-col items-center text-center w-full"
                onClick={handleRegister}
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-6 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] border border-purple-500/20 group-hover:border-purple-500/80">
                  <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
                     <span className="text-xs md:text-sm font-bold text-purple-200 uppercase tracking-widest">{card.subtitle}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-purple-400 transition-colors">{card.title}</h3>
                <p className="text-slate-500 text-sm px-2 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SEÇÃO DO LEQUE (INSERIDA) ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 py-12 bg-[#050505] overflow-hidden flex justify-center">
        <div className="relative w-full max-w-screen-2xl px-4 flex justify-center">
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            src={LEQUE_CARTAS} 
            alt="Escolha suas Cartas" 
            className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          />
          <div className="absolute top-0 left-0 h-full w-1/5 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-1/5 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ================= COMO FUNCIONA (FULL WIDTH) ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Como Funciona?</h2>
             <p className="text-slate-400 text-lg">Em 4 passos simples você terá a clareza que precisa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
             {[
               { 
                 step: "01", 
                 title: "Mentalize", 
                 text: "Concentre-se no que você precisa saber. Amor, dinheiro ou conselho geral?",
                 icon: <BrainCircuit size={28} className="text-purple-400"/>
               },
               { 
                 step: "02", 
                 title: "Cadastre-se", 
                 text: "Crie sua conta gratuita em segundos para liberar o acesso ao oráculo.",
                 icon: <MousePointerClick size={28} className="text-blue-400"/>
               },
               { 
                 step: "03", 
                 title: "Escolha", 
                 text: "Na nossa mesa virtual, sua intuição guia a escolha das cartas.",
                 icon: <Sparkles size={28} className="text-pink-400"/>
               },
               { 
                 step: "04", 
                 title: "Revele", 
                 text: "Receba sua interpretação completa e imediata usando seus créditos grátis.",
                 icon: <Eye size={28} className="text-yellow-400"/>
               }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl relative group hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-start w-full"
               >
                 <div className="absolute top-4 right-4 opacity-10 font-serif text-7xl font-bold text-white group-hover:opacity-20 transition-opacity">
                   {item.step}
                 </div>
                 
                 <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 transition-colors border border-white/5">
                   {item.icon}
                 </div>

                 <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{item.title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                   {item.text}
                 </p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* ================= OFERTA DE CADASTRO ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 py-24 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Seu Destino Espera</h2>
            <p className="text-slate-400">Não cobramos nada para você começar.</p>
          </div>

          <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
            <div className="bg-[#0f0f15] rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden">
              
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-yellow-500/20 p-4 rounded-full mb-6">
                  <Gift size={48} className="text-yellow-400" />
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Conta Gratuita</h3>
                <div className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-6 font-bold">
                  3 Créditos
                </div>

                <ul className="space-y-4 mb-10 text-left inline-block">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span>Acesso ao Oráculo de Cartas Ciganas</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span>Interpretação de Sonhos</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span>Histórico das suas leituras salvo</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <Zap className="text-yellow-400" size={20} />
                    <span className="text-white font-bold">Resultado Imediato</span>
                  </li>
                </ul>

                <button 
                  onClick={handleRegister}
                  className="w-full md:w-auto px-12 py-5 bg-white text-black font-bold rounded-full hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] text-lg uppercase tracking-wider flex items-center justify-center gap-3"
                >
                  <Star size={20} className="fill-black" />
                  Criar Conta Grátis
                </button>
                
                <p className="mt-4 text-slate-500 text-sm">Promoção por tempo limitado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEPOIMENTOS ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 text-white">Depoimentos</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Renata V.",
                img: "https://randomuser.me/api/portraits/women/65.jpg",
                text: "Eu estava cética no início. A leitura trouxe reflexões profundas e me ajudou a enxergar minha situação com mais clareza emocional.",
              },
              {
                name: "Marcos A.",
                img: "https://randomuser.me/api/portraits/men/44.jpg",
                text: "A tiragem de carreira trouxe reflexões importantes. Eu estava vivendo um momento difícil no trabalho e a leitura me ajudou a olhar para essa situação com mais consciência.",
              },
              {
                name: "Juliana K.",
                img: "https://randomuser.me/api/portraits/women/90.jpg",
                text: "A experiência foi marcante. Ao refletir sobre uma situação do passado, a leitura me trouxe alívio e uma nova perspectiva emocional.",
              },
              {
                name: "Patrícia L.",
                img: "https://randomuser.me/api/portraits/women/22.jpg",
                text: "Costumo usar com frequência para refletir sobre meu relacionamento. A leitura me ajuda a compreender melhor as emoções envolvidas e agir com mais equilíbrio.",
              },
              {
                name: "Eduardo S.",
                img: "https://randomuser.me/api/portraits/men/86.jpg",
                text: "A interpretação é detalhada e foge do óbvio. A experiência é envolvente e convida a uma conexão mais profunda com as próprias emoções.",
              },
              {
                name: "Camila T.",
                img: "https://randomuser.me/api/portraits/women/12.jpg",
                text: "Eu estava em dúvida entre dois caminhos. A leitura trouxe reflexões sobre cada possibilidade e me ajudou a tomar uma decisão com mais tranquilidade."
              }
            ].map((user, i) => (
              <div key={i} className="bg-[#121214] p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src={user.img} alt={user.name} className="w-12 h-12 rounded-full border border-purple-500/50 object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{user.name}</h4>
                    <div className="flex text-yellow-500 text-[10px] gap-0.5 mt-1">
                      <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 font-light text-sm italic leading-relaxed">"{user.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 py-20 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-serif text-center text-white mb-10">Dúvidas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "É realmente grátis?", a: "Sim! Ao se cadastrar, você ganha automaticamente 3 créditos para usar como quiser. Sem pegadinhas." },
              { q: "Preciso cadastrar cartão?", a: "Não. O cadastro pede apenas seu nome e e-mail para salvar seu histórico de leituras." },
              { q: "Como funciona a leitura?", a: "Você mentaliza sua questão, escolhe as cartas e nossa tecnologia interpreta o significado baseada na sabedoria ancestral." }
            ].map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2"><HelpCircle size={18} className="text-purple-400"/> {faq.q}</h3>
                <p className="text-slate-400 text-sm pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black py-8 border-t border-white/10 text-center md:text-left">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
    
    <div className="text-slate-500 text-sm">
      © {new Date().getFullYear()} Vozes do Oráculo. Todos os direitos reservados.
    </div>

    <div className="flex gap-6 text-sm">
      <a href="/#/privacidade" className="text-slate-400 hover:text-purple-400 transition-colors">
        Política de Privacidade
      </a>
      <a href="/#/termos" className="text-slate-400 hover:text-purple-400 transition-colors">
        Termos de Uso
      </a>
    </div>
    
  </div>
  
  {/* Disclaimer Obrigatório Pequeno no Rodapé */}
  <div className="max-w-4xl mx-auto mt-6 text-center px-4">
    <p className="text-[10px] text-slate-600 uppercase tracking-widest">
      Este site é para fins de entretenimento. Não substituímos aconselhamento profissional.
    </p>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;
