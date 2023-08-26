import axios from "axios";
import React, { useState, useEffect } from "react"; // Added useEffect here
import ReactSlider from "react-slider";
import "./MessageModal.css";

function MessageModal({ message, onClose, isVisible }) {
  const [editedMessage, setEditedMessage] = useState(message);
  const [isFinalized, setIsFinalized] = useState(false);
  const [viewpoint, setViewpoint] = useState(1); // 0 = Support, 1 = Neutral, 2 = Oppose

  useEffect(() => {
    setEditedMessage(message);
  }, [message]);

  const isMessageComplete = (message) => {
    const lastChar = message.slice(-1);
    return [".", "!", "?"].includes(lastChar);
  };

  const handleSliderChange = async (val) => {
    setViewpoint(val);

    const viewpointLabels = ["support", "neutral", "oppose"];
    const selectedViewpoint = viewpointLabels[val];

    // Create a new prompt to adjust the message
    const prompt = `Rewrite the following content with a complete ${selectedViewpoint} viewpoint on the issue. Ensure the message is clear and concise. Original content: "${message}"`;

    // Use the ChatGPT API to get the adjusted message
    try {
      const response = await axios.post("/.netlify/functions/chatGptHandler", {
        prompt: prompt,
      });
      const newMessage = response.data.message;
      setEditedMessage(newMessage); // Update the edited message content with the adjusted message
    } catch (error) {
      console.error("Error adjusting message:", error);
    }
  };

  const handleFinalize = () => {
    setIsFinalized(true);
  };

  const handleEditChange = (e) => {
    setEditedMessage(e.target.value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedMessage);
  };

  const handleSendEmail = () => {
    window.open(`mailto:?body=${editedMessage}`);
  };

  const handleShareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${editedMessage}&hashtags=tellarep`
    );
  };

  const handleShareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${editedMessage}`);
  };

  return (
    <div className="modalContent">
      {!isMessageComplete(editedMessage) && (
        <p className="warning">
          Warning: This message might be incomplete. Please review and adjust as
          necessary.
        </p>
      )}
      {isFinalized ? (
        <>
          <h3>Final Message:</h3>
          <textarea value={editedMessage} readOnly />
          {/* Buttons for Copy, Send, Share, etc. */}
          <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
          <button onClick={handleSendEmail}>Send Email</button>
          <button onClick={handleShareOnX}>Share on X</button>
          <button onClick={handleShareOnWhatsApp}>Share on WhatsApp</button>
        </>
      ) : (
        <>
          <h3>Drafted Message:</h3>
          <textarea value={message} readOnly />
          <h3>Edit Your Draft:</h3>
          <div>
            <ReactSlider
              value={viewpoint}
              onAfterChange={handleSliderChange} // Use handleSliderChange here
              min={0}
              max={2}
              thumbClassName="thumb"
              trackClassName="track"
            />
            <div className="labels">
              <span>Support</span>
              <span>Neutral</span>
              <span>Oppose</span>
            </div>
          </div>
          <textarea value={editedMessage} onChange={handleEditChange} />
          <button onClick={handleFinalize}>Finalize Message</button>
        </>
      )}
      <button onClick={onClose}>Return</button>
    </div>
  );
}

export default MessageModal;
