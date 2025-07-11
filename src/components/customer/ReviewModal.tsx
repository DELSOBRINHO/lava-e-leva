import { useState } from 'react';

interface AvaliacaoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function AvaliacaoModal({ open, onClose, onSubmit }: AvaliacaoModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-brand-dark">Avalie o serviço</h2>
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              className={star <= rating ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'}
              onClick={() => setRating(star)}
              type="button"
            >★</button>
          ))}
        </div>
        <textarea
          className="border border-brand-primary rounded-md p-2 w-full mb-4"
          rows={3}
          placeholder="Deixe um comentário (opcional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-md bg-gray-200 text-brand-dark" onClick={onClose} disabled={submitting}>Cancelar</button>
          <button
            className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-dark transition"
            onClick={async () => {
              setSubmitting(true);
              await onSubmit(rating, comment);
              setSubmitting(false);
            }}
            disabled={submitting}
          >{submitting ? 'Enviando...' : 'Enviar'}</button>
        </div>
      </div>
    </div>
  );
} 