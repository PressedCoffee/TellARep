import React, { useState } from "react";
import {
  FaTwitter,
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaPenNib,
} from "react-icons/fa";
import axios from "axios";
import "./RepresentativeCard.css";
import PhoneScriptModal from "../PhoneScriptModal/PhoneScriptModal";

const RepresentativeCard = ({ rep, message, onSendMessage }) => {
  const imageUrl = rep.photo_url || "/logo.svg";

  const handleEmailClick = () => {
    onSendMessage("email");
  };

  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handlePhoneScriptClick = () => {
    setShowPhoneModal(true);
  };

  const [showLetterModal, setShowLetterModal] = useState(false);

  const handleWriteLetterClick = () => {
    setShowLetterModal(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Extract address and message content
    const addressContent = document.querySelector(".rep-address").outerHTML;
    const rawMessage = document.querySelector("textarea").value;
    const formattedMessage = rawMessage
      .split("\n")
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
    const currentDate = new Date().toLocaleDateString();
    const messageContent = `<p>Date: ${currentDate}</p>${formattedMessage}`;

    printWindow.document.write("<html><head><title>Print Letter</title>");
    printWindow.document.write(
      '<link rel="stylesheet" type="text/css" href="path_to_your_css_file.css">'
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(addressContent);
    printWindow.document.write(messageContent);
    printWindow.document.write(
      '<button class="no-print" onclick="window.print()">Print</button>'
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
  };

  const handleGenerateXMessageForRep = async (twitterHandle) => {
    const xPrompt = `You are an expert Twitter bot. Distill this ${message} into a concise message for Twitter. Do not use salutations.`;

    try {
      const response = await axios.post("/.netlify/functions/chatGptHandler", {
        prompt: xPrompt,
      });

      let xMessage = `@${twitterHandle} ${response.data.message}`; // Prepend the representative's Twitter handle

      // Check if the hashtag is missing
      if (!xMessage.includes("#tellarep")) {
        xMessage += " #tellarep";
      }

      // Truncate message if it exceeds 280 characters
      if (xMessage.length > 280) {
        xMessage = xMessage.substring(0, 277) + "...";
      }

      // Now, open Twitter with this message
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(xMessage)}`
      );
    } catch (error) {
      console.error("Error generating X message:", error);
    }
  };

  const socialMediaArray = JSON.parse(rep.social_media || "[]");

  return (
    <div className="rep-card">
      <img className="rep-image" src={imageUrl} alt={rep.name} />
      <div className="rep-details">
        <h2>{rep.name}</h2>
        <p>Office: {rep.office_name}</p>
        <p>Party: {rep.party}</p>
        {showLetterModal && (
          <div className="letter-modal">
            <div className="letter-content no-print-break">
              <button onClick={() => setShowLetterModal(false)}>Close</button>
              <h4>Address:</h4>
              <div className="rep-address">
                <p>{rep.name}</p>
                <p>{rep.office_name}</p>
                {rep.address_line1 && <p>{rep.address_line1}</p>}
                {rep.address_line2 && <p>{rep.address_line2}</p>}
                {rep.address_line3 && <p>{rep.address_line3}</p>}
                <p>
                  {rep.city}, {rep.state} {rep.zip_code}
                </p>
              </div>
              <textarea placeholder="Please paste your message from clipboard."></textarea>
              <button onClick={handlePrint}>Print</button>
            </div>
          </div>
        )}

        <div className="contact-options">
          <button onClick={handleWriteLetterClick} title="Write Letter">
            <FaPenNib />
          </button>
          {rep.email && (
            <button onClick={handleEmailClick} title="Send Email">
              <FaEnvelope />
            </button>
          )}
          {showPhoneModal && (
            <PhoneScriptModal
              rep={rep}
              message={message}
              isVisible={showPhoneModal}
              onClose={() => setShowPhoneModal(false)}
            />
          )}
          {rep.phone_number && (
            <button onClick={handlePhoneScriptClick} title="Phone Script">
              <FaPhone />
            </button>
          )}

          {socialMediaArray.map((sm) => {
            if (sm.type === "Twitter") {
              return (
                <a
                  href="#!"
                  onClick={() => handleGenerateXMessageForRep(sm.id)}
                  title="Twitter"
                >
                  <FaTwitter />
                </a>
              );
            }
            if (sm.type === "Facebook") {
              return (
                <a
                  href={`https://facebook.com/${sm.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                >
                  <FaFacebook />
                </a>
              );
            }
            return null;
          })}
        </div>

        {rep.website && (
          <span class="website-link-tooltip">
            <p>
              Website:
              <a href={rep.website} target="_blank" rel="noopener noreferrer">
                {rep.website}
              </a>
            </p>
            <span class="tooltip-text">Preferred method of communication!</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default RepresentativeCard;
