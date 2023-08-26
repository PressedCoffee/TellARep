import React from "react";

const PhoneScriptModal = ({ rep, message, isVisible, onClose }) => {
  // Sample guidance for making effective calls
  const callGuidance =
    "Be polite and concise. Start by introducing yourself and mention where you're from. Clearly state the reason for your call and use the provided script as a guide. Thank the representative or their staff for their time.";

  if (!isVisible) return null; // Don't render the modal if it's not visible

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          maxHeight: "80vh", // Set max height
          overflowY: "auto", // Enable vertical scrolling
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <button onClick={onClose} style={{ float: "right" }}>
          Close
        </button>
        <h2>Contact Info</h2>
        <p>Name: {rep.name}</p>
        <p>Office: {rep.office_name}</p>
        <p>Phone: {rep.phone_number}</p>
        <hr />
        <h2>Phone Script</h2>
        <p>{message}</p>
        <hr />
        <h2>Guide for Making the Call</h2>
        <p>{callGuidance}</p>
      </div>
    </div>
  );
};

export default PhoneScriptModal;
