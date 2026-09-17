import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, count, size = "sm", className }: RatingProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/40"
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {value.toFixed(1)}
        {typeof count === "number" && <span> ({count})</span>}
      </span>
    </div>
  );
}
