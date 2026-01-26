import React, { useState } from 'react';
import Axios from 'axios';
import './Ai.css';

const Ai = () => {
    const [formData, setFormData] = useState({ room: '', date: '', time: '' });
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const userEmail = localStorage.getItem('userEmail');

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await Axios.get(`https://humble-orbit-v4pjxqxgw9qcw9vg-8000.app.github.dev/Apis/v1/ChennaiRoom/get_ai_suggestions/`, {
                params: {
                    email: userEmail,
                    room: formData.room,
                    date: formData.date,
                    time: formData.time
                }
            });
            setAnalysis(res.data);
        } catch (err) {
            console.error("AI Error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-container">
            <header className="ai-header">
                <h1>AI Booking Assistant</h1>
                <p>Input your intended booking to see your usage probability</p>
            </header>
            
            <section className="ai-input-form">
                <form onSubmit={handlePredict} className="ai-form-grid">
                    <div className="form-group">
                        <label>Room or Seat Name</label>
                        <input type="text" placeholder="e.g. MR1" onChange={(e)=>setFormData({...formData, room: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" onChange={(e)=>setFormData({...formData, date: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Time</label>
                        <input type="time" onChange={(e)=>setFormData({...formData, time: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-ai-predict">
                        {loading ? "Analyzing..." : "Analyze Pattern"}
                    </button>
                </form>
            </section>

            {analysis && (
                <div className="prediction-result-card">
                    <h3>Analysis for {analysis.requested_room}</h3>
                    <div className="gauge-container">
                        <div className="gauge-bar" style={{width: `${analysis.probability_of_usage}%`, backgroundColor: analysis.probability_of_usage > 50 ? '#27ae60' : '#e67e22'}}></div>
                    </div>
                    <p>Usage Likelihood: <strong>{analysis.probability_of_usage}%</strong></p>
                    <p className="ai-status">Status: <strong>{analysis.status}</strong></p>
                    <p className="ai-message">💡 {analysis.suggestion}</p>
                </div>
            )}
        </div>
    );
};

export default Ai;