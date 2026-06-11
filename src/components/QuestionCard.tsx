import type { CategoryMeta, Question } from '../types';
import { IconArrowRight, IconCheck, IconX } from './icons';

const LETTERS = 'ABCDE';

interface Props {
  question: Question;
  meta: CategoryMeta;
  selected: string | null;
  revealed: boolean;
  isLast: boolean;
  onSelect: (option: string) => void;
  onNext: () => void;
}

export default function QuestionCard({
  question,
  meta,
  selected,
  revealed,
  isLast,
  onSelect,
  onNext,
}: Props) {
  const passageLabel =
    question.category === 'DTK'
      ? 'Beskrivning av diagram/tabell'
      : question.category === 'ELF'
        ? 'Text (engelska)'
        : 'Text';

  const correct = selected !== null && selected === question.correctAnswer;
  const correctIndex = question.options.indexOf(question.correctAnswer);

  return (
    <div className="question-card card">
      {question.passage && (
        <div className="passage">
          <span className="passage__label">{passageLabel}</span>
          <p className="passage__text">{question.passage}</p>
        </div>
      )}

      {question.category === 'ORD' && <p className="question-card__hint">Vilket ord eller uttryck betyder ungefär detsamma?</p>}
      <h2 className={`question-card__question${question.category === 'ORD' ? ' question-card__question--word' : ''}`}>
        {question.question}
      </h2>

      <div className="options" role="group" aria-label="Svarsalternativ">
        {question.options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrectOption = option === question.correctAnswer;
          let cls = 'option-btn';
          if (revealed) {
            cls += ' option-btn--revealed';
            if (isCorrectOption) cls += ' option-btn--correct';
            else if (isSelected) cls += ' option-btn--wrong';
          }
          return (
            <button
              key={option}
              type="button"
              className={cls}
              onClick={() => !revealed && onSelect(option)}
              disabled={revealed && !isCorrectOption && !isSelected}
            >
              <span className="option-btn__letter">{LETTERS[i]}</span>
              <span className="option-btn__text">{option}</span>
              {revealed && isCorrectOption && <IconCheck size={20} className="option-btn__mark" />}
              {revealed && isSelected && !isCorrectOption && (
                <IconX size={20} className="option-btn__mark" />
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`feedback ${correct ? 'feedback--success' : 'feedback--error'}`}>
          <div className="feedback__headline">
            {correct ? (
              <>
                <IconCheck size={20} /> Rätt svar!
              </>
            ) : (
              <>
                <IconX size={20} /> Tyvärr fel
              </>
            )}
          </div>
          {!correct && (
            <p className="feedback__answer">
              Rätt svar: <strong>{LETTERS[correctIndex]} – {question.correctAnswer}</strong>
            </p>
          )}
          <p className="feedback__explanation">{question.explanation}</p>
          <div className="feedback__footer">
            <span className="difficulty-chip" style={{ color: meta.color }}>
              Svårighetsgrad: {question.difficulty}
            </span>
            <button type="button" className="btn btn--primary" onClick={onNext} autoFocus>
              {isLast ? 'Visa resultat' : 'Nästa fråga'} <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
