"use client";

import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center space-x-2 px-4">
      <Image
        src={"/logos/obby/obby-logo-min.webp"}
        className="logo"
        alt="Obby Logo"
        width={28}
        height={28}
      />
      <span className="text-foreground text-xl md:text-2xl font-bold font-mono">
        Obby
      </span>
    </div>
  );
}
