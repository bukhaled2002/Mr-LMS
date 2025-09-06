import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-5 left-5",
        })}
      >
        <ArrowLeft />
        Go Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6 relative">
        {children}
      </div>
    </main>
  );
}
