import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Calendar.css";

const Calendar = () => {
  // State for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendarDates = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/calendar_dates/calendar_dates/");
        setCalendarData(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch calendar dates:", err);
        setError("Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarDates();
  }, []);

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get month data
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month and days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create array of days
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      // Format date string to match the API format (YYYY-MM-DD)
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Find if this day has calendar data
      const dayData = calendarData.find(date => date.date === dateStr);
      
      days.push({
        day,
        isCurrentMonth: true,
        dateStr,
        isWorkday: dayData?.is_workday || false,
        isHoliday: dayData?.is_holiday || false,
        isSpecial: dayData?.is_special || false,
        holidayName: dayData?.holiday_name || ''
      });
    }
    
    return days;
  };

  // Get holidays for current month
  const getHolidaysForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return calendarData.filter(date => {
      const dateObj = new Date(date.date);
      return dateObj.getFullYear() === year && 
             dateObj.getMonth() === month && 
             date.is_holiday;
    });
  };

  const days = getMonthData();
  const holidays = getHolidaysForMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return <div className="hr-calendar-loading">Loading calendar...</div>;
  }

  if (error) {
    return <div className="hr-calendar-error">{error}</div>;
  }

  return (
    <div className="hr-calendar">
      {/* Calendar Header */}
      <div className="hr-calendar-header">
        <button onClick={prevMonth} className="hr-calendar-nav">←</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={nextMonth} className="hr-calendar-nav">→</button>
      </div>
      
      {/* Calendar Grid */}
      <div className="hr-calendar-grid">
        {/* Day Names Header */}
        {dayNames.map(day => (
          <div key={day} className="hr-calendar-day-name">{day}</div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`hr-calendar-day ${!day.isCurrentMonth ? 'hr-calendar-outside-month' : ''} 
                       ${day.isHoliday ? 'hr-calendar-holiday' : ''} 
                       ${day.isSpecial ? 'hr-calendar-special' : ''} 
                       ${day.isWorkday ? 'hr-calendar-workday' : 'hr-calendar-non-workday'}`}
            title={day.holidayName || ''}
          >
            {day.day}
            {day.isHoliday && <div className="hr-calendar-indicator">🎉</div>}
            {day.isSpecial && <div className="hr-calendar-indicator">✨</div>}
          </div>
        ))}
      </div>
      
      {/* Holiday Listing */}
      <div className="hr-calendar-holidays">
        <h4>Holidays this month</h4>
        {holidays.length === 0 ? (
          <p className="hr-calendar-no-holidays">No holidays this month</p>
        ) : (
          <ul className="hr-calendar-holiday-list">
            {holidays.map((holiday, index) => {
              const holidayDate = new Date(holiday.date);
              return (
                <li key={index} className="hr-calendar-holiday-item">
                  <span className="hr-calendar-holiday-date">
                    {monthNames[holidayDate.getMonth()]} {holidayDate.getDate()}
                  </span> – 
                  <span className="hr-calendar-holiday-name">
                    {holiday.holiday_name}
                  </span>
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
