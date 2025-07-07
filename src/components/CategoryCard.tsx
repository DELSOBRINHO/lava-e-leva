import React from 'react';
import type { ServiceCategory } from '../types';

interface CategoryCardProps {
  category: ServiceCategory;
  onClick: () => void;
}

const CategoryCardComponent: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform"
    >
      <div className="mb-4">
        {category.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
    </button>
  );
};

export const CategoryCard = CategoryCardComponent;
