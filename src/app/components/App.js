"use client"
import React, { useEffect } from "react";
import useQuizStore from "./../store/QuizStore";

export default function App() {
  const {
    status,
    numQuestions,
    points,
    maxPossiblePoints,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    restartQuiz,
    tick,
    index,
    answer,
    secondsRemaining,
    questions,
  } = useQuizStore();

  const percentage = (points / maxPossiblePoints) * 100;

  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const question = questions[index];
  const hasAnswered = answer !== null;

  useEffect(() => {
    const id = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="app">
      <div className="app-header">
        {status === "active" ? (
          <div className="timer">
            {mins < 10 && "0"}
            {mins}:{seconds < 10 && "0"}
            {seconds}
          </div>
        ) : null}
      </div>

      <div className="main">
        {status === "loading" && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading questions...</p>
          </div>
        )}
        {status === "error" && (
          <p className="error">
            <span>💥</span> There was an error fetching questions.
          </p>
        )}
        {status === "ready" && (
          <div className="start">
            <h2>Quiz App</h2>
            <h3>{numQuestions} questions to test your quiz app</h3>
            <button className="btn btn-ui" onClick={startQuiz}>
              Let's Go
            </button>
          </div>
        )}
        {status === "active" && (
          <>
            <div className="progress">
              <progress
                max={numQuestions}
                value={index + Number(answer !== null)}
              />

              <p>
                Question <strong>{index + 1}</strong> / {numQuestions}
              </p>

              <p>
                <strong>{points}</strong> / {maxPossiblePoints}
              </p>
            </div>
            <div>
              <h4>{question.text}</h4>
              <div className="options">
                {question.answers.map((answer, idx) => (
                  <label
                    key={answer.text}
                    className={`option-label ${
                      hasAnswered
                        ? answer.isCorrect
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={hasAnswered && answer.isCorrect}
                      disabled={hasAnswered}
                      onChange={() => answerQuestion(idx)}
                      className="custom-checkbox"
                    />
                    <span className="answer-text">{answer.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              {answer === null ? null : index < numQuestions - 1 ? (
                <button className="btn btn-ui" onClick={nextQuestion}>
                  Next
                </button>
              ) : index === numQuestions - 1 ? (
                <button className="btn btn-ui" onClick={finishQuiz}>
                  Finish
                </button>
              ) : null}
            </div>
          </>
        )}
        {status === "finished" && (
          <>
            <p className="result">
              You scored <strong>{points}</strong> out of{" "}
              {maxPossiblePoints} ({Math.ceil(percentage)}%)
            </p>
            <button className="btn btn-ui" onClick={restartQuiz}>
              Restart quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
