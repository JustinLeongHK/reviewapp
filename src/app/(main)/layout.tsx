import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MaxWidthWrapper from "@/components/MaxWithWrapper";
import Menubar from "./Menubar";
import TrendsSideBar from "@/components/TrendsSideBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  // This is not the real validation, the real validation happens in API routes
  if (!session.user) redirect("/sign-in"); // if is null, redirect happends the execution of code will end on this line.

  return (
    <SessionProvider value={session}>
      <Navbar />
      <MaxWidthWrapper className="pt-5">
        <div className="flex w-full gap-5">
          {" "}
          <Menubar className="h-max w-max space-y-5 rounded-md bg-secondary p-3" />
          {children}
          <TrendsSideBar />
        </div>
      </MaxWidthWrapper>
    </SessionProvider>
  );
}
