import React, { useState, useMemo, useEffect } from 'react';
import questionsHS from '../../test/ques_HS.json';
import questionsBD from '../../test/ques_BD.json';
import questionsKZ from '../../test/ques_KZ.json';
import questionsCST from '../../test/ques_CS_T.json';
import questionsCSM from '../../test/ques_CS_M.json';
import questionsCSB from '../../test/ques_CS_B.json';
import QuestionsList from './components/QuestionsList';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Объект с доступными тестами
  const availableTests = {
    HS: { 
      name: 'История Казахстана', 
      data: questionsHS, 
      isStudyMode: true,
      icon: '📚'
    },
    BD: { 
      name: 'База данных', 
      data: questionsBD, 
      isStudyMode: false,
      icon: '💾'
    },
    KZ: { 
      name: 'Казахский язык', 
      data: questionsKZ, 
      isStudyMode: false,
      icon: '🗣️'
    },
    CST: {
      name: 'Компьютерные сети (Тест)',
      data: questionsCST,
      isStudyMode: false,
      icon: '🌐'
    },
    CSM: {
      name: 'Компьютерные сети (Маршрутизация)',
      data: questionsCSM,
      isStudyMode: false,
      icon: '🔌'
    },
    CSB: {
      name: 'Компьютерные сети (Билеты)',
      data: questionsCSB,
      isStudyMode: true,
      icon: '📡'
    }
  };

  // Применяем тему
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const questions = useMemo(() => {
    if (selectedTest && availableTests[selectedTest].data && Array.isArray(availableTests[selectedTest].data.questions)) {
      const shuffledQuestions = shuffleArray(availableTests[selectedTest].data.questions);
      
      return shuffledQuestions.slice(0, 25).map(question => ({
        ...question,
        answers: shuffleArray(question.answers)
      }));
    }
    return [];
  }, [selectedTest]);

  const handleAnswer = (questionIndex, answerIndex) => {
    if (!questions[questionIndex] || !questions[questionIndex].answers[answerIndex]) {
      return;
    }

    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      
      if (newAnswers[questionIndex]?.selectedAnswerIndex === answerIndex) {
        delete newAnswers[questionIndex];
      } else {
        newAnswers[questionIndex] = {
          question: questions[questionIndex].question,
          answers: questions[questionIndex].answers,
          correctAnswer: questions[questionIndex].answers.find((ans) => ans.correct)?.text || 'Нет правильного ответа',
          userAnswer: questions[questionIndex].answers[answerIndex]?.text || 'Ответ не выбран',
          isCorrect: questions[questionIndex].answers[answerIndex]?.correct || false,
          selectedAnswerIndex: answerIndex,
        };
      }
      
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
    setShowAllQuestions(false);
  };

  const renderNavigation = () => {
    const isStudyMode = availableTests[selectedTest]?.isStudyMode;

    return (
      <div className="navigation">
        <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
        {!isStudyMode && (
          <>
            <button 
              className={`nav-button ${!showAllQuestions && !showResults ? 'active' : ''}`}
              onClick={() => {
                setShowAllQuestions(false);
                setShowResults(false);
              }}
            >
              Тест
            </button>
            <button 
              className={`nav-button ${showResults ? 'active' : ''}`}
              onClick={() => {
                setShowResults(true);
                setShowAllQuestions(false);
              }}
              disabled={!Object.keys(userAnswers).length}
            >
              Результаты
            </button>
          </>
        )}
        <button 
          className={`nav-button ${showAllQuestions ? 'active' : ''}`}
          onClick={() => {
            setShowAllQuestions(true);
            setShowResults(false);
          }}
        >
          Все вопросы
        </button>
        {!isStudyMode && (
          <button 
            className="nav-button"
            onClick={handleReset}
          >
            Начать заново
          </button>
        )}
      </div>
    );
  };

  if (!selectedTest) {
    return (
      <div className="container">
        <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(prev => !prev)} />
        <div className="test-selection">
          <h2>Выберите тест</h2>
          <div className="test-grid">
            {Object.entries(availableTests).map(([key, test]) => (
              <button
                key={key}
                className={`test-button ${test.isStudyMode ? 'study-mode' : 'test-mode'}`}
                onClick={() => setSelectedTest(key)}
              >
                <span className="test-icon">{test.icon}</span>
                <span className="test-name">{test.name}</span>
                <span className="test-type">
                  {test.isStudyMode ? 'Режим изучения' : 'Режим теста'}
                </span>
                <span className="question-count">
                  {test.data.questions_and_answers?.length || test.data.questions?.length} вопросов
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showAllQuestions || availableTests[selectedTest]?.isStudyMode) {
    return (
      <div className="container">
        {renderNavigation()}
        <QuestionsList selectedTest={selectedTest} />
      </div>
    );
  }

  if (showResults) {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    const correctAnswers = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="container">
        {renderNavigation()}
        <div className="results-container">
          <div className="results-summary">
            <h2>Результаты теста</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{totalQuestions}</div>
                <div className="stat-label">Всего вопросов</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{answeredQuestions}</div>
                <div className="stat-label">Отвечено</div>
              </div>
              <div className="stat-item correct">
                <div className="stat-value">{correctAnswers}</div>
                <div className="stat-label">Правильно</div>
              </div>
              <div className="stat-item incorrect">
                <div className="stat-value">{incorrectAnswers}</div>
                <div className="stat-label">Неправильно</div>
              </div>
              <div className="stat-item score">
                <div className="stat-value">{score}%</div>
                <div className="stat-label">Результат</div>
              </div>
            </div>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="result-item">
              <p className="question-text">
                <strong>Вопрос {index + 1}:</strong> {question.question}
              </p>
              <ol>
                {question.answers.map((ans, ansIndex) => (
                  <li key={ansIndex}>
                    <button
                      className={`answer-button 
                        ${ans.correct ? 'correct' : ''} 
                        ${userAnswers[index]?.selectedAnswerIndex === ansIndex ? 'selected' : ''}
                        ${!ans.correct && userAnswers[index]?.selectedAnswerIndex === ansIndex ? 'incorrect' : ''}
                      `}
                      disabled
                    >
                      {ans.text}
                    </button>
                  </li>
                ))}
              </ol>
              {userAnswers[index] ? (
                <p className={userAnswers[index].isCorrect ? 'correct-answer' : 'incorrect-answer'}>
                  {userAnswers[index].isCorrect ? 'Верно' : 'Неверно'}
                </p>
              ) : (
                <p className="incorrect-answer">Ответ не выбран</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {renderNavigation()}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-container">
            <p className="question-text">{questionIndex + 1}. {question?.question || 'Вопрос недоступен'}</p>
            <ol>
              {question?.answers?.map((answer, answerIndex) => (
                <li key={answerIndex}>
                  <button
                    type="button"
                    className={`answer-button ${userAnswers[questionIndex]?.selectedAnswerIndex === answerIndex ? 'selected' : ''}`}
                    onClick={() => handleAnswer(questionIndex, answerIndex)}
                  >
                    {answer?.text || 'Ответ недоступен'}
                  </button>
                </li>
              )) || <p>Ответы недоступны</p>}
            </ol>
          </div>
        ))}
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default App;
