import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./Poll.css";

function Poll() {
  const options = [
    "See upcoming votes and how reps vote",
    "Automated email handling",
    "News-based opinion polls",
    "More customization options",
    // ... add more options as needed
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(
    localStorage.getItem("hasVoted") === "true"
  );
  const [optionCounts, setOptionCounts] = useState(
    new Array(options.length).fill(0)
  );

  const handleSubmit = async () => {
    // Fetch the existing count for the selected option
    const { data, error } = await supabase
      .from("poll_results")
      .select("vote_count")
      .eq("option_text", selectedOption);

    if (error) {
      console.error("Error fetching poll results:", error);
      return;
    }

    let newCount = 1; // Default to 1 if no previous data exists
    if (data && data.length) {
      newCount = data[0].vote_count + 1;
    }

    // Update the count or insert a new record if it doesn't exist
    const { upsertError } = await supabase
      .from("poll_results")
      .upsert([{ option_text: selectedOption, vote_count: newCount }]);

    if (upsertError) {
      console.error("Error updating poll results:", upsertError);
      return;
    }

    // Refresh the displayed poll results (you'll implement this next)
    fetchPollResults();

    // Mark as submitted
    setSubmitted(true);

    // Mark as submitted in local storage
    localStorage.setItem("hasVoted", "true");
  };

  const fetchPollResults = async () => {
    const { data, error } = await supabase.from("poll_results").select("*");

    if (error) {
      console.error("Error fetching poll results:", error);
      return;
    }

    // Map the returned data to your state format
    const newCounts = options.map((option) => {
      const match = data.find((record) => record.option_text === option);
      return match ? match.vote_count : 0;
    });

    setOptionCounts(newCounts);
  };

  // Fetch the poll results when the component mounts
  useEffect(() => {
    fetchPollResults();
  }, []);

  if (submitted) {
    return (
      <div className="poll-container">
        <h5>Results:</h5>
        {options.map((option, index) => (
          <div key={index}>
            {option}: {optionCounts[index]} votes
          </div>
        ))}
        <div>Thank you for your feedback!</div>
      </div>
    );
  }

  return (
    <div className="poll-container">
      <h4>Which feature would you like to see next?</h4>
      <div>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={option}
              name="featurePoll"
              value={option}
              onChange={() => setSelectedOption(option)}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Poll;
