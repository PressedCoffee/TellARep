// FeedbackModal.jsx

import React, { useState } from "react";
import "./FeedbackModal.css";

const FeedbackModal = ({ onClose }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    // For now, we will simply log the feedback.
    // Later, you can integrate this with a backend or email service.
    console.log("Feedback received:", feedback);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Provide Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ width: "100%", minHeight: "100px" }}
          placeholder="Enter your feedback here..."
        ></textarea>
        <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
          Submit
        </button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
