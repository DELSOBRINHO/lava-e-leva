import { useEffect, useState } from 'react';
import { getLaundries } from '../../services/laundryService';
import { useNavigate } from 'react-router-dom';

export default function LaundrySearch() {
  const [laundries, setLaundries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getLaundries()
      .then(setLaundries)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-brand-dark">Laundry Search</h1>
      {/* Search filters (location, rating, price, services) */}
      <div className="mb-4">
        <input className="border border-brand-primary rounded-md p-2 w-full focus:ring-2 focus:ring-brand-accent" placeholder="Type name, neighborhood or service..." />
      </div>
      {loading && <div className="text-brand-primary">Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {/* Laundry list (initial mock) */}
      <div className="space-y-2">
        {laundries.map((laundry) => (
          <div
            key={laundry.id}
            className="border border-brand-primary rounded-md p-4 shadow flex items-center gap-4 cursor-pointer hover:bg-brand-graylight transition"
            onClick={() => navigate(`/lavanderia/${laundry.id}/servicos`)}
          >
            {laundry.logo_url && (
              <img src={laundry.logo_url} alt={laundry.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-accent" />
            )}
            <div>
              <div className="font-semibold text-brand-dark flex items-center gap-2">
                {laundry.name}
                {typeof laundry.rating === 'number' && (
                  <span className="flex items-center gap-1 text-yellow-400 text-base font-normal">
                    ★ {laundry.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="text-sm text-brand-gray">{laundry.address?.street || 'Endereço não informado'}</div>
            </div>
          </div>
        ))}
        {!loading && laundries.length === 0 && <div className="text-brand-gray">Nenhuma lavanderia encontrada.</div>}
      </div>
    </div>
  );
} 