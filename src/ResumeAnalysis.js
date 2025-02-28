import React, { useState } from "react";
import axios from "axios";

const ResumeAnalysis = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setResult(null);
        setError("");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please upload a resume file (PDF only).");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/analyze-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data) {
                setResult(response.data.feedback);
            } else {
                setError("No analysis results received. Try again.");
            }
        } catch (err) {
            setError("Error analyzing resume. Ensure backend is running.");
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Resume Analyzer</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && (
                <div>
                    <h3>Analysis Result:</h3>
                    <p dangerouslySetInnerHTML={{ __html: result }}></p>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalysis;
