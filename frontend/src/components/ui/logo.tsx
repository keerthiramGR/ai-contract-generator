"use client";

import React from "react";

export function Logo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Editorial legal monogram - overlapping ribbon 'A' shape */}
      <path
        d="M50 12L12 85H30L50 45L70 85H88L50 12Z"
        fill="currentColor"
        className="text-primary"
      />
      {/* Handcrafted signature loop in copper/gold indicating formal approval */}
      <path
        d="M22 65C38 65 52 48 78 48C90 48 94 58 75 68C60 76 42 70 30 58C20 48 35 32 55 32"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500/80 dark:text-amber-400/80 animate-pulse"
      />
    </svg>
  );
}
