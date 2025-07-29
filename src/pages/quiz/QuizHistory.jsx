import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { getUserQuizHistory, getUserQuizStats } from '../../services/supabaseQuizService';
import './QuizHistory.css';

const QuizHistory = () => {
  const { currentUser } = useAuth();
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadQuizData();
    }
  }, [currentUser]);

  const loadQuizData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load quiz history
      const historyResult = await getUserQuizHistory(currentUser.id);
      if (historyResult.success) {
        setQuizHistory(historyResult.data);
      } else {
        setError('Error al cargar el historial de quiz');
      }

      // Load quiz statistics
      const statsResult = await getUserQuizStats(currentUser.id);
      if (statsResult.success) {
        setQuizStats(statsResult.data);
      }
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error loading quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  if (!currentUser) {
    return (
      <div className="quiz-history-container">
        <div className="auth-required">
          <h2>Inicia sesión para ver tu historial</h2>
          <p>Necesitas estar autenticado para acceder a tu historial de quiz.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="quiz-history-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tu historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-history-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadQuizData} className="retry-button">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-history-container">
      <div className="quiz-history-header">
        <h1>Historial de Quiz</h1>
        <p>Revisa tu progreso y mejores puntuaciones</p>
      </div>

      {/* Quiz Statistics */}
      {quizStats && (
        <div className="quiz-stats">
          <h2>Estadísticas Generales</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{quizStats.totalAttempts}</div>
              <div className="stat-label">Intentos Totales</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: getScoreColor(quizStats.bestScore) }}>
                {quizStats.bestScore}%
              </div>
              <div className="stat-label">Mejor Puntuación</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: getScoreColor(quizStats.averageScore) }}>
                {quizStats.averageScore}%
              </div>
              <div className="stat-label">Promedio</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{quizStats.totalCorrectAnswers}</div>
              <div className="stat-label">Respuestas Correctas</div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz History */}
      <div className="quiz-history">
        <h2>Historial de Intentos</h2>
        
        {quizHistory.length === 0 ? (
          <div className="no-history">
            <p>Aún no has completado ningún quiz.</p>
            <p>¡Completa tu primer quiz para ver tus resultados aquí!</p>
          </div>
        ) : (
          <div className="history-list">
            {quizHistory.map((quiz, index) => (
              <div key={quiz.id} className="history-item">
                <div className="history-header">
                  <div className="attempt-number">Intento #{quizHistory.length - index}</div>
                  <div className="quiz-date">{formatDate(quiz.timeCompleted)}</div>
                </div>
                
                <div className="history-content">
                  <div className="score-section">
                    <div 
                      className="score-circle"
                      style={{ 
                        borderColor: getScoreColor(quiz.percentage),
                        color: getScoreColor(quiz.percentage)
                      }}
                    >
                      {quiz.percentage}%
                    </div>
                    <div className="score-details">
                      <div className="score-text">
                        {quiz.score} de {quiz.totalQuestions} correctas
                      </div>
                      <div className="score-breakdown">
                        <span className="correct">✅ {quiz.correctAnswers}</span>
                        <span className="incorrect">❌ {quiz.incorrectAnswers}</span>
                      </div>
                    </div>
                  </div>
                  
                  {quiz.percentage >= 80 && (
                    <div className="achievement-badge">
                      🏆 ¡Excelente puntuación!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
