import { isSupabaseConfigured, supabase } from './supabase';

export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export async function loadReviews() {
  if (!isSupabaseConfigured) return { reviews: [], error: 'not-configured' };

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) return { reviews: [], error: error.message };
  return { reviews: (data ?? []).map(mapReview), error: '' };
}

export async function addReview(rating: number, comment: string) {
  if (!isSupabaseConfigured) return 'not-configured';
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return 'not-authenticated';

  const { error } = await supabase
    .from('reviews')
    .insert({ rating, comment: comment.trim(), user_id: userData.user.id });

  return error?.message ?? '';
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}
