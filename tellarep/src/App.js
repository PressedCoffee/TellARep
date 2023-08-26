import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header/Header";
import NewsFeed from "./components/NewsFeed/NewsFeed";
import Profile from "./components/Profile/Profile";
import ChatGPTForm from "./components/ChatGPTForm/ChatGPTForm"; // Adjust the path based on your directory structure
import FeedbackModal from "./components/FeedbackModal/FeedbackModal";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = supabase.auth.session; // get current session
    setCurrentUser(session?.user ?? null);
    setIsAuthenticated(!!session?.user);

    console.log("Initial Supabase session:", session);
    console.log("Initial Supabase user:", session?.user);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);

        console.log("Auth state change Supabase session:", session);
        console.log("Auth state change Supabase user:", session?.user);
        console.log("isAuthenticated:", isAuthenticated);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            {/*<Route path="/feedback" element={<FeedbackModal />}*/}
            <Route path="/profile" element={<Profile user={currentUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
            {/* add more routes as needed */}
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
