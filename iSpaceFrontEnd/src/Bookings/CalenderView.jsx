import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { 
  format, addDays, startOfWeek, addWeeks, 
  subWeeks, startOfMonth, addMonths, subMonths, isSameDay, getDaysInMonth 
} from 'date-fns';
import './CalenderView.css';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [liveData, setLiveData] = useState([]);
  const [loading, setLoading] = useState(true);

  const ROOM_API = "https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/ChennaiRoom/";
  const SEAT_API = "https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/Seat/";

  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = () => {
    setLoading(true);
    Promise.all([
      Axios.get(ROOM_API),
      Axios.get(SEAT_API)
    ]).then(([roomRes, seatRes]) => {
      const rooms = roomRes.data.map(r => ({ ...r, origin: 'Room' }));
      const seats = seatRes.data.map(s => ({ ...s, origin: 'Seat' }));
      setLiveData([...rooms, ...seats]);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching live data:", err);
      setLoading(false);
    });
  };

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 3); // 3 AM to 4 PM

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <header className="calendar-header">
          <div className="header-left">
            <h1>Live Workspace Tracker</h1>
            <p>Real-time availability for Rooms & Seats</p>
          </div>
          <div className="nav-controls">
            <button className="nav-btn" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>‹</button>
            <button className="today-btn" onClick={() => setCurrentDate(new Date())}>Today</button>
            <button className="nav-btn" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>›</button>
          </div>
        </header>

        <div className="calendar-main-content">
          <div className="grid-card">
            <div className="grid-header">
              <div className="time-corner">Time</div>
              {weekDays.map((day) => (
                <div key={`h-${format(day, 'yyyy-MM-dd')}`} className={`day-header ${isSameDay(day, new Date()) ? 'is-today' : ''}`}>
                  <span className="day-name">{format(day, 'EEE').toUpperCase()}</span>
                  <span className="day-number">{format(day, 'd')}</span>
                </div>
              ))}
            </div>

            <div className="grid-scroll-area">
              {loading ? (
                <div className="loader">Loading...</div>
              ) : (
                timeSlots.map((hour) => (
                  <div key={`row-${hour}`} className="grid-row">
                    <div className="time-label">{hour > 12 ? `${hour-12} pm` : `${hour} ${hour === 12 ? 'pm' : 'am'}`}</div>
                    {weekDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      
                      const bookingsInSlot = liveData.filter(item => {
                          // Room uses 'OccuipedTiming', Seat uses 'start_time'
                          const rawTime = item.origin === 'Room' ? item.OccuipedTiming : item.start_time;
                          const rawDate = item.origin === 'Room' ? item.datetime : item.booking_date;
                          
                          // Format raw date from ISO string if it's a Room
                          const itemDate = rawDate && rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
                          const itemHour = rawTime && rawTime !== "N/A" ? parseInt(rawTime.split(':')[0]) : null;
                          
                          // availability_status: true means BOOKED in your JSON
                          const isBooked = item.origin === 'Room' ? item.availability_status === true : item.is_available === false;
                          
                          return itemDate === dateStr && itemHour === hour && isBooked;
                      });

                      return (
                        <div key={`c-${dateStr}-${hour}`} className="grid-cell">
                          {bookingsInSlot.map((b, idx) => (
                            <div key={idx} className={`booking-slot ${b.origin === 'Seat' ? 'seat-accent' : 'room-accent'}`}>
                              <span className="slot-name">{b.room_name || b.seat_id}</span>
                              <span className="slot-user">{b.BookedBy || b.booked_by_name || 'Reserved'}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="calendar-sidebar">
            <div className="mini-calendar">
              <div className="mini-header">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>‹</button>
                <span>{format(currentDate, 'MMMM yyyy')}</span>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>›</button>
              </div>
              <div className="mini-days-grid">
                {['S','M','T','W','T','F','S'].map((d, i) => <span key={`l-${i}`} className="mini-label">{d}</span>)}
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                    const d = addDays(startOfMonth(currentDate), i);
                    return (
                        <span key={`d-${i}`} className={`mini-date ${isSameDay(currentDate, d) ? 'active' : ''}`} onClick={() => setCurrentDate(d)}>
                            {i + 1}
                        </span>
                    );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;