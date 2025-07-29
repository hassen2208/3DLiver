
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
export const getQuizHistory = async (userId) => {
  const { data, error } = await supabase
    .from('quiz_history')
    .select('*')
    .eq('userId', userId)
    .order('timeCompleted', { ascending: false });

  if (error) {
    console.error('Error fetching quiz history:', error);
    return [];
  }

  return data;
};