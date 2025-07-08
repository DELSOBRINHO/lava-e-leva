import './index.css'
import { Auth } from './pages/Auth'
import { Home } from './pages/Home'
import { Header } from './components/common'
import { NotificationProvider } from './contexts/NotificationContext'
import { useState } from 'react'

// Tipos de perfil
const roles = ['customer', 'delivery', 'laundry'] as const;
type Role = typeof roles[number];

export default function App() {
  // Simulação de autenticação e seleção de perfil
  const [role, setRole] = useState<Role | null>(null);

  if (!role) {
    return <Auth onAuth={setRole} />;
  }

  return (
    <NotificationProvider>
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Lava & Leva</h1>
            <button
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
              onClick={() => setRole(null)}
            >Trocar perfil</button>
          </header>
          <main className="p-8">
            <Home role={role} />
          </main>
        </div>
      </>
    </NotificationProvider>
  );
}
