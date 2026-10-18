"use client";

import dynamic from "next/dynamic";
import React from "react";

const RemotionBackgroundClient = dynamic(
  () => import("./RemotionBackgroundClient"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#05070B]" />
    ),
  }
);

export default function RemotionBackground() {
  return <RemotionBackgroundClient />;
}
