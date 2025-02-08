"use client";

import AdBanner from "@/components/features/ads/GoogleDisplayAd";
export default function Home() {
  return (
    <div className="h-32 w-32 bg-red-500">
      <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="4196406083"
      />
    </div>
  );
}
