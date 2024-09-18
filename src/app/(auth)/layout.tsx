import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) redirect("/"); // if user is true, redirect happends the execution of code will end on this line.

  // for client side cache, put in context provider to make it available for all child client component
  return <>{children}</>;
}
