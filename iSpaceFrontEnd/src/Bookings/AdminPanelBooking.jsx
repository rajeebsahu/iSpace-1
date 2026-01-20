import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  // Mock data for seats: true = booked, false = available
  const [seats, setSeats] = useState([
    { id: 1, booked: true }, { id: 2, booked: false }, { id: 3, booked: false },
    { id: 4, booked: true }, { id: 5, booked: false }, { id: 6, booked: true }
  ]);

  return (
    <div className="admin-page">
      {/* Header Section */}
      <header className="admin-header">
        <div className="header-text">
          <h1>Admin Control Panel</h1>
          <p>Real-time Floor Map & Seat Management</p>
        </div>
        <div className="header-buttons">
          <button className="btn-light">View Reports</button>
          <button className="btn-dark">Manage Rooms</button>
        </div>
      </header>

      <main className="admin-container">
        {/* Seating Map Card */}
        <section className="map-card">
          <h2>Floor 01 - Workspace Map</h2>
          
          <div className="svg-container">
            {/* Simple SVG Table and Chairs Layout */}
            <svg viewBox="0 0 400 200" className="office-svg">
              {/* Main Conference Table */}
              <rect x="100" y="60" width="200" height="80" rx="10" fill="#e5e7eb" />
              <text x="165" y="105" fill="#9ca3af" fontSize="12">Conference Table</text>

              {/* Individual Seats (Interactive SVG Elements) */}
              {seats.map((seat, index) => {
                // Position logic for chairs around the table
                const xPos = index < 3 ? 120 + (index * 60) : 120 + ((index - 3) * 60);
                const yPos = index < 3 ? 30 : 150;
                
                return (
                  <g key={seat.id} className="seat-group">
                    <rect 
                      x={xPos} y={yPos} 
                      width="40" height="40" rx="8"
                      className={`seat ${seat.booked ? 'booked' : 'available'}`}
                    />
                    <text x={xPos + 15} y={yPos + 25} fontSize="10" fill="white">
                      S{seat.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="legend">
            <span className="legend-item"><div className="box available"></div> Available</span>
            <span className="legend-item"><div className="box booked"></div> Occupied</span>
          </div>
        </section>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-item">
            <span>Live Attendance</span>
            <strong>42 / 60</strong>
          </div>
          <div className="stat-item">
            <span>Pending Requests</span>
            <strong>12</strong>
          </div>
          <div className="stat-item">
            <span>Maintenance Mode</span>
            <strong>Room B</strong>
          </div>
          <div className="stat-item">
            <span>Active Bookings</span>
            <strong>156</strong>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;