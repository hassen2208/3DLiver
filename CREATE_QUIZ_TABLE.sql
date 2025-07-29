-- EXECUTE THIS IN YOUR SUPABASE SQL EDITOR
-- Go to: https://supabase.com/dashboard -> Your Project -> SQL Editor
-- Copy and paste this entire SQL script and click RUN

-- Create quiz_results table for Supabase
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  user_answers TEXT NOT NULL, -- Changed to TEXT for JSON storage
  time_completed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  quiz_type TEXT DEFAULT 'liver-health',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_time_completed ON quiz_results(time_completed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id_time ON quiz_results(user_id, time_completed);

-- Enable Row Level Security (RLS) - OPTIONAL, can be disabled for testing
-- ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security - OPTIONAL, can be disabled for testing
-- CREATE POLICY "Users can view own quiz results" ON quiz_results
--   FOR SELECT USING (user_id = auth.uid()::text);

-- CREATE POLICY "Users can insert own quiz results" ON quiz_results
--   FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- CREATE POLICY "Users can update own quiz results" ON quiz_results
--   FOR UPDATE USING (user_id = auth.uid()::text);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_quiz_results_updated_at ON quiz_results;
CREATE TRIGGER update_quiz_results_updated_at
  BEFORE UPDATE ON quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Test the table creation by inserting a sample record
INSERT INTO quiz_results (
  user_id, 
  score, 
  total_questions, 
  percentage, 
  correct_answers, 
  incorrect_answers, 
  user_answers,
  quiz_type
) VALUES (
  'test-user-123',
  8,
  10, 
  80.00,
  8,
  2,
  '[{"questionId": 1, "question": "Test question", "selectedAnswer": "Test answer", "isCorrect": true}]',
  'liver-health'
);

-- Verify the table was created and data inserted
SELECT * FROM quiz_results WHERE user_id = 'test-user-123';

-- Clean up test data
DELETE FROM quiz_results WHERE user_id = 'test-user-123';

-- Show table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quiz_results' 
ORDER BY ordinal_position;
