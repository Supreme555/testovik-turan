import React, { useState, useMemo } from 'react';
import questionsHS from '../../../test/ques_HS.json';
import questionsBD from '../../../test/ques_BD.json';
import questionsKZ from '../../../test/ques_KZ.json';
import questionsCST from '../../../test/ques_CS_T.json';
import questionsCSM from '../../../test/ques_CS_M.json';
import questionsCSB from '../../../test/ques_CS_B.json';
import questionsPS from '../../../test/ques_PS.json';
import questionsPS_A from '../../../test/ques_PS_A.json';
const QuestionsList = ({ selectedTest = 'HS' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const availableTests = {
    HS: questionsHS,
    BD: questionsBD,
    KZ: questionsKZ,
    CST: questionsCST,
    CSM: questionsCSM,
    CSB: questionsCSB,
    PS: questionsPS,
    PS_A: questionsPS_A
  };

  const currentTestData = availableTests[selectedTest];
  const questions = currentTestData.questions_and_answers || currentTestData.questions;

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return questions;

    return questions.filter(question => {
      const questionMatch = question.question.toLowerCase().includes(query);
      
      // Для режима изучения (История Казахстана)
      if (question.answer) {
        const answerText = Object.values(question.answer).join(' ').toLowerCase();
        return questionMatch || answerText.includes(query);
      }
      
      // Для режима тестирования
      const answersMatch = question.answers?.some(answer => 
        answer.text.toLowerCase().includes(query)
      );
      return questionMatch || answersMatch;
    });
  }, [searchQuery, questions]);

  const renderQuestion = (question) => {
    // Для режима изучения (История Казахстана)
    if (question.answer) {
      return (
        <div className="result-item study-mode">
          <p className="question-text">
            <strong>Вопрос {question.number}:</strong> {question.question}
          </p>
          <div className="answer-content">
            {Object.entries(question.answer).map(([title, content], i) => (
              <div key={i} className="answer-section">
                <h4>{title}</h4>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Для режима тестирования
    return (
      <div className="result-item test-mode">
        <p className="question-text">
          <strong>Вопрос {question.number}:</strong> {question.question}
        </p>
        <ol>
          {question.answers.map((answer, ansIndex) => (
            <li key={ansIndex}>
              <button
                className={`answer-button ${answer.correct ? 'correct' : ''}`}
                disabled
              >
                {answer.text}
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Поиск по вопросам и ответам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            className="clear-search"
            onClick={() => setSearchQuery('')}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        </div>
        <div className="search-info">
          Найдено вопросов: {filteredQuestions.length}
        </div>
      </div>
      <div className="results-container">
        {filteredQuestions.map((question, index) => (
          <div key={index}>
            {renderQuestion(question)}
          </div>
        ))}
        {filteredQuestions.length === 0 && (
          <div className="no-results">
            По вашему запросу ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsList; 