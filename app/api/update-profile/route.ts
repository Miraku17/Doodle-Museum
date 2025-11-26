import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = await createClient();

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, bio, avatarUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Artist name is required" }, { status: 400 });
    }

    let publicAvatarUrl = avatarUrl;

    // If avatarUrl is a base64 string (newly drawn), upload it
    if (avatarUrl && avatarUrl.startsWith('data:image')) {
      const timestamp = Date.now();
      const filePath = `avatars/${user.id}/${timestamp}.png`;

      // Convert base64 to blob (server-side handling needed, but here we can pass buffer or use a utility)
      // Since we are in Node/Edge runtime, we can convert base64 string to Buffer
      const base64Data = avatarUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      const { error: uploadError } = await supabase.storage
        .from("paintings") // Using 'paintings' bucket as decided
        .upload(filePath, buffer, {
          contentType: 'image/png',
          upsert: false,
        });

      if (uploadError) {
        console.error("Avatar upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("paintings").getPublicUrl(filePath);
      publicAvatarUrl = publicUrlData.publicUrl;
    }

    // Update profile in Supabase
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        artist_name: name,
        bio: bio,
        avatar_url: publicAvatarUrl,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      profile: {
        name,
        bio,
        avatarUrl: publicAvatarUrl
      }
    });

  } catch (err) {
    console.error("Internal server error during profile update:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
