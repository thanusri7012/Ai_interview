import React, { useState } from "react";
import { signUp, logIn, logOut } from "./auth";
import { useNavigate } from "react-router-dom";  // Import useNavigate for routing
import './AuthForm.css';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for errors
    const navigate = useNavigate();  // Initialize navigate hook

    // Handle Sign Up
    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            setError("");  // Reset error if successful
            navigate("/dashboard"); // Redirect to Dashboard after successful sign up
        } catch (err) {
            setError(err.message);  // Set the error message to show
        }
    };

    // Handle Log In
    const handleLogin = async () => {
        try {
            await logIn(email, password);
            setError("");  // Reset error if successful
            navigate("/dashboard"); // Redirect to Dashboard after successful login
        } catch (err) {
            setError(err.message);  // Set the error message to show
        }
    };

    // Handle Log Out
    const handleLogout = async () => {
        try {
            await logOut();
            setError("");  // Reset error if successful
            navigate("/");  // Redirect to Login page after logout
        } catch (err) {
            setError(err.message);  // Set the error message to show
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login / Sign Up</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                />
                <button className="auth-btn" onClick={handleSignUp}>Sign Up</button>
                <button className="auth-btn" onClick={handleLogin}>Log In</button>
                <button className="auth-btn" onClick={handleLogout}>Log Out</button>

                {/* Display error message */}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default AuthForm;
