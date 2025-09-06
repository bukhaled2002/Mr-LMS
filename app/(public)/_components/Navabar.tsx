"use client";
import { ThemeToggle } from "@/components/ui/mode-toggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];
export default function Navabar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-[backdrop-filter]:bg-backgrount/60 p-4 min-h-16">
      <div className="container m-auto flex items-center gap-4">
        <Link href="/" className="font-bold mr-4">
          MR LMS
        </Link>
        {/* desktop nav  */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between gap-4">
          <div className="flex items-center  space-x-2">
            {navigationItems.map((item, index) => (
              <Link key={index} href={item.href} className="">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            {isPending ? null : session?.user ? (
              <UserDropdown
                email={session.user.email}
                name={session.user.name}
              />
            ) : (
              <></>
            )}
          </div>
        </nav>
        {/* mobile nav  */}
        <div className="sm:hidden"></div>
      </div>
    </header>
  );
}
