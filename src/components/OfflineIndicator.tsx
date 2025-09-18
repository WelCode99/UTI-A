import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  
  if (isOnline) return null;
  
  return (
    <div className="
      fixed top-0 left-0 right-0 z-50
      bg-yellow-600 text-yellow-100
      px-4 py-2 text-center text-sm font-medium
      flex items-center justify-center gap-2
      border-b border-yellow-500
    ">
      <WifiOff className="w-4 h-4" />
      🔌 Modo Offline - UTI.AI funcionando localmente. Dados serão sincronizados quando reconectar.
    </div>
  );
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar prompt após algumas interações
      const interactions = parseInt(localStorage.getItem('pwa-interactions') || '0');
      const lastPromptTime = localStorage.getItem('pwa-prompt-time');
      
      if (!lastPromptTime || Date.now() - parseInt(lastPromptTime) > 86400000) {
        if (interactions >= 3) {
          setTimeout(() => setShowPrompt(true), 30000);
        }
      }
    };

    const handleInteraction = () => {
      const count = parseInt(localStorage.getItem('pwa-interactions') || '0');
      localStorage.setItem('pwa-interactions', (count + 1).toString());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwainstallable', handleBeforeInstallPrompt);
    window.addEventListener('click', handleInteraction);
    
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwainstallable', handleBeforeInstallPrompt);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      } else {
        localStorage.setItem('pwa-prompt-time', Date.now().toString());
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    } finally {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-time', Date.now().toString());
  };

  if (isInstalled || !deferredPrompt || !showPrompt) {
    return null;
  }

  return (
    <div className="
      fixed bottom-4 left-4 right-4 z-50
      bg-gradient-to-r from-purple-900 to-blue-900
      border border-purple-500 rounded-lg p-4 shadow-2xl
      max-w-md mx-auto
    ">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ×
      </button>

      <div className="flex gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          🏥
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">
            Instalar UTI.AI
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            Acesso rápido, funcionamento offline e notificações de avaliações.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 border border-gray-500 text-gray-300 px-3 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Mais Tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
