import React, { useState, useEffect } from 'react';
import { 
  getAllQuizResults, 
  getTopPerformers, 
  getRecentQuizActivity, 
  getGlobalQuizStats 
} from '../../services/supabaseQuizService';
import './PublicResults.css';

const PublicResults = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🌍 Loading public quiz data...');

      // Load all data in parallel
      const [topPerformersResult, recentActivityResult, globalStatsResult] = await Promise.all([
        getTopPerformers(15),
        getRecentQuizActivity(20),
        getGlobalQuizStats()
      ]);

      if (topPerformersResult.success) {
        setTopPerformers(topPerformersResult.data);
        console.log('✅ Top performers loaded:', topPerformersResult.data.length);
      } else {
        console.error('❌ Failed to load top performers:', topPerformersResult.error);
      }

      if (recentActivityResult.success) {
        setRecentActivity(recentActivityResult.data);
        console.log('✅ Recent activity loaded:', recentActivityResult.data.length);
      } else {
        console.error('❌ Failed to load recent activity:', recentActivityResult.error);
      }

      if (globalStatsResult.success) {
        setGlobalStats(globalStatsResult.data);
        console.log('✅ Global stats loaded:', globalStatsResult.data);
      } else {
        console.error('❌ Failed to load global stats:', globalStatsResult.error);
      }

    } catch (err) {
      console.error('💥 Error loading public data:', err);
      setError('Error cargando los datos públicos');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return '#10b981'; // green-500
    if (percentage >= 70) return '#f59e0b'; // yellow-500
    if (percentage >= 50) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (loading) {
    return (
      <div className="public-results">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando resultados públicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-results">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadPublicData} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-results">
      <div className="public-results-header">
        <h2>🌍 Resultados de la Comunidad</h2>
        <p>Descubre cómo están aprendiendo otros usuarios sobre salud hepática</p>
      </div>

      {/* Global Statistics */}
      {globalStats && (
        <div className="global-stats">
          <h3>📊 Estadísticas Globales</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{globalStats.totalAttempts}</div>
              <div className="stat-label">Quiz Completados</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{globalStats.totalUsers}</div>
              <div className="stat-label">Usuarios Participantes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{globalStats.averageScore}%</div>
              <div className="stat-label">Promedio Global</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{globalStats.bestScore}%</div>
              <div className="stat-label">Mejor Puntuación</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Tabla de Líderes
        </button>
        <button 
          className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          📈 Actividad Reciente
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'leaderboard' && (
          <div className="leaderboard-tab">
            <h3>🏆 Mejores Puntuaciones</h3>
            {topPerformers.length === 0 ? (
              <div className="empty-state">
                <p>Aún no hay resultados disponibles.</p>
                <p>¡Sé el primero en completar el quiz!</p>
              </div>
            ) : (
              <div className="leaderboard-list">
                {topPerformers.map((result, index) => (
                  <div 
                    key={result.id} 
                    className={`result-card ${index < 3 ? 'podium' : ''}`}
                  >
                    <div className="rank-badge">
                      {getMedalIcon(result.rank)}
                    </div>
                    
                    <div className="user-info">
                      <div className="user-name">
                        {result.displayName || result.email.split('@')[0]}
                      </div>
                      <div className="completion-time">
                        {result.timeCompleted.toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    
                    <div className="score-info">
                      <div 
                        className="percentage-score"
                        style={{ color: getScoreColor(result.percentage) }}
                      >
                        {result.percentage}%
                      </div>
                      <div className="detailed-score">
                        {result.score}/{result.totalQuestions} correctas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="recent-tab">
            <h3>📈 Actividad Reciente</h3>
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <p>No hay actividad reciente disponible.</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((result) => (
                  <div key={result.id} className="activity-card">
                    <div className="user-info">
                      <div className="user-name">
                        {result.displayName || result.email.split('@')[0]}
                      </div>
                      <div className="activity-time">
                        {result.timeAgo}
                      </div>
                    </div>
                    
                    <div className="score-info">
                      <div 
                        className="percentage-score"
                        style={{ color: getScoreColor(result.percentage) }}
                      >
                        {result.percentage}%
                      </div>
                      <div className="detailed-score">
                        {result.score}/{result.totalQuestions}
                      </div>
                    </div>

                    <div className="completion-badge">
                      {result.percentage >= 80 ? '🎉' : 
                       result.percentage >= 60 ? '👍' : '📚'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="refresh-section">
        <button onClick={loadPublicData} className="refresh-button">
          🔄 Actualizar Datos
        </button>
        <p className="last-updated">
          Última actualización: {new Date().toLocaleTimeString('es-ES')}
        </p>
      </div>
    </div>
  );
};

export default PublicResults;
