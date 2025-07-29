-- FIX ROW LEVEL SECURITY FOR QUIZ_RESULTS TABLE
-- Execute this in your Supabase SQL Editor

-- STEP 1: DISABLE Row Level Security (for testing/development)
-- This allows all operations on the table without restrictions
-- RECOMMENDED FOR IMMEDIATE FIX
ALTER TABLE quiz_results DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT schemaname, tablename, rowsecurity, hasrlspolicy 
FROM pg_tables t
LEFT JOIN pg_class c ON c.relname = t.tablename
WHERE tablename = 'quiz_results';

-- If you see rowsecurity = false, then RLS is disabled and quiz saving should work

-- ================================================================
-- OPTIONAL: FOR PRODUCTION - CREATE PROPER RLS POLICIES
-- Only uncomment and run these if you want to re-enable RLS later
-- ================================================================

-- Step 2a: Re-enable RLS (ONLY if you want production security)
-- ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Step 2b: Create policies that allow users to manage their own data
-- Policy to allow users to INSERT their own records
-- CREATE POLICY "Users can insert own quiz results" ON quiz_results
--   FOR INSERT 
--   WITH CHECK (usuario_id = auth.uid()::text);

-- Policy to allow users to SELECT their own records
-- CREATE POLICY "Users can view own quiz results" ON quiz_results
--   FOR SELECT 
--   USING (usuario_id = auth.uid()::text);

-- Policy to allow users to UPDATE their own records (optional)
-- CREATE POLICY "Users can update own quiz results" ON quiz_results
--   FOR UPDATE 
--   USING (usuario_id = auth.uid()::text)
--   WITH CHECK (usuario_id = auth.uid()::text);

-- Policy to allow users to DELETE their own records (optional)
-- CREATE POLICY "Users can delete own quiz results" ON quiz_results
--   FOR DELETE 
--   USING (usuario_id = auth.uid()::text);

-- ================================================================
-- ALTERNATIVE: ALLOW ALL OPERATIONS (for public leaderboard)
-- Uncomment these if you want all users to see all quiz results
-- ================================================================

-- Policy to allow anyone to SELECT all records (for public leaderboard)
-- CREATE POLICY "Anyone can view all quiz results" ON quiz_results
--   FOR SELECT 
--   USING (true);

-- Policy to allow authenticated users to INSERT
-- CREATE POLICY "Authenticated users can insert quiz results" ON quiz_results
--   FOR INSERT 
--   TO authenticated
--   WITH CHECK (true);

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check current RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS Enabled",
    hasrlspolicy as "Has Policies"
FROM pg_tables t
LEFT JOIN pg_class c ON c.relname = t.tablename
WHERE tablename = 'quiz_results';

-- Show current policies (if any)
SELECT 
    policyname as "Policy Name", 
    cmd as "Operation", 
    permissive as "Permissive",
    roles as "Roles", 
    qual as "Using Condition",
    with_check as "With Check"
FROM pg_policies 
WHERE tablename = 'quiz_results';
