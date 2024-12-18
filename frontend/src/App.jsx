import React, { useState } from 'react';
import questionsData from '../../ques.json';

const App = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = React.useMemo(() => {
    if (questionsData && Array.isArray(questionsData.questions)) {
      const shuffled = [...questionsData.questions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 25);
    }
    return [];
  }, []);

  const handleAnswer = (questionIndex, answerIndex) => {
    if (!questions[questionIndex] || !questions[questionIndex].answers[answerIndex]) {
      return;
    }

    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      
      // Если ответ уже выбран - отменяем его
      if (newAnswers[questionIndex]?.selectedAnswerIndex === answerIndex) {
        delete newAnswers[questionIndex];
      } else {
        // Иначе записываем новый ответ
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

  if (showResults) {
    return (
      <div className="container">
        <div className="results-container">
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
