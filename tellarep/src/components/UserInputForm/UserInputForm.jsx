import React, { useState } from "react";

function UserInputForm({ onGenerate }) {
  const [issue, setIssue] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [mainPoint, setMainPoint] = useState("");
  const [messageType, setMessageType] = useState("Message");

  const handleGenerateClick = () => {
    onGenerate({
      issue: issue === "Other" ? customIssue : issue,
      mainPoint,
      messageType,
    });
  };

  return (
    <div className="input-form">
      <h2>Express Your Concern</h2>
      <label>
        What issue are you concerned about?
        <select value={issue} onChange={(e) => setIssue(e.target.value)}>
          <option value="Environment">Environment</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </label>
      {issue === "Other" && (
        <label>
          Please specify:
          <input
            type="text"
            value={customIssue}
            onChange={(e) => setCustomIssue(e.target.value)}
          />
        </label>
      )}
      <label>
        What's your main point or message?
        <textarea
          value={mainPoint}
          onChange={(e) => setMainPoint(e.target.value)}
        />
      </label>
      <label>
        Choose the type of message:
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
        >
          <option value="Concise Message">Letter</option>
          <option value="Concise Message">Email</option>
          <option value="Concise Message">Phone Script</option>
          <option value="Social Media Post">Social Media Post</option>
        </select>
      </label>
      <button onClick={handleGenerateClick}>Generate Message</button>
    </div>
  );
}

export default UserInputForm;
