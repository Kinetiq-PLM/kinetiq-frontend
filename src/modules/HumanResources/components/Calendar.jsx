import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Calendar.css";

// Add navigateTo to the props
const Calendar = ({ leaveRequests = [], navigateTo }) => {
  /* ── state ─────────────────────────────────────────────────────────── */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  // Add new state for interviews and leave request data
  const [interviews, setInterviews] = useState([]);
  const [leaves, setLeaves] = useState([]);

  /* Add this mapping for leave type icons */
  const getLeaveTypeEmoji = (leaveType) => {
    switch (leaveType?.toLowerCase()) {
      case 'sick':
        return '🤒';
      case 'vacation':
        return '🏖️';
      case 'personal':
        return '🏠';
      case 'maternity':
        return '👶';
      case 'paternity':
        return '👨‍👦';
      case 'solo parent':
        return '👨‍👧';
      case 'unpaid':
        return '📝';
      default:
        return '📅';
    }
  };

  /* Update the getInterviewEmoji function to handle null/undefined values safely */
  const getInterviewEmoji = (interviewType) => {
    if (!interviewType) return '📋'; // Default emoji for undefined types
    
    switch (interviewType.toLowerCase()) {
      case 'technical':
        return '💻';
      case 'hr':
        return '👔';
      case 'panel':
        return '👥';
      case 'final':
        return '🏆';
      case 'initial':
        return '🤝';
      default:
        return '📋';
    }
  };

  /* Add a function to get the primary leave emoji for a cell */
  const getPrimaryLeaveEmoji = (leaves) => {
    if (!leaves || leaves.length === 0) return null;
    
    // If only one leave, return its emoji
    if (leaves.length === 1) {
      return getLeaveTypeEmoji(leaves[0].leave_type);
    }
    
    // If multiple leave types, use a mixed emoji or count
    return leaves.length > 1 ? `${leaves.length}+` : getLeaveTypeEmoji(leaves[0].leave_type);
  };

  /* Add a function to get the primary interview emoji for a cell */
  const getPrimaryInterviewEmoji = (interviews) => {
    if (!interviews || interviews.length === 0) return null;
    
    // If only one interview, return its emoji
    if (interviews.length === 1) {
      return getInterviewEmoji(interviews[0].interview_type);
    }
    
    // If multiple interviews, use a count
    return interviews.length > 1 ? `${interviews.length}+` : getInterviewEmoji(interviews[0].interview_type);
  };

  /* ── data fetch ─────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/calendar_dates/calendar_dates/"
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

  // Update the fetchInterviewsAndLeaves function inside useEffect
  useEffect(() => {
    const fetchInterviewsAndLeaves = async () => {
      setLoading(true);
      try {
        // Fetch interviews
        const interviewsResponse = await axios.get(
          "https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/interviews/"
        );
        
        console.log("Interviews API response:", interviewsResponse.data);
        
        // Add this after the API call in the fetchInterviewsAndLeaves function
        console.log("First interview object structure:", 
          interviewsResponse.data.length > 0 ? interviewsResponse.data[0] : "No interviews");
        
        // Process interview data to ensure date format is correct
        const processedInterviews = interviewsResponse.data.map(interview => {
          if (interview.interview_date) {
            // Ensure interview_date is in YYYY-MM-DD format
            const date = new Date(interview.interview_date);
            if (!isNaN(date.getTime())) {
              interview.interview_date = date.toISOString().split('T')[0];
            }
          }
          return interview;
        });
        
        setInterviews(processedInterviews);
        console.log("Processed interviews:", processedInterviews);
        
        // Fetch leave requests
        const leavesResponse = await axios.get(
          "https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/"
        );
        setLeaves(leavesResponse.data);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching interviews or leave requests:", err);
        console.log("Error details:", err.response?.data || err.message);
        setError("Failed to load interviews or leave requests");
        // Set empty arrays to prevent undefined errors
        setInterviews([]);
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterviewsAndLeaves();
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
  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  /* ── helpers ────────────────────────────────────────────────────────── */
  const todayISO = new Date().toISOString().split("T")[0];

  /** build an array of 42 cells (6 rows × 7 cols) for the current view */
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

      // Find leave requests for this date
      const dayLeaves = leaves.filter((leave) => {
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        const currentDate = new Date(dateStr);
        return currentDate >= startDate && currentDate <= endDate;
      });

      // Find interviews for this date
      const dayInterviews = interviews.filter((interview) => {
        if (!interview || !interview.interview_date) return false;
        
        try {
          // Try to normalize the date format for comparison
          const interviewDateObj = new Date(interview.interview_date);
          const interviewDateStr = interviewDateObj.toISOString().split('T')[0];
          return interviewDateStr === dateStr;
        } catch (err) {
          console.error("Error processing interview date:", err);
          return false;
        }
      });

      cells.push({
        day: d,
        dateStr,
        isToday: dateStr === todayISO,
        isWorkday: meta.is_workday || false,
        isHoliday: meta.is_holiday || false,
        isSpecial: meta.is_special || false,
        holidayName: meta.holiday_name || "",
        leaves: dayLeaves,
        hasLeaves: dayLeaves.length > 0,
        interviews: dayInterviews,
        hasInterviews: dayInterviews.length > 0
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

  /* ── event handlers ─────────────────────────────────────────────────── */
  const handleDayClick = (day) => {
    if (!day.empty) {
      setSelectedDay(day);
      setShowDayModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowDayModal(false);
  };

  // Add new handler for navigation with date context
  const handleNavigate = (path, dateStr) => {
    if (navigateTo) {
      // Pass the selected date as a query parameter or state
      navigateTo(path, { selectedDate: dateStr });
    }
  };

  /* Add this improved renderInterviewItem function for better display of interview details */
  const renderInterviewItem = (interview, index) => {
    // If we don't have a valid interview object, render a placeholder
    if (!interview) {
      return <li key={`unknown-interview-${index}`}>Unknown interview</li>;
    }
    
    // Debug the actual interview object structure in the console
    console.log("Interview data structure:", interview);
    
    // Try different possible field names for candidate name
    const candidateName = interview.candidate_name || 
                         interview.candidate?.name || 
                         interview.applicant_name || 
                         interview.name || 
                         'Unnamed Candidate';
    
    // Try different possible field names for interview time
    const time = interview.interview_time || 
                interview.time || 
                interview.schedule_time || 
                (interview.schedule ? interview.schedule.time : null) || 
                'No time specified';
    
    // Try different possible field names for interview type
    const type = interview.interview_type || 
                interview.type || 
                interview.interview_category || 
                'Unknown';
    
    // Safely get ID for key
    const id = interview.interview_id || 
              interview.id || 
              `interview-${index}`;
    
    // Safely get CSS class name
    const typeClass = type && typeof type === 'string' ? type.toLowerCase() : 'unknown';
    
    return (
      <li key={id}>
        <span className="interview-emoji">{getInterviewEmoji(type)}</span>
        <strong>{candidateName}</strong> -{" "}
        <span className={`interview-type ${typeClass}`}>
          {type} Interview
        </span>
        <span className="interview-time"> at {time}</span>
      </li>
    );
  };

  /* ── derived ────────────────────────────────────────────────────────── */
  const cells = getMonthData();
  const holidays = holidaysThisMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ── render ─────────────────────────────────────────────────────────── */
  if (loading) return <div className="hr-calendar-status">Loading…</div>;
  if (error) return <div className="hr-calendar-status error">{error}</div>;

  return (
    <div className="hr-calendar">
      {/* header */}
      <div className="hr-calendar-header">
        <button onClick={prevMonth} aria-label="Previous month">
          ‹
        </button>
        <h3>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="hr-calendar-header-buttons">
          <button
            onClick={jumpToToday}
            className="hr-calendar-today-btn"
            aria-label="Jump to today"
          >
            Today
          </button>
          <button onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>
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
                c.hasLeaves && "has-leaves",
                c.hasInterviews && "has-interviews",
                c.isWorkday ? "workday" : "nonwork",
              ]
                .filter(Boolean)
                .join(" ")}
              title={
                c.holidayName ||
                (c.hasLeaves ? `${c.leaves.length} leave request(s)` : "") ||
                (c.hasInterviews ? `${c.interviews.length} interview(s)` : "")
              }
              onClick={() => handleDayClick(c)}
            >
              <span className="date-number">{c.day}</span>
              {c.isHoliday && <span className="badge">🎉</span>}
              {c.isSpecial && !c.isHoliday && <span className="badge">✨</span>}
              {c.hasLeaves && (
                <span className="badge leaves" title={`${c.leaves.length} leave(s)`}>
                  {getPrimaryLeaveEmoji(c.leaves)}
                </span>
              )}
              {c.hasInterviews && (
                <span className="badge interviews" title={`${c.interviews.length} interview(s)`}>
                  {getPrimaryInterviewEmoji(c.interviews)}
                </span>
              )}
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

      {/* Day Details Modal */}
      {showDayModal && selectedDay && (
        <div className="hr-calendar-modal-overlay" onClick={handleCloseModal}>
          <div
            className="hr-calendar-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hr-calendar-modal-header">
              <h4>{selectedDay.dateStr}</h4>
              <button
                onClick={handleCloseModal}
                className="hr-calendar-modal-close"
              >
                ×
              </button>
            </div>
            <div className="hr-calendar-modal-content">
              {selectedDay.isHoliday && (
                <div className="hr-calendar-modal-holiday">
                  <span className="hr-calendar-modal-badge">🎉</span>
                  <p>
                    <strong>Holiday:</strong> {selectedDay.holidayName}
                  </p>
                </div>
              )}
              {selectedDay.isSpecial && !selectedDay.isHoliday && (
                <div className="hr-calendar-modal-special">
                  <span className="hr-calendar-modal-badge">✨</span>
                  <p>
                    <strong>Special Day</strong>
                  </p>
                </div>
              )}
              <p>
                <strong>Workday:</strong>{" "}
                {selectedDay.isWorkday ? "Yes" : "No"}
              </p>

              {/* Leave information */}
              {selectedDay.hasLeaves && (
                <div className="hr-calendar-modal-leaves">
                  <h5>
                    {selectedDay.leaves.length} Leave Request
                    {selectedDay.leaves.length !== 1 ? "s" : ""}
                  </h5>
                  <ul>
                    {selectedDay.leaves.map((leave) => (
                      <li key={leave.leave_id}>
                        <span className="leave-emoji">{getLeaveTypeEmoji(leave.leave_type)}</span>
                        {leave.employee_name} -{" "}
                        <span className={`leave-type ${leave.leave_type.toLowerCase()}`}>
                          {leave.leave_type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interview information */}
              {selectedDay.hasInterviews && (
                <div className="hr-calendar-modal-interviews">
                  <h5>
                    {selectedDay.interviews.length} Interview
                    {selectedDay.interviews.length !== 1 ? "s" : ""} Scheduled
                  </h5>
                  <ul>
                    {selectedDay.interviews.map((interview, index) => 
                      renderInterviewItem(interview, index)
                    )}
                  </ul>
                </div>
              )}

              {/* Link to attendance or leave requests for this day */}
              <div className="hr-calendar-modal-actions">
                <button 
                  className="hr-calendar-modal-btn attendance"
                  onClick={() => handleNavigate('/attendance', selectedDay.dateStr)}
                >
                  View Attendance
                </button>
                <button 
                  className="hr-calendar-modal-btn leaves"
                  onClick={() => handleNavigate('/leave-requests', selectedDay.dateStr)}
                >
                  View Leave Requests
                </button>
                {selectedDay.hasInterviews && (
                  <button 
                    className="hr-calendar-modal-btn interviews"
                    onClick={() => handleNavigate('/recruitment', selectedDay.dateStr)}
                  >
                    View Interviews
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
