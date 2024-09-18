import SearchField from "@/components/SearchField";

import Link from "next/link";
import UserButton from "./UserButton";
import { Logo } from "@/components/Logo";
import MaxWidthWrapper from "@/components/MaxWithWrapper";

export default function Navbar() {
  return (
    <div className="bg-card pb-3 pt-5 shadow-sm">
      <MaxWidthWrapper className="flex flex-wrap items-center">
        <Link
          href="/"
          className="mr-16 flex items-center text-2xl font-bold text-primary"
        >
          <p>Rate It</p>
          <Logo className="w-[40px]" />
        </Link>

        <SearchField />
        <UserButton className="mr-4 ms-auto sm:mr-0" />
      </MaxWidthWrapper>
    </div>
  );
}
