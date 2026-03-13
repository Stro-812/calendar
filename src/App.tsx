import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  formatDayNumber,
  formatMonthLabel,
  formatShortWeekday,
  formatTime,
  formatWeekRange,
  getHourLabels,
  getMinutesSinceDayStart,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  parseDateTime,
  toLocalInputValue
} from "./date";
import { createEvent, listEvents, updateEvent } from "./api/calendarApi";
import { CalendarEvent, CalendarView } from "./types";

const DAY_MINUTES = 24 * 60;
const SLOT_HEIGHT = 56;

const TEAM_CALENDARS = [
  { label: "Бег", color: "#0b4fb3" },
  { label: "Плавание", color: "#33a0ff" },
  { label: "Велосипед", color: "#5fa700" },
  { label: "Прочее", color: "#7986cb" }
];

type DraftEvent = {
  title: string;
  start: string;
  end: string;
  color: string;
  description: string;
  location: string;
};

type ComposerState = {
  mode: "create" | "edit";
  eventId: string | null;
};

const DEFAULT_DRAFT = (date = new Date()): DraftEvent => ({
  title: "",
  start: toLocalInputValue(date),
  end: toLocalInputValue(new Date(date.getTime() + 60 * 60 * 1000)),
  color: "#1a73e8",
  description: "",
  location: ""
});

export default function App() {
  const [view, setView] = useState<CalendarView>("week");
  const [cursorDate, setCursorDate] = useState(new Date("2026-03-11T08:00:00"));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftEvent>(DEFAULT_DRAFT(new Date("2026-03-11T10:00:00")));
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerState, setComposerState] = useState<ComposerState>({ mode: "create", eventId: null });
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  useEffect(() => {
    listEvents().then(setEvents);
  }, []);

  const weekDays = useMemo(() => getWeekDays(cursorDate), [cursorDate]);
  const monthDays = useMemo(() => getMonthGrid(cursorDate), [cursorDate]);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const visibleEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      startDate: parseDateTime(event.start),
      endDate: parseDateTime(event.end)
    }));
  }, [events]);
  const summary = useMemo(() => {
    const all = events.length;
    const focus = events.filter((event) => event.tag === "focus").length;
    const personal = events.filter((event) => event.tag === "personal").length;
    const meeting = events.filter((event) => event.tag === "meeting").length;

    return {
      all,
      focus,
      personal,
      meeting
    };
  }, [events]);

  const today = new Date("2026-03-11T00:00:00");

  function shiftPeriod(direction: -1 | 1) {
    setCursorDate((current) => (view === "week" ? addDays(current, direction * 7) : addMonths(current, direction)));
  }

  function openComposer(date?: Date) {
    const seed = date ?? new Date(cursorDate);
    const end = new Date(seed);
    end.setHours(seed.getHours() + 1);
    setComposerState({ mode: "create", eventId: null });
    setDraft({
      title: "",
      start: toLocalInputValue(seed),
      end: toLocalInputValue(end),
      color: "#1a73e8",
      description: "",
      location: ""
    });
    setIsComposerOpen(true);
  }

  function openEditor(eventId: string) {
    const targetEvent = events.find((event) => event.id === eventId);
    if (!targetEvent) {
      return;
    }

    setComposerState({ mode: "edit", eventId });
    setDraft({
      title: targetEvent.title,
      start: targetEvent.start,
      end: targetEvent.end,
      color: targetEvent.color,
      description: targetEvent.description ?? "",
      location: targetEvent.location ?? ""
    });
    setIsComposerOpen(true);
  }

  async function handleSaveEvent() {
    if (!draft.title.trim()) {
      return;
    }

    const baseEvent: CalendarEvent = {
      id: composerState.eventId ?? `evt-${Date.now()}`,
      title: draft.title.trim(),
      start: draft.start,
      end: draft.end,
      color: draft.color,
      tag: "meeting",
      description: draft.description.trim(),
      location: draft.location.trim()
    };

    if (composerState.mode === "edit" && composerState.eventId) {
      const updated = await updateEvent(baseEvent);
      setEvents((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setSelectedEventId(updated.id);
      setIsComposerOpen(false);
      return;
    }

    const created = await createEvent(baseEvent);
    setEvents((current) => [created, ...current]);
    setIsComposerOpen(false);
    setSelectedEventId(created.id);
  }

  async function moveEvent(eventId: string, nextDate: Date) {
    const existing = events.find((entry) => entry.id === eventId);
    if (!existing) {
      return;
    }

    const start = parseDateTime(existing.start);
    const end = parseDateTime(existing.end);
    const duration = end.getTime() - start.getTime();
    const nextStart = new Date(nextDate);
    const nextEnd = new Date(nextStart.getTime() + duration);
    const updatedEvent: CalendarEvent = {
      ...existing,
      start: toLocalInputValue(nextStart),
      end: toLocalInputValue(nextEnd)
    };

    setEvents((current) => current.map((entry) => (entry.id === eventId ? updatedEvent : entry)));
    await updateEvent(updatedEvent);
  }

  return (
    <div className="page-shell">
      <header className="portal-header">
        <div className="portal-brand">
          <strong>S10.run</strong>
          <span>Student</span>
        </div>
        <nav className="portal-nav">
          <button type="button">Модули</button>
          <button type="button">Доска</button>
          <button type="button">Дедлайны</button>
          <button type="button">Календарь</button>
          <button type="button">Рейтинг</button>
          <button type="button">Платежи</button>
        </nav>
        <div className="portal-meta">
          <span>Март 2026</span>
          <button className="portal-user">TS</button>
        </div>
      </header>

      <div className="app-shell">
        <aside className="sidebar">
          <div className="section-bar">Управление</div>
          <button className="create-button" onClick={() => openComposer()}>
            <span className="plus-mark">+</span>
            Создать
          </button>

          <section className="mini-card">
            <div className="mini-card-header">
              <span>Быстрые фильтры</span>
              <button>Настроить</button>
            </div>
            <div className="filter-list">
              {[
                { label: "Все", count: summary.all, tone: "all" },
                { label: "Бег / работа", count: summary.focus, tone: "focus" },
                { label: "Вело / доп.", count: summary.meeting, tone: "meeting" },
                { label: "Плавание", count: summary.personal, tone: "personal" }
              ].map((filter) => (
                <div className={`filter-chip filter-chip-${filter.tone}`} key={filter.label}>
                  <span>{filter.label}</span>
                  <strong>{filter.count}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="mini-card compact-calendar">
            <div className="mini-card-header">
              <span>{formatMonthLabel(cursorDate)}</span>
              <button>Сегодня</button>
            </div>
            <div className="mini-month-grid">
              {getMonthGrid(cursorDate).map((day) => (
                <button
                  key={day.toISOString()}
                  className={[
                    "mini-day",
                    isSameDay(day, today) ? "is-today" : "",
                    day.getMonth() !== cursorDate.getMonth() ? "is-muted" : ""
                  ].join(" ")}
                  onClick={() => setCursorDate(day)}
                >
                  {day.getDate()}
                </button>
              ))}
            </div>
          </section>

          <section className="mini-card">
            <div className="mini-card-header">
              <span>Календари</span>
              <button>+</button>
            </div>
            <div className="calendar-list">
              {TEAM_CALENDARS.map((calendar) => (
                <label className="calendar-row" key={calendar.label}>
                  <input defaultChecked type="checkbox" />
                  <span className="calendar-dot" style={{ background: calendar.color }} />
                  <span>{calendar.label}</span>
                </label>
              ))}
            </div>
          </section>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div className="topbar-left">
              <div className="brand-lockup">
                <div className="brand-mark">
                  <span />
                </div>
                <div>
                  <h1>Календарь занятий</h1>
                  <p>Единая лента занятий, дедлайнов и личных событий</p>
                </div>
              </div>
              <div className="nav-controls">
                <button onClick={() => shiftPeriod(-1)}>‹</button>
                <button onClick={() => setCursorDate(today)}>Сегодня</button>
                <button onClick={() => shiftPeriod(1)}>›</button>
              </div>
              <div className="period-label">
                {view === "week" ? formatWeekRange(cursorDate) : formatMonthLabel(cursorDate)}
              </div>
            </div>

            <div className="topbar-right">
              <div className="searchbox">
                <input placeholder="Поиск событий, людей, календарей" />
              </div>
              <div className="view-switcher">
                <button className={view === "week" ? "is-active" : ""} onClick={() => setView("week")}>
                  Неделя
                </button>
                <button className={view === "month" ? "is-active" : ""} onClick={() => setView("month")}>
                  Месяц
                </button>
              </div>
              <button className="avatar">TS</button>
            </div>
          </header>

          <section className="hero-strip">
            <div className="hero-text">
              <div className="section-bar hero-bar">Сводка</div>
              <strong>В плане {summary.all} тренировок</strong>
              <p>
                {summary.focus} беговых сессий, {summary.personal} плавательных, {summary.meeting} вело или
                дополнительных тренировок
              </p>
            </div>
            <div className="hero-actions">
              <button>Поделиться</button>
              <button className="primary" onClick={() => openComposer()}>
                Новое событие
              </button>
            </div>
          </section>

        {view === "week" ? (
          <section className="calendar-surface week-surface">
            <div className="surface-title">Расписание недели</div>
            <div className="week-header">
              <div className="time-column-header" />
              {weekDays.map((day) => (
                <button key={day.toISOString()} className="day-column-header" onClick={() => openComposer(day)}>
                  <span>{formatShortWeekday(day)}</span>
                  <strong className={isSameDay(day, today) ? "is-today" : ""}>{formatDayNumber(day)}</strong>
                </button>
              ))}
            </div>

            <div className="week-grid">
              <div className="time-column">
                {getHourLabels().map((label) => (
                  <div className="time-slot-label" key={label}>
                    {label}
                  </div>
                ))}
              </div>

              {weekDays.map((day) => (
                <div
                  className="day-column"
                  key={day.toISOString()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (!draggedEventId) {
                      return;
                    }
                    const nextDate = new Date(day);
                    nextDate.setHours(9, 0, 0, 0);
                    void moveEvent(draggedEventId, nextDate);
                    setDraggedEventId(null);
                  }}
                >
                  {getHourLabels().map((label) => (
                    <button
                      className="grid-slot"
                      key={label}
                      onClick={() => {
                        const [hours] = label.split(":");
                        const nextDate = new Date(day);
                        nextDate.setHours(Number(hours), 0, 0, 0);
                        openComposer(nextDate);
                      }}
                    />
                  ))}

                  {visibleEvents
                    .filter((event) => isSameDay(event.startDate, day))
                    .map((event) => {
                      const top = (getMinutesSinceDayStart(event.startDate) / DAY_MINUTES) * SLOT_HEIGHT * 24;
                      const height =
                        ((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60) / DAY_MINUTES) *
                        SLOT_HEIGHT *
                        24;

                      return (
                        <button
                          draggable
                          key={event.id}
                          className={`event-card ${selectedEventId === event.id ? "is-selected" : ""}`}
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 40)}px`,
                            background: `${event.color}1a`,
                            borderColor: event.color
                          }}
                          onClick={() => setSelectedEventId(event.id)}
                          onDragStart={() => setDraggedEventId(event.id)}
                        >
                          <strong>{event.title}</strong>
                          <span>
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </span>
                          {event.location ? <small>{event.location}</small> : null}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="calendar-surface month-surface">
            <div className="surface-title">Календарь месяца</div>
            <div className="month-header-row">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((label) => (
                <div key={label} className="month-weekday-label">
                  {label}
                </div>
              ))}
            </div>
            <div className="month-grid">
              {monthDays.map((day) => (
                <button key={day.toISOString()} className="month-cell" onClick={() => openComposer(day)}>
                  <div className="month-cell-top">
                    <span
                      className={[
                        "month-day-number",
                        isSameDay(day, today) ? "is-today" : "",
                        day.getMonth() !== cursorDate.getMonth() ? "is-muted" : ""
                      ].join(" ")}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  <div className="month-events">
                    {visibleEvents
                      .filter((event) => isSameDay(event.startDate, day))
                      .slice(0, 3)
                      .map((event) => (
                        <button
                          key={event.id}
                          className="month-event-pill"
                          style={{ background: `${event.color}20`, color: event.color }}
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            setSelectedEventId(event.id);
                          }}
                        >
                          {formatTime(event.startDate)} {event.title}
                        </button>
                      ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

          <aside className="details-panel">
            <div className="surface-title">Детали</div>
          {selectedEvent ? (
            <>
              <div className="details-chip" style={{ background: `${selectedEvent.color}20`, color: selectedEvent.color }}>
                {selectedEvent.tag}
              </div>
              <h2>{selectedEvent.title}</h2>
              <p>
                {formatTime(parseDateTime(selectedEvent.start))} - {formatTime(parseDateTime(selectedEvent.end))}
              </p>
              {selectedEvent.location ? <p>{selectedEvent.location}</p> : null}
              {selectedEvent.description ? <p>{selectedEvent.description}</p> : null}
              <div className="details-actions">
                <button onClick={() => openEditor(selectedEvent.id)}>Редактировать</button>
                <button className="primary">Поделиться</button>
              </div>
            </>
          ) : (
            <>
              <h2>Выберите событие</h2>
              <p>Правая панель покажет детали, участников и быстрые действия.</p>
            </>
          )}
          </aside>
        </main>
      </div>

      {isComposerOpen ? (
        <div className="modal-backdrop" onClick={() => setIsComposerOpen(false)}>
          <div className="composer-modal" onClick={(event) => event.stopPropagation()}>
            <div className="composer-header">
              <h2>{composerState.mode === "edit" ? "Редактировать событие" : "Новое событие"}</h2>
              <button onClick={() => setIsComposerOpen(false)}>×</button>
            </div>
            <div className="composer-grid">
              <label>
                Название
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Например, weekly sync"
                />
              </label>
              <label>
                Цвет
                <input
                  type="color"
                  value={draft.color}
                  onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))}
                />
              </label>
              <label>
                Начало
                <input
                  type="datetime-local"
                  value={draft.start}
                  onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
                />
              </label>
              <label>
                Конец
                <input
                  type="datetime-local"
                  value={draft.end}
                  onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
                />
              </label>
              <label>
                Место
                <input
                  value={draft.location}
                  onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
                  placeholder="Zoom / офис / ссылка"
                />
              </label>
              <label className="full-width">
                Описание
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Что важно подготовить"
                />
              </label>
            </div>
            <div className="composer-actions">
              <button onClick={() => setIsComposerOpen(false)}>Отмена</button>
              <button className="primary" onClick={() => void handleSaveEvent()}>
                {composerState.mode === "edit" ? "Обновить" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
