import { useCallback, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon';
import './Quiz.css'
import useQuizStore from '../../stores/use-quiz-store';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { saveQuizResult, testDatabaseConnection } from '../../services/supabaseQuizService';

// Green Ball Component with Physics
function GreenBall({ position, onCollision, onGroundCollision }) {
    const [ref, api] = useSphere(() => ({
        mass: 1,
        position: position,
        material: { friction: 0.3, restitution: 0.6 },
        onCollide: (event) => {
            // Check if collision is with the ground plane by checking the contact normal
            const contactNormal = event.contact.ni;
            // Ground plane has normal pointing up [0, 1, 0]
            if (Math.abs(contactNormal.y) > 0.8) {
                onGroundCollision();
            } else {
                onCollision(event);
            }
        }
    }));

    useEffect(() => {
        // Apply initial velocity to make the ball move towards the liver
        // More targeted approach - aim toward the liver center
        const targetX = 0; // Liver is at center
        const targetZ = 0; // Liver is at center
        const currentX = position[0];
        const currentZ = position[2];
        
        // Calculate direction toward liver with some randomness
        const directionX = (targetX - currentX) + (Math.random() - 0.5) * 1;
        const directionZ = (targetZ - currentZ) + (Math.random() - 0.5) * 1;
        
        api.velocity.set(
            directionX * 1.5, // X velocity toward liver
            -3, // Stronger downward Y velocity
            directionZ * 1.5  // Z velocity toward liver
        );

        // Fallback timeout to remove ball if no collision detected after 5 seconds
        const fallbackTimeout = setTimeout(() => {
            onGroundCollision();
        }, 5000);

        return () => clearTimeout(fallbackTimeout);
    }, [api, position, onGroundCollision]);

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial 
                color="#22C55E" 
                emissive="#16A34A"
                emissiveIntensity={0.3}
                metalness={0.2}
                roughness={0.1}
            />
        </mesh>
    );
}

// Red Ball Component with Physics for incorrect answers
function RedBall({ position, onCollision, onGroundCollision }) {
    const [ref, api] = useSphere(() => ({
        mass: 1,
        position: position,
        material: { friction: 0.3, restitution: 0.6 },
        onCollide: (event) => {
            // Check if collision is with the ground plane by checking the contact normal
            const contactNormal = event.contact.ni;
            // Ground plane has normal pointing up [0, 1, 0]
            if (Math.abs(contactNormal.y) > 0.8) {
                onGroundCollision();
            } else {
                onCollision(event);
            }
        }
    }));

    useEffect(() => {
        // Apply initial velocity to make the ball move towards the liver
        // More targeted approach - aim toward the liver center
        const targetX = 0; // Liver is at center
        const targetZ = 0; // Liver is at center
        const currentX = position[0];
        const currentZ = position[2];
        
        // Calculate direction toward liver with some randomness
        const directionX = (targetX - currentX) + (Math.random() - 0.5) * 1;
        const directionZ = (targetZ - currentZ) + (Math.random() - 0.5) * 1;
        
        api.velocity.set(
            directionX * 1.5, // X velocity toward liver
            -3, // Stronger downward Y velocity
            directionZ * 1.5  // Z velocity toward liver
        );

        // Fallback timeout to remove ball if no collision detected after 5 seconds
        const fallbackTimeout = setTimeout(() => {
            onGroundCollision();
        }, 5000);

        return () => clearTimeout(fallbackTimeout);
    }, [api, position, onGroundCollision]);

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial 
                color="#EF4444" 
                emissive="#DC2626"
                emissiveIntensity={0.3}
                metalness={0.2}
                roughness={0.1}
            />
        </mesh>
    );
}

// Physics Liver Model Component
function PhysicsLiverModel({ correctAnswers, totalQuestions, showBall, onBallCollision }) {
    const progressPercentage = (correctAnswers / totalQuestions) * 100;
    const { scene } = useGLTF("/modelos/Liver/healthy-liver.glb");
    
    // Physics body for the liver model
    const [liverRef] = useBox(() => ({
        mass: 0, // Static body
        position: [0, 0, 0],
        args: [4, 3, 3], // Larger collision box for easier hits
        onCollide: onBallCollision
    }));

    // Apply opacity based on correct answers
    const opacity = correctAnswers === 0 ? 0.1 : Math.min(0.1 + (correctAnswers / totalQuestions) * 0.9, 1.0);

    // Ensure the scene exists before traversing
    if (scene) {
        scene.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = opacity;
                child.material.needsUpdate = true;
                // Ensure the material is properly configured
                if (child.material.map) {
                    child.material.map.needsUpdate = true;
                }
            }
        });
    }

    return (
        <>
            {/* Invisible physics body for collision detection */}
            <mesh ref={liverRef} visible={false}>
                <boxGeometry args={[4, 3, 3]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
            
            {/* Visible liver model */}
            {scene ? (
                <primitive 
                    object={scene} 
                    scale={18} 
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                />
            ) : (
                // Fallback if model doesn't load
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[1.5]} />
                    <meshStandardMaterial 
                        color="#8B4513" 
                        transparent 
                        opacity={opacity}
                    />
                </mesh>
            )}
        </>
    );
}

// Ground plane for physics
function Ground({ onGroundCollision }) {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -3, 0],
        material: { friction: 0.4, restitution: 0.1 },
        onCollide: onGroundCollision
    }));

    return (
        <mesh ref={ref}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
}

// 3D Liver Progress Model Component with Physics
function LiverProgressModel({ correctAnswers, totalQuestions, showBall, ballType, onBallCollision, onGroundCollision }) {
    const progressPercentage = (correctAnswers / totalQuestions) * 100;

    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[2, 5, 2]} intensity={1.2} />
            <pointLight position={[-2, 3, -1]} intensity={0.6} color="#228B22" />
            <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.3} penumbra={0.2} />
            
            {correctAnswers === 0 ? (
                // Initial 3D Banner
                <Html position={[0, 0, 0]} center>
                    <div style={{
                        background: 'linear-gradient(135deg, #2a5c82, #1a4c72)',
                        color: '#f2f6f9',
                        padding: '2rem 3rem',
                        borderRadius: '20px',
                        textAlign: 'center',
                        fontSize: '1.8rem',
                        fontWeight: '600',
                        maxWidth: '400px',
                        boxShadow: '0 20px 40px rgba(42, 92, 130, 0.4)',
                        border: '2px solid rgba(161, 196, 219, 0.3)',
                        backdropFilter: 'blur(10px)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                    }}>
                        🎯 Responde correctamente para revelar el hígado sano
                    </div>
                </Html>
            ) : (
                <>
                    <PhysicsLiverModel 
                        correctAnswers={correctAnswers} 
                        totalQuestions={totalQuestions}
                        showBall={showBall}
                        onBallCollision={onBallCollision}
                    />
                    
                    {/* Ball that appears when answer is selected */}
                    {showBall && ballType === 'green' && (
                        <GreenBall 
                            position={[Math.random() * 2 - 1, 4, Math.random() * 2 - 1]}
                            onCollision={onBallCollision}
                            onGroundCollision={onGroundCollision}
                        />
                    )}
                    
                    {showBall && ballType === 'red' && (
                        <RedBall 
                            position={[Math.random() * 2 - 1, 4, Math.random() * 2 - 1]}
                            onCollision={onBallCollision}
                            onGroundCollision={onGroundCollision}
                        />
                    )}
                    
                    {/* Ground for physics */}
                    <Ground onGroundCollision={onGroundCollision} />
                    
                    {/* Progress circle */}
                    <Html position={[0, 1.5, 0]} center>
                        <div className="liver-progress-indicator">
                            <div className="progress-circle">
                                <div 
                                    className="progress-fill-circle"
                                    style={{
                                        background: `conic-gradient(#228B22 ${progressPercentage * 3.6}deg, rgba(255,255,255,0.2) 0deg)`
                                    }}
                                >
                                    <div className="progress-inner">
                                        <span className="progress-text">{Math.round(progressPercentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Html>
                </>
            )}
        </>
    );
}

const Quiz = () => {
    const { quiz, incrementQuizProgress, clearQuiz } = useQuizStore();
    const { currentUser } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [savingResult, setSavingResult] = useState(false);
    const [resultSaved, setResultSaved] = useState(false);
    const [showBall, setShowBall] = useState(false);
    const [ballType, setBallType] = useState('green'); // 'green' or 'red'
    const ballTimeoutRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cleanup ball timeout on unmount
    useEffect(() => {
        return () => {
            if (ballTimeoutRef.current) {
                clearTimeout(ballTimeoutRef.current);
            }
        };
    }, []);

    // Test database connection on component mount
    useEffect(() => {
        const testDB = async () => {
            const result = await testDatabaseConnection();
            if (!result.success) {
                console.error('⚠️ Database connection failed at component mount');
            }
        };
        testDB();
    }, []);

    // Quiz questions about liver diseases
    const questions = [
        {
            id: 1,
            question: "¿Cuál es la principal causa del hígado graso?",
            options: [
                "Consumo excesivo de alcohol",
                "Dieta alta en grasas saturadas y azúcares",
                "Infección viral",
                "Medicamentos"
            ],
            correctAnswer: 1,
            explanation: "El hígado graso no alcohólico es principalmente causado por una dieta alta en grasas saturadas, azúcares refinados y un estilo de vida sedentario."
        },
        {
            id: 2,
            question: "¿Qué síntoma es común en la cirrosis hepática?",
            options: [
                "Dolor de cabeza intenso",
                "Ictericia (coloración amarilla de la piel)",
                "Fiebre alta constante",
                "Pérdida de memoria"
            ],
            correctAnswer: 1,
            explanation: "La ictericia es un síntoma característico de la cirrosis, causada por la acumulación de bilirrubina en el organismo debido al mal funcionamiento del hígado."
        },
        {
            id: 3,
            question: "¿Cuál es el mejor tratamiento para el hígado graso?",
            options: [
                "Medicamentos específicos",
                "Cirugía inmediata",
                "Cambios en el estilo de vida",
                "Reposo absoluto"
            ],
            correctAnswer: 2,
            explanation: "El tratamiento más efectivo para el hígado graso incluye ejercicio regular, dieta saludable, pérdida de peso gradual y evitar el alcohol."
        },
        {
            id: 4,
            question: "¿Qué tipo de hepatitis se transmite principalmente por vía sexual?",
            options: [
                "Hepatitis A",
                "Hepatitis B",
                "Hepatitis C",
                "Hepatitis E"
            ],
            correctAnswer: 1,
            explanation: "La Hepatitis B se transmite principalmente por contacto sexual, sangre contaminada y de madre a hijo durante el parto."
        },
        {
            id: 5,
            question: "¿Cuál es la función principal del hígado en el cuerpo?",
            options: [
                "Bombear sangre",
                "Desintoxicar sustancias nocivas",
                "Producir insulina",
                "Regular la temperatura corporal"
            ],
            correctAnswer: 1,
            explanation: "El hígado es el principal órgano de desintoxicación del cuerpo, procesa toxinas, medicamentos y produce bilis para la digestión."
        },
        {
            id: 6,
            question: "¿Qué alimentos son especialmente dañinos para el hígado?",
            options: [
                "Frutas y verduras",
                "Pescado y pollo",
                "Alimentos procesados y azúcar refinada",
                "Legumbres y cereales"
            ],
            correctAnswer: 2,
            explanation: "Los alimentos procesados, el azúcar refinada y las grasas trans pueden sobrecargar el hígado y contribuir al hígado graso."
        },
        {
            id: 7,
            question: "¿Cuánto alcohol es considerado seguro para el hígado?",
            options: [
                "Una copa diaria para todos",
                "Varía según peso y género",
                "No hay límite seguro establecido",
                "Solo los fines de semana"
            ],
            correctAnswer: 1,
            explanation: "El consumo 'seguro' de alcohol varía según el peso corporal, género y salud individual. Las mujeres generalmente tienen menor tolerancia que los hombres."
        },
        {
            id: 8,
            question: "¿Qué vitamina es especialmente importante para la salud hepática?",
            options: [
                "Vitamina C",
                "Vitamina D",
                "Vitamina E",
                "Vitamina K"
            ],
            correctAnswer: 2,
            explanation: "La vitamina E es un potente antioxidante que ayuda a proteger las células hepáticas del daño oxidativo y la inflamación."
        },
        {
            id: 9,
            question: "¿Cuál es un signo temprano de problemas hepáticos?",
            options: [
                "Dolor en el pecho",
                "Fatiga y debilidad constante",
                "Dolor de rodillas",
                "Pérdida de audición"
            ],
            correctAnswer: 1,
            explanation: "La fatiga y debilidad son signos tempranos comunes de problemas hepáticos, ya que el hígado no puede procesar toxinas eficientemente."
        },
        {
            id: 10,
            question: "¿Qué ejercicio es más beneficioso para la salud del hígado?",
            options: [
                "Solo ejercicios de fuerza",
                "Solo ejercicios de estiramiento",
                "Combinación de cardio y fuerza",
                "No es necesario hacer ejercicio"
            ],
            correctAnswer: 2,
            explanation: "Una combinación de ejercicio cardiovascular y entrenamiento de fuerza es ideal para reducir la grasa hepática y mejorar la función del hígado."
        }
    ];

    // Handle ball collision with liver or ground
    const handleBallCollision = useCallback((event) => {
        if (ballType === 'green') {
            console.log('🟢 Green ball hit the liver! Correct answer!');
        } else {
            console.log('🔴 Red ball hit the liver! Incorrect answer!');
        }
        // Hide the ball after collision with a slight delay for visual effect
        setTimeout(() => {
            setShowBall(false);
        }, 500);
    }, [ballType]);

    // Handle ground collision - balls disappear when they hit the ground
    const handleGroundCollision = useCallback(() => {
        console.log('⚫ Ball hit the ground');
        // Hide the ball when it hits the ground
        setTimeout(() => {
            setShowBall(false);
        }, 200);
    }, []);

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswer(answerIndex);
        
        // Show explanation immediately when answer is selected
        const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
        const newAnswer = {
            questionId: questions[currentQuestion].id,
            selectedAnswer: answerIndex,
            isCorrect,
            question: questions[currentQuestion].question
        };

        setUserAnswers(prev => [...prev, newAnswer]);
        setShowExplanation(true);

        // Update correct answers count for liver model progress
        if (isCorrect) {
            setCorrectAnswersCount(prev => prev + 1);
        }

        // Show appropriate ball based on answer correctness
        setBallType(isCorrect ? 'green' : 'red');
        setShowBall(true);
        
        // Clear any existing timeout
        if (ballTimeoutRef.current) {
            clearTimeout(ballTimeoutRef.current);
        }

        // Update quiz progress
        incrementQuizProgress();
    };

    const handleNextQuestion = useCallback(() => {
        if (selectedAnswer === null) return;

        // Clear ball timeout
        if (ballTimeoutRef.current) {
            clearTimeout(ballTimeoutRef.current);
        }

        // Move to next question only when "Siguiente" is clicked
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setShowBall(false); // Reset ball state for next question
            setBallType('green'); // Reset ball type
        } else {
            setQuizCompleted(true);
            // Save quiz results if user is logged in
            if (currentUser) {
                saveQuizResults();
            }
        }
    }, [selectedAnswer, currentQuestion, questions, currentUser]);

    const saveQuizResults = async () => {
        if (!currentUser) return;
        
        setSavingResult(true);
        
        const score = getScore();
        const percentage = Math.round((score / questions.length) * 100);
        
        const quizData = {
            score,
            totalQuestions: questions.length,
            percentage,
            correctAnswers: score,
            incorrectAnswers: questions.length - score,
            userAnswers: userAnswers.map(answer => ({
                questionId: answer.questionId,
                question: answer.question,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: answer.isCorrect
            }))
        };
        
        try {
            console.log('🎯 === QUIZ COMPONENT SAVE ATTEMPT ===');
            console.log('🔹 Current User Object:', currentUser);
            console.log('🔹 User ID:', currentUser?.id);
            console.log('🔹 User Email:', currentUser?.email);
            console.log('🔹 User Properties:', Object.keys(currentUser || {}));
            console.log('🔹 Quiz Data Structure:', quizData);
            console.log('🔹 Quiz Data JSON:', JSON.stringify(quizData, null, 2));
            console.log('=====================================');
            
            if (!currentUser) {
                console.error('❌ No current user found, cannot save quiz');
                return;
            }
            
            if (!currentUser.id) {
                console.error('❌ Current user has no ID property:', currentUser);
                return;
            }
            
            const result = await saveQuizResult(currentUser.id, {
                ...quizData,
                userEmail: currentUser.email || '',
                userDisplayName: currentUser.user_metadata?.full_name || currentUser.email || ''
            });
            
            console.log('🎯 === SAVE OPERATION COMPLETE ===');
            console.log('🔹 Result object:', result);
            console.log('🔹 Success:', result?.success);
            console.log('🔹 Error:', result?.error);
            console.log('🔹 Full Error Object:', result?.fullError);
            console.log('==================================');
            
            if (result.success) {
                setResultSaved(true);
                console.log('✅ Quiz result saved successfully!');
            } else {
                console.error('❌ Failed to save quiz result:');
                console.error('🔸 Error message:', result.error);
                console.error('🔸 Full error object:', result.fullError);
                console.error('🔸 Exception details:', result.exception);
                
                // Show user-friendly error message
                alert(`Error saving quiz results: ${result.error}`);
            }
        } catch (error) {
            console.error('💥 Exception in Quiz component save function:');
            console.error('🔸 Error type:', error.constructor.name);
            console.error('🔸 Error message:', error.message);
            console.error('🔸 Error stack:', error.stack);
            console.error('🔸 Full error:', error);
            
            // Show user-friendly error message
            alert(`Unexpected error saving quiz: ${error.message}`);
        } finally {
            setSavingResult(false);
        }
    };

    const restartQuiz = () => {
        // Clear ball timeout
        if (ballTimeoutRef.current) {
            clearTimeout(ballTimeoutRef.current);
        }
        
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuizCompleted(false);
        setUserAnswers([]);
        setCorrectAnswersCount(0);
        setSavingResult(false);
        setResultSaved(false);
        setShowBall(false);
        setBallType('green');
        clearQuiz();
    };

    const getScore = () => {
        return userAnswers.filter(answer => answer.isCorrect).length;
    };

    const getScoreMessage = () => {
        const score = getScore();
        const percentage = (score / questions.length) * 100;
        
        if (percentage >= 80) return "¡Excelente! Tienes un gran conocimiento sobre salud hepática.";
        if (percentage >= 60) return "¡Bien hecho! Tienes buenos conocimientos básicos.";
        if (percentage >= 40) return "No está mal, pero podrías aprender un poco más.";
        return "Te recomendamos revisar más información sobre salud hepática.";
    };

    if (quizCompleted) {
        return (
            <div className="quiz-container">
                <div className="quiz-completed">
                    <h1>🎉 ¡Quiz Completado!</h1>
                    
                    {/* Save status indicator */}
                    {currentUser && (
                        <div className="save-status" style={{
                            padding: '1rem',
                            borderRadius: '10px',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                            border: '2px solid',
                            borderColor: savingResult ? '#f59e0b' : resultSaved ? '#10b981' : '#ef4444',
                            backgroundColor: savingResult ? 'rgba(245, 158, 11, 0.1)' : resultSaved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: savingResult ? '#f59e0b' : resultSaved ? '#10b981' : '#ef4444'
                        }}>
                            {savingResult ? (
                                <>
                                    <div className="loading-spinner" style={{ 
                                        width: '16px', 
                                        height: '16px', 
                                        display: 'inline-block', 
                                        marginRight: '0.5rem',
                                        border: '2px solid rgba(245, 158, 11, 0.3)',
                                        borderTop: '2px solid #f59e0b'
                                    }}></div>
                                    Guardando resultados...
                                </>
                            ) : resultSaved ? (
                                <>
                                    ✅ Resultados guardados en tu perfil
                                </>
                            ) : (
                                <>
                                    ⚠️ Error al guardar resultados
                                </>
                            )}
                        </div>
                    )}

                    <div className="score-summary">
                        <h2>Tu puntuación: {getScore()}/{questions.length}</h2>
                        <div className="score-percentage">
                            {Math.round((getScore() / questions.length) * 100)}%
                        </div>
                        <p className="score-message">{getScoreMessage()}</p>
                        
                        {/* User info if logged in */}
                        {currentUser && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                backgroundColor: 'rgba(42, 92, 130, 0.1)',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                color: '#1a4c72'
                            }}>
                                Resultado guardado para: {currentUser.displayName || currentUser.email}
                            </div>
                        )}
                    </div>
                    
                    <div className="answers-review">
                        <h3>Revisión de respuestas:</h3>
                        {userAnswers.map((answer, index) => (
                            <div key={answer.questionId} className={`answer-review ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                <span className="question-number">Pregunta {index + 1}:</span>
                                <span className="result-icon">{answer.isCorrect ? '✅' : '❌'}</span>
                            </div>
                        ))}
                    </div>
                    
                    <button className="restart-button" onClick={restartQuiz}>
                        🔄 Intentar de nuevo
                    </button>
                    
                    <div className="quiz-navigation-buttons">
                        <button 
                            className="nav-button secondary" 
                            onClick={() => window.open('/resultados-publicos', '_blank')}
                        >
                            🌍 Ver Resultados de la Comunidad
                        </button>
                        {currentUser && (
                            <button 
                                className="nav-button primary" 
                                onClick={() => window.open('/quiz-history', '_blank')}
                            >
                                📊 Ver Mi Historial
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h1>Quiz de Salud Hepática</h1>
                <div className="progress-container">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">
                        Pregunta {currentQuestion + 1} de {questions.length}
                    </span>
                </div>
            </div>

            {/* Main Quiz Layout - Canvas Centered */}
            <div className="quiz-main-layout" style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'stretch'
            }}>
                {/* Quiz Content Container - Left Side */}
                <div className="quiz-content" style={{
                    flex: isMobile ? 'none' : '1',
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '100%' : 'none'
                }}>
                    <div className="question-container">
                        {showExplanation && (
                            <div className="explanation-container" style={{
                                marginBottom: '1.5rem',
                                order: -1
                            }}>
                                <div className="explanation-header">
                                    <span className="explanation-icon">
                                        {selectedAnswer === questions[currentQuestion].correctAnswer ? '✅' : '❌'}
                                    </span>
                                    <h3>
                                        {selectedAnswer === questions[currentQuestion].correctAnswer 
                                            ? '¡Correcto!' 
                                            : 'Incorrecto'
                                        }
                                    </h3>
                                </div>
                                <p className="explanation-text">
                                    {questions[currentQuestion].explanation}
                                </p>
                            </div>
                        )}

                        <h2 className="question-text">
                            {questions[currentQuestion].question}
                        </h2>
                        
                        <div className="options-container">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-button ${
                                        selectedAnswer === index ? 'selected' : ''
                                    } ${
                                        showExplanation 
                                            ? index === questions[currentQuestion].correctAnswer 
                                                ? 'correct' 
                                                : selectedAnswer === index 
                                                    ? 'incorrect' 
                                                    : ''
                                            : ''
                                    }`}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={showExplanation}
                                >
                                    <span className="option-letter">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="option-text">{option}</span>
                                </button>
                            ))}
                        </div>

                        <div className="quiz-actions">
                            <button 
                                className="next-button"
                                onClick={handleNextQuestion}
                                disabled={selectedAnswer === null}
                            >
                                {currentQuestion === questions.length - 1 ? 'Finalizar Quiz' : 'Siguiente'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Container for 3D Model and Progress Info */}
                <div style={{ 
                    flex: isMobile ? 'none' : '4',
                    width: isMobile ? '100%' : 'auto',
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: isMobile ? '100%' : 'none'
                }}>
                    {/* 3D Liver Progress Model */}
                    <div className="liver-model-container" style={{
                        flex: '1',
                        minHeight: isMobile ? '300px' : '350px',
                        maxHeight: isMobile ? '400px' : '450px',
                        width: '100%'
                    }}>
                        <Canvas
                            style={{ 
                                width: "100%", 
                                height: "100%", 
                                background: "transparent",
                                border: "5px solid #f5b14c",
                                borderRadius: "15px",
                                boxShadow: "0 0 25px rgba(245, 177, 76, 0.7)",
                                overflow: "hidden"
                            }}
                            camera={{ position: [0, 2, 12], fov: 50 }}
                            gl={{ alpha: true, antialias: true }}
                        >
                            <OrbitControls 
                                enableZoom={false} 
                                enablePan={false}
                                autoRotate={false}
                                maxPolarAngle={Math.PI / 2}
                                minPolarAngle={Math.PI / 3}
                            />
                            <Physics gravity={[0, -9.81, 0]} iterations={15} tolerance={0.0001}>
                                <LiverProgressModel 
                                    correctAnswers={correctAnswersCount} 
                                    totalQuestions={questions.length}
                                    showBall={showBall}
                                    ballType={ballType}
                                    onBallCollision={handleBallCollision}
                                    onGroundCollision={handleGroundCollision}
                                />
                            </Physics>
                        </Canvas>
                    </div>

                    {/* Progress Information Container - Below the model */}
                    <div className="progress-info-container" style={{
                        backgroundColor: 'rgba(42, 92, 130, 0.1)',
                        borderRadius: '15px',
                        padding: isMobile ? '1rem' : '1.5rem',
                        border: '1px solid rgba(161, 196, 219, 0.3)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <h3 style={{
                            color: '#f2f6f9',
                            fontSize: isMobile ? '1.1rem' : '1.3rem',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
                        }}>
                            Progreso del Hígado
                        </h3>
                        
                        <div style={{
                            textAlign: 'center',
                            marginBottom: isMobile ? '1rem' : '1.5rem'
                        }}>
                            <div style={{
                                fontSize: isMobile ? '2.5rem' : '3rem',
                                fontWeight: 'bold',
                                color: '#f5b14c',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                marginBottom: '0.5rem'
                            }}>
                                {Math.round((correctAnswersCount / questions.length) * 100)}%
                            </div>
                            <div style={{
                                color: '#f2f6f9',
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                opacity: '0.9'
                            }}>
                                {correctAnswersCount} de {questions.length} respuestas correctas
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quiz;