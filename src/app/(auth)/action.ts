"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/auth";
import { db } from "@/lib/database";
import { verificationTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import { alphabet, generateRandomString } from "oslo/crypto";
import { createDate, TimeSpan } from "oslo";

export async function signoutAction() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/sign-in");
}

// export async function generateEmailVerificationCode(
//   userId: string,
//   email: string,
// ): Promise<string> {
//   await db
//     .delete(verificationTable)
//     .where(eq(verificationTable.userId, userId));
//   const code = generateRandomString(5, alphabet("0-9"));
//   await db.insert(verificationTable).values({
//     userId,
//     email,
//     code,
//     expiresAt: createDate(new TimeSpan(15, "m")), // 15 minutes
//   });
// }
