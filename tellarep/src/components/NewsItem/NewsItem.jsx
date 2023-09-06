import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactSlider from "react-slider";
import "./NewsItem.css";
import RepresentativeCard from "../RepresentativeCard/RepresentativeCard";
import { ReactComponent as TellarepLogoButton } from "../../images/TellarepLogoButton.svg";
import { supabase } from "../../supabaseClient"; // Import your Supabase client setup

const ControlledSlider = ({ value, onAfterChange }) => {
  //const stopPropagation = (e) => {
  //  e.stopPropagation();
  //};

  return (
    //<div
    //  onClick={stopPropagation}
    //  onMouseDown={stopPropagation}
    //  onMouseMove={stopPropagation}
    //  onMouseUp={stopPropagation}
    //  onTouchStart={stopPropagation}
    //  onTouchMove={stopPropagation}
    //  onTouchEnd={stopPropagation}
    //>
    <ReactSlider
      value={value}
      onAfterChange={onAfterChange}
      min={0}
      max={2}
      thumbClassName="thumb"
      trackClassName="track"
    />
    //</div>
  );
};

function NewsItem({ article }) {
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [isFinalized, setIsFinalized] = useState(false);
  const [viewpoint, setViewpoint] = useState(1); // 0 = Support, 1 = Neutral, 2 = Oppose
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEditedWarning, setShowEditedWarning] = useState(false);
  const [showRepresentatives, setShowRepresentatives] = useState(false);
  const [representatives, setRepresentatives] = useState([]);

  useEffect(() => {
    setEditedMessage(generatedMessage);
  }, [generatedMessage]);

  const handleArticleClick = () => {
    window.open(article.url, "_blank");
  };

  const handleTellARepClick = async (e) => {
    e.stopPropagation();
    const prompt = `Summarize concerns from the article "${article.title}" for a short letter to a representative.`;

    setLoading(true);
    try {
      const response = await axios.post("/.netlify/functions/chatGptHandler", {
        prompt: prompt,
      });
      const message = response.data.message;
      setGeneratedMessage(message);
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setLoading(false);
    }
  };

  const isMessageComplete = (message) => {
    const lastChar = message.slice(-1);
    return [".", "!", "?"].includes(lastChar);
  };

  const handleSliderChange = async (val) => {
    console.log("Slider changed to:", val);
    setViewpoint(val);

    const viewpointLabels = ["support", "neutral", "oppose"];
    const selectedViewpoint = viewpointLabels[val];

    // Create a new prompt to adjust the message
    const prompt = `Rewrite the following content with a complete ${selectedViewpoint} viewpoint on the issue. Ensure the message is clear and concise. Original content: "${generatedMessage}"`;

    // Use the ChatGPT API to get the adjusted message
    try {
      const response = await axios.post("/.netlify/functions/chatGptHandler", {
        prompt: prompt,
      });
      const newMessage = response.data.message;
      setEditedMessage(newMessage);
      if (!isMessageComplete(newMessage)) {
        setShowEditedWarning(true);
      } else {
        setShowEditedWarning(false);
      }
    } catch (error) {
      console.error("Error adjusting message:", error);
    }
  };

  const subject = "Urgent Concerns Regarding Tropical Storm Hilary's Impact";
  const body =
    "Your entire email body with special characters like & or % or '";

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const onSendMessage = (type) => {
    if (type === "email") {
      window.open(`mailto:?body=${editedMessage}`);
      // ... you can handle other types here as needed
    }
  };

  const handleGenerateXMessage = async () => {
    const xPrompt = `You are an expert Twitter bot. Distill this ${editedMessage}; into a concise message and with no salutations for Twitter.`;

    try {
      const response = await axios.post("/.netlify/functions/chatGptHandler", {
        prompt: xPrompt,
      });

      let xMessage = response.data.message; // Assuming the concise message is in the 'message' key of the response

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
        `https://twitter.com/intent/tweet?text=${xMessage}&hashtags=tellarep`
      );
    } catch (error) {
      console.error("Error generating X message:", error);
    }
  };

  /*
  const handleShareOnFacebook = () => {
    const appID = "968193114439707"; // replace with your app id
    const href = encodeURIComponent("window.location.href"); // the current page URL or any other link you wish to share
    const redirectURI = encodeURIComponent("http://localhost:8888"); // where to redirect after sharing, typically the same page

    const shareURL = `https://www.facebook.com/dialog/share?app_id=${appID}&display=popup&href=${href}&redirect_uri=${redirectURI}`;
  
    */

  const handleShareOnFacebook = () => {
    const appID = "968193114439707";
    const href = "https://www.google.com";
    const redirectURI = encodeURIComponent("http://localhost:8888");

    const shareURL = `https://www.facebook.com/dialog/share?app_id=${appID}&display=popup&href=${href}&redirect_uri=${redirectURI}`;
    window.open(shareURL, "_blank");
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

  const handleSendEmail = (e) => {
    e.stopPropagation();
    window.open(`mailto:?body=${editedMessage}`);
  };

  const handleShareOnX = () => {
    handleGenerateXMessage();
  };

  const handleShareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${editedMessage}`);
  };

  const getFilteredReps = async () => {
    console.log('Running getFilteredReps...')

    // get user id
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("user", user);

    if (user.id) {
      const { data: getZipCode, error: getZipCodeError } = await supabase
        .from("users")
        .select()
        .eq("user_id", user.id);

      if (getZipCodeError) console.log("getZipCodeError", getZipCodeError);
      console.log("getZipCode", getZipCode);

      if (getZipCode.length) {
        const { data: filteredReps, error: getFilteredRepsError } =
          await supabase
            .from("representatives")
            .select()
            .eq("zip_code", getZipCode[0].zip_code);

        console.log("filteredReps", filteredReps);
        setRepresentatives(filteredReps);

        if (getFilteredRepsError)
          console.log("getFilteredRepsError", getFilteredRepsError);
      }
    }
  };

  useEffect(() => {
    if (isFinalized) {
      // Get representatives from database using Netlify function
      // axios
      //   .get("/.netlify/functions/get-reps-from-db")
      //   .then((response) => {
      //     setRepresentatives(response.data);
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching representatives:", error);
      //   });

      // Get representatives from database using supabase directly
      getFilteredReps();
    }
  }, [isFinalized]);

  return (
    <div className="news-item">
      <img
        src={article.urlToImage}
        alt={article.title}
        onClick={handleArticleClick}
      />
      <h3 onClick={handleArticleClick}>{article.title}</h3>
      <p onClick={handleArticleClick}>{article.description}</p>
      <span>{article.source.name}</span>
      <span>{article.timestamp}</span>
      <div className="action-container">
        <TellarepLogoButton
          className="tellarep-button"
          onClick={handleTellARepClick}
        />
        <span className="tellarep-button-text">
          Write to your representative about this!
        </span>
      </div>
      {loading && <p>Loading...</p>}
      {generatedMessage && (
        <div>
          <h3>Generated Message:</h3>
          <textarea
            onClick={(e) => e.stopPropagation()}
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
          />
          {!isMessageComplete(generatedMessage) && (
            <p className="warning">
              Warning: This message might be incomplete. Please review and
              adjust as necessary.
            </p>
          )}
        </div>
      )}

      {/* This is where the MessageModal content is integrated */}
      {generatedMessage && !isFinalized && (
        <>
          <h3>Edit Your Draft:</h3>
          <ControlledSlider
            value={viewpoint}
            onAfterChange={handleSliderChange}
          />
          <div className="labels">
            <span>Support</span>
            <span>Neutral</span>
            <span>Oppose</span>
          </div>
          <textarea
            onClick={(e) => e.stopPropagation()}
            value={editedMessage}
            onChange={handleEditChange}
          />
          {showEditedWarning && (
            <p className="warning">
              Warning: This message might be incomplete. Please review and
              adjust as necessary.
            </p>
          )}
          <button
            className="button-style"
            onClick={(e) => {
              e.stopPropagation();
              handleFinalize();
            }}
          >
            Finalize Message
          </button>
        </>
      )}
      {isFinalized && (
        <>
          <h3>Final Message:</h3>
          <textarea value={editedMessage} readOnly />
          <button
            className="button-style"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyToClipboard();
            }}
          >
            Copy to Clipboard
          </button>
          <button className="button-style" onClick={(e) => handleSendEmail(e)}>
            Send Email
          </button>
          <button className="button-style" onClick={handleShareOnX}>
            Share on X (Twitter)
          </button>
          <button className="button-style" onClick={handleShareOnFacebook}>
            Share on Facebook
          </button>
          <button className="button-style" onClick={handleShareOnWhatsApp}>
            Share on WhatsApp
          </button>
        </>
      )}
      <div className="representatives-container">
        {isFinalized &&
          representatives.map((rep) => (
            <RepresentativeCard
              key={rep.id}
              rep={rep}
              message={editedMessage}
              onSendMessage={onSendMessage}
            />
          ))}
      </div>
    </div>
  );
}

export default NewsItem;
