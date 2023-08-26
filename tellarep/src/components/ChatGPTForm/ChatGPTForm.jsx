import React, { useState } from "react";
import axios from "axios";
import MessageModal from "../MessageModal/MessageModal";
import "./ChatGPTForm.css";
import UserInputForm from "../UserInputForm/UserInputForm";

function ChatGPTForm() {
  const [userInput, setUserInput] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInputForm, setShowInputForm] = useState(true);

  const createPromptFromFormData = (formData) => {
    const { issue, mainPoint, messageType } = formData;

    let context = "";

    switch (issue) {
      case "Education":
        context = "Emphasize its relevance in today's educational landscape.";
        break;
      // Add more cases for other issues if needed.
      default:
        context = "";
    }

    let style = "";
    switch (messageType) {
      case "Letter":
        style = "Craft a persuasive letter";
        break;
      case "Email":
        style = "Draft an email";
        break;
      case "Phone Script":
        style = "Write a phone script";
        break;
      case "Social Media Post":
        style = "Compose a social media post";
        break;
      default:
        style = "Draft a message";
    }

    return `Summarize concerns about ${mainPoint}. Emphasize ${context}.`;
  };

  const handleStructuredInputSubmit = (formData) => {
    console.log(formData);

    const prompt = createPromptFromFormData(formData);
    setUserInput(prompt);
    setShowInputForm(false);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/.netlify/functions/chatGptHandler", {
        prompt: userInput,
      });
      setGeneratedMessage(response.data.message);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching from API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatGPTForm">
      {showInputForm ? (
        <UserInputForm onGenerate={handleStructuredInputSubmit} />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userInput">Detailed Opinion:</label>
              <textarea
                id="userInput"
                value={userInput}
                onChange={handleInputChange}
                rows="5"
                placeholder="Type your opinion or question here..."
              />
            </div>
            <button type="submit" disabled={loading}>
              Generate Message
            </button>
          </form>
          {loading && <p>Loading...</p>}
          {showModal && (
            <MessageModal
              message={generatedMessage}
              onClose={() => setShowModal(false)}
              isVisible={showModal}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ChatGPTForm;
