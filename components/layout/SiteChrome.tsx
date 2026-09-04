"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function SiteChrome() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
    </>
  );
}
