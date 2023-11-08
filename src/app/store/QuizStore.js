import create from 'zustand';
import newquestions from './../data/quiz.json';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: newquestions,
  status: 'ready',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  numQuestions: newquestions.length,
  maxPossiblePoints: newquestions.reduce(
    (prev, cur) =>
      prev +
      cur.answers.reduce((acc, answer) => (answer.isCorrect ? acc + cur.points : acc), 0),
    0
  ),
};

const useQuizStore = create((set) => ({
  ...initialState,

  startQuiz: () =>
    set((state) => ({
      ...state,
      status: 'active',
      secondsRemaining: state.numQuestions * SECS_PER_QUESTION,
    })),

  answerQuestion: (payload) =>
    set((state) => {
      const question = state.questions[state.index];
      const newPoints = payload === question.answers.findIndex(answer => answer.isCorrect)
        ? state.points + question.points
        : state.points;
      return { ...state, answer: payload, points: newPoints };
    }),

  nextQuestion: () =>
    set((state) => ({ ...state, index: state.index + 1, answer: null })),

  finishQuiz: () =>
    set((state) => ({
      ...state,
      status: 'finished',
      highscore: state.points > state.highscore ? state.points : state.highscore,
    })),

  restartQuiz: () => set(() => initialState),

  tick: () =>
    set((state) => ({
      ...state,
      secondsRemaining: state.secondsRemaining - 1,
      status: state.secondsRemaining === 0 ? 'finished' : state.status,
    })),
}));

export default useQuizStore;
