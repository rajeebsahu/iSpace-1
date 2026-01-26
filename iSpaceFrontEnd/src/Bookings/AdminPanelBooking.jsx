// import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
// import { Link } from 'react-router-dom';
// import './AdminPanel.css';

// const AdminPanel = () => {
//     const [allRooms, setAllRooms] = useState([]);
//     const [editingId, setEditingId] = useState(null);
    
//     // State for the edit form
//     const [editForm, setEditForm] = useState({
//         BookingTime: '',
//         ReleaseTime: '',
//         date: '',
//         occupied_by: ''
//     });

//     const API_BASE = "https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/";

//     const fetchAllRooms = () => {
//         Axios.get(API_BASE).then(res => setAllRooms(res.data));
//     };

//     useEffect(() => {
//         fetchAllRooms();
//     }, []);

//     // 1. ADMIN CANCEL FUNCTION
//     const handleAdminCancel = (id) => {
//         if (window.confirm("Admin Action: Are you sure you want to FORCE CANCEL this booking?")) {
//             Axios.post(`${API_BASE}cancel_booking/`, { id: id })
//                 .then(() => {
//                     alert("Room has been reset to Available");
//                     fetchAllRooms();
//                 })
//                 .catch(err => alert("Error cancelling room"));
//         }
//     };

//     // 2. ADMIN EDIT FUNCTION
//     const handleAdminEditSave = (id) => {
//         Axios.post(`${API_BASE}edit_booking/`, {
//             id: id,
//             BookingTime: editForm.BookingTime,
//             ReleaseTime: editForm.ReleaseTime,
//             occupied_by: editForm.occupied_by,
//             // date: editForm.date // Include if your model supports date
//         })
//         .then(() => {
//             alert("Booking details updated successfully");
//             setEditingId(null);
//             fetchAllRooms();
//         })
//         .catch(err => alert("Update failed"));
//     };

//     const startEditing = (room) => {
//         setEditingId(room.id);
//         setEditForm({
//             BookingTime: room.OccuipedTiming,
//             ReleaseTime: room.ReleaseTiming,
//             occupied_by: room.Occupied_by,
//             date: room.date || ""
//         });
//     };

//     return (
//         <div className="admin-page">
//             <header className="booking-header">
//                 <h1>Admin Command Center</h1>
//                 <Link to="/booking" className="btn-light">Switch to User View</Link>
//             </header>

//             <main className="booking-container">
//                 <h2 className="section-title">All Room Statuses</h2>
//                 <div className="admin-table-wrapper">
//                     <table className="admin-table">
//                         <thead>
//                             <tr>
//                                 <th>Room</th>
//                                 <th>Category</th>
//                                 <th>Occupied By</th>
//                                 <th>Booked By (Email)</th>
//                                 <th>Time Slot</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {allRooms.map((room) => (
//                                 <tr key={room.id} className={room.availability_status ? "available-row" : "occupied-row"}>
//                                     <td><strong>{room.room_name}</strong></td>
//                                     <td>{room.MainRoomName}</td>
                                    
//                                     {editingId === room.id ? (
//                                         <>
//                                             <td>
//                                                 <input 
//                                                     type="text" 
//                                                     value={editForm.occupied_by} 
//                                                     onChange={(e) => setEditForm({...editForm, occupied_by: e.target.value})} 
//                                                 />
//                                             </td>
//                                             <td>{room.BookedBy}</td>
//                                             <td>
//                                                 <input 
//                                                     type="time" 
//                                                     value={editForm.BookingTime} 
//                                                     onChange={(e) => setEditForm({...editForm, BookingTime: e.target.value})} 
//                                                 />
//                                                 <input 
//                                                     type="time" 
//                                                     value={editForm.ReleaseTime} 
//                                                     onChange={(e) => setEditForm({...editForm, ReleaseTime: e.target.value})} 
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <button className="btn-save" onClick={() => handleAdminEditSave(room.id)}>Save</button>
//                                                 <button className="btn-cancel-small" onClick={() => setEditingId(null)}>Exit</button>
//                                             </td>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <td>{room.Occupied_by || "—"}</td>
//                                             <td>{room.BookedBy || "—"}</td>
//                                             <td>{room.OccuipedTiming} - {room.ReleaseTiming}</td>
//                                             <td>
//                                                 {!room.availability_status && (
//                                                     <div className="admin-actions">
//                                                         <button className="btn-edit-sm" onClick={() => startEditing(room)}>Edit</button>
//                                                         <button className="btn-cancel-sm" onClick={() => handleAdminCancel(room.id)}>Cancel</button>
//                                                     </div>
//                                                 )}
//                                             </td>
//                                         </>
//                                     )}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default AdminPanel;


import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    // Data State
    const [allRooms, setAllRooms] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Form States for Admin Booking
    const [roomType, setRoomType] = useState("");
    const [availableRoomId, setAvailableRoomId] = useState("");
    const [date, setDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [releaseTime, setReleaseTime] = useState("");
    const [location, setLocation] = useState("iSpace - Chennai");
    const [occupiedBy, setOccupiedBy] = useState("Admin Reserve");
    const [bookedByEmail, setBookedByEmail] = useState("");

    // State for the Edit Row Form
    const [editForm, setEditForm] = useState({
        BookingTime: '',
        ReleaseTime: '',
        occupied_by: ''
    });

    const API_BASE = "https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/ChennaiRoom/";

    const fetchAllRooms = () => {
        Axios.get(API_BASE).then(res => setAllRooms(res.data));
    };
    useEffect(() => {
        fetchAllRooms();
    }, []);


    // useEffect(() => {
    //     const savedEmail = localStorage.getItem('userEmail');
    //     if (savedEmail) {
    //       SetEmail(savedEmail)
    //       setIsEmail(true)
    //     };
    // }, []);

    // --- FUNCTION: ADMIN CREATE BOOKING ---
    const handleAdminBookRoom = () => {
        if (!availableRoomId || !bookedByEmail || !bookingTime || !releaseTime) {
            alert("Please fill all booking fields.");
            return;
        }

        Axios.post(`${API_BASE}bookroom/`, {
            id: availableRoomId,
            date: date,
            BookingTime: bookingTime,
            ReleaseTime: releaseTime,
            location: location,
            occupied_by: occupiedBy,
            Bookedby: bookedByEmail,
            MainRoom: roomType
        })
        .then(() => {
            alert("Room Assigned Successfully!");
            setRoomType(""); // Reset form
            fetchAllRooms();
        })
        .catch(err => alert("Error: " + (err.response?.data?.message || "Booking failed")));
    };

    // --- FUNCTION: ADMIN CANCEL/RESET ---
    const handleAdminCancel = (id) => {
        if (window.confirm("FORCE CANCEL: Are you sure?")) {
            Axios.post(`${API_BASE}cancel_booking/`, { id: id })
                .then(() => {
                    alert("Room is now Available");
                    fetchAllRooms();
                })
                .catch(err => alert("Reset failed"));
        }
    };

    // --- FUNCTION: ADMIN EDIT SAVE ---
    const handleAdminEditSave = (id) => {
        Axios.post(`${API_BASE}edit_booking/`, {
            id: id,
            BookingTime: editForm.BookingTime,
            ReleaseTime: editForm.ReleaseTime,
            occupied_by: editForm.occupied_by,
        })
        .then(() => {
            alert("Updated successfully");
            setEditingId(null);
            fetchAllRooms();
        })
        .catch(err => alert("Update failed"));
    };

    const startEditing = (room) => {
        setEditingId(room.id);
        setEditForm({
            BookingTime: room.OccuipedTiming,
            ReleaseTime: room.ReleaseTiming,
            occupied_by: room.Occupied_by
        });
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
    <div className="header-content">
        <div className='headerText'>
            <h1>Admin Command Center</h1>
            <p>System Overview & Control</p>
        </div>
        
        <div className='headerBtnGroup'>
            <Link to="/managerlevelseatbooking" className="btn-secondary">Book Seats</Link>
            <Link to="/adminlogin" className="btn-logout">LogOut</Link>
        </div>
    </div>
</header>

            <main className="admin-container">
                {/* SECTION 1: ADMIN BOOKING FORM */}
                <section className="admin-card booking-form-area">
                    <h2 className="card-title">Create Rapid Room Booking</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Room Category</label>
                            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                                <option value="">Select Type</option>
                                <option value="Meeting Room">Meeting Room</option>
                                <option value="Conference Room">Conference Room</option>
                                <option value="Training Room">Training Room</option>
                            </select>
                        </div>

                        {roomType && (
                            <>
                                <div className="form-group">
                                    <label>Available Room</label>
                                    <select onChange={(e) => setAvailableRoomId(e.target.value)}>
                                        <option value="">Select Room</option>
                                        {allRooms.filter(r => r.availability_status == false && r.MainRoomName === roomType).map(r => (
                                            <option key={r.id} value={r.id}>{r.room_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>From</label>
                                    <input type="time" onChange={(e) => setBookingTime(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>To</label>
                                    <input type="time" onChange={(e) => setReleaseTime(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Employee Email</label>
                                    <input type="email" placeholder="user@iopex.com" onChange={(e) => setBookedByEmail(e.target.value)} />
                                </div>
                                <button className="btn-primary admin-submit" onClick={handleAdminBookRoom}>Book on Behalf</button>
                            </>
                        )}
                    </div>
                </section>

                {/* SECTION 2: ROOM MANAGEMENT TABLE */}
                <section className="admin-card1 table-area">
                    <h2 className="card-title">Live Room Management</h2>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Room Name</th>
                                    <th>Team / User</th>
                                    <th>Booking Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allRooms.map((room) => (
                                    <tr key={room.id} className={room.availability_status ? "row-free" : "row-busy"}>
                                        <td><strong>{room.room_name}</strong><br/><small>{room.MainRoomName}</small></td>
                                        
                                        {editingId === room.id ? (
                                            <>
                                                <td><input type="text" value={editForm.occupied_by} onChange={(e) => setEditForm({...editForm, occupied_by: e.target.value})} /></td>
                                                <td>
                                                    <input type="time" value={editForm.BookingTime} onChange={(e) => setEditForm({...editForm, BookingTime: e.target.value})} />
                                                    <input type="time" value={editForm.ReleaseTime} onChange={(e) => setEditForm({...editForm, ReleaseTime: e.target.value})} />
                                                </td>
                                                <td>Editing...</td>
                                                <td>
                                                    <button className="btn-action save" onClick={() => handleAdminEditSave(room.id)}>Save</button>
                                                    <button className="btn-action exit" onClick={() => setEditingId(null)}>Exit</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{room.Occupied_by || "—"}<br/><small>{room.BookedBy}</small></td>
                                                <td>{room.OccuipedTiming} - {room.ReleaseTiming}</td>
                                                <td><span className={`badge ${room.availability_status ? 'free' : 'busy'}`}>
                                                    {room.availability_status ==false ? 'Available' : 'Occupied'}
                                                </span></td>
                                                <td>
                                                    {room.availability_status && (
                                                        <div className="action-btns">
                                                            <button className="btn-action edit" onClick={() => startEditing(room)}>Edit</button>
                                                            <button className="btn-action cancel" onClick={() => handleAdminCancel(room.id)}>Reset</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminPanel;