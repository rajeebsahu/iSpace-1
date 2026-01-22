import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './ManagerLevelSeatBooking.css';

const ManagerLevelSeatBooking = () => {
    const [selectedSeats, setSelectedSeats] = useState([]); // Array for multiple selection
    const [bookedSeats, setBookedSeats] = useState([]);
    const [formData, setFormData] = useState({ bookingBy: '', email: '', teamName: '', bookingDate: '', startTime: '', releaseTime: '' });

    const [EditformData, setEditFormData] = useState({ seatId: '', newReleaseTime: '',bookingDate: '', startTime: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [nextReleaseTime, setNextReleaseTime] = useState(false);

    const API_BASE = "https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/Seat/";

    // useEffect(() => { fetchSeatStatus(); }, []);
    ; // This runs every time bookedSeats changes

    const fetchSeatStatus = () => {
        Axios.get("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/Seat/",{
        }).then((res)=>{
            setBookedSeats(res.data)
        })
    };

    useEffect(() => {
        fetchSeatStatus();
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

    // const handleBooking = () => {
    //     if (selectedSeats.length === 0 || !formData.firstName) {
    //         alert("Please select at least one seat and enter your name.");
    //         return;
    //     }

    //     Axios.post(`${API_BASE}book_multiple_seats/`, {
    //         seat_ids: selectedSeats,
    //         name: `${formData.firstName} ${formData.lastName}`,
    //         release_time: formData.releaseTime
    //     }).then(() => {
    //         alert("Selected seats booked!");
    //         setSelectedSeats([]);
    //         fetchSeatStatus();
    //     });
    // };
    const handleBooking = () => {
    // 1. Validation
    if (selectedSeats.length === 0) {
        alert("Please click on a green seat to select it.");
        return;
    }
    if (!formData.bookingBy || !formData.email || !formData.teamName || !formData.bookingDate || !formData.startTime) {
        alert("Please enter your name.");
        return;
    }


    // 2. Booking Request
    Axios.post(`${API_BASE}book_multiple_seats/`, {
        seat_ids: selectedSeats, // Sends ["B1-S5"]
        release_time: formData.releaseTime,
        booked_by_name: formData.bookingBy,
        booked_by_email: formData.email,
        team_name: formData.teamName,
        booking_date: formData.bookingDate,
        start_time: formData.startTime
    })
    .then((res) => {
        alert("Success: " + res.data.message);
        setSelectedSeats([]); // Clear current selection
        fetchSeatStatus();    // Refresh the map to turn the seat Red
    })
    .catch((err) => {
        console.error(err);
        alert("Booking failed: " + (err.response?.data?.message || "Server Error"));
    });
};

    const renderBlock = (blockId, count, startX, startY, cols) => {
    return [...Array(count)].map((_, i) => {
        const seatId = `${blockId}-S${i + 1}`;
        
        // Find if this seat exists in your API data
        const seatData = bookedSeats.find(s => s.seat_id === seatId);
        
        // IMPORTANT: In your model, is_available: false means it's TAKEN.
        // If seatData doesn't exist yet, we treat it as Available.
        const isOccupied = seatData ? seatData.is_available === false : false;
        const isSelected = selectedSeats.includes(seatId);
        
        let seatClass = "seat ";
        if (isOccupied) {
            seatClass += "seat-booked"; // This should be RED
        } else if (isSelected) {
            seatClass += "seat-selected"; // This should be ORANGE
        } else {
            seatClass += "seat-available"; // This should be GREEN
        }

        return (
            <rect 
                key={seatId} 
                x={startX + (i % cols) * 25} 
                y={startY + Math.floor(i / cols) * 25}
                width="20" 
                height="15" 
                className={seatClass} 
                // Only allow clicking if NOT occupied
                onClick={() => !isOccupied && handleSeatClick(seatId)} 
                style={{ cursor: isOccupied ? 'not-allowed' : 'pointer' }}
            />
        );
    });
};
    return (
        <div className="seat-booking-container">
            <aside className="sidebar">
                <div className="sidebar-header">❮ Seat Booking</div>
                <nav>
                    <div className="nav-item active">⊕ Pick your seat</div>
                    <div className="nav-item">🪑 Your Seats Bookings</div>
                </nav>
            </aside>

            <main className="main-content">
                <header className="content-header"><h1>Architectural Booking</h1></header>
                <div className="content-wrapper">
                    <div className="booking-form">
                        <input type="text" placeholder="Booking By *" onChange={e => setFormData({...formData, bookingBy: e.target.value})} />
                        <input type="text" placeholder='Enter Email *' onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input type = "text" placeholder='Team_Name *' onChange={e => setFormData({...formData, teamName: e.target.value})} />
                        <input type = "date" placeholder="bookingDate *" onChange={e => setFormData({...formData, bookingDate: e.target.value})} />
                        <input type = "time" placeholder='startTime *' onChange={e=> setFormData({...formData, startTime: e.target.value})} />
                        <input type="time" onChange={e => setFormData({...formData, releaseTime: e.target.value})} value={formData.releaseTime} />
                    </div>

                    <div className="map-card">
                        <svg viewBox="0 0 800 350" className="office-svg">
                            <rect x="10" y="10" width="780" height="330" className="floor-bg" />
                            {/* Block 1 */}
                            <text x="25" y="25" className="room-label">Block 1</text>
                            <rect x="20" y="30" width="100" height="100" className="wall" />
                            {renderBlock('B1', 8, 30, 40, 3)}
                            {/* Block 2 */}
                            <text x="25" y="145" className="room-label">Block 2</text>
                            <rect x="20" y="150" width="100" height="180" className="wall" />
                            {renderBlock('B2', 16, 30, 160, 4)}
                            {/* Meeting Room */}
                            <rect x="130" y="10" width="280" height="120" className="meeting-room-bg" />
                            <text x="220" y="70" className="meeting-text">MEETING ROOM</text>
                        </svg>
                    </div>

                    <div className="submit-area">
                        <button className="btn-submit" onClick={handleBooking}>
                            Submit ({selectedSeats.length} Seats)
                        </button>
                    </div>
                </div>
                <div>
                    <h3>Your Seat Bookings </h3>
    <ul className="booking-list">
    {bookedSeats
        .filter((seat) => seat.booked_by_email === "ganesh@iopex.com"  && !seat.is_available)
        .map((seat) => (
            <li key={seat.seat_id} className="booking-list-item">
                <h5>SeatId : {seat.seat_id}</h5>
                <h5>BookedBy : {seat.booked_by_name}</h5>
                <h5>ReleaseTime : {seat.release_time}</h5>
                <button onClick={() => {setEditFormData({...EditformData, seatId: seat.seat_id}); setIsEditing(true);}}>Edit</button>
                <button onClick={() => cancelBooking(seat.seat_id)}>Cancel Booking</button>
            </li>
        ))
    }
    {isEditing && (
        <div className="edit-form">

            <h4>Edit Booking for Seat {EditformData.seatId}</h4>
            <label>New Booking Date:</label>
            <input 
                type="date" 
                placeholder="Booking Date" 
                value={EditformData.bookingDate} 
                onChange={e => setEditFormData({...EditformData, bookingDate: e.target.value})} 
            /><br></br>
            <label>New Booking Time:</label>
            <input 
                type="time" 
                placeholder="Start Time" 
                value={EditformData.startTime} 
                onChange={e => setEditFormData({...EditformData, startTime: e.target.value})} 
            /><br></br>
            <label>New Email:</label>
            <input 
                type="text" 
                placeholder="Email" 
                value={EditformData.email} 
                onChange={e => setEditFormData({...EditformData, email: e.target.value})} 
            /><br></br>
            <label>New Release Time:</label>
            <input 
                type="time" 
                placeholder="Current Release Time" 
                value={EditformData.newReleaseTime} 
                onChange={e => setEditFormData({...EditformData, newReleaseTime: e.target.value})} 
            /><br></br>
            <label>Booked By:</label>

            <input type="text" placeholder='bookedBy' onChange={e => setEditFormData({...EditformData, bookedBy: e.target.value})} /><br></br>
            <button   onClick={editBooking}>Save Changes</button><br></br>
            <button onClick={() => setIsEditing(false)}>Cancel</button><br></br>
        </div>
    )}
</ul> 


//next available booking slot display
                <h3>Your Seat Bookings </h3>
    <ul className="booking-list">
    {bookedSeats
        .map((seat) => (
            <li key={seat.seat_id} className="booking-list-item">
                <h5>SeatId : {seat.seat_id}</h5>
                <h5>BookedBy : {seat.booked_by_name}</h5>
                <h5>ReleaseTime : {seat.release_time}</h5>
                <button onClick={() => setNextReleaseTime(true)}>Book after nextReleaseTime</button>
            </li>
        ))
    }
    {nextReleaseTime && (
        <div className="edit-form">
            <h4>Select Next Booking for Seat {EditformData.seatId}</h4>
            <label>New Booking Date:</label>
            <input 
                type="date" 
                placeholder="Booking Date" 
                value={EditformData.bookingDate} 
                onChange={e => setEditFormData({...EditformData, bookingDate: e.target.value})} 
            /><br></br>
            <label>New Booking Time:</label>
            <input 
                type="time" 
                placeholder="Start Time" 
                value={EditformData.startTime} 
                onChange={e => setEditFormData({...EditformData, startTime: e.target.value})} 
            /><br></br>
            <label>New Email:</label>
            <input 
                type="text" 
                placeholder="Email" 
                value={EditformData.email} 
                onChange={e => setEditFormData({...EditformData, email: e.target.value})} 
            /><br></br>
            <label>New Release Time:</label>
            <input 
                type="time" 
                placeholder="Current Release Time" 
                value={EditformData.newReleaseTime} 
                onChange={e => setEditFormData({...EditformData, newReleaseTime: e.target.value})} 
            /><br></br>
            <label>Booked By:</label>

            <input type="text" placeholder='bookedBy' onChange={e => setEditFormData({...EditformData, bookedBy: e.target.value})} /><br></br>
            <button   onClick={editBooking}>Save Changes</button><br></br>
            <button onClick={() => setNextReleaseTime(false)}>Cancel</button><br></br>
        </div>
    )}
</ul> 



                </div>
            </main>
        </div>
    );
};

export default ManagerLevelSeatBooking;