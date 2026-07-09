import { supabase } from "./supabase";

export async function syncUserProfile(user: any) {
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  // Try to fetch existing profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 indicates no rows found in PostgREST, which is expected for new users
    console.error("Error fetching user profile from Supabase:", error);
    return null;
  }

  if (!profile) {
    // Insert a new profile decoupled from Supabase native auth
    const newProfile = {
      id: user.id,
      full_name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous User",
      email: email,
      avatar_url: user.imageUrl || null,
      role: "user" as const,
    };

    const { data: insertedProfile, error: insertError } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (insertError) {
      console.error("Error creating user profile in Supabase:", insertError);
      return null;
    }
    return insertedProfile;
  }

  return profile;
}
