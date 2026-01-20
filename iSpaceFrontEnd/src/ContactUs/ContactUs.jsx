import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-page">
      {/* Header Section */}
      <header className="contact-header">
        <div className="header-text">
          <h1>Contact Us</h1>
          <p>Have questions? Our team is here to help you.</p>
        </div>
      </header>

      <main className="contact-container">
        <div className="contact-card">
          <div className="contact-grid">
            
            {/* Left Side: Contact Information */}
            <div className="info-side">
              <h2 className="card-title">Get in Touch</h2>
              <p className="card-subtitle">Fill out the form and we will get back to you within 24 hours.</p>
              
              <div className="info-items">
                <div className="info-item">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Location</strong>
                    <p>Chennai- Guindy, Tamil Nadu</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>support@space.com</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="form-side">
              <form className="contact-form">
                <div className="input-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="Enter Your Name" />
                </div>
                
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter Your Email" />
                </div>

                <div className="input-group">
                  <label>Message</label>
                  <textarea rows="4" placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" className="btn-submit">Send Message</button>
              </form>
            </div>

          </div>
        </div>

        {/* Support Stats (Matching your "My Bookings" style) */}
        <div className="stats-grid">
          <div className="stat-item">
            <span>Average Response</span>
            <strong>2 Hours</strong>
          </div>
          <div className="stat-item">
            <span>Technical Support</span>
            <strong>24 / 7</strong>
          </div>
          <div className="stat-item">
            <span>Client Satisfaction</span>
            <strong>98%</strong>
          </div>
          <div className="stat-item">
            <span>Office Locations</span>
            <strong>5</strong>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;