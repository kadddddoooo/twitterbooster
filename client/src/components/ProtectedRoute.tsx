import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra un loader mentre verifichiamo l'autenticazione
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121217]">
        <Spinner size="lg" className="text-[#0BEFF7]" />
      </div>
    );
  }

  // Invece di reindirizzare alla pagina di login, mostra un messaggio con link alle impostazioni
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#121217] text-white">
        <div className="max-w-lg p-8 bg-[#1E2029] rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-2xl font-bold text-[#0BEFF7] mb-4">Autenticazione richiesta</h2>
          <p className="mb-6">
            Questa funzionalità richiede un account autenticato. Puoi accedere o registrarti dalla pagina delle impostazioni.
          </p>
          <div className="flex justify-between">
            <Link href="/">
              <a className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors">
                Torna alla home
              </a>
            </Link>
            <Link href="/settings">
              <a className="px-6 py-2 bg-[#0BEFF7] hover:bg-[#0CDFEA] rounded-lg text-[#121217] font-bold transition-colors">
                Vai alle impostazioni
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderizza i figli se l'utente è autenticato
  return <>{children}</>;
};

export default ProtectedRoute; 