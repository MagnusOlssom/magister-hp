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
} from '../utils/schedule';

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
/** Förvalda pluggtider (minuter) – medvetet diskreta val, inte en slider. */
const TIME_PRESETS = [60, 120, 180, 240, 300, 360, 480, 600];

export default function WeekSchedule() {
  const { sessions, profile, updateProfile } = useApp();
  const [editingTime, setEditingTime] = useState(false);

  const view = useMemo(() => ensureSchedule(sessions, profile, Date.now()), [sessions, profile]);

  // Frusna veckans uppgifter + nytillagda live-rekommendationer.
  const currentTasks = useMemo(
    () => [...view.current.tasks, ...view.newTasks],
    [view.current.tasks, view.newTasks],
  );
  const doneIds = useMemo(
    () => computeDoneTaskIds(currentTasks, view.current.weekStartMs, sessions),
    [currentTasks, view.current.weekStartMs, sessions],
  );

  const restDays = profile.restDays ?? [];

  const toggleRestDay = (day: number) => {
    const next = restDays.includes(day)
      ? restDays.filter((d) => d !== day)
      : [...restDays, day].sort((a, b) => a - b);
    updateProfile({ restDays: next });
  };

  const setMinutes = (minutes: number | undefined) => {
    updateProfile({ weeklyStudyMinutes: minutes });
    setEditingTime(false);
  };

  const doneCount = currentTasks.filter((t) => doneIds.has(t.id)).length;
  const totalTasks = currentTasks.length;

  return (
    <section className="summary__section">
      <h2 className="section-title">
        <IconCalendar size={18} /> Veckans schema
      </h2>

      <div className="card schedule-settings">
        <div className="schedule-time">
          <div className="schedule-time__head">
            <span className="field__label">Pluggtid per vecka</span>
            <span className="schedule-time__value">
              {formatHours(view.effectiveMinutes)}
              {!view.isOverride && <span className="schedule-time__tag">rekommenderat</span>}
            </span>
          </div>

          {editingTime ? (
            <div className="time-editor">
              <div className="time-editor__presets">
                {TIME_PRESETS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`preset-chip${view.isOverride && view.effectiveMinutes === m ? ' preset-chip--active' : ''}`}
                    onClick={() => setMinutes(m)}
                  >
                    {formatHours(m)}
                  </button>
                ))}
                <button
                  type="button"
                  className={`preset-chip preset-chip--reco${!view.isOverride ? ' preset-chip--active' : ''}`}
                  onClick={() => setMinutes(undefined)}
                >
                  Rekommenderat ({formatHours(view.autoMinutes)})
                </button>
              </div>
              <button type="button" className="inline-link" onClick={() => setEditingTime(false)}>
                Avbryt
              </button>
            </div>
          ) : (
            <div className="schedule-time__foot">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setEditingTime(true)}
              >
                Ändra pluggtid
              </button>
              <span className="schedule-time__hint">
                Ändras sällan – varje ändring uppdaterar veckans schema.
              </span>
            </div>
          )}
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

      <WeekGrid tasks={currentTasks} restDays={restDays} doneIds={doneIds} />

      {view.next && (
        <div className="schedule-next">
          <h3 className="schedule-next__title">Nästa vecka – förhandsvisning</h3>
          <WeekGrid tasks={view.next.tasks} restDays={restDays} doneIds={null} />
        </div>
      )}
    </section>
  );
}

function WeekGrid({
  tasks,
  restDays,
  doneIds,
}: {
  tasks: ScheduledTask[];
  restDays: number[];
  doneIds: Set<string> | null;
}) {
  return (
    <div className="schedule-grid">
      {ALL_DAYS.map((d) => {
        const dayTasks = tasks.filter((t) => t.day === d);
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
    <Link
      to={task.href}
      className={`task-chip${done ? ' task-chip--done' : ''}${task.isNew ? ' task-chip--new' : ''}`}
    >
      <span className="task-chip__check" aria-hidden="true">
        {done ? <IconCheck size={14} /> : null}
      </span>
      <span className="task-chip__label">{task.label}</span>
      {task.isNew && !done && <span className="task-chip__badge">Ny</span>}
      {!done && <IconArrowRight size={14} className="task-chip__go" />}
    </Link>
  );
}
