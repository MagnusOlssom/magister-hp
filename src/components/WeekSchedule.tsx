import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { IconArrowRight, IconCalendar, IconCheck } from './icons';
import {
  computeDoneTaskIds,
  DAY_LABELS,
  ensureSchedule,
  formatHours,
  type ScheduledTask,
  type WeekSchedule as WeekScheduleData,
} from '../utils/schedule';

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export default function WeekSchedule() {
  const { sessions, profile, updateProfile } = useApp();
  const [draftMinutes, setDraftMinutes] = useState<number | null>(null);

  const view = useMemo(
    () => ensureSchedule(sessions, profile, Date.now()),
    [sessions, profile],
  );
  const doneIds = useMemo(
    () => computeDoneTaskIds(view.current, sessions),
    [view.current, sessions],
  );

  const restDays = profile.restDays ?? [];
  const sliderValue = draftMinutes ?? view.effectiveMinutes;

  const toggleRestDay = (day: number) => {
    const next = restDays.includes(day)
      ? restDays.filter((d) => d !== day)
      : [...restDays, day].sort((a, b) => a - b);
    updateProfile({ restDays: next });
  };

  const commitMinutes = () => {
    if (draftMinutes !== null) {
      updateProfile({ weeklyStudyMinutes: draftMinutes });
      setDraftMinutes(null);
    }
  };

  const doneCount = view.current.tasks.filter((t) => doneIds.has(t.id)).length;
  const totalTasks = view.current.tasks.length;

  return (
    <section className="summary__section">
      <h2 className="section-title">
        <IconCalendar size={18} /> Veckans schema
      </h2>

      {/* Inställningar: pluggtid + vilodagar */}
      <div className="card schedule-settings">
        <div className="schedule-time">
          <div className="schedule-time__head">
            <span className="field__label">Pluggtid den här veckan</span>
            <span className="schedule-time__value">{formatHours(sliderValue)}</span>
          </div>
          <input
            type="range"
            className="field__range"
            min={60}
            max={900}
            step={30}
            value={sliderValue}
            onChange={(e) => setDraftMinutes(Number(e.target.value))}
            onMouseUp={commitMinutes}
            onTouchEnd={commitMinutes}
            onKeyUp={commitMinutes}
            aria-label="Pluggtid per vecka"
          />
          <div className="schedule-time__foot">
            {view.isOverride ? (
              <button
                type="button"
                className="inline-link"
                onClick={() => {
                  updateProfile({ weeklyStudyMinutes: undefined });
                  setDraftMinutes(null);
                }}
              >
                Återställ till rekommenderat ({formatHours(view.autoMinutes)})
              </button>
            ) : (
              <span className="schedule-time__hint">
                Rekommenderat utifrån ditt mål och din utveckling
              </span>
            )}
          </div>
        </div>

        <div className="schedule-rest">
          <span className="field__label">Vilodagar (inga uppgifter)</span>
          <div className="schedule-rest__days">
            {ALL_DAYS.map((d) => {
              const isRest = restDays.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  className={`day-toggle${isRest ? ' day-toggle--rest' : ''}`}
                  aria-pressed={isRest}
                  onClick={() => toggleRestDay(d)}
                >
                  {DAY_LABELS[d]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aktuell vecka */}
      <div className="schedule-progress">
        <span>
          {totalTasks > 0
            ? `${doneCount} av ${totalTasks} uppgifter klara`
            : 'Inga uppgifter inplanerade'}
        </span>
        {totalTasks > 0 && (
          <div className="bar-track bar-track--thin">
            <div
              className="bar-fill"
              style={{
                width: `${Math.round((doneCount / totalTasks) * 100)}%`,
                backgroundColor: doneCount === totalTasks ? 'var(--success)' : 'var(--primary)',
              }}
            />
          </div>
        )}
      </div>

      <WeekGrid week={view.current} restDays={restDays} doneIds={doneIds} />

      {/* Nästa vecka (söndag kväll) */}
      {view.next && (
        <div className="schedule-next">
          <h3 className="schedule-next__title">Nästa vecka – förhandsvisning</h3>
          <WeekGrid week={view.next} restDays={restDays} doneIds={null} />
        </div>
      )}
    </section>
  );
}

function WeekGrid({
  week,
  restDays,
  doneIds,
}: {
  week: WeekScheduleData;
  restDays: number[];
  doneIds: Set<string> | null;
}) {
  return (
    <div className="schedule-grid">
      {ALL_DAYS.map((d) => {
        const dayTasks = week.tasks.filter((t) => t.day === d);
        const isRest = restDays.includes(d);
        return (
          <div key={d} className={`schedule-day${isRest ? ' schedule-day--rest' : ''}`}>
            <span className="schedule-day__label">{DAY_LABELS[d]}</span>
            <div className="schedule-day__tasks">
              {isRest ? (
                <span className="schedule-day__empty">Vilodag</span>
              ) : dayTasks.length === 0 ? (
                <span className="schedule-day__empty">Ledigt</span>
              ) : (
                dayTasks.map((task) =>
                  doneIds ? (
                    <TaskChip key={task.id} task={task} done={doneIds.has(task.id)} />
                  ) : (
                    <span key={task.id} className="task-chip task-chip--preview">
                      <span className="task-chip__label">{task.label}</span>
                    </span>
                  ),
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskChip({ task, done }: { task: ScheduledTask; done: boolean }) {
  return (
    <Link to={task.href} className={`task-chip${done ? ' task-chip--done' : ''}`}>
      <span className="task-chip__check" aria-hidden="true">
        {done ? <IconCheck size={14} /> : null}
      </span>
      <span className="task-chip__label">{task.label}</span>
      {!done && <IconArrowRight size={14} className="task-chip__go" />}
    </Link>
  );
}
