import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const roles = [
  { value: 'customer', label: 'Cliente' },
  { value: 'delivery', label: 'Entregador' },
  { value: 'laundry', label: 'Lavanderia' },
] as const;

type Role = typeof roles[number]['value'];

interface AuthProps {
  onAuth: (role: Role) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        const { error } = await signUp(email, password, role);
        if (error) setError(error.message);
        else onAuth(role);
      } else {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
        else onAuth(role);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? 'Criar Conta' : 'Entrar no Lava & Leva'}
        </h1>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2 text-sm font-medium">Senha</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label className="block mb-2 text-sm font-medium">Perfil</label>
        <select
          className="w-full mb-6 px-3 py-2 border rounded"
          value={role}
          onChange={e => setRole(e.target.value as Role)}
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2"
          disabled={loading}
        >
          {loading ? 'Aguarde...' : isRegister ? 'Cadastrar' : 'Entrar'}
        </button>
        <button
          type="button"
          className="w-full text-blue-600 underline text-sm"
          onClick={() => setIsRegister(r => !r)}
        >
          {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'}
        </button>
      </form>
    </div>
  );
}; 