import React, { useState, useMemo } from 'react';
import questionsData from '../../../test/ques_KZ.json';

const QuestionsList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return questionsData.questions;

    return questionsData.questions.filter(question => {
      const questionMatch = question.question.toLowerCase().includes(query);
      const answersMatch = question.answers.some(answer => 
        answer.text.toLowerCase().includes(query)
      );
      const numberMatch = question.number.toString().includes(query);

      return questionMatch || answersMatch || numberMatch;
    });
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
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
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={handleClearSearch}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>
        <div className="search-info">
          Найдено вопросов: {filteredQuestions.length}
        </div>
      </div>
      <div className="results-container">
        {filteredQuestions.map((question, index) => (
          <div key={index} className="result-item">
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