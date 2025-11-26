import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user's doodles
    const { data: doodles, error: doodlesError } = await supabase
      .from("doodles")
      .select("*")
      .eq("user_id", user.id)
      .order('created_at', { ascending: false });

    if (doodlesError) {
      console.error("Error fetching doodles:", doodlesError);
      return NextResponse.json({ error: "Failed to fetch doodles" }, { status: 500 });
    }

    // Fetch user profile name for the artist field
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("artist_name")
        .eq("id", user.id)
        .single();
    
    const artistName = profile?.artist_name || 'Unknown Artist';

    // Map to frontend structure
    const paintings = doodles.map(d => ({
        id: d.id,
        dataUrl: d.image_url,
        title: d.title,
        artist: artistName,
        votes: d.votes || 0,
        timestamp: new Date(d.created_at).getTime(),
        description: d.description,
        critique: d.critique
    }));

    // Calculate stats
    const totalArtworks = doodles.length;
    const totalVotes = doodles.reduce((acc, curr) => acc + (curr.votes || 0), 0);
    const avgVotes = totalArtworks > 0 ? Math.round(totalVotes / totalArtworks) : 0;

    return NextResponse.json({ 
      paintings,
      stats: {
        totalArtworks,
        totalVotes,
        avgVotes
      }
    });

  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
