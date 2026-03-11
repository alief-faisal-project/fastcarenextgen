"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function LoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loadingComplete, setLoadingComplete] = useState(false);

  if (!loadingComplete) {
    return <LoadingScreen onLoadComplete={() => setLoadingComplete(true)} />;
  }

  return <>{children}</>;
}
