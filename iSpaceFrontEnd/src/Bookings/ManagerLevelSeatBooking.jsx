import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './ManagerLevelSeatBooking.css';
import { Link } from 'react-router-dom';

const ManagerLevelSeatBooking = () => {
    const [selectedSeats, setSelectedSeats] = useState([]); // Array for multiple selection
    const [bookedSeats, setBookedSeats] = useState([]);
    const ManagerAccess = localStorage.getItem("managerAccess") === "true";
    const teamName1 = localStorage.getItem('teamName')
    const EmployeeName = localStorage.getItem('EmployeeName')
    const [formData, setFormData] = useState({ bookingBy: '', email: '', teamName: '', bookingDate: '', startTime: '', releaseTime: '' });

    const [EditformData, setEditFormData] = useState({ seatId: '', newReleaseTime: '',bookingDate: '', startTime: '', email: '',bookingBy: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [nextReleaseTime, setNextReleaseTime] = useState(false);
    const savedEmail = localStorage.getItem('userEmail');
    const address = localStorage.getItem('address')
    const [activeSeatQueueId, setActiveSeatQueueId] = useState(null);
    const [BookingHistoryData,setBookingHistoryData]=useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const API_BASE = "https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/Seat/";

    // useEffect(() => { fetchSeatStatus(); }, []);
    ; // This runs every time bookedSeats changes

    const fetchSeatStatus = () => {
        Axios.get("https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/Seat/",{
        }).then((res)=>{
            setBookedSeats(res.data)
        })
    };
    useEffect(() => {
        fetchSeatStatus();
        setFormData({...formData,teamName: teamName1, email: savedEmail});
      }, []);

    const getHistoryChennaiRoom = ()=>{
    Axios.get("https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/BookingHistory/",{
    }).then((res)=>{
      setBookingHistoryData(res.data)
    })
  }
  useEffect(() => {
    getHistoryChennaiRoom();
  }, []);

    const cancelBooking = (seatId) => {
        if (!window.confirm(`Are you sure you want to cancel booking for seat ${seatId}?`)) {
            return;
        }
        Axios.post(`${API_BASE}cancel_booking/`, {
            seat_id: seatId
        }).then(() => {
            alert(`Booking for seat ${seatId} has been cancelled.`);
            fetchSeatStatus();
        }).catch((err) => {
            console.error(err);
            alert("Cancellation failed: " + (err.response?.data?.message || "Server Error"));
        });
    };

    const editBooking = () => {
        console.log("Editing booking for seat:", EditformData.seatId);
        console.log("Edit form data:", EditformData);
        Axios.post(`${API_BASE}edit_booking/`, {
            seat_id: EditformData.seatId,
            release_time: EditformData.newReleaseTime,
            booking_date: EditformData.bookingDate,
            start_time: EditformData.startTime,
            booked_by_email: EditformData.email,
            booked_by_name: EditformData.bookedBy
        }).then(() => {
            alert(`Booking for seat ${EditformData.seatId} has been updated.`);
            setIsEditing(false);
            fetchSeatStatus();
        }).catch((err) => {
            console.error(err);
            alert("Update failed: " + (err.response?.data?.message || "Server Error"));
        });
    };
    
    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        
        // Toggle Seat Selection
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

 
const handleBooking = (isQueue = false, specificSeatId = null) => {
    // 1. Determine target seats
    // Fresh booking uses selectedSeats array; Queue uses specificSeatId
    const targetSeats = isQueue ? [specificSeatId] : selectedSeats;

    // 2. Clear Validation Logic
    if (isQueue) {
        if (!specificSeatId) {
            alert("Error: No seat selected for queuing.");
            return;
        }
    } else {
        if (selectedSeats.length === 0) {
            alert("Please click on a green seat to select it.");
            return;
        }
    }

    // 3. Form Data Selection
    // Fresh bookings use formData; Queues use EditformData
    const bookingName = formData.bookingBy || "Employee"; 
    // const bookingName = formData.bookedBy || "Employee"; 
    
    const bookingEmail = formData.email || savedEmail;
    
    const bDate = isQueue ? EditformData.bookingDate : formData.bookingDate;
    const sTime = isQueue ? EditformData.startTime : formData.startTime;
    // Note: use newReleaseTime for queue, releaseTime for fresh
    const rTime = isQueue ? EditformData.newReleaseTime : formData.releaseTime;
    const rBookedby = isQueue ? EditformData.bookingBy : formData.bookingBy

    if (!bDate || !sTime || !rTime) {
        alert("Please fill in the Date, Start Time, and End Time.");
        return;
    }

    // 4. Payload Construction
    const payload = {
        seat_ids: targetSeats,
        booked_by_name: EmployeeName,
        booked_by_email: bookingEmail,
        team_name: formData.teamName || "General",
        booking_date: bDate,
        start_time: sTime,
        release_time: rTime
    };

    Axios.post(`${API_BASE}book_multiple_seats/`, payload)
        .then((res) => {
            alert("Success: " + res.data.message);
            // Reset states
            setSelectedSeats([]); 
            setActiveSeatQueueId(null); 
            fetchSeatStatus();    
        })
        .catch((err) => {
            alert("Booking failed: " + (err.response?.data?.message || "Server Error"));
        });
};
console.log(savedEmail)
// const renderBlock = (blockId, count, startX, startY, cols) => {
//     return [...Array(count)].map((_, i) => {
//         const seatId = `${blockId}-S${i + 1}`;
        
//         // Find if this seat exists in your API data
//         const seatData = bookedSeats.find(s => s.seat_id === seatId);
        
//         // IMPORTANT: In your model, is_available: false means it's TAKEN.
//         // If seatData doesn't exist yet, we treat it as Available.
//         const isOccupied = seatData ? seatData.is_available === false : false;
//         const isSelected = selectedSeats.includes(seatId);
        
//         let seatClass = "seat ";
//         if (isOccupied) {
//             seatClass += "seat-booked"; // This should be RED
//         } else if (isSelected) {
//             seatClass += "seat-selected"; // This should be ORANGE
//         } else {
//             seatClass += "seat-available"; // This should be GREEN
//         }

//         return (
//             <rect 
//                 key={seatId} 
//                 x={startX + (i % cols) * 25} 
//                 y={startY + Math.floor(i / cols) * 25}
//                 width="20" 
//                 height="15" 
//                 className={seatClass} 
//                 // Only allow clicking if NOT occupied
//                 onClick={() => !isOccupied && handleSeatClick(seatId)} 
//                 style={{ cursor: isOccupied ? 'not-allowed' : 'pointer' }}
//             />
//         );
//     });
// };
// Inside your ManagerLevelSeatBooking component:

// 1. Helper function to check availability for a specific time window
const isSeatOccupiedAtTime = (seat, selDate, selStart, selEnd) => {
    if (!selDate || !selStart || !selEnd) return false;

    // Check current active booking
    if (!seat.is_available) {
        if (seat.booking_date === selDate) {
            // Overlap check: selStart < existingEnd && selEnd > existingStart
            if (selStart < seat.release_time ) return true;
        }
    }

    // Check all future queue bookings
    if (seat.FutureBookings && seat.FutureBookings.length > 0) {
        const conflict = seat.FutureBookings.some(b => {
            if (b.booking_date === selDate) {
                return (selStart < b.release_time && selEnd > b.start_time);
            }
            return false;
        });
        if (conflict) return true;
    }

    return false;
};

// 2. Updated renderBlock logic to use the check
const renderBlock = (blockId, count, startX, startY, cols) => {
    return [...Array(count)].map((_, i) => {
        const seatNumber = i + 1;
        const seatId = `${blockId}-S${seatNumber}`;
        const seatLabel = `S${seatNumber}`; // The label you want to see
        
        const seatData = bookedSeats.find(s => s.seat_id === seatId);
        
        // Use our dynamic occupancy check based on selected date/time
        const isBusy = seatData ? isSeatOccupiedAtTime(
            seatData, 
            formData.bookingDate, 
            formData.startTime, 
            formData.releaseTime
        ) : false;

        const isSelected = selectedSeats.includes(seatId);
        
        let seatClass = "seat ";
        if (isBusy) {
            seatClass += "seat-booked"; 
        } else if (isSelected) {
            seatClass += "seat-selected"; 
        } else {
            seatClass += "seat-available"; 
        }

        // Calculate positions
        const posX = startX + (i % cols) * 40; // Increased spacing for better readability
        const posY = startY + Math.floor(i / cols) * 40;

        return (
            <g key={seatId} style={{ cursor: isBusy ? 'not-allowed' : 'pointer' }}>
                {/* Seat Rectangle */}
                <rect 
                    x={posX} 
                    y={posY}
                    width="30" 
                    height="25" 
                    rx="4" // Rounded corners for a modern look
                    className={seatClass} 
                    onClick={() => !isBusy && handleSeatClick(seatId)} 
                />
                
                {/* Seat Label Text */}
                {/* Placing this AFTER the rect ensures it is on top */}
                <text 
                    x={posX + 15} // Center of the 30 width
                    y={posY + 16} // Middle of the 25 height
                    textAnchor="middle" 
                    style={{ 
                        fontSize: '10px', 
                        fontWeight: 'bold',
                        fill: isBusy || isSelected ? 'white' : '#333', // Contrast color
                        pointerEvents: 'none', // Critical: clicks pass through to the rect
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    {seatLabel}
                </text>
            </g>
        );
    });
};

// const renderBlock = (blockId, count, startX, startY, cols) => {
//     return [...Array(count)].map((_, i) => {
//         const seatNumber = i + 1;
//         const seatId = `${blockId}-S${seatNumber}`;
//         const seatLabel = `S${seatNumber}`; // Individual seat name
        
//         const seatData = bookedSeats.find(s => s.seat_id === seatId);
//         const isOccupied = seatData ? seatData.is_available === false : false;
//         const isSelected = selectedSeats.includes(seatId);
        
//         let seatClass = "seat ";
//         if (isOccupied) {
//             seatClass += "seat-booked"; 
//         } else if (isSelected) {
//             seatClass += "seat-selected"; 
//         } else {
//             seatClass += "seat-available"; 
//         }

//         const posX = startX + (i % cols) * 35; // Increased spacing to fit text
//         const posY = startY + Math.floor(i / cols) * 35;

//         return (
//             <g key={seatId}>
//                 {/* Seat Rectangle */}
//                 <rect 
//                     x={posX} 
//                     y={posY}
//                     width="24" 
//                     height="20" 
//                     className={seatClass} 
//                     onClick={() => !isOccupied && handleSeatClick(seatId)} 
//                     style={{ cursor: isOccupied ? 'not-allowed' : 'pointer' }}
//                 />
//                 {/* Seat Name Label (e.g., S1, S2) */}
//                 <text 
//                     x={posX + 12.5} 
//                     y={posY + 13} 
//                     textAnchor="middle" 
//                     style={{ fontSize: '8px', fill: isOccupied ? 'white' : 'black', pointerEvents: 'none' }}
//                 >
//                     {seatLabel}
//                 </text>
//             </g>
//         );
//     });
// };    
return (
        <div className="seat-booking-container" >

            <main className="main-content">
                {/* <header className="content-header"><h1>Manager Level Seat Booking</h1></header> */}
                <header className="booking-header">
        <div className="header-text">
          <h1>Office Booking System</h1>
          <p>Manage seats and meeting rooms</p>
        </div>
        
      </header>
                <div className="content-wrapper">
                    <div className="booking-form">
                        <input type="text" placeholder="Booking By *" onChange={e => setFormData({...formData, bookingBy: e.target.value})} />
                        <input type="text" placeholder={savedEmail}  disabled />
                        {/* <input type = "text" placeholder='Team_Name *' onChange={e => setFormData({...formData, teamName: e.target.value})} /> */}
                        {/* <select onChange={e => setFormData({...formData, teamName: e.target.value})}>
                            <option>Choose Team</option>
                            <option>Imigrate</option>
                            <option>ServiceNow</option>
                        </select> */}
                        <select value={teamName1} disabled>
                            <option value={teamName1}>{teamName1}</option>
                        </select>
                        <input type = "text" placeholder="bookingDate *" onFocus={(e) => (e.target.type = "date")} onChange={e => setFormData({...formData, bookingDate: e.target.value})} />
                        <input type = "text" placeholder='startTime *' onFocus={(e) => (e.target.type = "time")} onChange={e=> setFormData({...formData, startTime: e.target.value})} />
                        <input type="text" placeholder='EndTime *' onFocus={(e) => (e.target.type = "time")} onChange={e => setFormData({...formData, releaseTime: e.target.value})} value={formData.releaseTime} />
                    </div>

                    <div className="map-card" style={{ width: '94%', overflow: 'hidden',margin:'19px' }}>
    <svg viewBox="0 0 1000 350" className="office-svg" style={{ width: '100%', height: 'auto'}}>
        {/* Floor Background */}
        <rect x="0" y="0" width="1000" height="350" fill="#ebdecc" stroke="#d51b1b" />

        {/* --- SPECIALIZED ROOMS --- */}
        <rect x="20" y="20" width="300" height="70" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" />
        <text x="170" y="60" textAnchor="middle" className="meeting-text" fill="#1565c0" style={{ fontWeight: 'bold', fontSize: '14px' }}>CONFERENCE ROOM</text>

        <rect x="350" y="20" width="300" height="70" fill="#f1f8e9" stroke="#4caf50" strokeWidth="2" />
        <text x="500" y="60" textAnchor="middle" className="meeting-text" fill="#2e7d32" style={{ fontWeight: 'bold', fontSize: '14px' }}>MEETING ROOM</text>

        <rect x="680" y="20" width="300" height="70" fill="#fff3e0" stroke="#ff9800" strokeWidth="2" />
        <text x="830" y="60" textAnchor="middle" className="meeting-text" fill="#ef6c00" style={{ fontWeight: 'bold', fontSize: '14px' }}>TRAINING ROOM</text>

        {/* --- SEATING BLOCKS (Adjusted for 10x15 seats) --- */}
        
        {/* Block 1 */}
        <text x="20" y="125" className="room-label">Block 1</text>
        <rect x="20" y="130" width="170" height="200" fill="none" stroke="#ccc" />
        {renderBlock('B1', 12, 30, 145, 4)}

        {/* Block 2 */}
        <text x="215" y="125" className="room-label">Block 2</text>
        <rect x="215" y="130" width="170" height="200" fill="none" stroke="#ccc" />
        {renderBlock('B2', 12, 225, 145, 4)}

        {/* Block 3 */}
        <text x="410" y="125" className="room-label">Block 3</text>
        <rect x="410" y="130" width="170" height="200" fill="none" stroke="#ccc" />
        {renderBlock('B3', 11, 420, 145, 4)}

        {/* Block 4 */}
        <text x="605" y="125" className="room-label">Block 4</text>
        <rect x="605" y="130" width="170" height="200" fill="none" stroke="#ccc" />
        {renderBlock('B4', 18, 615, 145, 4)}

        {/* Block 5 */}
        <text x="800" y="125" className="room-label">Block 5</text>
        <rect x="800" y="130" width="180" height="200" fill="none" stroke="#ccc" />
        {renderBlock('B5', 20, 810, 145, 5)}
    </svg>
</div>

                    <div className="submit-area" style={{margin:'19px'}}>
                        <button className="btn-submit" onClick={() => handleBooking(false)}>
                            Submit ({selectedSeats.length} Seats)
                        </button>
                    </div>
                </div>
                <div>
                {/* --- YOUR SEAT BOOKINGS SECTION --- */}
<div className='booking-list1'>
    <h3>Your Seat Bookings</h3>
    <ul className="booking-list">
        {bookedSeats
            .filter((seat) => seat.booked_by_email === savedEmail && !seat.is_available)
            .map((seat) => (
                <li key={seat.seat_id} className="booking-list-item">
                    <h5>SeatId : {seat.seat_id}</h5>
                    <h5>BookedBy : {seat.booked_by_name}</h5>
                    <h5>Date: {seat.booking_date}</h5>
                    <h5>ReleaseTime : {seat.release_time}</h5>
                    <h5>Team Name: {seat.team_name}</h5>
                    <button onClick={() => { 
                        setEditFormData({
                            ...EditformData, 
                            seatId: seat.seat_id,
                            bookingDate: seat.booking_date,
                            startTime: seat.start_time,
                            newReleaseTime: seat.release_time,
                            email: seat.booked_by_email,
                            bookedBy: seat.booked_by_name
                        }); 
                        setIsEditing(true); 
                    }}>Edit</button>
                    <button onClick={() => cancelBooking(seat.seat_id)}>Cancel Booking</button>
                </li>
            ))
        }
    </ul>

    {/* --- SHARED EDIT MODAL --- */}
    {isEditing && (
        <>
            {/* Backdrop to dim the page */}
            <div className="modal-backdrop" onClick={() => setIsEditing(false)}></div>

            <div className="edit-form-modal">
                <div className="modal-header">
                    <h4>Edit Booking: Seat {EditformData.seatId}</h4>
                    <button className="close-x" onClick={() => setIsEditing(false)}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="input-group">
                        <label>New Booking Date:</label>
                        <input 
                            type="date" 
                            value={EditformData.bookingDate} 
                            onChange={e => setEditFormData({...EditformData, bookingDate: e.target.value})} 
                        />
                    </div>
                    <div className="input-group">
                        <label>New Start Time:</label>
                        <input 
                            type="time" 
                            value={EditformData.startTime} 
                            onChange={e => setEditFormData({...EditformData, startTime: e.target.value})} 
                        />
                    </div>
                    <div className="input-group">
                        <label>New End Time:</label>
                        <input 
                            type="time" 
                            value={EditformData.newReleaseTime} 
                            onChange={e => setEditFormData({...EditformData, newReleaseTime: e.target.value})} 
                        />
                    </div>
                    <div className="input-group">
                        <label>Booked By Name:</label>
                        <input 
                      section      type="text" 
                            value={EditformData.bookedBy}
                            onChange={e => setEditFormData({...EditformData, bookedBy: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-save-modal" onClick={editBooking}>Save Changes</button>
                    <button className="btn-cancel-modal" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            </div>
        </>
    )}
</div>
    <div className="occupied-seats-section">
    <h3>Occupied Seats & Waiting Lists</h3>
    <div className="table-container">
        <table className="booking-table">
            <thead>
                <tr>
                    <th>Seat ID</th>
                    <th>Current Occupant</th>
                    <th>Team</th>
                    <th>Date</th>
                    <th>Release Time</th>
                    <th>Waiting List Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {bookedSeats
                    .filter(seat => !seat.is_available)
                    .map((seat) => (
                        <React.Fragment key={seat.seat_id}>
                            <tr>
                                <td><strong>{seat.seat_id}</strong></td>
                                <td>
                                    <div className="user-info">
                                        <span className="user-name">{seat.booked_by_name}</span>
                                        <span className="user-email">{seat.booked_by_email}</span>
                                    </div>
                                </td>
                                <td>{seat.team_name || 'General'}</td>
                                <td>{seat.booking_date}</td>
                                <td><span className="time-highlight">{seat.release_time}</span></td>
                                <td>
                                    {seat.FutureBookings && seat.FutureBookings.length > 0 ? (
                                        <div className="mini-queue-list">
                                            {seat.FutureBookings.map((queueItem, index) => (
                                                <div key={index} className="queue-item-detail">
                                                    <strong>{index + 1}. {queueItem.booked_by_name},{queueItem.booked_by_email}</strong>
                                                    <span>({queueItem.start_time} - {queueItem.release_time})</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="no-queue-text">No one waiting</span>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="btn-book-next"
                                        onClick={() => {
                                            setActiveSeatQueueId(seat.seat_id);
                                            setEditFormData({
                                                ...EditformData,
                                                seatId: seat.seat_id,
                                                startTime: seat.release_time,
                                                bookingDate: seat.booking_date
                                            });
                                        }}
                                    >
                                        Book For Next Slot
                                    </button>
                                </td>
                            </tr>

                            {/* Inline Form for Adding to Queue */}
                            {/* {activeSeatQueueId === seat.seat_id && (
                                <tr className="expandable-form-row">
                                    <td colSpan="6">
                                        <div className="next-booking-popup-inline">
                                            <h4>Add User to Waiting List for {seat.seat_id}</h4>
                                            <div className="form-grid">
                                                <div className="input-group">
                                                    <label>Date:</label>
                                                    <input 
                                                        type="date" 
                                                        value={EditformData.bookingDate || ''} 
                                                        onChange={e => setEditFormData({...EditformData, bookingDate: e.target.value})} 
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label>Start (After {seat.release_time}):</label>
                                                    <input 
                                                        type="time" 
                                                        value={EditformData.startTime || ''} 
                                                        onChange={e => setEditFormData({...EditformData, startTime: e.target.value})} 
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label>End Time:</label>
                                                    <input 
                                                        type="time" 
                                                        value={EditformData.newReleaseTime || ''} 
                                                        onChange={e => setEditFormData({...EditformData, newReleaseTime: e.target.value})} 
                                                    />
                                                </div>
                                                <div className="form-actions-inline">
                                                    <button className="btn-confirm" onClick={() => handleBooking(true, seat.seat_id)}>Confirm</button>
                                                    <button className="btn-close" onClick={() => setActiveSeatQueueId(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )} */}
                            {/* ... inside your .map() function after the </tr> ... */}

{activeSeatQueueId === seat.seat_id && (
    <>
        {/* 1. The Backdrop (dims the background) */}
        <div className="modal-backdrop" onClick={() => setActiveSeatQueueId(null)}></div>

        {/* 2. The Centered Modal Form */}
        <div className="next-booking-modal">
            <div className="modal-header">
                <h4>Queue Request for Seat: {seat.seat_id}</h4>
                <button className="close-x" onClick={() => setActiveSeatQueueId(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
                <p className="current-status">
                    Currently occupied until: <strong>{seat.release_time}</strong>
                </p>

                <div className="input-group">
                    <label>Date:</label>
                    <input 
                        type="date" 
                        value={EditformData.bookingDate || ''} 
                        onChange={e => setEditFormData({...EditformData, bookingDate: e.target.value})} 
                    />
                </div>

                <div className="input-group">
                    <label>Start (After {seat.release_time}):</label>
                    <input 
                        type="time" 
                        value={EditformData.startTime || ''} 
                        onChange={e => setEditFormData({...EditformData, startTime: e.target.value})} 
                    />
                </div>

                <div className="input-group">
                    <label>End Time:</label>
                    <input 
                        type="time" 
                        value={EditformData.newReleaseTime || ''} 
                        onChange={e => setEditFormData({...EditformData, newReleaseTime: e.target.value})} 
                    />
                </div>
            </div>

            <div className="modal-footer">
                <button className="btn-confirm-modal" onClick={() => handleBooking(true, seat.seat_id)}>
                    Confirm Queue
                </button>
                <button className="btn-cancel-modal" onClick={() => setActiveSeatQueueId(null)}>
                    Cancel
                </button>
            </div>
        </div>
    </>
)}
                        </React.Fragment>
                    ))}
            </tbody>
        </table>
    </div>
</div>

<div className='PastBookings1'>
<h2 className="section-title">Your Past Seat Booking Data</h2>
<div className='PastBookings'>
  {savedEmail && (
    <>
      {(() => {
        // Filter the data first
        const mySeatHistory = BookingHistoryData.filter(
          (data) => 
            data.occupied_by === savedEmail && 
            data.BookingType === "SeatBooking"
        );

        // 2. Pagination Calculation Logic
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = mySeatHistory.slice(indexOfFirstRecord, indexOfLastRecord);
        const totalPages = Math.ceil(mySeatHistory.length / recordsPerPage);

        if (mySeatHistory.length > 0) {
          return (
            <div className="table-container">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Seat ID</th>
                    <th>Block</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((data) => (
                    <tr key={data.id}>
                      <td><strong>{data.main_room_name}</strong></td>
                      <td>{data.room_name}</td>
                      <td>{data.date}</td>
                      <td>{data.start_time}</td>
                      <td>{data.end_time}</td>
                      <td>{data.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 3. Pagination Controls */}
              <div className="pagination-controls">
                <button 
                  className="btn-pagination" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  &larr; Previous
                </button>
                
                <span className="page-info">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>

                <button 
                  className="btn-pagination" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          );
        } else {
          return <p className="no-data-text">No past seat bookings found for "{savedEmail}"</p>;
        }
      })()}
    </>
  )}
</div>
</div>


                </div>
            </main>
        </div>
    );
};

export default ManagerLevelSeatBooking;

