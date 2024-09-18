"use server";

import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { db } from "@/lib/database/index";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "@/auth";
import { userTable } from "@/lib/database/schema";
import { SignUpSchema, SignUpValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Resend } from "resend";
import { VerifyEmail } from "@/lib/emails";

interface ActionResult {
  error: string;
}

export async function signupAction(
  credentials: SignUpValues,
): Promise<ActionResult> {
  try {
    // Validate front end data
    const { username, email, password } = SignUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    const exisitingUser = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    if (exisitingUser) {
      return {
        error: "Username already in use.",
      };
    }

    const existingEmail = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingEmail) {
      return {
        error: "Email already in use.",
      };
    }

    await db.insert(userTable).values({
      id: userId,
      username: username,
      email: email,
      password_hash: passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error; // redirect function naturally throws an RedirectError
    console.error(error);
    return {
      error: "Something went wrong. Please try again.", // for example, server down. Wont happen for serverless
    };
  }
}
