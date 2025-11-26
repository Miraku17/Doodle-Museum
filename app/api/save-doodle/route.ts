import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // your server-side Supabase client
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST(req: Request) {
  const supabase = await createClient(); // server-side client

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData(); // for multipart/form-data

  const title = body.get("title") as string;
  const userDescription = body.get("description") as string;
  const artCritique = body.get("critique") as string; // Changed 'description' to 'critique' to match project's terminology
  const imageDataUrl = body.get("file") as string; // This will be the base64 data URL

  if (!imageDataUrl || !title) {
    return NextResponse.json({ error: "Missing title or image data" }, { status: 400 });
  }

  try {
    // Convert base64 Data URL to Blob for upload
    const base64Response = await fetch(imageDataUrl);
    const blob = await base64Response.blob();
    
    // Upload to Supabase Storage
    const timestamp = Date.now();
    const filePath = `paintings/${user.id}/${timestamp}.png`;

    const { error: uploadError } = await supabase.storage
      .from("artworks") // Using the artworks bucket with paintings folder
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/png',
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("artworks").getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    // Insert into doodles table
    const { error: insertError } = await supabase.from("doodles").insert({
      user_id: user.id,
      title,
      description: userDescription,
      image_url: publicUrl,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Failed to save doodle metadata" }, { status: 500 });
    }

    return NextResponse.json({ success: true, image_url: publicUrl });
  } catch (err) {
    console.error("Internal server error during doodle save:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
