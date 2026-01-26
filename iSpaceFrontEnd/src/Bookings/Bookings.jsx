import React, { useState } from 'react';
import './Booking.css';
import { data, Link } from 'react-router-dom';
import CalendarView from './CalenderView';
import { useEffect } from 'react';
import Axios from 'axios'

const Booking = () => {
  // Use one state to track which tab is active
  const [activeTab, setActiveTab] = useState('Room Booking');
  const [ChennaiRoomData,setChennaiRoomData]=useState([]);
  const [BookingHistoryData,setBookingHistoryData]=useState([]);

  //rooms tye
  const [meetingRoom,setMeetingRoom]=useState('True')
  const [conferenceRoom,setConferenceRoom]=useState('false')
  const [ChennaiRoom,setChennaiRoom]=useState('false')

  
  //posting Data
  const [roomType,setRoomType]=useState("")
  const [date, setDate]=useState("")
  const [AvailableRoom, setAvailableRoom] = useState("")
  const [BookingTime,setBookingTime]=useState("")
  const [ReleaseTime,setReleaseTime]=useState("")
  const [location,setLocation]=useState("")
  const [occupied_by,setOccupied_by]=useState("")
  const [Bookedby,setBookedby]=useState(localStorage.getItem('userEmail'))

  //Edited data
  const [editingId, setEditingId] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newDate,setNewDate]=useState("")

  //ForNext Bookin
  const [ToTime,setToTime]=useState("")
  const [FromTime,setFromTime]=useState("")
  const [bookNextAvailableRoom,setBookNextAvailableRoom]=useState(null)
  const [nextBooking,setNextBooking]=useState(false)
  const [FutureReleaseTime, setFutureReleaseTime] = useState(null)
  const [FutureBookRoomId, setFutureBookRoomId] = useState(null)


  const savedEmail = localStorage.getItem('userEmail');
  const ManagerAccess = localStorage.getItem("managerAccess") === "true";
  // Add this line with your other state declarations
  const [activeBookingId, setActiveBookingId] = useState(null);



  const getChennaiRoom = ()=>{
    Axios.get("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/",{
    }).then((res)=>{
      setChennaiRoomData(res.data)
    })
  }
  useEffect(() => {
    getChennaiRoom();
  }, []);




  const getHistoryChennaiRoom = ()=>{
    Axios.get("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/BookingHistory/",{
    }).then((res)=>{
      setBookingHistoryData(res.data)
    })
  }
  useEffect(() => {
    getHistoryChennaiRoom();
  }, []);

  const counts = {
    total: 0,
    training: 0,
    conference: 0,
    meeting: 0
  };

  ChennaiRoomData.forEach(item => {
    if (item.availability_status === true) {
      counts.total++;
      if (item.MainRoomName === "Training Room") counts.training++;
      if (item.MainRoomName === "Conference Room") counts.conference++;
      if (item.MainRoomName === "Meeting Room") counts.meeting++;
    }
  });
  
  

const BookingRoom = () => {
    Axios.post("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/bookroom/", {
        id: AvailableRoom, // Sending the ID picked from the dropdown
        date: date,
        BookingTime: BookingTime,
        ReleaseTime: ReleaseTime,
        location: location,
        occupied_by: occupied_by,
        Bookedby: Bookedby,
        MainRoom: roomType
    })
    .then((res) => {
        alert("Data added successfully");
        getChennaiRoom();
    })
    .catch((err) => {
        console.error(err.response.data);
        alert("Error occurred: " + (err.response.data.message || "Bad Request"));
    });
};

const CancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
        Axios.post("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/cancel_booking/", {
            id: id
        })
        .then((res) => {
            alert("Booking cancelled successfully");
            getChennaiRoom(); // Refresh the list
        })
        .catch((err) => {
            alert("Error: " + (err.response?.data?.message || "Cancellation failed"));
        });
    }
};
console.log("Manages access ",ManagerAccess)

const handleUpdate = (id) => {
    Axios.post("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/edit_booking/", {
        id: id,
        BookingTime: newStartTime,
        ReleaseTime: newEndTime,
        date: newDate
    })
    .then((res) => {
        alert("Booking updated!");
        setEditingId(null); // Close edit mode
        getChennaiRoom();   // Refresh data
    })
    .catch((err) => alert("Update failed"));
};


  return (
    <div className="booking-page">
      {/* Header Section */}
      <header className="booking-header">
        <div className="header-text">
          <h1>Office Booking System</h1>
          <p>Manage seats and meeting rooms</p>
        </div>
        <div className="header-buttons">
          <button className='btn1-dark'><Link to="/Ai">Ai predections</Link></button>
          {/* <button className="btn-dark">Employee Panel</button> */}
          {ManagerAccess === true &&(
            <>
            <button className="btn1-light">
            <Link to="/managerlevelseatbooking" style={{ textDecoration: 'none', color: 'inherit' }}>
              Manager Panel
            </Link>
          </button>
            </>
          )}
        </div>
      </header>

      <main className="booking-container">
        {/* Tab Toggle */}
        <div className="tabs-wrapper">
          <button 
            className={`tab-btn ${activeTab === 'Room Booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('Room Booking')}
          >
            Room Booking
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Calendar View' ? 'active' : ''}`}
            onClick={() => setActiveTab('Calendar View')}
          >
            Calendar View
          </button>
        </div>

        {/* Conditional Rendering Logic */}
        {activeTab === 'Room Booking' ? (
          <>
            {/* Form Card */}
            <section className="booking-card">
              <div className="input-row">
                <div className="input-group">
                  <label>Select Room <span className='textred'>*</span></label>
                  <select onChange={(e)=>{setRoomType(e.target.value)}}>
                    <option >Select Room</option>
                    <option >Meeting Room</option>
                    <option>Conference Room</option>
                    <option>Training Room</option>
                  </select>
                </div>

                {roomType==="Meeting Room" && ( 
                  <><div className="input-group">
                  <label>Date <span className='textred'>*</span></label>
                  <input type="text" onFocus={(e) => (e.target.type = "date")}  placeholder="Enter Date"  onChange={(e)=>{setDate(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>From <span className='textred'>*</span></label>
                  <input type="text" onFocus={(e) => (e.target.type = "time")}  placeholder="Enter Start Time" onChange={(e)=>{setBookingTime(e.target.value); setToTime(e.target)}} />
                </div>
                <div className="input-group">
                  <label>To <span className='textred'>*</span></label>
                  <input type="text" onFocus={(e) => (e.target.type = "time")}  placeholder="Enter End Time" onChange={(e)=>{setReleaseTime(e.target.value); setFromTime(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>Select Room Type <span className='textred'>*</span></label>
                  <select onChange={(e) => setAvailableRoom(e.target.value)}>
    <option value="">Select Room</option>
    {ChennaiRoomData.map((data) => {
      console.log(data.availability_status)
        // Filter: Show rooms that match category AND are currently AVAILABLE (status === false)
        if (data.availability_status === false && data.MainRoomName === roomType ) {
            return (
                <option key={data.id} value={data.id}>
                    {data.room_name}
                </option>
            );
        }
        return null;
    })}
</select>
                </div>
                <div className="input-group">
                  <label>Location <span className='textred'>*</span></label>
                  <select onChange={(e)=>{setLocation(e.target.value)}}>
                    <option>Choose Branch</option>
                    <option>iSpace - Bangalore</option>
                    <option>iSpace - Chennai</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Team Name <span className='textred'>*</span></label>
                  <select onChange={(e)=>{setOccupied_by(e.target.value)}}>
                    <option>Choose Team</option>
                    <option>Imigrate</option>
                    <option>ServiceNow</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Employee Name <span className='textred'>*</span></label>
                  <input type="text" placeholder="Employee Name" value={savedEmail} disabled  onChange={(e)=>{setBookedby(e.target.value)}} />
                </div>
                </>
                )}

                {roomType==="Conference Room" && ( 
                  <><div className="input-group">
                  <label>Date</label>
                  <input type="date" placeholder="January 5th, 2026" onChange={(e)=>{setDate(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>Available Conference Type</label>
                  <select onChange={(e)=>{setAvailableRoom(e.target.value)}}>
                    <option>Select Room</option>
                    {
                      ChennaiRoomData.map((data)=>{
                        if(data.availability_status===false && data.MainRoomName===roomType){
                          return <option key={data.id} value={data.id}>{data.room_name}</option>
                        }
                      })
                    }
                  </select>
                </div>

                <div className="input-group">
                  <label>From</label>
                  <input type="time" placeholder="11:00 AM" onChange={(e)=>{setBookingTime(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>To</label>
                  <input type="time" placeholder="11:00 AM" onChange={(e)=>{setReleaseTime(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <select onChange={(e)=>{setLocation(e.target.value)}}>
                    <option>iSpace - Bangalore</option>
                    <option>iSpace - Chennai</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Team Name</label>
                  <select onChange={(e)=>{setOccupied_by(e.target.value)}}>
                    <option>Imigrate</option>
                    <option>ServiceNow</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Employee Name</label>
                  <input type="text" placeholder="Employee Name" value={savedEmail} disabled onChange={(e)=>{setBookedby(e.target.value)}} />
                </div></>
                )}

                {roomType==="Training Room" && ( 
                  <><div className="input-group">
                  <label>Date</label>
                  <input type="date" placeholder="January 5th, 2026" onChange={(e)=>{setDate(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>Available Training Room Type</label>
                  <select onChange={(e)=>{setAvailableRoom(e.target.value)}}>
                    <option>Select Room</option>
                    {
                      ChennaiRoomData.map((data)=>{
                        if(data.availability_status===false && data.MainRoomName===roomType){
                          return <option key={data.id} value={data.id}>{data.room_name}</option>
                        }
                      })
                    }
                  </select>
                </div>

                <div className="input-group">
                  <label>From</label>
                  <input type="time" placeholder="11:00 AM" onChange={(e)=>{setBookingTime(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>To</label>
                  <input type="time" placeholder="11:00 AM" onChange={(e)=>{setReleaseTime(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <select onChange={(e)=>{setLocation(e.target.value)}}>
                    <option>iSpace - Bangalore</option>
                    <option>iSpace - Chennai</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Team Name</label>
                  <select onChange={(e)=>{setOccupied_by(e.target.value)}}>
                    <option>Imigrate</option>
                    <option>ServiceNow</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Employee Name</label>
                  <input type="text" placeholder="Employee Name" value={savedEmail} disabled onChange={(e)=>{setBookedby(e.target.value)}} />
                </div>
                </>
                )}
                
              </div>

              <button className="btn-submit" onClick={BookingRoom}>Book Room</button>
            </section>
            {/* <h4>Occupied Room Details</h4>
            <div className='occupiedRoomDetail'>
            {ChennaiRoomData.map((data)=>{
              if(data.availability_status===true){
                return(
                  <>
                <div key={data.id} className='occupiedRoomDetailData'>
                  <h3>ChennaiRoom: {data.room_name}</h3>
                  <p>Location: {data.location}</p>
                  <p>Capacity: {data.capacity}</p>
                  <p>Booked By: {data.BookedBy}</p>
                  <p>Release Timing: {data.ReleaseTiming}</p>
                  <button onClick={() => {setBookNextAvailableRoom(data.id); setNextBooking(true); setFutureReleaseTime(data.ReleaseTiming); setFutureBookRoomId(data.room_name)}}>Book room for next available time</button>
                </div>
                </>
              )
              }
               return null; 
            })}

            </div> */}
<div className='recentBookings1'>
<h4>My Booking Data</h4>
{/* <div className='recentBookings'>
{Bookedby && (
  <>
    {(() => {
      const myBookings = ChennaiRoomData.filter(
        (data) => 
          data.BookedBy === savedEmail &&    // Match the employee name
          data.availability_status === true // Match only 'Occupied' rooms
      );
      if (myBookings.length > 0) {
        return myBookings.map((data) => (
          <>
          <div key={data.id} className="booking-card-item">
            <h4>Booking Details for {Bookedby}</h4>
            <h3>Room: {data.room_name} ({data.MainRoomName})</h3>
            <p><strong>Location:</strong> {data.location}</p>
            <p><strong>Time:</strong> {data.OccuipedTiming} - {data.ReleaseTiming}</p>
            <button className="btn-cancel" onClick={() => CancelBooking(data.id)}>Cancel Booking</button>
            <button className="btn-edit" onClick={() => setEditingId(data.id)}>Edit Booking</button>
          </div>
          {editingId == data.id && (
              <div className="edit-booking-form">
                <h4>Edit Booking Time</h4>
                <div className="input-group">
                  <label>New Start Time</label>
                  <input type = "date" value={newDate} onChange={(e)=>setNewDate(e.target.value)}></input>
                  <input 
                    type="time" 
                    value={newStartTime} 
                    onChange={(e) => setNewStartTime(e.target.value)} 
                  />
                </div>
                <div className="input-group">
                  <label>New End Time</label>
                  <input 
                    type="time" 
                    value={newEndTime} 
                    onChange={(e) => setNewEndTime(e.target.value)} 
                  />
                </div>
                <button className="btn-update" onClick={() => handleUpdate(data.id)}>Update Booking</button>
                <button className="btn-cancel-edit" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            )}
          </>
        ));
      } else {
        return <p className="no-data-text">No active bookings found for "{Bookedby}"</p>;
      }
    })()}
   
  </>
)}
 </div> */}
 <div className='recentBookings'>
  {Bookedby && (
    <>
      {(() => {
        const myBookings = ChennaiRoomData.filter(
          (data) => 
            data.BookedBy === savedEmail && 
            data.availability_status === true 
        );

        if (myBookings.length > 0) {
          return myBookings.map((data) => (
            <>
            <div key={data.id} className="booking-group-container">
              
              {/* The Visual Card */}
              <div className="booking-card-item">
                <h3>Booking Details for {Bookedby}</h3>
                <h3>Room: {data.room_name} ({data.MainRoomName})</h3>
                <p><strong>Location:</strong> {data.location}</p>
                <p><strong>Time:</strong> {data.OccuipedTiming} - {data.ReleaseTiming}</p>
                
                <div className="card-actions">
                  <button className="btn-cancel" onClick={() => CancelBooking(data.id)}>Cancel Booking</button>
                  <button className="btn-edit" onClick={() => setEditingId(data.id)}>Edit Booking</button>
                </div>
              </div>

              {/* The Edit Form - Now stays strictly below the card it belongs to */}
              {editingId === data.id && (
                <div className="edit-booking-form">
                  <h4>Edit Booking Time</h4>
                  <div className="input-group">
                    <label>New Date</label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>New Start Time</label>
                    <input 
                      type="time" 
                      value={newStartTime} 
                      onChange={(e) => setNewStartTime(e.target.value)} 
                    />
                  </div>
                  <div className="input-group">
                    <label>New End Time</label>
                    <input 
                      type="time" 
                      value={newEndTime} 
                      onChange={(e) => setNewEndTime(e.target.value)} 
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-update" onClick={() => handleUpdate(data.id)}>Update Booking</button>
                    <button className="btn-cancel-edit" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
            </>
            
          ));
        } else {
          return <p className="no-data-text">No active bookings found for "{Bookedby}"</p>;
        }
      })()}
    </>
  )}
</div>

 
</div>



<div className='occupiedRoomDetail1'><h4>Currenlty Occupied Room Details</h4>   
<div className='occupiedRoomDetail'>
  {ChennaiRoomData.map((data) => {
    if (data.availability_status === true) {
      return (
        <div key={data.id} className='occupiedRoomDetailData' style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
          
          {/* Current Booking Info */}
          <div className="current-booking">
            <h3 style={{ color: '#d9534f' }}>🔴 Currently Occupied: {data.room_name}</h3>
            <p><strong>Capacity:</strong> {data.capacity} | <strong>Location:</strong> {data.location}</p>
            <p><strong>Current User:</strong> {data.BookedBy}</p>
            <p><strong>Occupied Team:</strong>{data.Occupied_by}</p>
            <p><strong>Ends At:</strong> {data.ReleaseTiming}</p>
{/*             
            <button 
               className="btn-book-next"
               onClick={() => {
                 setBookNextAvailableRoom(data.id); 
                 setActiveBookingId(data.id); 
                 setBookingTime(data.ReleaseTiming); // Auto-starts when current ends
               }}
            >
              Book next available slot
            </button> */}
            <button onClick={() => {
    setAvailableRoom(data.id);           // Set the ID for the API call
    setActiveBookingId(data.id);         // Open the form for THIS room
    setFutureReleaseTime(data.ReleaseTiming); 
    setFutureBookRoomId(data.room_name);
    setBookingTime(data.ReleaseTiming);  // Pre-fill "From" time
}}>
    Book room for next available time
</button>
          </div>
          {/* --- FUTURE BOOKINGS (The Queue) --- */}
          {data.FutureBookings && data.FutureBookings.length > 0 && (
            <div className="future-queue" style={{ marginTop: '15px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
              <h5 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>📅 Waiting List / Future Bookings</h5>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {data.FutureBookings.map((future, index) => (
                  <li key={index} style={{ fontSize: '0.9rem', marginBottom: '8px', padding: '5px', borderLeft: '3px solid #5bc0de' }}>
                    <strong>{index + 1}. {future.Bookedby}</strong> ({future.occupied_by}) <br/>
                    <span>Time: {future.BookingTime} - {future.ReleaseTime}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking Form (Only shows if this room is active) */}
          {activeBookingId === data.id && (
  <>
    {/* Dark overlay behind the modal */}
    <div className="modal-overlay" onClick={() => setActiveBookingId(null)}></div>
    
    {/* The Centered Modal Form */}
    <div className="next-booking-form-modal">
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        Book Next Slot: {data.room_name}
      </h3>
      
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
        Current booking ends at <strong>{data.ReleaseTiming}</strong>.
      </p>

      <div className="input-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="input-group">
        <label>From Time</label>
        <input 
          type="time" 
          value={BookingTime} 
          onChange={(e) => setBookingTime(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <label>To Time</label>
        <input 
          type="time" 
          value={ReleaseTime} 
          onChange={(e) => setReleaseTime(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <label>Team Name</label>
        <select onChange={(e) => setOccupied_by(e.target.value)}>
          <option value="">Select Team</option>
          <option value="Imigrate">Imigrate</option>
          <option value="ServiceNow">ServiceNow</option>
        </select>
      </div>

      <div className="input-group">
        <label>Employee Name</label>
        <input type="text" value={savedEmail} disabled />
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        <button 
          className="btn-submit" /* Reusing your main submit style */
          onClick={() => {
            BookingRoom();
            setActiveBookingId(null);
          }}
        >
          Confirm Booking
        </button>
        <button 
          className="btn1-light" 
          style={{ width: '100%', backgroundColor: '#eee', color: '#333' }}
          onClick={() => setActiveBookingId(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </>
)}
        </div>
      );
    }
    return null;
  })}
</div>
</div> 



            {/* Only show "My Bookings" if an employee name is typed */}
            
 <h2 className="section-title">Your Past Booking Data</h2>
<div className='PastBookings'>
  {Bookedby && (
    <>
      {(() => {
        const myBookings = BookingHistoryData.filter(
          (data) => data.booked_by === Bookedby
        );

        if (myBookings.length > 0) {
          return (
            <div className="table-container">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Room Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((data) => (
                    <tr key={data.id}>
                      <td>{data.booked_by}</td>
                      <td>{data.room_name}</td>
                      <td>{data.main_room_name}</td>
                      <td>{data.location}</td>
                      <td>{data.date}</td>
                      <td>{data.start_time}</td>
                      <td>{data.end_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } else {
          return <p className="no-data-text">No active past bookings found for "{Bookedby}"</p>;
        }
      })()}
    </>
  )}
</div>


            {/* Stats Section */}
            <h2 className="section-title">Total Room Bookings</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span>Total Bookings</span>
                <strong>{counts.total}</strong>
              </div>
              <div className="stat-item">
                <span>Meeting Rooms</span>
                <strong>{counts.meeting}</strong>
              </div>
              <div className="stat-item">
                <span>Project/Training</span>
                <strong>{counts.training}</strong>
              </div>
              <div className="stat-item">
                <span>Conference Room</span>
                <strong>{counts.conference}</strong>
              </div>
            </div>
          </>
        ) : (
          <CalendarView />
        )}
      </main>
    </div>
  );
};

export default Booking;