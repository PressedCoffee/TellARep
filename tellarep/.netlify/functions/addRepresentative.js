const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ewwwiomygdasknmerolc.supabase.co"; // replace with your Supabase project URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Ensure this environment variable is available in your serverless function context

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  console.log("Data received in addRepresentative:", event.body);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const receivedData = JSON.parse(event.body);

  const divisionsToUpsert = Object.entries(receivedData.divisions).map(
    ([ocdId, divisionDetails]) => ({
      ocd_id: ocdId,
      name: divisionDetails.name,
      alsoknownas: divisionDetails.aliases
        ? divisionDetails.aliases.join(", ")
        : null,
      created_at: new Date().toISOString(),
    })
  );

  console.log("Divisions to upsert:", divisionsToUpsert);

  try {
    let response = await supabase.from("divisions").insert(divisionsToUpsert);

    if (response.error && isDuplicateKeyError(response.error)) {
      for (let division of divisionsToUpsert) {
        response = await supabase
          .from("divisions")
          .update(division)
          .eq("ocd_id", division.ocd_id);
        if (response.error) {
          console.error("Error updating division:", response.error);
          throw response.error;
        }
      }
    }

    let { data: insertedOrExistingDivisions, error: fetchError } =
      await supabase
        .from("divisions")
        .select("*")
        .in(
          "ocd_id",
          divisionsToUpsert.map((d) => d.ocd_id)
        );

    if (fetchError) {
      console.error("Error fetching divisions after upsert:", fetchError);
      throw fetchError;
    }

    console.log("Full response from divisions upsert:", response);

    // Map divisionId for each office using insertedOrExistingDivisions
    const updatedOffices = receivedData.offices
      .map((office) => {
        const correspondingDivision = insertedOrExistingDivisions.find(
          (division) => division.ocd_id === office.divisionId
        );

        if (!correspondingDivision) {
          console.error(
            `No division found for office with divisionId: ${office.divisionId}`
          );
          return null;
        }

        return {
          ...office,
          divisionId: correspondingDivision.id,
        };
      })
      .filter(Boolean);

    // Insert offices
    const { data: insertedOffices, error: officesError } = await supabase
      .from("offices")
      .insert(
        updatedOffices.map((office) => ({
          name: office.name,
          divisionId: office.divisionId,
          levels: office.levels.join(", "),
          roles: office.roles.join(", "),
        }))
      );

    if (officesError) {
      throw officesError;
    }

    let { data: insertedOrExistingOffices } = await supabase
      .from("offices")
      .select("*")
      .in(
        "name",
        updatedOffices.map((office) => office.name)
      );

    // ... [previous code]

    // Prepare representatives data for insertion
    const representativesToInsert = receivedData.officials
      .map((official, index) => {
        const officeDetails = receivedData.offices.find(
          (office) =>
            office.officialIndices && office.officialIndices.includes(index)
        );

        if (!officeDetails) {
          console.error(
            "Failed to find office details for official:",
            official
          );
          return null; // return null if failed to find office details
        }

        const correspondingInsertedOffice = insertedOrExistingOffices.find(
          (io) => io.name === officeDetails.name
        );

        if (!correspondingInsertedOffice) {
          console.error("Failed to find inserted office for:", officeDetails);
          return null; // return null if failed to find inserted office
        }

        const address =
          official.address && official.address[0] ? official.address[0] : {};

        return {
          name: official.name,
          office_name: officeDetails.name, // Incorporate office name
          email: official.emails ? official.emails[0] : null,
          phone_number: official.phones ? official.phones[0] : null,
          party: official.party,
          photo_url: official.photoUrl || "",
          website: official.urls ? official.urls[0] : null,
          social_media: official.channels
            ? JSON.stringify(official.channels)
            : null,
          office_id: correspondingInsertedOffice.id,
          // Add address information
          locationName: address.locationName || "",
          address_line1: address.line1 || "",
          address_line2: address.line2 || "",
          address_line3: address.line3 || "",
          city: address.city || "",
          state: address.state || "",
          zip_code: address.zip || "",
        };
      })
      .filter(Boolean); // filter out any null values

    // Insert representatives into the database
    const { data: insertedReps, error: repsError } = await supabase
      .from("representatives")
      .insert(representativesToInsert);

    if (repsError) {
      console.error("Error inserting representatives:", repsError);
      throw repsError;
    }

    // Return the inserted data

    return {
      statusCode: 200,
      body: JSON.stringify({
        divisions: insertedOrExistingDivisions,
        offices: insertedOffices,
        representatives: insertedReps,
      }),
    };
  } catch (error) {
    console.error(
      "Error inserting representative data:",
      error.message,
      error.stack
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Internal Server Error: ${error.message}`,
      }),
    };
  }
};

function isDuplicateKeyError(error) {
  // This check might need to be adjusted based on the exact error message or code Supabase returns
  return error.message.includes("duplicate key");
}
