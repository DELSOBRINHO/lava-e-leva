import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServicesByLaundry } from '../../services/laundryService';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

export default function SelecaoServico() {
  const { laundryId } = useParams();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    if (laundryId) {
      getServicesByLaundry(laundryId)
        .then(setServices)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [laundryId]);

  async function handleAgendar() {
    if (!user || !selectedService || !date || !time || !laundryId) return;
    setSubmitting(true);
    try {
      await createOrder({
        customerId: user.id,
        laundryId,
        serviceId: selectedService,
        pickupDate: date,
        pickupTime: time,
        paymentMethod,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-brand-dark">Selecione um Serviço</h1>
      {loading && <div className="text-brand-primary">Carregando...</div>}
      {error && <div className="text-red-500">Erro: {error}</div>}
      <div className="space-y-2 mb-4">
        {services.map((service) => (
          <div key={service.id} className={`border border-brand-primary rounded-md p-4 shadow cursor-pointer transition ${selectedService === service.id ? 'bg-brand-accent/20 border-brand-accent' : 'hover:bg-brand-graylight'}`}
            onClick={() => setSelectedService(service.id)}>
            <div className="font-semibold text-brand-dark">{service.name}</div>
            <div className="text-sm text-brand-gray">{service.description}</div>
            <div className="text-sm text-brand-primary font-bold">R$ {service.price}</div>
          </div>
        ))}
        {!loading && services.length === 0 && <div className="text-brand-gray">Nenhum serviço disponível.</div>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-brand-dark">Data para coleta:</label>
        <input type="date" className="border border-brand-primary rounded-md p-2 w-full focus:ring-2 focus:ring-brand-accent" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-brand-dark">Horário:</label>
        <input type="time" className="border border-brand-primary rounded-md p-2 w-full focus:ring-2 focus:ring-brand-accent" value={time} onChange={e => setTime(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-brand-dark">Método de pagamento:</label>
        <select
          className="border border-brand-primary rounded-md p-2 w-full"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="pix">PIX</option>
          <option value="credit_card">Cartão de crédito</option>
          <option value="wallet">Saldo no app</option>
        </select>
      </div>
      <button
        className="bg-brand-primary text-white rounded-md px-4 py-2 shadow hover:bg-brand-dark transition"
        disabled={!selectedService || !date || !time || submitting}
        onClick={handleAgendar}
      >
        {submitting ? 'Agendando...' : 'Agendar Coleta'}
      </button>
      {success && (
        <div className="mt-4 text-green-600 font-semibold">Pedido agendado com sucesso!</div>
      )}
    </div>
  );
} 