import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { user } from '@/server/db/schema';

export async function GET() {
  try {
    const supabase = createClient();
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch user data from our custom database
    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, authUser.id),
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      userName: dbUser.userName,
      avatarUrl: dbUser.avatarUrl,
      email: dbUser.email,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
