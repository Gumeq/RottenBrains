"use client";

import { useEffect, useRef, useState } from "react";
import HomeMediaCardUI from "./HomeMediaCardUI";

export default function ContinueWatchingRow({
  items,
  user_id,
}: {
  items: any[];
  user_id: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // We'll store the sliced items here
  const [itemsToShow, setItemsToShow] = useState<any[]>(items);

  useEffect(() => {
    if (containerRef.current && cardRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth;
      const gap = 16; // gap-4 in Tailwind → 16px

      // Calculate how many cards fit in a single row
      const fitPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));

      // Make sure we at least show 1 card, just in case
      const numberToShow = Math.max(1, fitPerRow);

      // Slice the original array to fit exactly
      setItemsToShow(items.slice(0, numberToShow));
    }
  }, [items]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex gap-4">
        {itemsToShow.map((media, i) => (
          <div
            key={media.id}
            // Only measure the first card’s width
            ref={i === 0 ? cardRef : null}
          >
            <HomeMediaCardUI media={media} user_id={user_id} />
          </div>
        ))}
      </div>
    </div>
  );
}
