-- SIMPLE QUIZ TABLE CREATION
-- Execute this in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard -> Your Project -> SQL Editor

-- Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS quiz_results;

-- Create a simple quiz_results table
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  user_answers TEXT NOT NULL,
  time_completed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quiz_type TEXT DEFAULT 'liver-health',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);

-- Test insert to verify table works
INSERT INTO quiz_results (
  user_id, 
  score, 
  total_questions, 
  percentage, 
  user_answers,
  quiz_type
) VALUES (
  'test-user-123',
  8,
  10, 
  80.00,
  '[{"questionId": 1, "question": "Test", "selectedAnswer": "Test", "isCorrect": true}]',
  'liver-health'
);

-- Verify the test data
SELECT * FROM quiz_results WHERE user_id = 'test-user-123';

-- Clean up test data
DELETE FROM quiz_results WHERE user_id = 'test-user-123';

-- Show final table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quiz_results' 
ORDER BY ordinal_position;
