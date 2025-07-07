import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
    onLoginSuccess: () => void;
}

const AuthComponent: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (action: 'login' | 'signup') => {
    if (!supabase) {
        setError("O serviço de autenticação não está configurado.");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
        let authResponse;
        if (action === 'login') {
            authResponse = await supabase.auth.signInWithPassword({ email, password });
        } else {
            authResponse = await supabase.auth.signUp({ email, password });
        }

        const { error: authError } = authResponse;

        if (authError) {
          throw authError;
        }
        
        if (action === 'signup' && authResponse.data.user?.identities?.length === 0) {
            setMessage("Usuário já existe. Tente fazer login.");
        } else if (action === 'signup') {
            setMessage("Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de fazer login.");
        }
        // onLoginSuccess is handled by the onAuthStateChange listener in App.tsx

    } catch (err: any) {
        console.error(`Error during ${action}:`, err);
        setError(err.message || 'Ocorreu um erro. Verifique seus dados e tente novamente.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Acesse sua Conta</h2>
        <p className="text-center text-gray-600 mb-8">
          Faça login ou crie uma conta para continuar seu pedido.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => handleAuthAction('login')}
              disabled={isLoading || !email || !password}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={() => handleAuthAction('signup')}
              disabled={isLoading || !email || !password}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-200"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Auth = AuthComponent;
