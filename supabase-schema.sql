-- Create quiz_results table for Supabase
-- Execute this SQL in your Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  correct_answers JSONB NOT NULL,
  incorrect_answers JSONB NOT NULL,
  user_answers JSONB NOT NULL,
  time_completed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  quiz_type TEXT DEFAULT 'liver-health',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_time_completed ON quiz_results(time_completed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id_time ON quiz_results(user_id, time_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can only see their own quiz results
CREATE POLICY "Users can view own quiz results" ON quiz_results
  FOR SELECT USING (user_id = auth.uid()::text);

-- Users can only insert their own quiz results
CREATE POLICY "Users can insert own quiz results" ON quiz_results
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Users can only update their own quiz results
CREATE POLICY "Users can update own quiz results" ON quiz_results
  FOR UPDATE USING (user_id = auth.uid()::text);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_quiz_results_updated_at
  BEFORE UPDATE ON quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for quiz statistics
CREATE OR REPLACE VIEW user_quiz_stats AS
SELECT 
  user_id,
  user_email,
  user_name,
  COUNT(*) as total_quizzes,
  AVG(percentage) as average_percentage,
  MAX(percentage) as best_percentage,
  MIN(percentage) as worst_percentage,
  MAX(time_completed) as last_quiz_date,
  MIN(time_completed) as first_quiz_date
FROM quiz_results
GROUP BY user_id, user_email, user_name;
