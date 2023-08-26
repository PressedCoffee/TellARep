import React, { useEffect } from "react";
import { supabase } from "../supabaseClient";

function Login() {
  const signInWithGoogle = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: "google",
    });
    console.log("User:", user);
    console.log("Session:", session);
    console.log("Error:", error);
  };

  useEffect(() => {
    // Listen for the SIGNED_IN event
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);

        if (event === "SIGNED_IN") {
          console.log("Handling SIGNED_IN event...");

          // The user has signed in
          const user = session.user;

          // Check if the user exists in the users table
          const { data, error } = await supabase
            .from("users")
            .select("user_id")
            .eq("user_id", user.id);

          console.log("User check data:", data);
          console.log("User check error:", error);

          if (!data.length) {
            console.log("Inserting user...");

            // If the user doesn't exist in the users table, insert a new entry
            const { error: insertError } = await supabase
              .from("users")
              .insert([{ user_id: user.id }]);

            console.log("Insert error:", insertError);
          }
        }
      }
    );

    // Cleanup the listener when the component is unmounted
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default Login;
