import React, { useState, useCallback } from 'react';
import { getStainRemovalTips } from '../services/geminiService';
import { SparklesIcon } from '../constants';

const StainHelperComponent: React.FC = () => {
  const [stainDescription, setStainDescription] = useState('');
  const [tips, setTips] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetTips = useCallback(async () => {
    if (!stainDescription.trim()) {
      setError('Por favor, descreva a mancha.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTips('');

    try {
      const result = await getStainRemovalTips(stainDescription);
      setTips(result);
    } catch (err) {
      setError('Ocorreu um erro ao buscar as dicas. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [stainDescription]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-8 h-8 text-blue-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-800">Assistente de Manchas</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Tem uma mancha difícil? Descreva-a abaixo e nossa IA fornecerá dicas de pré-tratamento.
      </p>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="text"
          value={stainDescription}
          onChange={(e) => setStainDescription(e.target.value)}
          placeholder="Ex: mancha de vinho em camisa de algodão"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={handleGetTips}
          disabled={isLoading}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </>
          ) : (
            'Obter Dicas'
          )}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {tips && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <h4 className="font-semibold text-blue-800">Dicas da nossa IA:</h4>
          <p className="text-blue-700 whitespace-pre-wrap mt-2">{tips}</p>
        </div>
      )}
    </div>
  );
};

export const StainHelper = StainHelperComponent;
