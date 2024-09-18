import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import { Metadata } from "next";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen w-full justify-between p-5">
      <div className="relative hidden h-full w-1/2 sm:block">
        <Image
          src="/sign-up.jpeg"
          alt=""
          className="w-1/2 overflow-hidden rounded-md object-cover shadow-md"
          fill
        />
      </div>
      <div className="flex h-full flex-col justify-start px-5 sm:w-1/2">
        <div className="flex space-x-5 pb-2">
          <h1 className="text-5xl font-bold text-primary">Rate It</h1>
          <Logo className="w-14" />
        </div>
        <p className="pb-5 text-muted-foreground">
          A platform to{" "}
          <span className="font-bold">discover and share honest reviews</span>{" "}
          about your favorite products.
        </p>
        <div className="h-[2px] bg-slate-300"></div>
        <div className="flex h-full flex-col items-center justify-center pt-3">
          <SignUpForm />

          <Link href="/sign-in">
            <Button variant="link" className="my-2">
              Already have an account? Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
