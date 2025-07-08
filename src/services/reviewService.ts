import { supabase } from './supabaseClient';

export async function submitReview({
  orderId,
  rating,
  comment,
  targetType,
  targetId,
}: {
  orderId: string;
  rating: number;
  comment: string;
  targetType: 'laundry' | 'deliveryman';
  targetId: string;
}) {
  const { error } = await supabase.from('reviews').insert([
    {
      order_id: orderId,
      rating,
      comment,
      target_type: targetType,
      target_id: targetId,
    },
  ]);
  if (error) throw error;
} 