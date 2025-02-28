import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InterviewTypeSelection.css";

const InterviewType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");

  const handleSelect = (type) => {
    setSelectedType(type);
    // Pass the interview type in lowercase
    const lowerType = type.toLowerCase();
    setTimeout(() => {
      navigate("/interview", { state: { type: lowerType } });
    }, 500);
  };

  return (
    <div className="interview-type-container">
      <div className="interview-type-box">
        <h2>Select Interview Type</h2>
        <p>Choose the type of interview you want to attempt.</p>
        <div className="button-group">
          <button
            className={`interview-btn behavioral ${selectedType === "Behavioral" ? "selected" : ""}`}
            onClick={() => handleSelect("Behavioral")}
          >
            Behavioral
          </button>
          <button
            className={`interview-btn technical ${selectedType === "Technical" ? "selected" : ""}`}
            onClick={() => handleSelect("Technical")}
          >
            Technical
          </button>
          <button
            className={`interview-btn both ${selectedType === "Both" ? "selected" : ""}`}
            onClick={() => handleSelect("Both")}
          >
            Both
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewType;
