"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function TagBadges({
  tags,
  variant = "default",
}: {
  tags: string[];
  variant?: "default" | "compact";
}) {
  if (tags.length === 0) return null;

  const displayTags = variant === "compact" ? tags.slice(0, 3) : tags;
  const remaining = variant === "compact" ? Math.max(0, tags.length - 3) : 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {displayTags.map((tag) => (
        <Link key={tag} href={`/sites?tag=${encodeURIComponent(tag)}`}>
          <Badge
            variant="secondary"
            className="cursor-pointer text-xs font-normal hover:bg-secondary/80 transition-colors"
          >
            {tag}
          </Badge>
        </Link>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining} more</span>
      )}
    </div>
  );
}
