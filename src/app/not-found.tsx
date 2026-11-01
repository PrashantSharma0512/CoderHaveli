"use client";

import dynamic from "next/dynamic";

const NotFound = dynamic(() => import("@/components/utils/404"), {
  ssr: false,
});

export default function NotFoundPage() {
  return <NotFound />;
}
