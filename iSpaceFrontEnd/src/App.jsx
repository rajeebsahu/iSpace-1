import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './ForLogins/AdminLogin'
import AdminLogin from './ForLogins/AdminLogin'
import Dashboard from './dashBoard/dashBoard'
import Bookings from './Bookings/Bookings'
import AdminPanelBooking from './Bookings/AdminPanelBooking'
import CalendarView  from './Bookings/CalenderView'  
import ContactUs from './ContactUs/ContactUs'
import ManagerLevelSeatBooking from './Bookings/ManagerLevelSeatBooking'
import Ai from './Ai/Ai'
import { BrowserRouter,Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/adminpanel" element={<AdminPanelBooking />} />
        <Route path="/calendarview" element={<CalendarView />} />
        <Route path='/contactUs' element={<ContactUs />} />
        <Route path='/managerlevelseatbooking' element={<ManagerLevelSeatBooking />} />
        <Route path='/Ai' element={<Ai></Ai>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App
