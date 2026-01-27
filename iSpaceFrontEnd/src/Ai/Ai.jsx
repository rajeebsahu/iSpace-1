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
            const res = await Axios.get(`https://congenial-parakeet-94vvg49gwrvhqw4-8000.app.github.dev/Apis/v1/ChennaiRoom/get_ai_suggestions/`, {
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
        <div className="ai-page-wrapper">
            <div className="ai-main-container">
                <header className="ai-hero-section">
                    <div className="ai-icon-pulse">🤖</div>
                    <h1>AI Booking Assistant</h1>
                    <p>Harnessing predictive patterns for your workspace efficiency</p>
                </header>
                
                <section className="ai-card-glass">
                    <form onSubmit={handlePredict} className="ai-form-layout">
                        <div className="input-field-wrapper">
                            <label>Workspace Resource</label>
                            <input type="text" placeholder="e.g., MR1 or B1-S1" onChange={(e)=>setFormData({...formData, room: e.target.value})} required />
                        </div>
                        <div className="input-field-wrapper">
                            <label>Target Date</label>
                            <input type="date" onChange={(e)=>setFormData({...formData, date: e.target.value})} required />
                        </div>
                        <div className="input-field-wrapper">
                            <label>Target Time</label>
                            <input type="time" onChange={(e)=>setFormData({...formData, time: e.target.value})} required />
                        </div>
                        <button type="submit" className={`ai-submit-btn ${loading ? 'loading' : ''}`}>
                            {loading ? <span className="spinner"></span> : "Generate Intelligence"}
                        </button>
                    </form>
                </section>

                {analysis && (
                    <div className="analysis-result-anim">
                        <div className="result-glass-card">
                            <div className="result-header">
                                <h3>Intelligence for <span>{analysis.requested_room}</span></h3>
                                <div className="status-pill" data-status={analysis.status}>{analysis.status}</div>
                            </div>
                            
                            <div className="usage-meter-section">
                                <div className="usage-info">
                                    <span>Usage Likelihood</span>
                                    <span className="percentage">{analysis.probability_of_usage}%</span>
                                </div>
                                <div className="meter-container">
                                    <div className="meter-fill" style={{width: `${analysis.probability_of_usage}%`}}></div>
                                </div>
                            </div>

                            <div className="ai-insight-box">
                                <span className="insight-label">💡 Predictive Insight</span>
                                <p>{analysis.suggestion}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ai;