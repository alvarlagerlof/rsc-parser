import React from "react";

export function Logo({ variant }: { variant: "small" | "wide" }) {
  if (variant === "small") {
    return <p className="dark:text-white">RSC</p>;
  }

  return <p className="dark:text-white">RSC Devtools</p>;
}
