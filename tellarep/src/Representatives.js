import React, { useEffect, useState } from "react";

function Representatives() {
  const [officials, setOfficials] = useState([]);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/civicinfo/v2/representatives?address=YOUR_ADDRESS&key=YOUR_GOOGLE_CIVIC_API_KEY`
    )
      .then((response) => response.json())
      .then((data) => {
        setOfficials(data.officials);
        setOffices(data.offices);
      });
  }, []);

  return (
    <div>
      {offices.map((office, index) => (
        <div key={index}>
          <h2>{office.name}</h2>
          {office.officialIndices.map((i) => {
            const official = officials[i];
            return (
              <div key={i}>
                <h3>{official.name}</h3>
                {official.emails &&
                  official.emails.map((email, emailIndex) => (
                    <p key={emailIndex}>{email}</p>
                  ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Representatives;
