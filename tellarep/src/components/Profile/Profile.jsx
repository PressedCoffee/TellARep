import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import ZipCodeComponent from "../ZipCodeComponent/ZipCodeComponent";
import RepresentativeCard from "../RepresentativeCard/RepresentativeCard";
import "./Profile.css";

function Profile({ user }) {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [repsUpdated, setRepsUpdated] = useState(false);
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (userData) {
      setFullName(userData.full_name || "");
      setAddressLine1(userData.user_address_line1 || "");
      setAddressLine2(userData.user_address_line2 || "");
      setCity(userData.user_city || "");
      setState(userData.user_state || "");
    }
  }, [userData]);

  useEffect(() => {
    setUserData(user);
    setLoading(false);
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchReps = async () => {
      if (userData) {
        const response = await fetch("/.netlify/functions/get-reps-from-db");
        const data = await response.json();
        if (data && data.length) {
          setData(data);
        } else {
          console.error("Error fetching representatives:", data.error);
        }
      }
    };
    fetchReps();
  }, [repsUpdated, userData]);

  const handleZipCodeSubmit = async (zipCode) => {
    // ... (the function remains unchanged)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("zipCode", zipCode);
    console.log("user", user);

    // get filtered reps
    if (user.id) {
      const { data: getFilteredReps, error } = await supabase
        .from("representatives")
        .select()
        .eq("zip_code", zipCode);

      console.log("getFilteredReps", getFilteredReps);
      setData(getFilteredReps)
    }
  };

  const handleUpdate = async () => {
    // ... (the function remains unchanged)
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <ZipCodeComponent onSubmit={handleZipCodeSubmit} />
          {/* ... rest of the JSX code ... */}
          {data &&
            data.map((rep) => (
              <RepresentativeCard
                key={rep.rep_id}
                rep={rep}
                userData={userData}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
