import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Check:');
console.log('🔹 URL exists:', !!supabaseUrl);
console.log('🔹 URL value:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING');
console.log('🔹 Key exists:', !!supabaseKey);
console.log('🔹 Key value:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test database connection and table existence
export const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    
    // First, try to get the table structure to see what columns exist
    try {
      const { data: columns, error: structureError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'quiz_results');
      
      if (!structureError && columns && columns.length > 0) {
        console.log('📊 Current table structure:');
        columns.forEach(col => {
          console.log(`   ${col.column_name}: ${col.data_type}`);
        });
      }
    } catch (err) {
      console.log('ℹ️ Could not fetch table structure - might not exist yet');
    }
    
    // Test if the quiz_results table exists
    const { data, error } = await supabase
      .from('quiz_results')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database test failed:', error);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('🚨 TABLE DOES NOT EXIST: quiz_results table not found in database');
        console.error('💡 SOLUTION: You need to create the database table!');
        console.error('📋 STEPS TO FIX:');
        console.error('   1. Go to https://supabase.com/dashboard');
        console.error('   2. Select your project');
        console.error('   3. Go to SQL Editor');
        console.error('   4. Copy and paste the contents of MINIMAL_QUIZ_TABLE.sql');
        console.error('   5. Click RUN to create the table');
        console.error('   6. Refresh this page and try again');
        
        return { 
          success: false, 
          error: 'Database table "quiz_results" does not exist. Please create it using the SQL script.', 
          code: error.code,
          needsTableCreation: true
        };
      }
      
      return { success: false, error: error.message || JSON.stringify(error), code: error.code };
    }
    
    console.log('✅ Database connection successful! Table exists.');
    return { success: true };
  } catch (err) {
    console.error('💥 Database connection error:', err);
    console.error('💥 Full error object:', JSON.stringify(err, null, 2));
    return { success: false, error: err.message };
  }
};



// Save quiz result to Supabase
export const saveQuizResult = async (userId, quizData) => {
  console.log('🚀 === STARTING SAVE QUIZ RESULT ===');
  console.log('🔹 Input userId:', userId);
  console.log('🔹 Input quizData:', quizData);
  
  try {
    // Check current auth state
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('🔐 Current auth user:', user);
    console.log('🔐 Auth error:', authError);
    console.log('🔐 User ID from auth:', user?.id);
    console.log('🔐 User ID from input:', userId);
    console.log('🔐 Do they match?:', user?.id === userId);
    
    // First test if we can connect to the table
    console.log('🔍 Testing table access...');
    const testResult = await testDatabaseConnection();
    console.log('🔹 Table test result:', testResult);
    
    if (!testResult.success) {
      console.error('❌ Table access failed, aborting save');
      return { success: false, error: 'Database table not accessible: ' + testResult.error };
    }
    
    const quizResult = {
      usuario_id: userId,           // user_id -> usuario_id
      email: quizData.userEmail || '', // Get email from quizData
      preguntas: quizData.totalQuestions,  // total_questions -> preguntas
      correctas: quizData.score,           // score -> correctas
      calificacion: quizData.percentage || Math.round((quizData.score / quizData.totalQuestions) * 100), // percentage -> calificacion
      fecha: new Date().toISOString()      // time_completed -> fecha
    };

    console.log('📝 Prepared quiz result object:', quizResult);
    console.log('🔹 Data types:');
    Object.entries(quizResult).forEach(([key, value]) => {
      console.log(`   ${key}: ${typeof value} = ${value}`);
    });

    console.log('💾 Attempting database insert...');
    // Try insert with RLS context
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([quizResult])
      .select();

    console.log('📤 Insert response - data:', data);
    console.log('📤 Insert response - error:', error);

    if (error) {
      console.error('🚨 === DETAILED SUPABASE ERROR ===');
      console.error('❌ Raw error object:', JSON.stringify(error, null, 2));
      console.error('❌ Error message:', error.message || 'No message');
      console.error('❌ Error details:', error.details || 'No details');
      console.error('❌ Error hint:', error.hint || 'No hint');
      console.error('❌ Error code:', error.code || 'No code');
      console.error('❌ Status code:', error.status || 'No status');
      console.error('❌ Status text:', error.statusText || 'No status text');
      console.error('🔹 Quiz data that failed:', JSON.stringify(quizResult, null, 2));
      
      // Check for RLS violation
      if (error.message && error.message.includes('row-level security policy')) {
        console.error('🔒 ROW LEVEL SECURITY VIOLATION DETECTED!');
        console.error('💡 SOLUTION: You need to fix the RLS policy!');
        console.error('📋 STEPS TO FIX:');
        console.error('   1. Go to https://supabase.com/dashboard');
        console.error('   2. Select your project');
        console.error('   3. Go to SQL Editor');
        console.error('   4. Copy and paste the contents of FIX_RLS_POLICY.sql');
        console.error('   5. Click RUN to disable RLS or create proper policies');
        console.error('   6. Refresh this page and try again');
        console.error('================================');
        
        return { 
          success: false, 
          error: 'Row Level Security policy violation. Please run the FIX_RLS_POLICY.sql script in your Supabase dashboard to allow quiz data insertion.',
          needsRLSFix: true,
          fullError: error 
        };
      }
      
      console.error('================================');
      
      // Try to extract meaningful error message
      let errorMessage = 'Unknown database error';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.details) {
        errorMessage = error.details;
      } else if (error.hint) {
        errorMessage = error.hint;
      } else if (error.code) {
        errorMessage = `Database error code: ${error.code}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = `Database error: ${JSON.stringify(error)}`;
      }
      
      return { success: false, error: errorMessage, fullError: error };
    }

    if (!data || data.length === 0) {
      console.error('⚠️ No data returned from insert operation');
      return { success: false, error: 'No data returned from save operation' };
    }

    console.log('✅ Quiz result saved successfully with ID:', data[0].id);
    console.log('🎉 === SAVE COMPLETED SUCCESSFULLY ===');
    return { success: true, id: data[0].id };
    
  } catch (error) {
    console.error('💥 === JAVASCRIPT EXCEPTION ===');
    console.error('❌ Exception type:', error.constructor.name);
    console.error('❌ Exception message:', error.message);
    console.error('❌ Exception stack:', error.stack);
    console.error('❌ Full exception object:', JSON.stringify(error, null, 2));
    console.error('===============================');
    return { success: false, error: `JavaScript error: ${error.message}`, exception: error };
  }
};

// Get user's quiz history
export const getUserQuizHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('usuario_id', userId)  // user_id -> usuario_id
      .order('fecha', { ascending: false }); // time_completed -> fecha
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    // Map the Spanish column names to English for compatibility
    const processedData = data.map(item => ({
      id: item.id,
      user_id: item.usuario_id,
      email: item.email,
      score: item.correctas,      // correctas -> score
      totalQuestions: item.preguntas, // preguntas -> totalQuestions
      percentage: item.calificacion,  // calificacion -> percentage
      timeCompleted: new Date(item.fecha), // fecha -> timeCompleted
      userAnswers: [], // No user_answers in this table structure
    }));
    
    return { success: true, data: processedData };
  } catch (error) {
    console.error('Error getting quiz history: ', error);
    return { success: false, error: error.message };
  }
};

// Get user's best score
export const getUserBestScore = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('usuario_id', userId)  // user_id -> usuario_id
      .order('calificacion', { ascending: false }) // Order by calificacion (percentage)
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    if (data && data.length > 0) {
      const bestResult = {
        id: data[0].id,
        user_id: data[0].usuario_id,
        email: data[0].email,
        score: data[0].correctas,      // correctas -> score
        totalQuestions: data[0].preguntas, // preguntas -> totalQuestions
        percentage: data[0].calificacion,  // calificacion -> percentage
        timeCompleted: new Date(data[0].fecha), // fecha -> timeCompleted
        userAnswers: [], // No user_answers in this table structure
      };
      return { success: true, data: bestResult };
    } else {
      return { success: true, data: null };
    }
  } catch (error) {
    console.error('Error getting best score: ', error);
    return { success: false, error: error.message };
  }
};

// Get user's quiz statistics
export const getUserQuizStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('usuario_id', userId); // user_id -> usuario_id
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { 
        success: true, 
        data: {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalCorrectAnswers: 0,
          totalQuestions: 0
        }
      };
    }
    
    let totalAttempts = 0;
    let totalScore = 0;
    let bestScore = 0;
    let totalCorrectAnswers = 0;
    let totalQuestions = 0;
    
    data.forEach((item) => {
      totalAttempts++;
      totalScore += item.calificacion; // Use calificacion (percentage)
      bestScore = Math.max(bestScore, item.calificacion);
      totalCorrectAnswers += item.correctas; // Use correctas
      totalQuestions += item.preguntas; // Use preguntas
    });
    
    const averageScore = totalScore / totalAttempts;
    
    return {
      success: true,
      data: {
        totalAttempts,
        averageScore: Math.round(averageScore),
        bestScore,
        totalCorrectAnswers,
        totalQuestions
      }
    };
  } catch (error) {
    console.error('Error getting quiz stats: ', error);
    return { success: false, error: error.message };
  }
};

// Get all quiz results from all users (public leaderboard)
export const getAllQuizResults = async (limit = 50) => {
  try {
    console.log('🌍 Fetching all users quiz results...');
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('fecha', { ascending: false }) // Most recent first
      .limit(limit);
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    // Map the Spanish column names to English for compatibility
    const processedData = data.map(item => ({
      id: item.id,
      user_id: item.usuario_id,
      email: item.email,
      score: item.correctas,      // correctas -> score
      totalQuestions: item.preguntas, // preguntas -> totalQuestions
      percentage: item.calificacion,  // calificacion -> percentage
      timeCompleted: new Date(item.fecha), // fecha -> timeCompleted
      userAnswers: [], // No user_answers in this table structure
    }));
    
    console.log(`✅ Found ${processedData.length} total quiz results`);
    return { success: true, data: processedData };
  } catch (error) {
    console.error('Error getting all quiz results: ', error);
    return { success: false, error: error.message };
  }
};

// Get top performers (leaderboard by best scores)
export const getTopPerformers = async (limit = 10) => {
  try {
    console.log('🏆 Fetching top performers...');
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('calificacion', { ascending: false }) // Best scores first
      .order('fecha', { ascending: false }) // Recent first for ties
      .limit(limit);
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    // Map the Spanish column names to English for compatibility
    const processedData = data.map((item, index) => ({
      rank: index + 1,
      id: item.id,
      user_id: item.usuario_id,
      email: item.email,
      score: item.correctas,      // correctas -> score
      totalQuestions: item.preguntas, // preguntas -> totalQuestions
      percentage: item.calificacion,  // calificacion -> percentage
      timeCompleted: new Date(item.fecha), // fecha -> timeCompleted
      userAnswers: [], // No user_answers in this table structure
    }));
    
    console.log(`🏆 Found ${processedData.length} top performers`);
    return { success: true, data: processedData };
  } catch (error) {
    console.error('Error getting top performers: ', error);
    return { success: false, error: error.message };
  }
};

// Get recent quiz activity from all users
export const getRecentQuizActivity = async (limit = 20) => {
  try {
    console.log('📈 Fetching recent quiz activity...');
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('fecha', { ascending: false }) // Most recent first
      .limit(limit);
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    // Map the Spanish column names to English for compatibility
    const processedData = data.map(item => ({
      id: item.id,
      user_id: item.usuario_id,
      email: item.email,
      score: item.correctas,      // correctas -> score
      totalQuestions: item.preguntas, // preguntas -> totalQuestions
      percentage: item.calificacion,  // calificacion -> percentage
      timeCompleted: new Date(item.fecha), // fecha -> timeCompleted
      userAnswers: [], // No user_answers in this table structure
      // Additional display helpers
      timeAgo: getTimeAgo(new Date(item.fecha)),
      displayName: getDisplayName(item.email),
    }));
    
    console.log(`📈 Found ${processedData.length} recent activities`);
    return { success: true, data: processedData };
  } catch (error) {
    console.error('Error getting recent quiz activity: ', error);
    return { success: false, error: error.message };
  }
};

// Get global quiz statistics (all users combined)
export const getGlobalQuizStats = async () => {
  try {
    console.log('🌐 Calculating global quiz statistics...');
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { 
        success: true, 
        data: {
          totalAttempts: 0,
          totalUsers: 0,
          averageScore: 0,
          bestScore: 0,
          totalCorrectAnswers: 0,
          totalQuestions: 0,
          averageAttemptsPerUser: 0
        }
      };
    }
    
    let totalAttempts = 0;
    let totalScore = 0;
    let bestScore = 0;
    let totalCorrectAnswers = 0;
    let totalQuestions = 0;
    const uniqueUsers = new Set();
    
    data.forEach((item) => {
      totalAttempts++;
      totalScore += item.calificacion; // Use calificacion (percentage)
      bestScore = Math.max(bestScore, item.calificacion);
      totalCorrectAnswers += item.correctas; // Use correctas
      totalQuestions += item.preguntas; // Use preguntas
      uniqueUsers.add(item.usuario_id);
    });
    
    const averageScore = totalScore / totalAttempts;
    const totalUsers = uniqueUsers.size;
    const averageAttemptsPerUser = totalAttempts / totalUsers;
    
    const stats = {
      totalAttempts,
      totalUsers,
      averageScore: Math.round(averageScore),
      bestScore,
      totalCorrectAnswers,
      totalQuestions,
      averageAttemptsPerUser: Math.round(averageAttemptsPerUser * 100) / 100
    };
    
    console.log('🌐 Global stats calculated:', stats);
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error('Error getting global quiz stats: ', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get time ago string
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Hace un momento';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString('es-ES');
};

// Helper function to get display name from email
const getDisplayName = (email) => {
  if (!email) return 'Usuario Anónimo';
  // Extract username from email (before @)
  const username = email.split('@')[0];
  // Capitalize first letter
  return username.charAt(0).toUpperCase() + username.slice(1);
};
