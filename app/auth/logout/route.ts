import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('Supabase sign out error:', signOutError);
      return NextResponse.json(
        { error: signOutError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
