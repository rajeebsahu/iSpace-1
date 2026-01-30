// import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
// import { 
//   format, addDays, startOfWeek, addWeeks, 
//   subWeeks, startOfMonth, addMonths, subMonths, isSameDay, getDaysInMonth 
// } from 'date-fns';
// import './CalenderView.css';

// const CalendarView = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [liveData, setLiveData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const ROOM_API = "https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/ChennaiRoom/";
//   const SEAT_API = "https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/Seat/";

//   useEffect(() => {
//     fetchLiveData();
//   }, []);

//   const fetchLiveData = () => {
//     setLoading(true);
//     Promise.all([
//       Axios.get(ROOM_API),
//       Axios.get(SEAT_API)
//     ]).then(([roomRes, seatRes]) => {
//       const rooms = roomRes.data.map(r => ({ ...r, origin: 'Room' }));
//       const seats = seatRes.data.map(s => ({ ...s, origin: 'Seat' }));
//       setLiveData([...rooms, ...seats]);
//       setLoading(false);
//     }).catch(err => {
//       console.error("Error fetching live data:", err);
//       setLoading(false);
//     });
//   };

//   const weekStart = startOfWeek(currentDate);
//   const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
//   const timeSlots = Array.from({ length: 14 }, (_, i) => i + 3); // 3 AM to 4 PM

//   return (
//     <div className="calendar-page">
//       <div className="calendar-container">
//         <header className="calendar-header">
//           <div className="header-left">
//             <h1>Live Workspace Tracker</h1>
//             <p>Real-time availability for Rooms & Seats</p>
//           </div>
//           <div className="nav-controls">
//             <button className="nav-btn" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>‹</button>
//             <button className="today-btn" onClick={() => setCurrentDate(new Date())}>Today</button>
//             <button className="nav-btn" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>›</button>
//           </div>
//         </header>

//         <div className="calendar-main-content">
//           <div className="grid-card">
//             <div className="grid-header">
//               <div className="time-corner">Time</div>
//               {weekDays.map((day) => (
//                 <div key={`h-${format(day, 'yyyy-MM-dd')}`} className={`day-header ${isSameDay(day, new Date()) ? 'is-today' : ''}`}>
//                   <span className="day-name">{format(day, 'EEE').toUpperCase()}</span>
//                   <span className="day-number">{format(day, 'd')}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="grid-scroll-area">
//               {loading ? (
//                 <div className="loader">Loading...</div>
//               ) : (
//                 timeSlots.map((hour) => (
//                   <div key={`row-${hour}`} className="grid-row">
//                     <div className="time-label">{hour > 12 ? `${hour-12} pm` : `${hour} ${hour === 12 ? 'pm' : 'am'}`}</div>
//                     {weekDays.map((day) => {
//                       const dateStr = format(day, 'yyyy-MM-dd');
                      
//                       const bookingsInSlot = liveData.filter(item => {
//                           // Room uses 'OccuipedTiming', Seat uses 'start_time'
//                           const rawTime = item.origin === 'Room' ? item.OccuipedTiming : item.start_time;
//                           const rawDate = item.origin === 'Room' ? item.datetime : item.booking_date;
                          
//                           // Format raw date from ISO string if it's a Room
//                           const itemDate = rawDate && rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
//                           const itemHour = rawTime && rawTime !== "N/A" ? parseInt(rawTime.split(':')[0]) : null;
                          
//                           // availability_status: true means BOOKED in your JSON
//                           const isBooked = item.origin === 'Room' ? item.availability_status === true : item.is_available === false;
                          
//                           return itemDate === dateStr && itemHour === hour && isBooked;
//                       });

//                       return (
//                         <div key={`c-${dateStr}-${hour}`} className="grid-cell">
//                           {bookingsInSlot.map((b, idx) => (
//                             <div key={idx} className={`booking-slot ${b.origin === 'Seat' ? 'seat-accent' : 'room-accent'}`}>
//                               <span className="slot-name">{b.room_name || b.seat_id}</span>
//                               <span className="slot-user">{b.BookedBy || b.booked_by_name || 'Reserved'}</span>
//                             </div>
//                           ))}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <aside className="calendar-sidebar">
//             <div className="mini-calendar">
//               <div className="mini-header">
//                 <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>‹</button>
//                 <span>{format(currentDate, 'MMMM yyyy')}</span>
//                 <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>›</button>
//               </div>
//               <div className="mini-days-grid">
//                 {['S','M','T','W','T','F','S'].map((d, i) => <span key={`l-${i}`} className="mini-label">{d}</span>)}
//                 {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
//                     const d = addDays(startOfMonth(currentDate), i);
//                     return (
//                         <span key={`d-${i}`} className={`mini-date ${isSameDay(currentDate, d) ? 'active' : ''}`} onClick={() => setCurrentDate(d)}>
//                             {i + 1}
//                         </span>
//                     );
//                 })}
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CalendarView;

import React, { useState, useEffect, useMemo } from 'react';
import Axios from 'axios';
import { 
  format, addDays, startOfWeek, addWeeks, 
  subWeeks, startOfMonth, addMonths, subMonths, isSameDay, getDaysInMonth, parseISO 
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

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const [roomRes, seatRes] = await Promise.all([
        Axios.get(ROOM_API),
        Axios.get(SEAT_API)
      ]);

      // Normalize Data on Fetch
      const normalizedRooms = roomRes.data.map(r => ({
        id: r.id,
        name: r.room_name,
        user: r.BookedBy || 'Reserved',
        // Standardize date to YYYY-MM-DD
        date: r.datetime ? r.datetime.split('T')[0] : null,
        // Convert "HH:MM" or "HH:MM AM/PM" to 24-hour integer
        hour: parseHour(r.OccuipedTiming),
        isBooked: r.availability_status === true,
        type: 'Room'
      }));

      const normalizedSeats = seatRes.data.map(s => ({
        id: s.id,
        name: s.seat_id,
        user: s.booked_by_name || 'Reserved',
        date: s.booking_date,
        hour: parseHour(s.start_time),
        isBooked: s.is_available === false,
        type: 'Seat'
      }));

      setLiveData([...normalizedRooms, ...normalizedSeats]);
    } catch (err) {
      console.error("Error fetching live data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to convert any time string to a 24-hour integer
  const parseHour = (timeStr) => {
    if (!timeStr || timeStr === "N/A") return null;
    let [time, modifier] = timeStr.split(' ');
    let [hours] = time.split(':');
    let hour = parseInt(hours, 10);

    if (modifier) { // Handles "03:00 PM"
      if (modifier.toLowerCase() === 'pm' && hour < 12) hour += 12;
      if (modifier.toLowerCase() === 'am' && hour === 12) hour = 0;
    }
    return hour;
  };

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6); // Adjusted to 6 AM - 7 PM for visibility

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
                <div key={format(day, 'yyyy-MM-dd')} className={`day-header ${isSameDay(day, new Date()) ? 'is-today' : ''}`}>
                  <span className="day-name">{format(day, 'EEE').toUpperCase()}</span>
                  <span className="day-number">{format(day, 'd')}</span>
                </div>
              ))}
            </div>

            <div className="grid-scroll-area">
              {loading ? (
                <div className="loader">Loading Workspace Data...</div>
              ) : (
                timeSlots.map((hour) => (
                  <div key={`row-${hour}`} className="grid-row">
                    <div className="time-label">
                      {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                    </div>
                    {weekDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const bookingsInSlot = liveData.filter(b => 
                        b.date === dateStr && b.hour === hour && b.isBooked
                      );

                      return (
                        <div key={`${dateStr}-${hour}`} className="grid-cell">
                          {bookingsInSlot.map((b, idx) => (
                            <div key={`${b.type}-${b.id}-${idx}`} className={`booking-slot ${b.type === 'Seat' ? 'seat-accent' : 'room-accent'}`}>
                              <span className="slot-name">{b.name}</span>
                              <span className="slot-user">{b.user}</span>
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
                {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="mini-label">{d}</span>)}
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                  const d = addDays(startOfMonth(currentDate), i);
                  const isCurrent = isSameDay(currentDate, d);
                  return (
                    <span 
                      key={i} 
                      className={`mini-date ${isCurrent ? 'active' : ''}`} 
                      onClick={() => setCurrentDate(d)}
                    >
                      {i + 1}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="legend">
                <div className="legend-item"><span className="dot room"></span> Room</div>
                <div className="legend-item"><span className="dot seat"></span> Seat</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;