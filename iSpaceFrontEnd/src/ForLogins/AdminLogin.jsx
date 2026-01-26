

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import for redirection
import Axios from 'axios';
import './AdminLogin.css';
import loginImg from '../assets/AdminAndImployeeLogin.png'; 

const AdminLogin = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [isAdminView, setIsAdminView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault(); // Prevent page refresh
    Axios.post('https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/admin/login/', {
      email: email,
      password: password,
    })
    .then((response) => {

      alert("Admin Login Successful!");
      // Optionally store admin status in localStorage
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', email);
      navigate('/adminpanel'); // Redirect to Admin Panel
    })
    .catch(err => alert("Admin Credentials Invalid"));
  };

  // Handle Employee Login
  const handleEmployeeLogin = (e) => {
    e.preventDefault(); // Prevent page refresh
    Axios.post('https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/Employees/login/', {
      email: email,
      password: password,
    })
    .then((response) => {
      const managerAccess = response.data.managerAccess
      alert("Employee Login Successful!");
      // 3. CRITICAL: Store the email so ManagerLevelSeatBooking can use it!
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'employee');
      localStorage.setItem('managerAccess',managerAccess)
  
      navigate('/'); // Redirect to ManagerLevelSeatBooking.jsx page
    })
    .catch(err => alert("Employee Credentials Invalid"));
  };

  return (
    <div className="admin-container">
      <div className="image-section">
        <div className="bg-image" style={{ backgroundImage: `url(${loginImg})` }}>
        </div>
      </div>

      <div className="form-section">
        <div className="form-wrapper">
          <h1>{isAdminView ? "Admin Portal" : "Employee Portal"}</h1>
          <p>Enter your credentials to access your {isAdminView ? "admin" : "employee"} portal</p>

          {/* 4. Use onSubmit on the form instead of onClick on the button */}
          <form onSubmit={isAdminView ? handleAdminLogin : handleEmployeeLogin}>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                required
                placeholder="Enter your email" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                required
                placeholder="Enter your password" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="divider">
              <div className="line"></div>
              <span className="or-text">or</span>
              <div className="line"></div>
            </div>

            <button 
              type="button" 
              className="btn-toggle" 
              onClick={() => setIsAdminView(!isAdminView)}
            >
              Switch to {isAdminView ? "Employee" : "Admin"} Login
            </button>

            <button type="submit" className="btn-login">
              Login as {isAdminView ? "Admin" : "Employee"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;