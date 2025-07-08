import React from 'react';

interface HomeProps {
  role: 'customer' | 'delivery' | 'laundry';
}

export const Home: React.FC<HomeProps> = ({ role }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Lava & Leva!</h2>
      {role === 'customer' && (
        <p className="mb-2">Você pode solicitar serviços de lavagem, acompanhar seus pedidos e avaliar parceiros.</p>
      )}
      {role === 'delivery' && (
        <p className="mb-2">Veja entregas disponíveis, acompanhe rotas e atualize seu status de entregador.</p>
      )}
      {role === 'laundry' && (
        <p className="mb-2">Gerencie pedidos, serviços e avaliações dos clientes da sua lavanderia.</p>
      )}
    </div>
  );
}; 