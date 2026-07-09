"use client";

import { Link } from "next-view-transitions";
import PlaygroundCard from "./components/PlaygroundCard";
import { MasonryGrid } from "./MasonryGrid";
import { crafts } from "./crafts";

export default function PlaygroundList() {
  return (
    <MasonryGrid
      items={crafts}
      renderItem={(craft) => (
        <Link key={craft.slug} href={`/playground/${craft.slug}`} className="block">
          <PlaygroundCard craft={craft} />
        </Link>
      )}
    />
  );
}
