import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Save quiz result to Firestore
export const saveQuizResult = async (userId, quizData) => {
  try {
    const quizResult = {
      userId,
      score: quizData.score,
      totalQuestions: quizData.totalQuestions,
      percentage: quizData.percentage,
      correctAnswers: quizData.correctAnswers,
      incorrectAnswers: quizData.incorrectAnswers,
      userAnswers: quizData.userAnswers,
      timeCompleted: serverTimestamp(),
      quizType: 'liver-health' // For future quiz types
    };

    const docRef = await addDoc(collection(db, 'quizResults'), quizResult);
    console.log('Quiz result saved with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving quiz result: ', error);
    return { success: false, error: error.message };
  }
};

// Get user's quiz history
export const getUserQuizHistory = async (userId) => {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId),
      orderBy('timeCompleted', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const quizHistory = [];
    
    querySnapshot.forEach((doc) => {
      quizHistory.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: quizHistory };
  } catch (error) {
    console.error('Error getting quiz history: ', error);
    return { success: false, error: error.message };
  }
};

// Get user's best score
export const getUserBestScore = async (userId) => {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId),
      orderBy('percentage', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const bestResult = querySnapshot.docs[0].data();
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
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
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
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalAttempts++;
      totalScore += data.percentage;
      bestScore = Math.max(bestScore, data.percentage);
      totalCorrectAnswers += data.correctAnswers;
      totalQuestions += data.totalQuestions;
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
