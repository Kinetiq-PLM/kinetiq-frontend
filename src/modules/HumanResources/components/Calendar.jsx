import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Calendar.css";

const Calendar = () => {
  /* ── state ─────────────────────────────────────────────────────────── */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── data fetch ─────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/calendar_dates/calendar_dates/"
        );
        setCalendarData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── navigation ─────────────────────────────────────────────────────── */
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  /* ── helpers ────────────────────────────────────────────────────────── */
  const todayISO = new Date().toISOString().split("T")[0];

  /** build an array of 42 cells (6 rows × 7 cols) for the current view */
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    /* leading empty cells */
    for (let i = 0; i < firstDayIndex; i++) cells.push({ empty: true });

    /* actual days */
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      const meta = calendarData.find((c) => c.date === dateStr) || {};
      cells.push({
        day: d,
        dateStr,
        isToday: dateStr === todayISO,
        isWorkday: meta.is_workday || false,
        isHoliday: meta.is_holiday || false,
        isSpecial: meta.is_special || false,
        holidayName: meta.holiday_name || "",
      });
    }
    /* trailing cells so the grid is always complete */
    while (cells.length % 7 !== 0) cells.push({ empty: true });
    return cells;
  };

  const holidaysThisMonth = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return calendarData.filter((d) => {
      const dt = new Date(d.date);
      return dt.getFullYear() === y && dt.getMonth() === m && d.is_holiday;
    });
  };

  /* ── derived ────────────────────────────────────────────────────────── */
  const cells = getMonthData();
  const holidays = holidaysThisMonth();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  /* ── render ─────────────────────────────────────────────────────────── */
  if (loading)  return <div className="hr-calendar-status">Loading…</div>;
  if (error)    return <div className="hr-calendar-status error">{error}</div>;

  return (
    <div className="hr-calendar">
      {/* header */}
      <div className="hr-calendar-header">
        <button onClick={prevMonth} aria-label="Previous month">‹</button>
        <h3>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} aria-label="Next month">›</button>
      </div>

      {/* day‑of‑week strip */}
      <div className="hr-calendar-grid names">
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* actual days */}
      <div key={currentDate} className="hr-calendar-grid fade">
        {cells.map((c, i) =>
          c.empty ? (
            <div key={i} className="hr-calendar-cell empty"></div>
          ) : (
            <div
              key={i}
              className={[
                "hr-calendar-cell",
                c.isToday && "today",
                c.isHoliday && "holiday",
                c.isSpecial && "special",
                c.isWorkday ? "workday" : "nonwork",
              ].filter(Boolean).join(" ")}
              title={c.holidayName}
            >
              <span className="date-number">{c.day}</span>
              {c.isHoliday && <span className="badge">🎉</span>}
              {c.isSpecial && !c.isHoliday && <span className="badge">✨</span>}
            </div>
          )
        )}
      </div>

      {/* holiday list */}
      <div className="hr-calendar-holidays">
        <h4>Holidays this month</h4>
        {holidays.length === 0 ? (
          <p className="no-holidays">None 🎉</p>
        ) : (
          <ul>
            {holidays.map((h, i) => {
              const dt = new Date(h.date);
              return (
                <li key={i}>
                  <span className="day">
                    {monthNames[dt.getMonth()]} {dt.getDate()}
                  </span>
                  <span className="name">{h.holiday_name}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Calendar;
