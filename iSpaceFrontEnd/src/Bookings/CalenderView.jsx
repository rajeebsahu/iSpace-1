import React, { useState } from 'react';
import './CalenderView.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for room availability status (Bottom section)
  const rooms = [
    { name: "Conference Room A", wing: "North Wing", status: "Available" },
    { name: "Conference Room B", wing: "South Wing", status: "Available" },
    { name: "Executive Room", wing: "West Wing", status: "Available" },
    { name: "Project Room Alpha", wing: "East Wing", status: "Available" },
    { name: "Project Room Beta", wing: "North Wing", status: "Available" },
    { name: "Training Room 1", wing: "South Wing", status: "Available" },
  ];

  const timeSlots = Array.from({ length: 14 }, (_, i) => `${(i + 3).toString().padStart(2, '0')} am`);

  return (
    <div className="calendar-page">
      <div className="calendar-card">
        <header className="view-header">
          <h2>Weekly Calendar View</h2>
          <div className="nav-controls">
            <button className="arrow-btn">&lt;</button>
            <button className="today-btn">Today</button>
            <button className="arrow-btn">&gt;</button>
          </div>
        </header>

        <div className="calendar-main-layout">
          {/* Main Time Grid */}
          <div className="grid-container">
            <div className="grid-header">
              <div className="time-col"></div>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                <div key={day} className={`day-col ${day === 'TUE' ? 'active-day' : ''}`}>
                  <span>{day}</span>
                  <strong>{29 + i}</strong>
                </div>
              ))}
            </div>

            <div className="grid-body">
              {timeSlots.map((time, idx) => (
                <div key={time} className="grid-row">
                  <div className="time-label">{time}</div>
                  {/* Mock grid cells */}
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="grid-cell">
                      {/* Example Booking Block (Wednesday 3am) */}
                      {idx === 0 && i === 3 && (
                        <div className="booking-block">03:00 am - 03:30 am</div>
                      )}
                      {/* Example Booking Block (Wednesday 1pm) */}
                      {idx === 10 && i === 3 && (
                        <div className="booking-block">01:00 pm - 02:00 pm</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Side Mini Calendar */}
          <aside className="side-calendar">
            <div className="mini-month-nav">
              <button>&lt;</button>
              <span>December</span>
              <button>&gt;</button>
            </div>
            <div className="mini-grid">
              {['S','M','T','W','T','F','S'].map(d => <span key={d} className="mini-day-name">{d}</span>)}
              {Array.from({ length: 31 }, (_, i) => (
                <span key={i} className={`mini-day ${i + 1 === 31 ? 'selected' : ''}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </aside>
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          <span className="legend-item"><div className="box-booked"></div> Booked</span>
          <span className="legend-item"><div className="box-available"></div> Available</span>
        </div>
      </div>

      {/* Today's Room Availability Section */}
      <section className="availability-section">
        <h3>Today's Room Availability</h3>
        <div className="room-status-grid">
          {rooms.map((room, idx) => (
            <div key={idx} className="room-status-card">
              <div className="room-info">
                <h4>{room.name}</h4>
                <p>{room.wing}</p>
              </div>
              <span className="status-badge">Available</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CalendarView;