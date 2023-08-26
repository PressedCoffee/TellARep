import React, { useState, useEffect } from "react";
import "./Header.css";
import { supabase, signInWithGoogle, logout } from "../../supabaseClient";
import { Link } from "react-router-dom";

function Header() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setCurrentUser(session.user);

          // Check user in DB and insert if not exists
          await createUserIfNotExists(session.user);
        } else {
          setCurrentUser(null);
        }
        console.log(`Auth event: ${event} Session: ${session}`);
      }
    );

    // Cleanup
    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  async function createUserIfNotExists(user) {
    // Check for user's existence based on the 'user_id' column
    const { data, error } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    // If user doesn't exist, insert them into the 'users' table
    if (!data) {
      // Insert only into the 'user_id' and 'created_at' columns
      const { error: insertError } = await supabase.from("users").insert([
        {
          user_id: user.id,
          created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting user:", insertError);
      }
    }
  }

  return (
    <header className="header-container">
      <img src="/logo.svg" alt="TellARep Logo" className="logo" />
      <nav className="nav-container">
        <ul className="nav-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          {/*<li>
            <Link to="/FeedbackModal">Feedback</Link>
  </li>*/}
          <li>
            <Link to="/profile">Profile</Link> {/* Add this line */}
          </li>
          {currentUser ? (
            <>
              <li>Hello, {currentUser.email}</li>

              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={signInWithGoogle}>Login with Google</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
