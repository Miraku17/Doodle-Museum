import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = await createClient();

  try {
    // Fetch all doodles and optionally join profiles
    const { data: doodles, error: doodlesError } = await supabase
      .from('doodles')
      .select(`
    id,
    title,
    description,
    image_url,
    votes_count,
    created_at,
    profiles:user_id (
      artist_name
    )
  `)
      .order("created_at", { ascending: false });

    if (doodlesError) {
      console.error("Error fetching all doodles:", doodlesError);
      return NextResponse.json(
        { error: "Failed to fetch doodles" },
        { status: 500 }
      );
    }

    // Map to frontend Painting type
    const paintings = doodles.map((doodle) => {
      const profile = Array.isArray(doodle.profiles) ? doodle.profiles[0] : doodle.profiles;
      return {
        id: doodle.id,
        dataUrl: doodle.image_url,
        title: doodle.title,
        artist: profile?.artist_name || "Unknown Artist",
        votes: doodle.votes_count || 0,
        timestamp: new Date(doodle.created_at).getTime(),
        description: doodle.description,
      };
    });

    return NextResponse.json({ paintings });
  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
