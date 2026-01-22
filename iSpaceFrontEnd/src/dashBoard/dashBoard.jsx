import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import Booking from '../Bookings/Bookings';
import ContactUs from '../ContactUs/ContactUs';
import { useState, useEffect } from 'react';
const Dashboard = () => {
  // const email=localStorage.getItem("email")
  const [email,SetEmail]=useState("")
  const [isEmail,setIsEmail]= useState(false)

  // Inside ManagerLevelSeatBooking.jsx
    useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      SetEmail(savedEmail)
      setIsEmail(true)
        
    };
    }, []);

  const handleLogout = () => {
  localStorage.removeItem('userEmail');
  SetEmail("");
  setIsEmail(false);
  };
  

  return (
    <>
    <div className="hero-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">S</span>PACE
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><Link to="/contactUs">Contact Us</Link></li>
          <li><Link to="/bookings">Booking</Link></li>
          {!isEmail &&(
            <>
            <li><Link to="/adminlogin">Login</Link></li>
            </>
          )}
          {isEmail &&(
            <>
            <li>{email}</li>
            <li>
              <Link to="/adminlogin" onClick={handleLogout}>Logout</Link>
            </li>
            </>
          )}
        </ul>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        <h1>Find Your Perfect Workspace</h1>
        <button className="get-started-btn"><Link to="/bookings">Get Started!</Link></button>
      </div>
    </div>
    <Booking></Booking>
    <ContactUs></ContactUs>
    </>
  );
};

export default Dashboard;