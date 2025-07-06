import { LAUNDRY_ITEMS } from '../constants';
import type { ServiceCategory, LaundryItem, BasketItem } from '../types';
import ItemSelector from './ItemSelector';

interface ServiceSelectionProps {
  category: ServiceCategory;
  basket: BasketItem[];
  updateBasket: (item: LaundryItem, quantity: number) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ category, basket, updateBasket }) => {
  const itemsInCategory = LAUNDRY_ITEMS.filter(item => item.category === category.id);

  const getQuantity = (itemId: string) => {
    const itemInBasket = basket.find(item => item.id === itemId);
    return itemInBasket ? itemInBasket.quantity : 0;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <h2 className="text-3xl font-bold text-gray-800 mb-2">Selecione os Itens</h2>
       <p className="text-lg text-gray-600 mb-6">Escolha os itens da categoria "{category.name}" para limpar.</p>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {itemsInCategory.map(item => (
          <ItemSelector
            key={item.id}
            item={item}
            quantity={getQuantity(item.id)}
            onQuantityChange={(quantity) => updateBasket(item, quantity)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
