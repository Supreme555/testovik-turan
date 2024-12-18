import React from 'react';
import questionsData from '../../../ques.json';

const QuestionsList = () => {
  return (
    <div className="container">
      <div className="results-container">
        {questionsData.questions.map((question, index) => (
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
      </div>
    </div>
  );
};

export default QuestionsList; 