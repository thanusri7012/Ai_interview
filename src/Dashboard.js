import React, { useState, useEffect } from "react";
import { logOut } from "./auth";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "./auth"; 
import ResumeAnalysis from "./ResumeAnalysis";
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [showResumeAnalysis, setShowResumeAnalysis] = useState(false);

    useEffect(() => {
        getCurrentUser((user) => {
            if (user) {
                setEmail(user.email);
            } else {
                setEmail(null);
            }
        });
    }, []);

    const handleStartInterview = () => {
        navigate("/interviewtypeselection"); 
    };

    const handleResumeAnalysis = () => {
        setShowResumeAnalysis(true); 
    };

    const handleBackToDashboard = () => {
        setShowResumeAnalysis(false); 
    };

    const handleLogout = () => {
        logOut();
        navigate("/");
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-overlay">
                <header className="dashboard-header">
                    <h1>AI Interviewer Dashboard</h1>
                    <p>Welcome back, {email ? email : "User"}! Ready for your next step?</p>
                </header>

                <div className="dashboard-content">
                    {showResumeAnalysis ? (
                        <div>
                            <button className="dashboard-btn back-btn" onClick={handleBackToDashboard}>
                                ⬅ Back to Dashboard
                            </button>
                            <ResumeAnalysis />
                        </div>
                    ) : (
                        <>
                            <div className="user-info">
                                <p><strong>Email:</strong> {email || "Not logged in"}</p>
                                <p><strong>Status:</strong> {email ? "Logged In" : "Not logged in"}</p>
                            </div>

                            <div className="dashboard-buttons">
                                <button className="dashboard-btn" onClick={handleStartInterview}>Start Interview</button>
                                <button className="dashboard-btn resume-btn" onClick={handleResumeAnalysis}>Resume Analysis</button>
                                <button className="dashboard-btn logout-btn" onClick={handleLogout}>Log Out</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
