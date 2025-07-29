-- MINIMAL QUIZ TABLE - EXECUTE IN SUPABASE SQL EDITOR
-- This creates the simplest possible table structure

-- Drop existing table to start fresh
DROP TABLE IF EXISTS quiz_results CASCADE;

-- Create minimal quiz_results table
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  user_answers TEXT,
  time_completed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quiz_type TEXT DEFAULT 'liver-health'
);

-- Create basic index
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);

-- Test the table with a simple insert
INSERT INTO quiz_results (user_id, score, total_questions, user_answers) 
VALUES ('test-user', 5, 10, '[]');

-- Verify the insert worked
SELECT * FROM quiz_results WHERE user_id = 'test-user';

-- Clean up test data
DELETE FROM quiz_results WHERE user_id = 'test-user';

-- Show the final table structure
\d quiz_results;
