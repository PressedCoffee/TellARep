import { supabase } from "../../supabaseClient"; // Import your Supabase client setup

export const fetchZipCode = async (userId) => {
  let { data, error } = await supabase
    .from("users")
    .select("zip_code")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user's zip code:", error);
    return null;
  }

  return data[0]?.zip_code;
};
