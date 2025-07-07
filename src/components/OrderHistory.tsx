import React from 'react';
import type { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

const OrderHistoryComponent: React.FC<OrderHistoryProps> = ({ orders, onSelectOrder }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Meus Pedidos</h2>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectOrder(order)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="font-bold text-lg text-gray-800">{order.partner.name}</p>
                  <p className="text-sm text-gray-500">
                    Pedido #{order.id.slice(0, 8)} &bull; {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-6 w-full sm:w-auto">
                  <div className="text-right">
                     <p className="font-semibold text-xl text-blue-600">R$ {order.total.toFixed(2)}</p>
                  </div>
                   <div className="text-right">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        order.status === 'Entregue'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-gray-800">Nenhum pedido encontrado</h3>
          <p className="mt-1 text-gray-500">Parece que você ainda não fez nenhum pedido. Comece agora!</p>
        </div>
      )}
    </div>
  );
};

export const OrderHistory = OrderHistoryComponent;
