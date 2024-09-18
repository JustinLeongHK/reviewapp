// This context provider will provide the user details without prop drilling
// In addition, using the session provider we will not need to check if the session is null or not everytime when we call validate request
"use client";

import { Session, User } from "lucia";
import { createContext, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

// The reason why is there NULL below is because we need to create the context outside of the component, we don't have the session here yet. Session can only be created inside the component
const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// custom hook to deal with NULL session, only need to check once as compared to checking it in every component.
// Since it is a custom hook, it must start with "use"
export function useSession() {
  const context = useContext(SessionContext);

  if (!context)
    throw new Error("useSession must be used within a SessionProvider");

  return context;
}
