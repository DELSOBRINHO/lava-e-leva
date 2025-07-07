import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { LaundryPartner } from '../types';
import { PartnerCard } from './PartnerCard';
import { PARTNERS } from '../constants';

interface PartnerSelectionProps {
  onPartnerSelect: (partner: LaundryPartner) => Promise<void>;
}

const PartnerSelectionComponent: React.FC<PartnerSelectionProps> = ({ onPartnerSelect }) => {
  const [partners, setPartners] = useState<LaundryPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      setError(null);

      // If Supabase is not configured, use mock data as a fallback.
      if (!supabase) {
        console.log("Supabase not configured, using mock partner data.");
        setTimeout(() => {
          setPartners(PARTNERS);
          setIsLoading(false);
        }, 300);
        return;
      }

      // If Supabase is configured, try to fetch data.
      try {
        const { data, error: fetchError } = await supabase
          .from('partners')
          .select('*');

        if (fetchError) {
          throw fetchError;
        }

        setPartners(data as LaundryPartner[]);
      } catch (err: any) {
        console.error('Error fetching partners from Supabase:', err);
        setError('Não foi possível carregar as lavanderias. Por favor, tente novamente mais tarde.');
        // Fallback to mock data on error
        setPartners(PARTNERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);
  
  const handleSelect = async (partner: LaundryPartner) => {
      setIsCreatingOrder(true);
      await onPartnerSelect(partner);
      // No need to set isCreatingOrder back to false, as the view will change.
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-600">Carregando parceiros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Erro de Conexão</p>
                <p>{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Escolha uma Lavanderia</h2>
      <p className="text-lg text-gray-600 mb-6">Selecione um de nossos parceiros de confiança.</p>
      {partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map(partner => (
            <PartnerCard 
                key={partner.id} 
                partner={partner} 
                onSelect={() => handleSelect(partner)}
                disabled={isCreatingOrder}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-12 px-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Nenhuma Lavanderia Encontrada</h3>
            <p className="text-gray-500 mt-2">No momento, não há parceiros disponíveis. Por favor, verifique novamente mais tarde.</p>
        </div>
      )}
    </div>
  );
};

export const PartnerSelection = PartnerSelectionComponent;
