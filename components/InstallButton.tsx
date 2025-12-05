import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado (rodando como app)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Detecta se é iPhone/iPad (iOS não tem prompt automático, precisa de instrução)
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Captura o evento de instalação do Chrome/Android
    window.addEventListener('beforeinstallprompt', (e) => {
      // Previne que o navegador mostre a barra padrão feia
      e.preventDefault();
      // Guarda o evento para usarmos no clique do botão
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Dispara o prompt nativo do Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // Mostra instrução para iPhone
      alert("Para instalar no iPhone:\n\n1. Toque no botão 'Compartilhar' (quadrado com seta)\n2. Role para baixo\n3. Toque em 'Adicionar à Tela de Início'");
    }
  };

  // Se já estiver instalado, não mostra nada
  if (isStandalone) return null;

  // Só mostra o botão se tivermos capturado o evento (Android) ou se for iOS
  if (!deferredPrompt && !isIOS) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-2 text-xs tracking-widest uppercase text-yellow-400 hover:text-white transition-colors border border-yellow-500/30 hover:border-yellow-400/50 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-full animate-pulse"
    >
      <Download size={14} />
      <span className="hidden md:inline">Instalar App</span>
      <span className="md:hidden">App</span>
    </button>
  );
};

export default InstallButton;
