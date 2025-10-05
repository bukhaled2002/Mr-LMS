"use client";
import { ThemeToggle } from "@/components/ui/mode-toggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];
export default function Navabar() {
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
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
              <Link
                key={index}
                href={item.href}
                className={cn(
                  currentPath === item.href.split("/")[1] ? "text-primary" : "",
                  "px-3 py-2 hover:bg-accent rounded-md transition-colors"
                )}
              >
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
                image={session.user?.image || ""}
              />
            ) : (
              <></>
            )}
          </div>
        </nav>
        {/* Mobile nav */}
        <div className="md:hidden flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          {!isPending && session?.user && (
            <UserDropdown
              email={session.user.email}
              name={session.user.name}
              image={session.user?.image || ""}
            />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="absolute md:hidden border-t mt-4 bg-background/90 w-full shadow-lg">
          <nav className="container m-auto py-2 flex flex-col space-y-3">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="px-3 py-2 hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
