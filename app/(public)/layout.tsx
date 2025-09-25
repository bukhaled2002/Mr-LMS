import React, { ReactNode } from "react";
import Navabar from "./_components/Navabar";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navabar />
      <main className="container m-auto px-4 md:px-6 lg:px-8 mb-20">
        {children}
      </main>
    </div>
  );
}
