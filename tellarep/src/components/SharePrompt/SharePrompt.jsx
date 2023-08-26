import React from "react";
import "./SharePrompt.css";
import { FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";

function SharePrompt() {
  const shareURL = "https://tellarep.com";

  return (
    <div className="share-prompt">
      <div className="share-prompt-content">
        Found this interesting? Share with your friends!
      </div>
      <div className="share-prompt-action">
        <a
          href={`https://twitter.com/share?url=${shareURL}&text=Check out this cool app!`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
        >
          <FaFacebook />
        </a>
        <a
          href={`mailto:?subject=Check out this app&body=${shareURL}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Email to a friend"
        >
          <FaEnvelope />
        </a>
      </div>
    </div>
  );
}

export default SharePrompt;
