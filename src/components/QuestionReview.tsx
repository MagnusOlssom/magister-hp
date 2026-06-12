import { useState } from 'react';
import type { AnsweredQuestion, CategoryMeta, Question } from '../types';
import { formatDuration } from '../utils/format';
import { IconArrowLeft, IconArrowRight, IconCheck, IconClock, IconX } from './icons';

const LETTERS = 'ABCDE';

type Status = 'correct' | 'wrong' | 'timeout';

interface Props {
  /** Frågorna i den ordning de visades under passet. */
  questions: Question[];
  /** Besvarade frågor. Frågor som saknas här hanns inte med (tiden tog slut). */
  answered: AnsweredQuestion[];
  meta: CategoryMeta;
}

/**
 * Navigerbar granskning av varje enskild fråga efter ett pass.
 * Tre tillstånd: rätt, fel och "hann inte svara" (tiden tog slut).
 */
export default function QuestionReview({ questions, answered, meta }: Props) {
  const answerById = new Map(answered.map((a) => [a.questionId, a]));
  const [active, setActive] = useState(0);

  const evaluate = (q: Question): { status: Status; answer: AnsweredQuestion | null } => {
    const answer = answerById.get(q.id) ?? null;
    if (!answer || answer.selected === null) return { status: 'timeout', answer };
    return { status: answer.correct ? 'correct' : 'wrong', answer };
  };

  const q = questions[active];
  const { status, answer } = evaluate(q);
  const correctIndex = q.options.indexOf(q.correctAnswer);

  return (
    <section className="summary__section">
      <h3 className="section-title">Granska frågorna</h3>

      <div className="review-nav" role="tablist" aria-label="Välj fråga att granska">
        {questions.map((item, i) => {
          const s = evaluate(item).status;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Fråga ${i + 1}: ${
                s === 'correct' ? 'rätt' : s === 'wrong' ? 'fel' : 'hann inte svara'
              }`}
              className={`review-nav__item review-nav__item--${s}${
                i === active ? ' review-nav__item--active' : ''
              }`}
              onClick={() => setActive(i)}
            >
              {s === 'correct' ? (
                <IconCheck size={15} />
              ) : s === 'wrong' ? (
                <IconX size={15} />
              ) : (
                <IconClock size={14} />
              )}
              <span className="review-nav__num">{i + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="card review-detail">
        <div className="review-detail__head">
          <span className="review-detail__counter">
            Fråga {active + 1} av {questions.length}
          </span>
          <span className="difficulty-chip" style={{ color: meta.color }}>
            Svårighetsgrad: {q.difficulty}
          </span>
        </div>

        {q.passage && (
          <div className="passage">
            <span className="passage__label">
              {q.category === 'DTK'
                ? 'Beskrivning av diagram/tabell'
                : q.category === 'ELF'
                  ? 'Text (engelska)'
                  : 'Text'}
            </span>
            <p className="passage__text">{q.passage}</p>
          </div>
        )}

        <p className="review-detail__question">{q.question}</p>

        <div className="options options--readonly">
          {q.options.map((option, i) => {
            const isCorrect = option === q.correctAnswer;
            const isUserChoice = answer?.selected === option;
            let cls = 'option-btn option-btn--revealed';
            if (isCorrect) cls += ' option-btn--correct';
            else if (isUserChoice) cls += ' option-btn--wrong';
            return (
              <div key={option} className={cls}>
                <span className="option-btn__letter">{LETTERS[i]}</span>
                <span className="option-btn__text">{option}</span>
                {isCorrect && <IconCheck size={20} className="option-btn__mark" />}
                {isUserChoice && !isCorrect && <IconX size={20} className="option-btn__mark" />}
              </div>
            );
          })}
        </div>

        {status === 'timeout' ? (
          <div className="feedback feedback--timeout">
            <div className="feedback__headline">
              <IconClock size={20} /> Du hann inte besvara denna fråga – tiden gick ut
            </div>
            <p className="feedback__answer">
              Rätt svar:{' '}
              <strong>
                {LETTERS[correctIndex]} – {q.correctAnswer}
              </strong>
            </p>
            <p className="feedback__explanation">{q.explanation}</p>
          </div>
        ) : status === 'correct' ? (
          <div className="feedback feedback--success">
            <div className="feedback__headline">
              <IconCheck size={20} /> Rätt svar!
            </div>
            <p className="feedback__answer">
              Ditt svar:{' '}
              <strong>
                {LETTERS[q.options.indexOf(answer!.selected!)]} – {answer!.selected}
              </strong>
              {answer!.timeSpentSec > 0 && (
                <span className="feedback__time"> · {formatDuration(answer!.timeSpentSec)}</span>
              )}
            </p>
            <p className="feedback__explanation">{q.explanation}</p>
          </div>
        ) : (
          <div className="feedback feedback--error">
            <div className="feedback__headline">
              <IconX size={20} /> Tyvärr fel
            </div>
            <p className="feedback__answer feedback__answer--wrong">
              Ditt svar:{' '}
              <strong>
                {LETTERS[q.options.indexOf(answer!.selected!)]} – {answer!.selected}
              </strong>
            </p>
            <p className="feedback__answer">
              Rätt svar:{' '}
              <strong>
                {LETTERS[correctIndex]} – {q.correctAnswer}
              </strong>
            </p>
            <p className="feedback__explanation">{q.explanation}</p>
          </div>
        )}

        <div className="review-detail__nav">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={active === 0}
            onClick={() => setActive((i) => Math.max(0, i - 1))}
          >
            <IconArrowLeft size={16} /> Föregående
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={active === questions.length - 1}
            onClick={() => setActive((i) => Math.min(questions.length - 1, i + 1))}
          >
            Nästa <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
