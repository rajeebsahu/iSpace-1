// import React from 'react';
// import './AdminLogin.css'; // Import the CSS file we just made
// import loginImg from '../assets/react.svg'; // Make sure you have a real image here

// const AdminLogin = () => {
//   const [customerlogin, setCustomerLogin] = useState(false);
//   const [adminlogin, SetAdminLogin] = useState(false);

//   return (
//     <>
//     {!customerlogin && (
//     <div className="admin-container">
//       {/* Left Side */}
//       <div className="image-section">
//         <div className="bg-image" style={{ backgroundImage: `url(${loginImg})` }}>
//           <button className="signup-badge">Sign Up</button>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="form-section">
//         <div className="form-wrapper">
//           <h1>Admin Portal</h1>
//           <p>Enter your credentials to access your portal</p>

//           <form>
//             <div className="input-group">
//               <label>Email</label>
//               <input type="email" placeholder="Enter your email" />
//             </div>

//             <div className="input-group">
//               <label>Password</label>
//               <input type="password" placeholder="Enter your password" />
//             </div>

//             <div className="divider">
//               <div className="line"></div>
//               <span className="or-text">or</span>
//               <div className="line"></div>
//             </div>

//             <button type="button" className="btn-employee">
//               Login As Employee
//             </button>

//             <button type="submit" className="btn-login">
//               Login
//             </button>
//           </form>

//           <p className="footer-text">
//             Don't have an account? <span className="signup-link">Sign Up</span>
//           </p>
//         </div>
//       </div>
//     </div>
//     )}

//     {!adminlogin && (
//     <div className="admin-container">
//       {/* Left Side */}
//       <div className="image-section">
//         <div className="bg-image" style={{ backgroundImage: `url(${loginImg})` }}>
//           <button className="signup-badge">Sign Up</button>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="form-section">
//         <div className="form-wrapper">
//           <h1>Admin Portal</h1>
//           <p>Enter your credentials to access your portal</p>

//           <form>
//             <div className="input-group">
//               <label>Email</label>
//               <input type="email" placeholder="Enter your email" />
//             </div>

//             <div className="input-group">
//               <label>Password</label>
//               <input type="password" placeholder="Enter your password" />
//             </div>

//             <div className="divider">
//               <div className="line"></div>
//               <span className="or-text">or</span>
//               <div className="line"></div>
//             </div>

//             <button type="button" className="btn-employee">
//               Login As Employee
//             </button>

//             <button type="submit" className="btn-login">
//               Login
//             </button>
//           </form>

//           <p className="footer-text">
//             Don't have an account? <span className="signup-link">Sign Up</span>
//           </p>
//         </div>
//       </div>
//     </div>
//     )}
//     </>
//   );
// };

// export default AdminLogin;

import React, { useState } from 'react'; // 1. Added useState import
import './AdminLogin.css';
import loginImg from '../assets/react.svg'; 

const AdminLogin = () => {
  // Use one state to track the "view" or keep your two booleans
  const [isAdminView, setIsAdminView] = useState(true); 

  return (
    <div className="admin-container">
      {/* Left Side - Stays the same for both */}
      <div className="image-section">
        <div className="bg-image" style={{ backgroundImage: `url(${loginImg})` }}>
          <button className="signup-badge">Sign Up</button>
        </div>
      </div>

      {/* Right Side - Changes based on state */}
      <div className="form-section">
        <div className="form-wrapper">
          
          {/* Conditional Title */}
          <h1>{isAdminView ? "Admin Portal" : "Customer Portal"}</h1>
          <p>Enter your credentials to access your {isAdminView ? "admin" : "customer"} portal</p>

          <form>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            <div className="divider">
              <div className="line"></div>
              <span className="or-text">or</span>
              <div className="line"></div>
            </div>

            {/* Toggle Button: Swaps between Admin and Customer */}
            <button 
              type="button" 
              className="btn-employee" 
              onClick={() => setIsAdminView(!isAdminView)}
            >
              Login As {isAdminView ? "Customer" : "Admin"}
            </button>

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>

          <p className="footer-text">
            Don't have an account? <span className="signup-link">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;