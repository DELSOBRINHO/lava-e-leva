import React from 'react';
import type { LaundryPartner } from '../types';

interface PartnerCardProps {
  partner: LaundryPartner;
  onSelect: () => void;
  disabled?: boolean;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PartnerCardComponent: React.FC<PartnerCardProps> = ({ partner, onSelect, disabled = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img className="h-48 w-full object-cover" src={partner.imageUrl} alt={partner.name} />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{partner.name}</h3>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < Math.round(partner.rating)} />
            ))}
          </div>
          <span className="ml-2 text-gray-600 font-semibold">{partner.rating.toFixed(1)}</span>
        </div>
        <p className="text-gray-500 mt-2">Entrega estimada: <span className="font-semibold text-gray-700">{partner.deliveryTime}</span></p>
        <button
          onClick={onSelect}
          disabled={disabled}
          className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-wait flex items-center justify-center"
        >
          {disabled ? 'Processando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  );
};

export const PartnerCard = PartnerCardComponent;
