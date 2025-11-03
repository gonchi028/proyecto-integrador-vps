'use server';
import 'server-only';
import { db } from '@/server/db';
import { user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getUsuarios() {
  return await db.query.user.findMany({
    orderBy: (user, { asc }) => [asc(user.id)],
  });
}

export async function createOrUpdateUser(userData: {
  id: string;
  email: string;
  name?: string;
  userName?: string;
  avatarUrl?: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userData.id),
    });

    if (existingUser) {
      // Update existing user
      return await db
        .update(user)
        .set({
          name: userData.name || existingUser.name,
          userName: userData.userName || existingUser.userName,
          avatarUrl: userData.avatarUrl || existingUser.avatarUrl,
          email: userData.email,
        })
        .where(eq(user.id, userData.id))
        .returning();
    } else {
      // Create new user
      return await db
        .insert(user)
        .values({
          id: userData.id,
          name: userData.name || 'Usuario',
          userName: userData.userName || userData.email.split('@')[0],
          avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
          email: userData.email,
        })
        .returning();
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}
