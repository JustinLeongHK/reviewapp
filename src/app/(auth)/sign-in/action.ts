"use server";

import { lucia } from "@/auth";
import { db } from "@/lib/database";
import { SignInSchema, SignInValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ActionResult {
  error: string;
}

export async function signinAction(
  credentials: SignInValues,
): Promise<ActionResult> {
  try {
    // Validate front end data
    const { email, password } = SignInSchema.parse(credentials);

    const existingUser = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!existingUser) {
      return {
        error: "Incorrect username or password",
      };
    }
    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
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
