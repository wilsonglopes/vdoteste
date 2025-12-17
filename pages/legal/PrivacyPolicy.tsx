import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
          <Shield className="text-purple-500" /> Política de Privacidade
        </h1>

        <div className="space-y-6 text-sm md:text-base leading-relaxed bg-white/5 p-8 rounded-2xl border border-white/10">
          <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">1. Introdução</h2>
            <p>
              O Vozes do Oráculo respeita a sua privacidade e está comprometido em proteger os seus dados pessoais. 
              Esta política explica como coletamos, usamos e protegemos suas informações ao utilizar nosso site e serviços de oráculo.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">2. Coleta de Dados</h2>
            <p>Para fornecer nossas leituras personalizadas, coletamos as seguintes informações:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nome e Data de Nascimento (para personalização astrológica/numerológica da leitura).</li>
              <li>Endereço de E-mail (para criação de conta e recuperação de histórico).</li>
              <li>Dados de pagamento (processados de forma segura por terceiros, não armazenamos dados de cartão de crédito).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">3. Uso das Informações</h2>
            <p>Utilizamos seus dados exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gerar as interpretações de Tarot e Sonhos via Inteligência Artificial.</li>
              <li>Manter seu histórico de leituras acessível no seu Grimório pessoal.</li>
              <li>Comunicar atualizações do sistema ou ofertas, caso você tenha consentido.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">4. Segurança</h2>
            <p>
              Adotamos medidas de segurança técnicas para proteger seus dados. As senhas são criptografadas e o acesso ao banco de dados é restrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-2">5. Seus Direitos</h2>
            <p>
              Você tem o direito de solicitar a exclusão de sua conta e de todos os seus dados a qualquer momento, entrando em contato através dos nossos canais de suporte ou diretamente nas configurações do seu perfil.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl text-white font-bold mb-2">6. Contato</h2>
            <p>
              Para dúvidas sobre esta política, entre em contato pelo e-mail: suporte@vozesdooraculo.com.br
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
