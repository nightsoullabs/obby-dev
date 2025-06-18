"use client";

import type React from "react";

import { Button } from "@/components/ui/button";

interface PricingButtonProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  planTitle: string;
}

export function PricingButton({
  children,
  variant = "default",
  planTitle,
}: PricingButtonProps) {
  const handleClick = () => {
    console.log(`Selected plan: ${planTitle}`);
    // Handle plan selection logic here
  };

  return (
    <Button disabled className="w-full text-sm" variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}
