import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, artistName } = body;

    if (!email || !password || !artistName) {
      return NextResponse.json(
        { error: 'Email, password, and artist name are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          artist_name: artistName
        });

      if (profileError) {
        console.log("Error saving profile:", profileError);
        // We don't necessarily want to fail the whole signup if profile creation fails,
        // but we should probably let the client know or handle it.
        // For now, just logging as per user snippet logic style, 
        // but ideally we might want to return a warning or handle it more gracefully.
        // However, usually profile creation is critical. 
        // If profile creation fails (e.g. constraint violation), the user exists in Auth but not in public schema.
        
        return NextResponse.json(
            { 
                message: 'Sign up successful but profile creation failed.',
                user: data.user,
                profileError: profileError.message
            }, 
            { status: 200 } // Use 200 or 201? 200 is fine for now.
        );
      }
    }

    return NextResponse.json(
      { message: 'Sign up successful', user: data.user },
      { status: 200 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
