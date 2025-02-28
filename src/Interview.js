import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Interview.css"; // ✅ Applying previous styles

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewType = location.state?.type || "technical";

  const technicalTopics = [
    "C",
    "Java",
    "Python",
    "Data Structures (Arrays, Linked Lists, Stacks, Queues, Hash Tables, Trees, Graphs)",
    "Algorithms (Sorting, Searching, Recursion, Dynamic Programming, Greedy Algorithms)",
    "Time & Space Complexity Analysis (Big O Notation)",
    "Object-Oriented Programming (OOP) (Classes, Inheritance, Polymorphism, Encapsulation, Abstraction)",
    "Databases & SQL",
    "Web Development",
    "Operating Systems",
    "Computer Networks"
  ];

  const behavioralTopics = ["Behavioral"];

  const levels = ["Easy", "Medium", "Hard"];

  const [level, setLevel] = useState("Easy");
  const [topic, setTopic] = useState(technicalTopics[0]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Fetch AI-generated question
  const fetchQuestion = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate-question", {
        topic: interviewType === "behavioral" ? "behavioral" : topic,
        level: interviewType === "behavioral" ? "" : level,
      });
      setQuestion(response.data.question);
      setAnswer("");
      setFeedback("");
      setTimeLeft(180);
      setIsTimerRunning(true);
      setCurrentQuestionIndex(previousQuestions.length);
    } catch (error) {
      console.error("❌ Error fetching question:", error);
    }
  }, [interviewType, topic, level, previousQuestions.length]);

  // Handle submitting answer
  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || answer.trim().toLowerCase() === "i don't know") {
      setFeedback("No answer provided.");
      setTotalScore((prevScore) => prevScore);
      setIsTimerRunning(false);
      return;
    }

    setIsTimerRunning(false);
    try {
      const response = await axios.post("http://localhost:5000/evaluate-answer", { question, answer });
      const { feedback, correctAnswer, score } = response.data;
      setFeedback(`Correct Answer: ${correctAnswer}<br>${feedback}`);
      const updatedPreviousQuestions = [...previousQuestions, { question, answer, feedback: `Correct Answer: ${correctAnswer}<br>${feedback}`, score }];
      setPreviousQuestions(updatedPreviousQuestions);
      setCurrentQuestionIndex(updatedPreviousQuestions.length - 1);
      setTotalScore((prevScore) => prevScore + score);
    } catch (error) {
      console.error("❌ Error retrieving feedback:", error);
    }
  }, [answer, question, previousQuestions]);

  // Handle auto submission when timer ends
  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isTimerRunning, handleSubmit]);

  // Stop interview & get summary
  const handleStopInterview = async () => {
    try {
      const response = await axios.post("http://localhost:5000/overall-feedback");
      setTotalScore(response.data.totalScore);
      setAttempts(response.data.attempts);
      setFeedback(response.data.feedback);
      setShowSummary(true);
    } catch (error) {
      console.error("❌ Error fetching overall feedback:", error);
    }
    navigate("/interviewtypeselection");
  };

  // Voice Input Handling
  const startRecording = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };

    recognition.onend = () => setIsRecording(false);
  };

  // Navigate to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = previousQuestions[currentQuestionIndex - 1];
      setQuestion(prevQuestion.question);
      setAnswer(prevQuestion.answer);
      setFeedback(prevQuestion.feedback);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < previousQuestions.length - 1) {
      const nextQuestion = previousQuestions[currentQuestionIndex + 1];
      setQuestion(nextQuestion.question);
      setAnswer(nextQuestion.answer);
      setFeedback(nextQuestion.feedback);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="interview-container">
      {!showSummary ? (
        <>
          <h2 className="title">AI Interview</h2>
          <div className="selection-container">
            <label htmlFor="topic">Topic:</label>
            <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {(interviewType === "behavioral" ? behavioralTopics : technicalTopics).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select><br></br>
            {interviewType !== "behavioral" && (
              <>
                <label htmlFor="level">Level:</label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
                  {levels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </>
            )}
          </div>
          <button className="btn start-btn" onClick={fetchQuestion}>Start Interview</button>
          {question && (
            <>
              <p className="question">{question}</p>
              <p className="timer">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            </>
          )}
          <textarea
            className="answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />
          <button className={`btn voice-btn ${isRecording ? "recording" : ""}`} onClick={startRecording}>
            {isRecording ? "🎙 Listening..." : "🎤 Use Voice Input"}
          </button>
          <button className="btn submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="btn previous-btn" onClick={handlePreviousQuestion} disabled={currentQuestionIndex <= 0}>Previous</button>
          <button className="btn next-btn" onClick={handleNextQuestion} disabled={currentQuestionIndex >= previousQuestions.length - 1}>Next</button>
          <button className="btn stop-btn" onClick={handleStopInterview}>Stop Interview</button>
          {feedback && <p className="feedback" dangerouslySetInnerHTML={{ __html: feedback }}></p>}
        </>
      ) : (
        <div className="summary-container">
          <h2 className="title">Interview Summary</h2>
          <p className="score">Total Score: {totalScore} / {attempts * 10}</p>
          <p className="summary-feedback">{feedback}</p>
          <button className="btn back-btn" onClick={() => navigate("/interviewtypeselection")}>Return</button>
        </div>
      )}
    </div>
  );
};
export default Interview;
