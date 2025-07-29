import { supabase } from '../services/supabaseQuizService';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('quiz_results')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection successful!');
    return { success: true, message: 'Database connected successfully' };
  } catch (err) {
    console.error('Database connection error:', err);
    return { success: false, error: err.message };
  }
};

export const testSaveQuizResult = async () => {
  try {
    console.log('Testing quiz save functionality...');
    
    const testData = {
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      correctAnswers: 8,
      incorrectAnswers: 2,
      userAnswers: [
        { questionId: 1, question: "Test question", selectedAnswer: "Test answer", isCorrect: true }
      ]
    };
    
    const testUserId = 'test-user-id';
    
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([{
        user_id: testUserId,
        score: testData.score,
        total_questions: testData.totalQuestions,
        percentage: testData.percentage,
        correct_answers: testData.correctAnswers,
        incorrect_answers: testData.incorrectAnswers,
        user_answers: JSON.stringify(testData.userAnswers),
        time_completed: new Date().toISOString(),
        quiz_type: 'liver-health'
      }])
      .select();
    
    if (error) {
      console.error('Quiz save test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Quiz save test successful!', data);
    return { success: true, data };
  } catch (err) {
    console.error('Quiz save test error:', err);
    return { success: false, error: err.message };
  }
};
