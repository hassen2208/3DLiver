import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { 
  getAllQuizResults, 
  getTopPerformers, 
  getRecentQuizActivity, 
  getGlobalQuizStats 
} from '../../services/supabaseQuizService';
import './PublicResults.css';

// 3D Podium Component
function PodiumStep({ position, height, color, rank, userName, percentage, isWinner = false }) {
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#666666';
    }
  };

  return (
    <group position={position}>
      {/* Podium Step */}
      <Box args={[1.5, height, 1.5]} position={[0, height/2, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
      
      {/* Medal/Trophy on top */}
      <mesh position={[0, height + 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
        <meshStandardMaterial color={getMedalColor(rank)} metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Rank Number */}
      <Text
        position={[0, height + 0.7, 0]}
        fontSize={0.4}
        color={getMedalColor(rank)}
        anchorX="center"
        anchorY="middle"
      >
        #{rank}
      </Text>
      
      {/* User Name */}
      <Text
        position={[0, height - 0.3, 0.8]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
        textAlign="center"
      >
        {userName}
      </Text>
      
      {/* Percentage Score */}
      <Text
        position={[0, height - 0.6, 0.8]}
        fontSize={0.25}
        color={getMedalColor(rank)}
        anchorX="center"
        anchorY="middle"
      >
        {percentage}%
      </Text>
    </group>
  );
}

function Podium3D({ topThree }) {
  if (!topThree || topThree.length === 0) {
    return (
      <div className="podium-3d-container">
        <div className="empty-podium">
          <p>🏆 Aún no hay suficientes participantes para el podio</p>
        </div>
      </div>
    );
  }

  // Arrange positions for 1st, 2nd, 3rd
  const podiumPositions = [
    { position: [0, 0, 0], height: 2.2, color: '#FFD700' },    // 1st place - center, tallest
    { position: [-2.8, 0, 0], height: 1.6, color: '#C0C0C0' }, // 2nd place - left
    { position: [2.8, 0, 0], height: 1.2, color: '#CD7F32' }   // 3rd place - right
  ];

  return (
    <div className="podium-3d-container">
      <Canvas
        style={{ 
          width: "100%", 
          height: "400px", 
          background: "linear-gradient(135deg, #1a1a2e, #2a2a5a)",
          borderRadius: "15px",
          border: "3px solid #f5b14c",
          boxShadow: "0 10px 30px rgba(245, 177, 76, 0.3)"
        }}
        camera={{ position: [6, 3, 8], fov: 45 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <pointLight position={[-5, 8, 5]} intensity={0.8} color="#f5b14c" />
        <spotLight position={[0, 15, 0]} intensity={1.0} angle={0.4} penumbra={0.2} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          target={[0, 1, 0]}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 8}
          maxDistance={15}
          minDistance={5}
        />
        
        {topThree.map((performer, index) => {
          const podiumData = podiumPositions[index];
          if (!podiumData) return null;
          
          return (
            <PodiumStep
              key={performer.id}
              position={podiumData.position}
              height={podiumData.height}
              color={podiumData.color}
              rank={performer.rank || (index + 1)}
              userName={performer.displayName || performer.email?.split('@')[0] || 'Usuario'}
              percentage={performer.percentage}
              isWinner={index === 0}
            />
          );
        })}
        
        {/* Base Platform */}
        <Box args={[9, 0.3, 4]} position={[0, -0.15, 0]}>
          <meshStandardMaterial color="#2a2a5a" metalness={0.1} roughness={0.8} />
        </Box>
      </Canvas>
      
      <div className="podium-legend">
        <h4>🏆 Podio de Campeones</h4>
        <p>Los 3 mejores puntajes en el Quiz de Salud Hepática</p>
      </div>
    </div>
  );
}

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
              <>
                {/* 3D Podium for Top 3 */}
                <Podium3D topThree={topPerformers.slice(0, 3)} />
                
                {/* Rest of the leaderboard */}
                {topPerformers.length > 3 && (
                  <div className="remaining-leaderboard">
                    <h4>📋 Clasificación Completa</h4>
                    <div className="leaderboard-list">
                      {topPerformers.map((result, index) => (
                        <div 
                          key={result.id} 
                          className={`result-card ${index < 3 ? 'podium' : ''}`}
                        >
                          <div className="rank-badge">
                            {getMedalIcon(result.rank || (index + 1))}
                          </div>
                          
                          <div className="user-info">
                            <div className="user-name">
                              {result.displayName || result.email.split('@')[0]}
                            </div>
                            <div className="completion-time">
                              {result.timeCompleted?.toLocaleDateString('es-ES') || 'Fecha no disponible'}
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
                  </div>
                )}
              </>
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
