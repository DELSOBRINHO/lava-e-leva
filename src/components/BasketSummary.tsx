import React from 'react';
import type { BasketItem } from '../types';

interface BasketSummaryProps {
  basket: BasketItem[];
  onConfirm: () => void;
}

const BasketSummaryComponent: React.FC<BasketSummaryProps> = ({ basket, onConfirm }) => {
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg text-gray-800">{totalItems} item(s) no cesto</p>
          <p className="text-2xl font-bold text-blue-600">Total: R$ {totalPrice.toFixed(2)}</p>
        </div>
        <button
          onClick={onConfirm}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Escolher Lavanderia
        </button>
      </div>
    </div>
  );
};

export const BasketSummary = BasketSummaryComponent;
