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
  const [Bookedby,setBookedby]=useState("ganesh@iopex.com")




  const getChennaiRoom = ()=>{
    Axios.get("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/",{
    }).then((res)=>{
      setChennaiRoomData(res.data)
    })
  }
  useEffect(() => {
    getChennaiRoom();
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
  
  
//   const BookingRoom = () => {
//   // 1. Point to the specific @action URL
//   // 2. Ensure keys match the backend (room_name vs roomType)
//   Axios.post("https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/bookroom/", {
//       id: AvailableRoom, // Changed from roomType to room_name
//       date: date,
//       AvailableRoom: AvailableRoom,
//       BookingTime: BookingTime,
//       ReleaseTime: ReleaseTime,
//       location: location,
//       occupied_by: occupied_by,
//       Bookedby: Bookedby,
//       MainRoom: roomType,
//       availability_status:"false" // Added since your backend expects this
//     })
//     .then((res) => {
//       alert("Data added successfully");
//       getChennaiRoom();
//     })
//     .catch((err) => {
//       console.error(err.response.data); // Log the actual error from Django
//       alert("Error occurred: " + (err.response.data.message || "Bad Request"));
//     });
// }
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



  return (
    <div className="booking-page">
      {/* Header Section */}
      <header className="booking-header">
        <div className="header-text">
          <h1>Office Booking System</h1>
          <p>Manage seats and meeting rooms</p>
        </div>
        <div className="header-buttons">
          <button className="btn-dark">Employee Panel</button>
          <button className="btn-light">
            <Link to="/adminpanel" style={{ textDecoration: 'none', color: 'inherit' }}>
              Admin Panel
            </Link>
          </button>
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
                  <label>Select Room</label>
                  <select onChange={(e)=>{setRoomType(e.target.value)}}>
                    <option >Select Room</option>
                    <option >Meeting Room</option>
                    <option>Conference Room</option>
                    <option>Training Room</option>
                  </select>
                </div>

                {roomType==="Meeting Room" && ( 
                  <><div className="input-group">
                  <label>Date</label>
                  <input type="date" placeholder="January 5th, 2026" onChange={(e)=>{setDate(e.target.value)}} />
                </div>
                <div className="input-group">
                  <label>Select Room Type</label>
                  {/* <select onChange={(e)=>{setAvailableRoom(e.target.value)}}>
                    <option>Available Meeting Room</option>
                    {
                      ChennaiRoomData.map((data)=>{
                        if(data.availability_status===false && data.MainRoomName==="Meeting Room"){
                          return <option key={data.id}>{data.room_name}</option>
                        }
                      })
                    }
                  </select> */}
                  <select onChange={(e) => setAvailableRoom(e.target.value)}>
    <option value="">Select Room</option>
    {ChennaiRoomData.map((data) => {
        // Filter: Show rooms that match category AND are currently AVAILABLE (status === false)
        if (data.availability_status === true && data.MainRoomName === roomType) {
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
                  <input type="text" placeholder="Employee Name" onChange={(e)=>{setBookedby(e.target.value)}} />
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
                        if(data.availability_status===true && data.MainRoomName==="Conference Room"){
                          return <option key={data.id}>{data.room_name}</option>
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
                  <input type="text" placeholder="Employee Name" onChange={(e)=>{setBookedby(e.target.value)}} />
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
                        if(data.availability_status===true && data.MainRoomName==="Training Room"){
                          return <option key={data.id}>{data.room_name}</option>
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
                  <input type="text" placeholder="Employee Name" onChange={(e)=>{setBookedby(e.target.value)}} />
                </div>
                </>
                )}
                
              </div>

              <button className="btn-submit" onClick={BookingRoom}>Book Room</button>
            </section>
            <h4>Occupied Room Details</h4>
            <div className='occupiedRoomDetail'>
            {ChennaiRoomData.map((data)=>{
              if(data.availability_status===false){
                return(
                <div key={data.id} className='occupiedRoomDetailData'>
                  
                  <h3>ChennaiRoom: {data.room_name}</h3>
                  <p>Location: {data.location}</p>
                  <p>Capacity: {data.capacity}</p>
                  <p>Booked By: {data.Occupied_by}</p>
                  <p>Release Timing: {data.ReleaseTiming}</p>
                </div>
              )
              }
               return null;
              
            })}
            </div>

            {/* Only show "My Bookings" if an employee name is typed */}
            <h2 className="section-title">My Recent Bookings</h2>
            <div className='recentBookings'>

{Bookedby && (
  <>
    {(() => {
      const myBookings = ChennaiRoomData.filter(
        (data) => 
          data.BookedBy === Bookedby &&    // Match the employee name
          data.availability_status === false // Match only 'Occupied' rooms
      );

      if (myBookings.length > 0) {
        return myBookings.map((data) => (
          <div key={data.id} className="booking-card-item">
            <h4>Booking Details for {Bookedby}</h4>
            <h3>Room: {data.room_name} ({data.MainRoomName})</h3>
            <p><strong>Location:</strong> {data.location}</p>
            <p><strong>Time:</strong> {data.OccuipedTiming} - {data.ReleaseTiming}</p>
            <p><strong>Status:</strong> Confirmed & Occupied</p>
          </div>
        ));
      } else {
        return <p className="no-data-text">No active bookings found for "{Bookedby}"</p>;
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