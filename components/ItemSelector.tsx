import React from 'react';
import type { LaundryItem } from '../types';

interface ItemSelectorProps {
  item: LaundryItem;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ item, quantity, onQuantityChange }) => {
  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div>
        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-sm text-blue-600 font-medium">R$ {item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={quantity === 0}
        >
          -
        </button>
        <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ItemSelector;
