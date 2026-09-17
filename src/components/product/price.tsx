import { formatPrice, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceProps {
  price: number;
  comparePrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Price({ price, comparePrice, size = "md", className }: PriceProps) {
  const discount = discountPercent(price, comparePrice);
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-heading font-semibold tabular-nums", sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {comparePrice && discount && (
        <>
          <span className="text-sm text-muted-foreground line-through tabular-nums">
            {formatPrice(comparePrice)}
          </span>
          <span className="text-xs font-medium text-sale">{discount}% off</span>
        </>
      )}
    </div>
  );
}
